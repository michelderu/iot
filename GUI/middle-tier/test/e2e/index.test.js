'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('/', () => {
  let server;
  beforeEach(() => {
    server = require('../../node-app');
  });

  it('returns a 404 for GET', () => {
    return chai
      .request(server)
      .get('/')
      .then(response => {
        expect(response.status).to.equal(
          404,
          'Received response: ' + JSON.stringify(response.body)
        );
        expect(response).to.be.json;
        expect(response.body).to.include.keys('message');
      });
  });

  it('returns a 404 with bad POST', () => {
    return chai
      .request(server)
      .post('/api/search')
      .then(response => {
        expect(response.status).to.equal(
          404,
          'Received response: ' + JSON.stringify(response.body)
        );
        expect(response).to.be.json;
        expect(response.body).to.include.keys('message');
      });
  });
});
