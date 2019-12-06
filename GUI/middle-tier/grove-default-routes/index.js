'use strict';

const factory = (function() {
  const defaultAuthRoute = function(config) {
    return require('./auth')(config);
  };

  const defaultCrudRoute = function(config) {
    return require('./crud')(config);
  };

  const defaultSearchRoute = function(config) {
    return require('./search')(config);
  };

  const defaultStaticRoute = function(config) {
    return require('./static')(config);
  };

  return {
    defaultAuthRoute: defaultAuthRoute,
    defaultCrudRoute: defaultCrudRoute,
    defaultSearchRoute: defaultSearchRoute,
    defaultStaticRoute: defaultStaticRoute
  };
})();

module.exports = factory;
