# IOT Demo

## Prerequisites
- MarkLogic Server (https://hub.docker.com/_/marklogic)
- Data Hub Framework 5 (https://github.com/marklogic/marklogic-data-hub)

### Install MarkLogic from Docker Hub
This will download and run MarkLogic from Docker Hub, storing the MarkLogic data files locally in the current directoy under `./MarkLogic`.
```sh
docker run -d -it \
    -p 8000-8020:8000-8020 \
    -v `pwd`/MarkLogic:/var/opt/MarkLogic \
    -e MARKLOGIC_INIT=true \
    -e MARKLOGIC_ADMIN_USERNAME=admin \
    -e MARKLOGIC_ADMIN_PASSWORD=admin \
    --name iot \
    store/marklogicdb/marklogic-server:10.0-2-dev-centos
```

### Start Datahub Quickstart
```sh
java -jar marklogic-datahub-5.0.4.war
```

### Tail the logfiles
It can be helpful to put a tail on the logfile of the data hub as follows:
```sh
tail -f MarkLogic/Logs/8010_ErrorLog.txt
```

### Configure VPP
All of the following actions are relative to the `visual-programming-plugin` folder.
## Install Quasar
Install quasar CLI.
```sh
yarn global add quasar-cli
```
## Install the node packages
```sh
yarn install
```
### Override litegraph node_modules
Make sure to override litegraph node_modules with the project one node_modules_override
```sh
cp node_modules_override/litegraph.js node_modules/litegraph.js//build/.
```
### Point VPP to the Data Hub
Optional: update MarkLogic staging port if different from 8010.  
Proxy configuration is here: `quasar.conf.js` on line 114.

### Copy and install VPP code into the Data Hub
```sh
cp -r dist_user/DHF/src/* ../src/.
cd ..
./gradlew mlReloadModules
```
### Start VPP
```sh
cd dist_user/DesignerUI
quasar serve --proxy ../proxy_rule.js
```
