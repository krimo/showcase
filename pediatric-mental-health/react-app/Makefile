.PHONY: build build-production

REACT_APP_GA_TRACKING_ID := G-PFK1MHK3ZK

export REACT_APP_GA_TRACKING_ID

# These are non-private variables
build-production: export REACT_APP_WORDPRESS_ROOT = https://wordpress.bendhealth.com
build-production: export REACT_APP_API_BASE_URL = https://wordpress.bendhealth.com/graphql
build-production: export REACT_APP_AUTH0_CLIENT_DOMAIN = iam.bendhealth.com
build-production: export REACT_APP_AUTH0_CLIENT_ID = 1LbFeEHe0brhQyovb02sjuEYx92MHNNG

build-production:
	yarn run build


build: export REACT_APP_WORDPRESS_ROOT = https://wordpress.bh-staging.com
build: export REACT_APP_API_BASE_URL = https://wordpress.bh-staging.com/graphql
build: export REACT_APP_AUTH0_CLIENT_DOMAIN = iam.bh-staging.com
build: export REACT_APP_AUTH0_CLIENT_ID = XUUYh43kha3NJhlnswg7jLvajPfUDLkr

build:
	yarn run build
