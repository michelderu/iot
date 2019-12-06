'use strict';

var fs = require('fs');
var dotenv = require('dotenv');

module.exports = {
  readEnv: function readEnv() {
    var NODE_ENV = process.env.NODE_ENV;
    if (!NODE_ENV) {
      throw new Error(
        'The NODE_ENV environment variable is required but was not specified.'
      );
    }

    // TODO: look in parent folder too?
    var dotenvFilename = './.env';
    var dotenvFiles = [
      dotenvFilename + '.' + NODE_ENV + '.local',
      dotenvFilename + '.' + NODE_ENV,
      dotenvFilename + '.local',
      dotenvFilename
    ].filter(Boolean);

    // Load environment variables from .env* files.
    // https://github.com/motdotla/dotenv
    dotenvFiles.forEach(function(dotenvFile) {
      if (fs.existsSync(dotenvFile)) {
        dotenv.config({
          path: dotenvFile
        });
      }
    });
  }
};
