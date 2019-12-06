'use strict';

var factory = (function() {
  var whitelistProxyRoute = function(config) {
    return require('./proxy')(config);
  };

  return {
    whitelistProxyRoute: whitelistProxyRoute
  };
})();

module.exports = factory;
