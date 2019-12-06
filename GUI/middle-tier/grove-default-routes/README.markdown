# Grove Default Routes

These are configurable route implementations designed for use in a MarkLogic Grove middle-tier. As such, they are intended to be used within a Node Express.js application.

These routes implement the Grove API specification.

## How to Install

TODO: actually publish on npm :-)
```
npm install --save grove-node-default-routes
const routeFactory = require('grove-default-routes');
```

## Provided Routes and How to Use Them

### defaultAuthRoute

```javascript
router.use(
  '/auth',
  routeFactory.defaultAuthRoute({
    authProvider: authProvider
  })
);
```

The defaultAuthRoute accepts a single configuration entry: authProvider. The authProvider must have three functions: `getAuth()`, `handleLocalAuth()`, and `clearAuthenticator()`. See grove-node-server-utils for details on the default authProvider.

### defaultSearchRoute

```javascript
// Provide routes for pseudo-type 'all'
const type = 'all';
router.use(
  '/search/' + type,
  routeFactory.defaultSearchRoute({
    authProvider: authProvider,
    namedOptions: type,
    idConverter: idConverter,
    // Example for making result labels using name property of person sample-data
    extract: '/name',
    makeLabel: result => {
      return (
        result.extracted &&
        result.extracted.content[0] &&
        result.extracted.content[0].name
      );
    }
  })
);
```

Grove supports typed searches. This example sets up a pseudo-type of 'all', staying close to basic document search using the MarkLogic Search API (though, its behavior can be changed by changing the "all" saved search options in the MarkLogic REST server).

Supported configuration includes:

- authProvider: See the `defaultAuthRoute` section above, though the search route only makes use of the `getAuth()` function;

- namedOptions: This refers to the name of saved search options on the MarkLogic REST server;

- idConverter: This is a function to convert from document uris to application ids and vice-versa. It is helpful to make this configurable, so it can be shared between search and CRUD endpoints of the same type. (NOTE: this assumes a 1-to-1 relation of entities to documents stored in MarkLogic. Future development may allow higher-level entities that do not have such a mapping.)

- extract: **DEPRECATED!** This is a experimental feature allowing the user to specify parts of matching documents that they wish to include within each search result sent to the browser. The value of this property should be an XPath expression pointing to the section of each matching document should be included within each search result.

  (See MarkLogic's documentation on ["Extracting a Portion of Matching Documents"](https://docs.marklogic.com/guide/search-dev/query-options#id_37692) for details on how to write your XPath expression. Your string is ultimately passed along as an `extract-path` option.)

- makeLabel: This must be a function, taking a result object, which returns a 'label' for that search result. It often makes use of extracted data.

### defaultCrudRoute

Grove supports typed CRUD, like for search. This example sets up a pseudo-type of 'all', staying close to basic document search using the MarkLogic document API.

See [grove-node's `routes/api/index.js`](../routes/api/index.js) for an example.

Supported configuration includes:

- authProvider: See the `defaultAuthRoute` section above, though the search route only makes use of the `getAuth()` function and `isAuthenticated` property;

- authed: Defaults to true. When true, it will return a 401 immediately if the currentUser is not authenticated to the middle-tier.

- neverCache: Defaults to true. When true, it adds headers to the response indicating to the client that the response should not be cached.

- directory: Default to '/'. This is the prefix used when creating a new entity document. (NOTE: this assumes a 1-to-1 relation of entities to documents stored in MarkLogic. Future development may allow higher-level entities that do not have such a mapping.)

- collections: Defaults to none. This is an array of the collections applied when creating a new entity document. (NOTE: this assumes a 1-to-1 relation of entities to documents stored in MarkLogic. Future development may allow higher-level entities that do not have such a mapping.)

- temporalCollection: Defaults to none. This is the temporal collection applied when creating a new entity document. (NOTE: this assumes a 1-to-1 relation of entities to documents stored in MarkLogic. Future development may allow higher-level entities that do not have such a mapping.)

- idConverter: This is a function to convert from document uris to application ids and vice-versa. It is helpful to make this configurable, so it can be shared between search and CRUD endpoints of the same type. (NOTE: this assumes a 1-to-1 relation of entities to documents stored in MarkLogic. Future development may allow higher-level entities that do not have such a mapping.)

- contentType: Defaults to 'application/json'.

- views: Defaults to none (though a 'metadata' view is automatically included). Should be an object with a view name as a key. Values of the config object can be a `call` function (which overrides the included READ logic and receives req, res, config, id, and the viewName), a `transform`, a `category`, `contentType` (the mimetype that will be sent to the browser, which defaults to the top-level contentType for the route), and/or a MarkLogic `format` ("json" or "xml"). Views are accessed with a URL like `/:id/:view`. See the grove-core-api for details.

  When no view is specified, an implicit `\_default` view is used, which can be modified by the user, if they pass a configuration for a view with that `\_default` name.

### defaultStaticRoute

This is a simple route encapsulating logic for serving the UI as a set of static assets. It does not currently accept configuration, other than setting the `GROVE_UI_BUILD_PATH` environment variable.
