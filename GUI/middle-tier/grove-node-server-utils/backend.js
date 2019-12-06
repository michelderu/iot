const options = require('../grove-node-server-utils/options')();

const http = require('http');
const https = require('https');
//const fs = require('fs');

// var ca = '';
var httpClient = null;
if (options.httpsEnabledInBackend) {
  //   console.log('Loading ML Certificate ' + options.mlCertificate)
  //   ca = fs.readFileSync(options.mlCertificate)
  httpClient = https;
} else {
  httpClient = http;
}

var backend = (function() {
  //// Helper function to make backend calls
  // invokes callback when backend call finishes
  // browserResponse is optional, backendResponse is piped into it if provided
  // otherwise data is returned as Buffer via callback
  var callBackend = function(
    browserRequest,
    backendOptions,
    callback,
    browserResponse
  ) {
    backendOptions.hostname = backendOptions.hostname || options.mlHost;
    backendOptions.port = backendOptions.port || options.mlRestPort;

    var body = backendOptions.body;
    delete backendOptions.body;
    if (body) {
      delete backendOptions.headers['content-length'];
    }

    // get rid of some headers that throw off ML authentication
    delete backendOptions.headers['x-forwarded-for'];
    delete backendOptions.headers['x-forwarded-host'];
    delete backendOptions.headers['x-forwarded-port'];
    delete backendOptions.headers['x-forwarded-proto'];

    // append unencoded JSON params to request path
    if (backendOptions.params) {
      var params = [];

      Object.keys(backendOptions.params).forEach(function(key) {
        var value = backendOptions.params[key];
        if (Array.isArray(value)) {
          value.forEach(function(val) {
            params.push(
              encodeURIComponent(key) + '=' + encodeURIComponent(val)
            );
          });
        } else if (value !== undefined && value !== null) {
          params.push(
            encodeURIComponent(key) + '=' + encodeURIComponent(value)
          );
        }
      });

      var path = backendOptions.path;
      backendOptions.path =
        path + (path.indexOf('?') > -1 ? '&' : '?') + params.join('&');

      delete backendOptions.params;
    }

    // Debug info
    // console.log(backendOptions)
    // if (body) {
    //   console.log(body)
    // }

    // make actual backend call
    var backendRequest = httpClient.request(backendOptions, function(
      backendResponse
    ) {
      var data = [];

      if (browserResponse) {
        // proxy status to server response
        browserResponse.status(backendResponse.statusCode);

        // proxy all headers to server response
        for (var header in backendResponse.headers) {
          // except auth challenge headers
          if (header !== 'www-authenticate') {
            browserResponse.header(header, backendResponse.headers[header]);
          }
        }
      }

      backendResponse.on('data', function(chunk) {
        if (browserResponse) {
          // proxy data to server response
          browserResponse.write(chunk);
        } else {
          // or gather to pass back to callback
          data.push(chunk);
        }
      });

      backendResponse.on('end', function() {
        if (browserResponse) {
          // close server response for proxying convenience
          browserResponse.end();
        }

        // notify upstream, passing back data (if not streamed into server response yet)
        if (callback) {
          callback(backendResponse, Buffer.concat(data));
        }
      });
    });

    // try to clean up in case of untimely responses
    backendRequest.on('socket', function(socket) {
      socket.on('timeout', function() {
        console.log('Timeout reached, aborting network call..');
        backendRequest.abort();
      });
    });

    // try to clean up in case of failure
    backendRequest.on('error', function(e) {
      if (browserResponse) {
        console.log('Problem with request: ' + e.message);
        browserResponse.status(500).end();
      } else {
        return new Error('Network call failed: ' + e.message);
      }
    });

    // stream browser request data into backend request
    // note: requires non-parsed body!
    if (body) {
      backendRequest.write(body);
      backendRequest.end();
    } else {
      browserRequest.pipe(backendRequest);
      browserRequest.on('end', function() {
        backendRequest.end();
      });
    }
  };

  return {
    call: callBackend
  };
})();

module.exports = backend;
