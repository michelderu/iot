'use strict';

var options = require('./options')();
var https = require('https');
var http = require('http');
var q = require('q');
var wwwAuthenticate = require('www-authenticate');
var _ = require('underscore');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var httpClient = http;
if (options.httpsEnabledInBackend) {
  //   console.log('ML Certificate = "' + options.mlCertificate + '"')
  console.log('Will use https client to communicate with MarkLogic.');
  httpClient = https;
} else {
  // console.log('ML Certificate = "' + options.mlCertificate + '"')
  console.log('Will use http client to communicate with MarkLogic.');
}

var defaultOptions = {
  authHost: options.mlHost,
  authPort: options.mlRestPort,
  challengeMethod: 'HEAD',
  challengePath: '/v1/ping'
};

function init() {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(
    new LocalStrategy(
      {
        passReqToCallback: true
      },
      function(req, username, password, done) {
        // Debug info
        // console.log('LocalStrategy callback')
        // console.log(req)
        var reqOptions = {
          hostname: options.mlHost,
          port: options.mlRestPort,
          // FIXME: /v1/documents??
          path: '/v1/documents?uri=/api/users/' + username + '.json',
          headers: {}
        };

        getAuthorization(req.session, reqOptions.method, reqOptions.path, {
          authHost: options.mlHost,
          authPort: options.mlRestPort,
          authUser: username,
          authPassword: password
        })
          .then(function(authorization) {
            if (authorization) {
              reqOptions.headers.Authorization = authorization;
            }

            var login = httpClient.get(reqOptions, function(response) {
              var user = {
                authenticated: true,
                username: username
              };

              if (response.statusCode === 200) {
                response.on('data', function(chunk) {
                  var json = JSON.parse(chunk);
                  if (json.user !== undefined) {
                    user.profile = json.user;
                  } else {
                    console.log('did not find chunk.user');
                  }

                  done(null, user);
                });
              } else if (response.statusCode === 404) {
                // no user profile yet..
                done(null, user);
              } else if (response.statusCode === 401) {
                clearAuthenticator(req.session);
                done(null, false, {
                  message: 'Invalid credentials'
                });
              } else {
                done(null, false, {
                  message: 'API error'
                });
              }
            });
            login.on('error', function(e) {
              console.error(JSON.stringify(e));
              console.error('login failed: ' + e.statusCode);
              done(e);
            });
          })
          .catch(done);
      }
    )
  );
}

function handleLocalAuth(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        message: info.message
      });
    }

    // Manually establish the session...
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.json(user);
    });
  })(req, res, next);
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

var authenticators = {};

setInterval(function() {
  for (var id in authenticators) {
    if (isExpired(authenticators[id])) {
      delete authenticators[id];
    }
  }
}, 1000 * 60 * 30);

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  );
}

function clearAuthenticator(session) {
  if (session.authenticators) {
    for (var key in session.authenticators) {
      var authenticatorId = session.authenticators[key];
      delete authenticators[authenticatorId];
    }
  }
  delete session.authenticators;
}

function createAuthenticator(session, host, port, user, password, challenge) {
  var authenticator = wwwAuthenticate(user, password)(challenge);
  if (!session.authenticators) {
    session.authenticators = {};
  }
  var authenticatorId = session.authenticators[user + ':' + host + ':' + port];
  if (!authenticatorId) {
    authenticatorId = guid();
    session.authenticators[user + ':' + host + ':' + port] = authenticatorId;
  }

  authenticators[authenticatorId] = authenticator;
  timestampAuthenticator(authenticator);
  return authenticator;
}

function timestampAuthenticator(authenticator) {
  if (authenticator) {
    authenticator.lastAccessed = new Date();
  }
}

var expirationTime = 1000 * 60 * 60 * 12;

function isExpired(authenticator) {
  return (
    authenticator.lastAccessed &&
    new Date() - authenticator.lastAccessed > expirationTime
  );
}

function getAuthenticator(session, user, host, port) {
  if (!session.authenticators) {
    return null;
  }
  var authenticatorId = session.authenticators[user + ':' + host + ':' + port];
  if (!authenticatorId) {
    return null;
  }
  var authenticator = authenticators[authenticatorId];
  timestampAuthenticator(authenticator);
  return authenticator;
}

function getAuth(session, reqOptions) {
  if (!session.passport) {
    return Promise.reject('Unauthorized');
  }
  var passportUser = session.passport.user;
  return getAuthorization(
    session,
    reqOptions.method || 'GET',
    reqOptions.path,
    {
      authHost: reqOptions.hostname || options.mlHost,
      authPort: reqOptions.port || options.mlRestPort,
      authUser: passportUser.username,
      authPassword: passportUser.password
    }
  );
}

function getAuthorization(session, reqMethod, reqPath, authOptions) {
  reqMethod = reqMethod || 'GET';
  var authorization = null;
  var d = q.defer();
  if (!authOptions.authUser) {
    d.reject('Unauthorized');
    return d.promise;
  }
  var mergedOptions = _.extend({}, defaultOptions, authOptions || {});
  var authenticator = getAuthenticator(
    session,
    mergedOptions.authUser,
    mergedOptions.authHost,
    mergedOptions.authPort
  );
  if (authenticator) {
    authorization = authenticator.authorize(reqMethod, reqPath);
    d.resolve(authorization);
  } else {
    var challengeReq = httpClient.request(
      {
        hostname: mergedOptions.authHost,
        port: mergedOptions.authPort,
        method: mergedOptions.challengeMethod,
        path: mergedOptions.challengePath
      },
      function(response) {
        var statusCode = response.statusCode;
        var challenge = response.headers['www-authenticate'];
        var hasChallenge = challenge !== null;
        if (statusCode === 401 && hasChallenge) {
          authenticator = createAuthenticator(
            session,
            mergedOptions.authHost,
            mergedOptions.authPort,
            mergedOptions.authUser,
            mergedOptions.authPassword,
            challenge
          );
          authorization = authenticator.authorize(reqMethod, reqPath);
          d.resolve(authorization);
        } else {
          session.authenticators = {};
          d.reject('Unauthorized');
        }
      }
      // TODO: capture error response?
    );
    challengeReq.on('error', function challengeReqError(error) {
      console.error(
        '\nReceived the following error when trying to connect to MarkLogic: ' +
          error.stack
      );
      if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
        console.error(
          'Please ensure that MarkLogic is running on the host specified by GROVE_ML_HOST (currently "' +
            options.mlHost +
            '") and the port specified by GROVE_ML_REST_PORT (currently "' +
            options.mlRestPort +
            '"). See the README for more information.'
        );
      }
      d.reject(error);
    });
    challengeReq.end();
  }
  return d.promise;
}

// TODO, but looks broken at the moment (authenticator isn't used)
// function expiresAt(session) {
//   var authenticator = getAuthenticator(
//     session,
//     session.passport.user,
//     defaultOptions.authHost,
//     defaultOptions.authPort
//   );
//   var d = new Date();
//   d.setTime(d.getTime() + expirationTime);
//   return d;
// }

var authHelper = {
  init: init,
  isAuthenticated: isAuthenticated,
  handleLocalAuth: handleLocalAuth,
  getAuthorization: getAuthorization,
  getAuth: getAuth,
  clearAuthenticator: clearAuthenticator
  // expiresAt: expiresAt
};

module.exports = authHelper;
