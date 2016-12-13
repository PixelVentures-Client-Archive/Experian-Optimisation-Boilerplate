.PHONY: start build build-dev build-prod watch develop;

BIN = ./node_modules/.bin

start:
	@npm start

build: build-dev
build: build-prod

build-dev: export NODE_ENV=development
build-dev:
	@webpack --colors --progress

build-prod: export NODE_ENV=production
build-prod:
	@webpack --colors --progress
	@npm version patch

watch: export NODE_ENV=development
watch:
	@webpack --watch --colors --progress

develop: export NODE_ENV=development
develop:
	@node ./webpack-dev-server.js