# MarkLogic Grove React-Redux-Node Template

Grove is a framework to help developers and architects build UI-rich applications backed by MarkLogic, the multi-model, enterprise NoSQL database.

Every Grove Project consists of a one or more middle-tier or UI Applications. Those Applications communicate using defined Grove APIs (at least for core functions: you can also create ad-hoc extensions). Application-behavior is generally added by installing Plugins,which are versioned and thus can be upgraded over the life of the Project.

This particular repository contains a Template for a React-Redux-Node Grove Project. A Project based on this Template consists of a Node Express middle-tier and a React-Redux front-end. This reference Template provides a simple search and discovery application.

Grove and this Project are *beta* and are still changing often in breaking ways.

## Create a Project Based on this React-Redux-Node Template

Follow [the instructions in the Grove Getting Started Guide](https://marklogic-community.github.io/grove/guides/getting-started/) in order to create a new Grove project.

## About Projects Based on this Template

The reference project includes three directories: 'ui' (for Vue.js front-end and Redux client-state management code), 'middle-tier' (for a reference Node implementation of a middle-tier), and 'marklogic' (for database configuration and sample data loading).

When you run commands like `npm install` and `npm start` from the top-level, it automatically runs the relevant commands. For example, `npm install` installs npm dependencies within the Node `middle-tier` and the `ui` application. Similarly, `npm start` starts the Node middle-tier, as well as a Webpack development server to serve up HTML, Javascript and CSS on port 3000.

The `ui` part of this project was built using the [Create-React-App library](https://github.com/facebookincubator/create-react-app), in order to rely on expert community help in staying up-to-date as the ecosystem changes. Much configuration is done using the tools provided by that library. Please refer to their extensive [User Guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md) to understand how to configure various parts of the `ui` application.

## Developing your project

To install dependencies:

    npm install

To create shared configuration between the three tiers (`marklogic`, `middle-tier`, and `ui`):

    grove config

To run the tests:

    npm test

To start a development server at `localhost:3000`:

    npm start

For more discussion about how to make changes to your Grove project see the "Learning to Customize and Extend Your Application" section of [GUIDE.markdown](docs/GUIDE.markdown#developing-your-app) in this repository.

## Run your project in production

This command will build the `ui` into static files and start the Node middle-tier in production. The Node middle-tier will serve those static UI files. See `middle-tier/README.markdown` if you need to configure how that works, or the path to the static files. **Note that it is a better practice to set up a reverse proxy like Nginx or HAProxy to serve these static files instead, but this will do.**.

If you have not already done so, you will need to build your current UI into static files within the `ui/build` directory. You may want to set `NODE_ENV` to "production", so the build process includes all production optimizations.

    NODE_ENV=production npm run build

Then you can run:

    npm run start:prod

By default, `start:prod` will set `NODE_ENV` to "production", and it will tell the middle-tier to serve the built UI from `ui/build`, by setting `GROVE_UI_BUILD_PATH` to "../ui/build". You can modify this command if, for example, you are following best practices and serving the UI files from a reverse proxy.

Note that this will run on `http://localhost:9003` by default (rather than port 3000, where the development Webpack server runs by default).

You can more durably set the `GROVE_UI_BUILD_PATH` in  `middle-tier/.env` or `middle-tier/.env.production` (or some other `.env` file) rather than specifying it on the command line. Just add the line:

    GROVE_UI_BUILD_PATH=../ui/build

## UI and Middle-Tier Application Documentation

Much additional documentation is available in `ui/README.markdown` and `middle-tier/README.markdown` about the UI and middle-tier specifically. Please also look there for information.

## Customizing

As you work with your Grove Project, you will soon want to customize it. To understand the design of the UI-Toolkit and how to customize it to your needs, is most important to understand how to use Grove to quickly create a MarkLogic-backed project - and then to customize it. For this, please *read [the Advanced Guide to Grove](docs/GUIDE.markdown)*.

For those seeking to contribute to the project, our evolving [Best Practices document](docs/BEST_PRACTICES.markdown) are designed to get contributors on the same page and to communicate some of our goals. The [Contributing document](docs/CONTRIBUTING.markdown) has additional concrete advice for contributors. Please read both.

## Developing Pieces of Grove Itself

**NOTE: This section is currently out-of-date! Updates coming soon.**

For those seeking to contribute to the project, our evolving [Best Practices document](docs/BEST_PRACTICES.markdown) are designed to get contributors on the same page and to communicate some of our goals. The [Contributing document](docs/CONTRIBUTING.markdown) has additional concrete advice for contributors. Please read both.
