# -----------------------------------------------------------------------------
# SETUP
# -----------------------------------------------------------------------------
.PHONY: network
network:
	@docker network create melonproject > /dev/null 2> /dev/null || true

.PHONY: install
install:
	@docker build -f Dockerfile.installer -t melonproject/installer:latest .

.PHONY: bootstrap
bootstrap: network install

# -----------------------------------------------------------------------------
# BUILD
# -----------------------------------------------------------------------------
.PHONY: all
all: install build lint test

.PHONY: build
build:
	@docker-compose build

.PHONY: lint
lint:
	@docker-compose run --rm exchange-aggregator yarn lint
	@docker-compose run --rm graphql-server yarn lint
	@docker-compose run --rm graphql-schema yarn lint
	@docker-compose run --rm manager-interface yarn lint
	@docker-compose run --rm manager-components yarn lint
	# TODO: Fix tests and linting in imported projects.
	# @docker-compose run --rm melon-js yarn lint

.PHONY: test
test:
	@docker-compose run --rm exchange-aggregator yarn test
	@docker-compose run --rm graphql-server yarn test
	@docker-compose run --rm graphql-schema yarn test
	@docker-compose run --rm manager-interface yarn test
	@docker-compose run --rm manager-components yarn test
	# TODO: Fix tests and linting in imported projects.
	# @docker-compose run --rm melon-js yarn test

# -----------------------------------------------------------------------------
# DEVELOPMENT
# -----------------------------------------------------------------------------
.PHONY: start
start:
	@docker-compose up

.PHONY: stop
stop:
	@docker-compose kill

.PHONY: restart
restart: stop start

# -----------------------------------------------------------------------------
# GRAPHQL SERVER DEPLOYMENT
# -----------------------------------------------------------------------------
.PHONY: gql-build
gql-build:
	@docker-compose build graphql-server-prod

.PHONY: gql-publish
gql-publish:
	@docker push melonproject/graphql-server:latest

.PHONY: gql-deploy
gql-deploy:
	@ssh ubuntu@51.144.232.216 "docker ps -q --filter ancestor=melonproject/graphql-server:latest | docker stop 2>/dev/null || true"
	@ssh ubuntu@51.144.232.216 "docker pull melonproject/graphql-server:latest"
	@ssh ubuntu@51.144.232.216 "docker run -d -p443:3030 melonproject/graphql-server:latest"
