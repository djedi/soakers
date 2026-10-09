# Makefile — soakers 11ty site
# ----------------------------------------------------------------------------
# `make dev` serves the site with live reload and opens it in your browser.
# Everything else is the usual suspects.

SHELL := /bin/bash

# `make dev` records the URL it served here so `make open` can find it.
URL_FILE := .cache/dev-url

.DEFAULT_GOAL := help

.PHONY: help dev open build clean lint install

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Serve 11ty with live reload, then open the browser
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

open: ## Just open the site in your browser (needs a running `make dev`)
	@URL=$$(cat $(URL_FILE) 2>/dev/null); \
	if [ -z "$$URL" ] || ! curl -sf -o /dev/null "$$URL/"; then echo "No dev server running - try 'make dev' first." >&2; exit 1; fi; \
	echo "Opening $$URL"; \
	open "$$URL"

build: ## Production build (ELEVENTY_ENV=prod, minified CSS)
	npm run build

lint: ## Lint SCSS (auto-fixes what it can)
	npm run lint:fix

clean: ## Remove the built output
	rm -rf public
