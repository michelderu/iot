# Grove Node.js Middle-tier

This contains the Node.js implementation of a Grove Middle-Tier. It is currently the default middle-tier for that project.

## Running

By default, this middle-tier starts in development mode (and sets `NODE_ENV` to 'development'):

    npm start

You can start in a production-style mode with the following command (which does not set `NODE_ENV` for you):

    npm start:prod

You probably want to set NODE_ENV to `production`: 

    NODE_ENV=production npm start:prod

Note that this Node middle-tier is configured to serve static UI assets only if
you tell it the path by setting the GROVE_UI_BUILD_PATH environment variable
(see "Configuration" below). For example, you may set
`GROVE_UI_BUILD_PATH=../ui/build` or `GROVE_UI_BUILD_PATH=../ui/dist`. This is
helpful for production-like deployments. **However, it is better to use
a reverse proxy like Nginx or HAProxy for this purpose in production, for
performance reasons.**

See the comment in `routes/index.js` if you wish to stop serving static assets or change the way they are served.
 
## Run the tests

    npm test

## Configuration

### Endpoints and Routes

See [ConfigureRoutes.markdown](ConfigureRoutes.markdown) in this repository on how to configure endpoints and the routes to them in this application.

### Environment variables

Much of this project is configured via environment variables, roughly following the [recommendations from "The Twelve-Factor App"](https://12factor.net/config). Following established practice in the Vue and React communities, among others, we modify those recommendations by allowing configuration groupings for "development", "production" or other custom environments.

You can use environment variables to override specific pieces of configuration, or even to provide all the configuration for this Grove-generated Node middle-tier.

You can find the environment variables this application looks for in `utils/options.js`. Those environment variables currently include:

- `GROVE_APP_NAME`: The name of this Grove application. It is used to set cookies and is provided to the middle-tier as server metadata during authentication. It may also be used, for example, to establish which usernames are app-specific usernames. This can be used in conjunction with the `GROVE_APP_USERS_ONLY` setting to restrict the MarkLogic users considered valid by this middle-tier.
- `GROVE_SESSION_SECRET`: The [session secret for this application's Express session](https://github.com/expressjs/session#secret). For security, it is advisable to set a different secret in each of your deployments and to keep it out of version control (see section on .env\*.local files for one strategy).
- `GROVE_APP_PORT`: The port this middle-tier will listen on.
- `GROVE_ML_HOST`: The host on which the MarkLogic REST server with which this server will communicate is available.
- `GROVE_ML_REST_PORT`: The port on which the MarkLogic REST server with which this server will communicate is available.
- `GROVE_APP_USERS_ONLY`: An optional setting, instructing this middle-tier application not to authorize any users whose usernames do not begin with `GROVE_APP_NAME`. This is particularly helpful in a situation where the backend MarkLogic instance has many users, and you do not wish to allow those other users (including administrators) to log into this application. During auth calls, this application may inform the front-end of this setting.
- `GROVE_DISALLOW_UPDATES`: An optional setting, instructing this middle-tier application not to allow any user to update data. During auth calls, this application may inform the front-end of this setting.
- `GROVE_HTTPS_ENABLED_IN_BACKEND`: An optional setting, defaulting to false, instructing this middle-tier to use SSL when communicating with MarkLogic.
- `GROVE_ENABLE_HTTPS_IN_MIDDLETIER`: An optional setting, defaulting to false, instructing this middle-tier to run in https mode. When this is set to true, the following environment variables must also be set:
  - `GROVE_MIDDLETIER_SSLCERT`: A relative or absolute path pointing to the middle-tier SSL certificate.
  - `GROVE_MIDDLETIER_SSLKEY`: A relative or absolute path pointing to the middle-tier SSL private key. **Note that you should not check the private key itself into version control.**
- `GROVE_UI_BUILD_PATH`: A relative or absolute path pointing to the directory containing static UI files. This directory should, at a minimum, contain an `index.html` file, though of course it will likely also have javascript, CSS, images, etc. Note that a relative path is relative to this middle-tier directory. If this property is not set, the out-of-the-box middle-tier will not attempt to serve static files.

### `.env` Configuration files

There are many ways to set environment variables and those ways depend on the context within which your application is running. Feel free to use what fits your purposes. **Any system environment variables already set will take precedence over what is in these `.env` files.**

For convenience, this project adopts the pattern of `.env` files. When starting via `npm start`, the application will load environment variables stored with a `.env` file. You can override or extend that configuration for specific application-environments, such as "development", "production", or "test".

 `.env` files **should be checked into version control** and **should not contain secrets**.**Be careful not to commit any configuration file containing application secrets into version control.** Such secrets could leak if the project repository was ever hosted publicly. Secrets belong in a `.env.local` file, or an application-environment-specific file such as `.env.development.local`. Such files are listed in this project's `.gitignore` file by default, and should remain there.

The following files in the root of this project's source code are valid. The existing environment is checked first, then the files in this list from bottom to top. The first value encountered will take precedence.

- `.env`: Default, project-wide settings.
- `.env.local`: Settings, ignored by git, which override those in `.env`. This is advisable to use in development, for example, for developer-specific configuration.
- `.env.{app-environment}`: Settings loaded only in a specific app-environment. This depends on the NODE_ENV. For example, `npm start` will load `.env.development` while `npm test` will load `.env.test`. `npm run build` will run in production by default and use `.env.production`
- `.env.{app-environment}.local`: Settings loaded only in a specific app-environment and ignored by git.

You will find the allowable options in `utils/options.js`. You are advised to use the `grove config` command-line tool to update those, rather than changing them yourself. This allows any Grove-configured UI to stay in sync.

Upon generation, this application should already have a `.env` file, which has a simple `KEY=value` syntax:

    FOO=bar
    GROVE_APP_NAME=killer-demo

For more advanced usage and information, please see the [documentation for the dotenv project](https://github.com/motdotla/dotenv).

### Enabling HTTPS

[See HTTPS.markdown in this repository.](HTTPS.markdown)

## Dockerfile

This repository contains a `Dockerfile`, which can be used to build a Docker image for a container running this middle-tier.

To build an image, execute the following commands from this directory.  

    docker build -t <docker-repo>/<image-name>:<version-number>
