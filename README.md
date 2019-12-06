# IOT Demo
This demo show how MarkLogic and the Data Hub Framework can be used in IOT cases. There are three datasets avaiable:
- In this case, there is a company with disconnected CRM and ERP databases. Of both, there are CSV dumps available.  
- Additionally there is a feed that provides IOT data from the devices under a service contract. This data is available as JSON data.
- Furthermore the company has an ECM system that comtains contracts and documents in PDF format, relevant to the customers.

We will create three flows:
1. The `Customer360 flow` that will ingest the CRM and ERP data and then harmonize it to a business entity Customer.
2. The `IOT flow` that will ingest the raw JSON data coming from the devices
3. The `Contracts flow` that will ingest the PDF files, convert them to machine readable text and enrich them based on the above information.

Finally the data is provided through a Tableau dashboard showing the following information:
- The support contracts that will soon be out of date
- Customers with a critical CO level
- Device data
- A pie chart showing the distribution of device types

![Tableau Dashboard](images/tableau.png)

Additionally there is a HTML front-end that will allow analysts to include the unstructured information from PDF.

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

### Configure Visual Programming Plugin
All of the following actions are relative to the `visual-programming-plugin` folder.
#### Install Quasar
Install quasar CLI.
```sh
yarn global add quasar-cli
```
#### Install the node packages
```sh
yarn install
```
#### Override litegraph node_modules
Make sure to override litegraph node_modules with the project one node_modules_override
```sh
cp node_modules_override/litegraph.js node_modules/litegraph.js//build/.
```
#### Point VPP to the Data Hub
Optional: update MarkLogic staging port if different from 8010.  
Proxy configuration is here: `quasar.conf.js` on line 114.

#### Copy and install VPP code into the Data Hub
```sh
cp -r dist_user/DHF/src/* ../src/.
cd ..
./gradlew mlReloadModules
```
#### Start Visual Programming Plugin
```sh
cd dist_user/DesignerUI
quasar serve --proxy ../proxy_rule.js
```
