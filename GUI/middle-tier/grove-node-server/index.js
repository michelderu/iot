'use strict';

var factory = (function() {
  var defaultNodeServer = function(config) {
    return require('./node-server')(config);
  };

  return {
    defaultNodeServer: defaultNodeServer
  };
})();

module.exports = factory;
