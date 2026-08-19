# Makefile — soakers 11ty site
# ----------------------------------------------------------------------------
# `make dev` serves the site with live reload and opens it in your browser.
# Everything else is the usual suspects.

SHELL := /bin/bash
PORT  ?= 8080
URL   := http://localhost:$(PORT)

.DEFAULT_GOAL := help

.PHONY: help dev open build clean lint install

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Serve 11ty with live reload, then open the browser
	@echo "Starting dev server at $(URL) ..."
	@npm start & \
	PID=$$!; \
	trap 'echo; echo "Stopping dev server..."; kill $$PID 2>/dev/null; exit 0' INT TERM EXIT; \
	for i in $$(seq 1 60); do \
		if curl -sf -o /dev/null $(URL); then break; fi; \
		sleep 0.5; \
	done; \
	echo "Site is up at $(URL) - opening browser"; \
	open $(URL); \
	wait $$PID

open: ## Just open the site in your browser (server must be running)
	open $(URL)

build: ## Production build (ELEVENTY_ENV=prod, minified CSS)
	npm run build

lint: ## Lint SCSS (auto-fixes what it can)
	npm run lint:fix

clean: ## Remove the built output
	rm -rf public
