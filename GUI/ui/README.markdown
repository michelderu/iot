# Grove-React-Redux UI

This is a React UI designed to be used in conjunction with a MarkLogic UI Resources (Grove) middle-tier. It uses Redux for application state management.

## Quick Start

Note that this UI expects a Grove API-spec compliant middle-tier to be available at the location specified in the `proxy` field of the `package.json` located in this directory.

    npm install
    npm start # Starts a Webpack development server

## Installation

This UI can be generated using the [grove-cli](https://github.com/marklogic-community/grove-cli).

You can install npm dependencies with the following command:

    npm install

## Start the Application

Note that this UI expects a Grove API-spec compliant middle-tier to be available at the location specified in the `proxy` field of the `package.json` located in this directory.

    npm start

## Run the Tests

    npm test

## Build into static files

You can create a static build of this application by running `npm run build`. You may want to set `NODE_ENV=production` when running that if you are building for production.

By default, this will build into the `build/` directory.

See the [create-react-app User Guide](https://github.com/facebook/create-react-app#readme) for more details.

## Configuration

Best practice is to use the grove-cli to configure the application from the parent directory, so that it can coordinate configuration with the Grove middle-tier:

    cd ..
    grove config

The only configuration needed by this UI out-of-the-box is the `proxy` setting in `package.json`. It should point to the host and port where a Grove API-spec compliant middle-tier is running and available. (The Webpack development server uses this to proxy requests that do not refer to assets within this UI to the Grove middle-tier. This avoids CORS issues. [See the create-react-app docs for more information.](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development))

### Create-React-App User Guide: Much more information on extending this application

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find the most recent version of the create-react-app user guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

### Using HTTPS

There are two places to think about HTTPS:

1. When serving the files of this UI application to a client (a browser), and

2. When this UI application makes network calls to a middle-tier or other backend.

As the sections below make clear, in most production-like situations, nothing needs to change in this application when moving from HTTP to HTTPS or vice-versa.

#### Using HTTPS when serving the UI application

You will most often want to use HTTPS in a production-like environment. Typically, in such an environment, this UI will have been transpiled and minified into a set of static files (possible to achieve by running `npm run build`). A file server (which could be a Grove middle-tier, but could also be Apache, Nginx, etc, which serves static assets and proxies back to a middle-tier) will then serve those files to clients. The file server should be configured to use HTTPS - and nothing special has to be done in this UI application.

Sometimes, however, you will want to use HTTPS in development, when you are making use of the Webpack development server bundled with create-react-app. This is easy to setup: Simply set the `HTTPS` environment variable to true.

You can do this in `.env.development` (shared with your team) or `.env.development.local` (only for your local machine):

    HTTPS=true

[See the create-react-app User Guide for more details and up-to-date documentation on this feature](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#using-https-in-development).

#### Using HTTPS when making network calls

As in the last section, in a production situation, nothing special needs to be done. All network calls should be relative URLs, inheriting the protocol (https), host and port from which the UI application files themselves were served.

In development, when your middle-tier or other backend requires HTTPS, simply change the protocol to 'https' in the `proxy` field of this UI directory's `package.json`. NOTE: the grove-cli may currently overwrite this property when run, unfortunately. There is Jira ticket to improve this: [GROVE-316](https://project.marklogic.com/jira/browse/GROVE-316)

## Docker

A template to create a nginx docker container is included into this project.  Once you have built the static files by running `npm run build`, then use the following docker command at the project root to create the container.  

    docker build -t <containerName> .

The [nginx.conf](nginx.conf) assumes several configuration items.

 * The middle tier is hosted on a docker container named grove_node
 * The middle tier is listening on port 9003

