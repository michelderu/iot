# Enabling HTTPS in Grove Node

With regard to https and the Grove Node middle-tier, it is important to distinguish between:

1. Connecting and sending outgoing requests to MarkLogic (or other data sources) via HTTPS; and

2. Receiving and replying to incoming requests from a client browser via HTTPS.

## How to connect to MarkLogic (or other sources) via HTTPS

1. Enable SSL on your MarkLogic REST server (or other data source). [See the ml-gradle wiki for instructions on using ml-gradle to accomplish this](https://github.com/marklogic-community/ml-gradle/wiki/Loading-modules-via-SSL).
   
2. Set the following environment variable. The preferred way to do this is in `.env` files as described in [the README](README.markdown), but other methods can be used where appropriate.

    GROVE_HTTPS_ENABLED_IN_BACKEND=true

3. Start Grove Node with that environment variable set.

TODO: set up way to trust MarkLogic- or self-signed certificates. See HTTPS.mdown in slush-marklogic-node for ideas. See Jira ticket GROVE-390

## How to receive and reply to incoming requests via HTTPS

**Note that running Grove Node itself as an HTTPS server is only one way to accomplish this.** Other options include running an https-enabled load balancer or other process in front of Grove Node. The load balancer could communicate locally to Grove Node over http, in which case the steps below are unnecessary. This depends on your security model.

1. Create a key and certificate for the Grove Node middle-tier. [A step by step guide can be found here for a self-signed certificate.](https://devcenter.heroku.com/articles/ssl-certificate-self) Or, for real-world applications, you may decide to obtain a trusted certificate from a Certificate Authority. That is beyond the scope of this tutorial.

2. Copy the certificate and key to the root of the project. For this tutorial, we assume you have created `server.crt` and `server.key` and placed them within your `middle-tier/` directory. 

3. Carefully add `server.crt` to version control **but not `server.key`**.

  You can and probably should check the certificate into version control, **but be careful never to check the key into version control. Like any private key, this is a secret which must be carefully guarded, and should be changed immediately if potentially exposed.** You will need some other file-transfer mechanism to deploy your private key onto remote servers running your Grove Node middle-tier.

  You can use this set of commands:

  ```bash
  echo "*.key" >> .gitignore # appends a line to the .gitignore file
  git add .gitignore
  git add middle-tier/server.crt
  git commit -m "Add HTTPS certificate and gitignore private key"
  ```

4. Set the necessary environment variables. The preferred way to do this is in `.env` files as described in [the README](README.markdown), but other methods can be used where appropriate.

  1. Set `GROVE_ENABLE_HTTPS_IN_MIDDLETIER` to true.

  2. Set `GROVE_MIDDLETIER_SSLCERT` to the relative or absolute path of the server certificate.

    `GROVE_MIDDLETIER_SSLCERT=server.crt`

  3. Set `GROVE_MIDDLETIER_SSLKEY` to the relative or absolute path of the server key.

    `GROVE_MIDDLETIER_SSLKEY=server.key`

5. Start Grove Node with those environment variables set.
