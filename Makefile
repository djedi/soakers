# Makefile — soakers 11ty site
# ----------------------------------------------------------------------------
# `make up`   runs the site in Docker with live reload and opens the browser.
# `make dev`  does the same with your local Node (no Docker).
# `make`      lists every target.

SHELL := /bin/bash

# Docker dev port. Deliberately uncommon so it won't collide with other
# projects' 3000/8080 servers. Override with `make up PORT=5000`.
PORT ?= 4817
DOCKER_URL := http://localhost:$(PORT)
export PORT
COMPOSE := docker compose

# `make dev` records the URL it served here so `make open` can find it.
URL_FILE := .cache/dev-url

.DEFAULT_GOAL := help

.PHONY: help up down restart logs shell ps docker-clean \
        install dev open build lint clean

help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} \
		/^##@/ {printf "\n\033[1m%s\033[0m\n", substr($$0, 5); next} \
		/^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

##@ Docker (dev server, default port 4817)

up: ## Start the site in Docker with live reload and open the browser
	@$(COMPOSE) up -d
	@echo "Waiting for $(DOCKER_URL) (first run installs deps, may take a minute) ..."
	@for i in $$(seq 1 240); do \
		if curl -sf -o /dev/null "$(DOCKER_URL)/"; then \
			echo "Site is up at $(DOCKER_URL) - opening browser"; \
			open "$(DOCKER_URL)"; \
			echo "Following logs (Ctrl-C detaches; the site keeps running - 'make down' stops it)"; \
			exec $(COMPOSE) logs -f --tail=20; \
		fi; \
		if [ -z "$$($(COMPOSE) ps -q --status running web)" ]; then \
			echo "Container exited - recent logs:" >&2; $(COMPOSE) logs --tail=50 >&2; exit 1; \
		fi; \
		sleep 0.5; \
	done; \
	echo "Timed out waiting for the site - see 'make logs'." >&2; exit 1

down: ## Stop the Docker dev server
	$(COMPOSE) down

restart: ## Restart the Docker dev server
	@$(MAKE) --no-print-directory down
	@$(MAKE) --no-print-directory up

logs: ## Tail the Docker dev server logs
	$(COMPOSE) logs -f --tail=50

shell: ## Open a shell in the running container
	$(COMPOSE) exec web bash

ps: ## Show container status
	$(COMPOSE) ps

docker-clean: ## Stop and remove containers plus the node_modules volume
	$(COMPOSE) down -v

##@ Local (no Docker)

install: ## Install dependencies
	npm install

dev: ## Serve 11ty with live reload locally, then open the browser
	@echo "Starting dev server (eleventy picks an open port) ..."
	@mkdir -p .cache; rm -f $(URL_FILE); \
	npm start & \
	PID=$$!; \
	trap 'echo; echo "Stopping dev server..."; rm -f $(URL_FILE); kill $$PID 2>/dev/null; exit 0' INT TERM EXIT; \
	URL=""; \
	for i in $$(seq 1 90); do \
		PIDS=$$PID; FRONTIER=$$PID; \
		while [ -n "$$FRONTIER" ]; do \
			FRONTIER=$$(for p in $$FRONTIER; do pgrep -P $$p; done); \
			PIDS="$$PIDS $$FRONTIER"; \
		done; \
		PORT_FOUND=$$(lsof -a -iTCP -sTCP:LISTEN -P -n -p $$(echo $$PIDS | tr ' ' ',') 2>/dev/null | awk '/LISTEN/{print $$9}' | grep -oE '[0-9]+$$' | head -1); \
		if [ -n "$$PORT_FOUND" ] && curl -sf -o /dev/null "http://localhost:$$PORT_FOUND/"; then \
			URL="http://localhost:$$PORT_FOUND"; \
			break; \
		fi; \
		sleep 0.5; \
	done; \
	if [ -n "$$URL" ]; then \
		echo "$$URL" > $(URL_FILE); \
		echo "Site is up at $$URL - opening browser"; \
		open "$$URL"; \
	else \
		echo "Server started but no port responded - check the output above." >&2; \
	fi; \
	wait $$PID

open: ## Open the running site (Docker or `make dev`) in your browser
	@if curl -sf -o /dev/null "$(DOCKER_URL)/"; then URL="$(DOCKER_URL)"; \
	else URL=$$(cat $(URL_FILE) 2>/dev/null); fi; \
	if [ -z "$$URL" ] || ! curl -sf -o /dev/null "$$URL/"; then echo "No dev server running - try 'make up' or 'make dev'." >&2; exit 1; fi; \
	echo "Opening $$URL"; \
	open "$$URL"

##@ Build & quality

build: ## Production build (ELEVENTY_ENV=prod, minified CSS)
	npm run build

lint: ## Lint SCSS (auto-fixes what it can)
	npm run lint:fix

clean: ## Remove the built output
	rm -rf public
