const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const setup = require('../helpers/setup');
const marklogicURL = setup.marklogicURL;
const login = setup.login;

describe('auth integration tests', () => {
  let server;
  beforeEach(() => {
    server = require('../../node-app');
  });

  it('reports when a valid call is made without authenticated user', () => {
    chai
      .request(server)
      .post('/api/search/all')
      .send({})
      .then(response => {
        expect(response.status).to.equal(
          401,
          'Received response: ' + JSON.stringify(response.body)
        );
      });
  });

  describe('after login', () => {
    let agent;

    beforeEach(() => {
      agent = chai.request.agent(server);
      return login(marklogicURL, agent);
    });

    afterEach(done => {
      agent.close(done);
    });

    it('reports that user without profile is authenticated', done => {
      setup.mockMLDocument({
        query: { uri: '/api/users/admin.json' },
        reply: { statusCode: 404 }
      });
      agent.get('/api/auth/status').then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.include({
          authenticated: true,
          username: 'admin',
          profile: {}
        });
        done();
      });
    });

    it('reports that user with profile is authenticated', done => {
      const userProfile = {
        username: 'admin',
        emails: ['admin@example.com']
      };
      setup.mockMLDocument({
        query: { uri: '/api/users/admin.json' },
        reply: { body: { user: userProfile } }
      });
      agent.get('/api/auth/status').then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.include({
          authenticated: true,
          username: 'admin',
          profile: userProfile
        });
        done();
      });
    });
  });
});
