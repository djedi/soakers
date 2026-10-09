# Makefile — soakers 11ty site
# ----------------------------------------------------------------------------
# `make dev` serves the site with live reload and opens it in your browser.
# Everything else is the usual suspects.

SHELL := /bin/bash

.DEFAULT_GOAL := help

.PHONY: help dev open build clean lint install

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Serve 11ty with live reload, then open the browser
	@echo "Starting dev server (eleventy picks an open port) ..."
	@npm start & \
	PID=$$!; \
	trap 'echo; echo "Stopping dev server..."; kill $$PID 2>/dev/null; exit 0' INT TERM EXIT; \
	URL=""; \
	for i in $$(seq 1 90); do \
		PORT_FOUND=$$(lsof -a -iTCP -sTCP:LISTEN -P -n -c node 2>/dev/null | awk '/LISTEN/{print $$9}' | grep -oE '[0-9]+$$' | head -1); \
		if [ -n "$$PORT_FOUND" ] && curl -sf -o /dev/null "http://localhost:$$PORT_FOUND/"; then \
			URL="http://localhost:$$PORT_FOUND"; \
			break; \
		fi; \
		sleep 0.5; \
	done; \
	if [ -n "$$URL" ]; then \
		echo "Site is up at $$URL - opening browser"; \
		open "$$URL"; \
	else \
		echo "Server started but no port responded - check the output above." >&2; \
	fi; \
	wait $$PID

open: ## Just open the site in your browser (server must be running)
	@PORT=$$(lsof -a -iTCP -sTCP:LISTEN -P -n -c node 2>/dev/null | awk '/LISTEN/{print $$9}' | grep -oE '[0-9]+$$' | head -1); \
	if [ -z "$$PORT" ]; then echo "No dev server running - try 'make dev' first." >&2; exit 1; fi; \
	echo "Opening http://localhost:$$PORT"; \
	open "http://localhost:$$PORT"

build: ## Production build (ELEVENTY_ENV=prod, minified CSS)
	npm run build

lint: ## Lint SCSS (auto-fixes what it can)
	npm run lint:fix

clean: ## Remove the built output
	rm -rf public
