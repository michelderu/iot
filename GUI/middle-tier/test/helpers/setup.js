// root: applies to all tests
const nock = require('nock');
const expect = require('chai').expect;

const mlPort = '51234';
const mlHost = 'marklogic';
const marklogicURL = 'http://' + mlHost + ':' + mlPort;

beforeEach(() => {
  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
  process.env.NODE_ENV = 'test';
  process.env.GROVE_APP_PORT = 61234;
  process.env.GROVE_ML_REST_PORT = mlPort;
  process.env.GROVE_ML_HOST = mlHost;

  // This clears the Node cache of all middle-tier files, so tests
  // do not pollute each other and initialization logic can happen
  // on each test. We exclude test files and node_modules.
  // (Keeping node_modules cached is a major performance boost.)
  for (let modulePath in require.cache) {
    const topDir = __dirname.replace(/test\/helpers$/, '');
    if (
      !modulePath.includes(topDir + 'node_modules') &&
      !modulePath.includes(topDir + 'test')
    ) {
      delete require.cache[modulePath];
    }
  }
});

afterEach(() => {
  try {
    expect(nock.isDone()).to.equal(
      true,
      'Pending Nocks: ' + nock.pendingMocks()
    );
  } catch (error) {
    nock.cleanAll();
    throw error;
  }
});

const mockMLDocument = (overrides = {}) => {
  const reply = overrides.reply || {};
  nock(marklogicURL)
    .intercept('/v1/documents', overrides.verb || 'GET')
    .query(
      typeof overrides.query === 'function'
        ? overrides.query
        : { uri: '/all/id1%20.json', format: 'json', ...overrides.query }
    )
    .reply(reply.statusCode || 200, reply.body, reply.headers);
};

const login = (url, agent) => {
  const user = { username: 'admin', password: 'admin' };
  nock(url)
    .head('/v1/ping')
    .reply(401, null, {
      'www-authenticate':
        'Digest realm="public", qop="auth", nonce="36375f8ae29508:J/s57T1IOCeLl5pNumdHNA==", opaque="d0bbf52b5da95b60"'
    });
  nock(url)
    .get('/v1/documents')
    .query({ uri: '/api/users/admin.json' })
    .reply(404);
  return agent
    .post('/api/auth/login')
    .send(user)
    .catch(error => {
      throw error;
    });
};

module.exports = {
  marklogicURL: 'http://' + mlHost + ':' + mlPort,
  minAuthProvider: {
    isAuthenticated: (req, res, next) => next(),
    getAuth: () => Promise.resolve()
  },
  login,
  mockMLDocument
};
