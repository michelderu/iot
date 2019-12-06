# MarkLogic Grove Welcome Tutorial

Welcome!

If you are here, you probably already know that [MarkLogic](http://www.marklogic.com/what-is-marklogic/) is a powerful, multi-model, NoSQL database with ACID transactions and top-grade security. You can use it to build all kinds of applications.

While working through this tutorial, you will use pieces of this Grove (rhymes with 'pure') library to quickly build a single-page Web application backed by MarkLogic.

A quick, but important, aside: The tech stack used here (React, NodeJS, etc) is by no means required to work with MarkLogic. **You can use your preferred tools to build a Web application backed by MarkLogic.** MarkLogic exposes a rich and extensible [REST API](https://docs.marklogic.com/guide/rest-dev). Any tool capable of making http requests can be used to build an app against MarkLogic.

This tutorial will also expose you to core MarkLogic concepts in action. MarkLogic is a powerful database with equally powerful abstractions that differ in fascinating and useful ways from relational ways of thinking. This Welcome tutorial is useful for getting your feet wet and hands dirty. For more theoretical background, consider also reading MarkLogic's[ "Concepts Guide"](https://docs.marklogic.com/guide/concepts/overview).

Let's get started.

## What We Are Going to Build

TODO: give this a story, an overall narrative that is at least mildly engaging.

## Prerequisites

This tutorial requires you to interact, at times, with a command line. Before continuing, you should be sure you have a command-line terminal you are comfortable using.

Other dependencies will be pointed out when the need for them arises.

## Get MarkLogic Running

1. **[Download MarkLogic 9.](https://developer.marklogic.com/products)**

    MarkLogic provides a free [Developer License](https://developer.marklogic.com/free-developer) to everyone who [joins the MarkLogic developer community](https://developer.marklogic.com/people/signup). So following this tutorial won't cost you a thing!

2. **Install MarkLogic.**

    The docs have a handy [Installation Guide](https://docs.marklogic.com/guide/installation/procedures#id_28962).

3. **Start MarkLogic.**

    The docs also tell you [how to start MarkLogic on your system](https://docs.marklogic.com/guide/installation/procedures#id_92457).

4. **Initialize MarkLogic to run on a single host computer.**

    The first time you start MarkLogic, you are going to initialize it to run on a single host. Again, [the docs are clear on how to do it](https://docs.marklogic.com/guide/installation/procedures#id_60220). (MarkLogic can powerfully scale and prevent data loss when hardware fails by [running in clusters](https://docs.marklogic.com/guide/cluster), but you won't need all that power for this tutorial.)

    Remember what admin password you set up. You'll need that later, but you probably realized that.

You are ready to move on if you can point a browser to [localhost:8001](http://localhost:8001) and it looks a bit like [this](https://docs.marklogic.com/guide/concepts/admin-monitoring#id_14747): 

![MarkLogic Admin UI](https://docs.marklogic.com/media/apidoc/9.0/guide/concepts/admin-monitoring/images/admin-ui.gif)

There is a [complete description of the Admin Interface in the docs](https://docs.marklogic.com/guide/admin/admin_inter), but for now, it is enough for us to know that MarkLogic is running.

(We recommend using the [Chrome browser](https://www.google.com/chrome/) for this tutorial, by the way, so you can use all the great developer tools available for React and Redux.)

## If You are Impatient

In case you missed it, the README has [VERY Quick Start instructions that show you how to get everything running with three commands](README.markdown#very-quick). Here, we are going to take our time, soe we discuss things a bit as we move along.

## Get the ML-UI-React Source Code

Clone down the reference application provided by the Grove project. For this, you will need to have a command-line terminal and [git](https://git-scm.com/downloads) for version-control.

    git clone --recursive ssh://git@project.marklogic.com:7999/nacw/grove-react-template.git
    cd grove-react-template
 
The reference application has everything you need to get a search-and-discovery application running. We'll describe it all in more detail below, but just to orient you, be aware that this source code includes:

- a `marklogic` directory, with tools and configuration files to configure and administer your MarkLogic server,
- a `middle-tier` directory, with a Node middle-tier that will form the middle-tier of this application, and
- a `ui` directory, which contains code that will run in the browser.

## Provision MarkLogic

### Install Java Locally

On your command-line, run the following command to see if you have Java 1.7 or higher installed:

    java -version

If not, [install Java](https://www.java.com/en/download/help/download_options.xml).

Once the command above shows that you have version 1.7 or above, you are ready to provision MarkLogic using ml-gradle.

### Provision MarkLogic with ml-gradle

[TODO: configure marklogic/gradle-local.properties with the admin username and password]

[ml-gradle](https://github.com/marklogic-community/ml-gradle) is a community-supported tool that lets you and your team manage MarkLogic via automated tasks that run based on configuration files placed under version control. In this tutorial, we will use some of the most common ml-gradle tasks. For background and an appreciation of all the MarkLogic management tasks that you can automate, [take a look at the ml-gradle docs](https://github.com/marklogic-community/ml-gradle).

We'll work from the `marklogic` directory of our source code when managing and provisioning MarkLogic:

    cd marklogic

Now, run the ml-gradle task to provision MarkLogic with what we need. This command uses `gradlew`, a [way of invoking Gradle](https://docs.gradle.org/current/userguide/gradle_wrapper.html) that ensures all the developers on this new project have the same version and dispenses with manual gradle installation:

    ./gradlew mlDeploy

Or, on Windows:

    gradlew.bat mlDeploy

That should have just worked! You can verify that by pointing your browser to the [MarkLogic Admin UI](http://localhost:8001). On the right, under "Databases", you should see "grove-content" and "grove-modules" (you will also see "grove-triggers", a helpful database that, alas, we won't use in this tutorial). Under "App Servers", you should see "grove", an HTTP server running on port 8063. There will be several "grove" entries under "Forests". And if you were to click on "Users" or "Roles" under "Security", you should see some grove-related users and roles. [TODO: add screenshots]

Congratulations, you've got MarkLogic configured and all the configuration is under version control, so you will be on the same page as the rest of your [Friend Finder; TODO: connect to overall narrative] team. Any changes you make will be shared using `git` and everyone can stay in sync, as well as your production and staging systems and any automated testing builds.

When we are done, move back up to the top-level directory of our source code:

    cd ..

But before rushing on, let's dig a little deeper into what we accomplished using this command, in order to understand some basics of how MarkLogic works. If you already understand MarkLogic basics, you can skip to the next section.

#### Content Database

TODO

#### Modules Database

TODO

#### MarkLogic REST server

TODO

#### Users and Security Roles

TODO

Users:

- grove-reader
- grove-writer
- grove-admin

Roles:

- grove-nobody
- grove-reader
- grove-writer
- grove-internal (amping)
- grove-admin
- rest-reader
- rest-writer
- rest-admin
- manage-admin
- admin

## Start the ML-UI-React Application

### Install Node.js Locally

As you develop your application, you will use Node.js in development for things like pulling down useful code libraries from Node's package management system. Don't worry, this doesn't mean that you have to use it in production if you don't want to or can't in your environment.

Check if you have Node version 6 or above by running the following command:

    node -v

If not [follow the instructions at the Node.js website to install a Node for your operating system](https://nodejs.org). 

Once `node -v` is showing you version 6 or above, let's double-check that you have version 5 or above of Node's package manager, npm:

    npm -v

If it is less than version 5, or you just want the latest, run the following to install the latest globally on your computer:

    npm install -g npm

Great, time to get the application running ...

### Install Javascript Dependencies

This command instructs npm, the Node.js package manager, to install javascript dependencies for ui and middle-tier code. These will be stored locally in the `node_modules` directories within `ui` and `middle-tier` [TODO: say more]:

    npm install

### Start the Development and Middle-Tier Servers

[TODO: configure ml-gradle with the admin username and password]

This command will actually start two servers concurrently:

- a Webpack development server, defaulting to port 3000, to serve the Web app files and proxy other requests to the Node middle-tier, and
- the Node middle-tier express.js server, defaulting to port 9003

    npm start

Then navigate to `localhost:3000` to see your running application!

When you search, you won't see any results yet, because we have not yet loaded any data. We'll do that in the next section.

## Load Some Sample Data with the MarkLogic Content Pump (mlcp)

In this very simple, initial tutorial, you are being introduced to the basics of setting up Grove and MarkLogic. We are going to load a little bit of data as-is and demonstrate how MarkLogic automatically indexes both the words and the structure, making the documents instantly searchable upon ingest. We will then explore additional indexes that allow you to answer useful queries even more quickly.

This is all just a little taste, though, of the value of MarkLogic. MarkLogic is the world's best database at integrating data from silos; its true value shines through once you load in large amounts of data from multiple sources. Like in this tutorial, you can load it all as-is and instantly search against it, *all* of it, in once place, but that's only the beginning. After completing this tutorial, you can learn how to use MarkLogic as an Operational Data Hub using the [MarkLogic Data Hub Framework](https://marklogic-community.github.io/marklogic-data-hub/).

You already have your search-and-discovery application running in a console window, so open a new one to launch your MarkLogic data load. (This is a common practice when developing using Grove, dedicating one console window to running the application while you can use the other to make changes. For most changes the running application will not need to be restarted.)

Data loading is well handled by ml-gradle, so change directories into `marklogic`:

    cd marklogic

This command uses [ml-gradle](https://github.com/marklogic-community/ml-gradle) and [mlcp](https://docs.marklogic.com/guide/mlcp) to load 3000 sample json documents, about people. These documents are stored in the `marklogic/data` directory of this source code. [TODO: say more]

    ./gradlew loadSampleData

Or, on Windows:

    gradlew.bat loadSampleData

