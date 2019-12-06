'use strict';

/*
 * HELPFUL COMMENTS ALERT
 *
 * This file defines Grove routes nested under `/api`.
 *
 * You should make this the primary place to configure, install, and
 * remove middle-tier endpoints for your Grove project.
 *
 * We have commented this file to make your job easier.
 */

// See the Express.js documentation to understand the Router.
var router = require('express').Router();

// Grove provides default route implementations. They are configurable.
// We import the routeFactory here and will use it below.
// TODO: create and link to documentation on grove-default-routes.
const routeFactory = require('../../grove-default-routes');

// The authProvider is injected into each route.
// This is so that you can provide a different authProvider if desired.
const authProvider = require('../../grove-node-server-utils/auth-helper');

// mapping URIs to ids for CRUD in other routes
// even possibly going so far as to return IDs instead of URIs
// /dogs/1587 instead of dogs?uri=/somethingUgly
// It is helpful to share this logic between search and CRUD routes,
// particularly those referencing the same type.
const idConverter = {
  toId: function(uri) {
    return encodeURIComponent(uri);
  },
  toUri: function(id) {
    return decodeURIComponent(id);
  }
};

// A minimal authRoute.
router.use(
  '/auth',
  routeFactory.defaultAuthRoute({
    authProvider: authProvider
  })
);

// Provide search route for pseudo-type 'all'
const type = 'all';
router.use(
  '/search/' + type,
  routeFactory.defaultSearchRoute({
    authProvider: authProvider,
    namedOptions: type, // default: 'all'
    // options: {
    // // Add JSON search options here.
    //
    // // default: none
    //
    // // WARNING: This will override the saved search options referenced by 'namedOptions' above.
    //
    // // See https://docs.marklogic.com/guide/search-dev/appendixa for
    // // details on query options
    //
    // // Example for making result labels using name property of person sample-data
    //   'extract-document-data': {
    //     'extract-path': ['/name']
    //   }
    // },
    idConverter: idConverter, // default: encodeURIComponent(result.uri)
    makeLabel: result => {
      // default: none
      return (
        result.extracted &&
        result.extracted.content[0] &&
        result.extracted.content[0].name
      );
    }
  })
);

// Provide CRUD route for pseudo-type 'all'
router.use(
  '/crud/' + type,
  routeFactory.defaultCrudRoute({
    authProvider: authProvider,
    authed: true, // default: true
    neverCache: true, // default: true
    directory: '/' + type + '/', // default: '/'
    //extension: 'json',                   // (default)
    contentType: '*/*', // default: application/json
    //temporalCollection: 'uni-temporal',  // default: none
    collections: ['data', 'type/' + type], // default: none
    idConverter: idConverter, // default: encode/decodeUriComponent
    views: {
      // By default, a single `metadata` view is configured.
      // This metadata view returns metadata including contentType,
      // fileName, format, and size of the entity. It is particularly
      // useful for binaries.
      //
      // There is also an implicit `_default` view, which is invoked
      // when the crud endpoint is called with only an id (not followed by
      // a view name). You can change the behavior of this implicit view
      // by configuring a view named `_default`.
      //
      // The client can access different views when performing a READ
      // by adding a view name after the id, as in:
      // '/api/crud/all/someID/indent'
      //
      // Supported view configuration options include `transform`,
      // `category`, `format` (which defaults to 'json'),
      // `contentType` (the mimetype that will be sent to the browser,
      // which defaults to the top-level contentType for the route),
      // `call` (a function to override the middle-tiers READ logic,
      // which receives req, res, config, id, and the viewName as arguments)
      'to-json': {
        transform: 'to-json'
      },
      indent: {
        transform: 'indent'
      }
    }
  })
);

/*
 * Your additional routes here. Or modify the above. Or delete them. :-)
 */

// For requests not matching any of the above, return a 404.
var four0four = require('../../grove-node-server-utils/404')();
router.get('/*', four0four.notFound);

module.exports = router;
