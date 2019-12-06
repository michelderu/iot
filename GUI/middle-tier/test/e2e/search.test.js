'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const setup = require('../helpers/setup');
const marklogicURL = setup.marklogicURL;
const login = setup.login;

const nock = require('nock');

describe('/api/search/all', () => {
  let agent;

  afterEach(done => {
    agent.close(done);
  });

  describe('with http', () => {
    beforeEach(() => {
      const server = require('../../node-app');
      agent = chai.request.agent(server);
      return login(marklogicURL, agent);
    });

    it('POSTs search to MarkLogic', done => {
      const searchResponse = require('../helpers/qtextSearchResponse').henry;
      nock(marklogicURL)
        .post('/v1/search', {
          search: {
            query: {
              qtext: 'henry'
            },
            options: {}
          }
        })
        .query({
          format: 'json',
          start: 1,
          pageLength: 10,
          options: 'all'
        })
        .reply(200, searchResponse);
      const executedQuery = {
        filters: {
          type: 'queryText',
          value: 'henry'
        },
        options: {
          start: 1,
          pageLength: 10
        }
      };
      agent
        .post('/api/search/all')
        .send(executedQuery)
        .then(response => {
          expect(response.status).to.equal(
            200,
            'Received response: ' + JSON.stringify(response.body)
          );
          expect(response.body).to.include.all.keys(
            'results',
            'facets',
            'total',
            'metrics'
          );
          expect(response.body.results).to.deep.equal(
            searchResponse.results.map(r => ({
              ...r,
              id: encodeURIComponent(r.uri)
            }))
          );
          expect(response.body.facets).to.deep.equal(searchResponse.facets);
          expect(response.body.total).to.equal(2);
          expect(response.body.metrics).to.include({
            'total-time': 'PT0.010867S'
          });
          done();
        });
    });

    it('works with an empty request body', done => {
      nock(marklogicURL)
        .post(/search/)
        .reply(200, {});
      agent
        .post('/api/search/all')
        .send({})
        .then(response => {
          expect(response.status).to.equal(
            200,
            'Received response: ' + JSON.stringify(response.body)
          );
          done();
        })
        .catch(done.fail);
    });

    it('requests the second page', done => {
      const searchResponse = require('../helpers/qtextSearchResponse')
        .henryPageTwo;
      nock(marklogicURL)
        .post('/v1/search', {
          search: {
            query: {
              qtext: 'henry'
            },
            options: {}
          }
        })
        .query({
          format: 'json',
          start: 11,
          pageLength: 10,
          options: 'all'
        })
        .reply(200, searchResponse);
      const executedQuery = {
        filters: {
          type: 'queryText',
          value: 'henry'
        },
        options: {
          start: 11,
          pageLength: 10
        }
      };
      agent
        .post('/api/search/all')
        .send(executedQuery)
        .then(response => {
          expect(response.status).to.equal(
            200,
            'Received response: ' + JSON.stringify(response.body)
          );
          done();
        });
    });

    it('builds a constraint plus qtext query', done => {
      const searchResponse = require('../helpers/qtextSearchResponse').henry;
      nock(marklogicURL)
        .post('/v1/search', {
          search: {
            query: {
              'and-query': {
                queries: [
                  {
                    'range-constraint-query': {
                      'constraint-name': 'Gender',
                      value: ['F'],
                      'range-operator': 'EQ',
                      'range-option': []
                    }
                  },
                  {
                    qtext: 'henry'
                  }
                ]
              }
            },
            options: {}
          }
        })
        .query({
          format: 'json',
          pageLength: 10,
          start: 1,
          options: 'all'
        })
        .reply(200, searchResponse);
      const executedQuery = {
        start: 1,
        pageLength: 10,
        filters: {
          and: [
            {
              constraint: 'Gender',
              constraintType: 'range',
              type: 'selection',
              mode: 'and',
              value: ['F']
            },
            {
              type: 'queryText',
              value: 'henry'
            }
          ]
        }
      };
      agent
        .post('/api/search/all')
        .send(executedQuery)
        .then(response => {
          expect(response.status).to.equal(
            200,
            'Received response: ' + JSON.stringify(response.body)
          );
          done();
        });
    });

    xit('handles 400 errors from MarkLogic', done => {
      nock(marklogicURL)
        // We don't want to assert on post body in this spec
        .filteringRequestBody(() => '*')
        .post('/v1/search', '*')
        .query(true) // We don't care about the queryString in this spec
        .reply(400, {
          errorResponse: {
            statusCode: 400,
            status: 'Bad Request',
            messageCode: 'XDMP-ELEMRIDXNOTFOUND',
            message:
              'XDMP-ELEMRIDXNOTFOUND: cts:json-property-reference("Gender", ()) -- No  element range index for Gender collation=http://marklogic.com/collation/ coordinate-system=wgs84'
          }
        });
      agent.post('/api/search/all').end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.deep.equal({
          statusCode: 400,
          status: 'Bad Request',
          messageCode: 'XDMP-ELEMRIDXNOTFOUND',
          message:
            'XDMP-ELEMRIDXNOTFOUND: cts:json-property-reference("Gender", ()) -- No  element range index for Gender collation=http://marklogic.com/collation/ coordinate-system=wgs84'
        });
        done();
      });
    });
  });

  describe('with https', () => {
    const marklogicHttpsURL = marklogicURL.replace('http', 'https');
    beforeEach(() => {
      process.env.GROVE_HTTPS_ENABLED_IN_BACKEND = true;
      const server = require('../../node-app');
      agent = chai.request.agent(server);
      return login(marklogicHttpsURL, agent);
    });

    afterEach(() => {
      process.env.GROVE_HTTPS_ENABLED_IN_BACKEND = false;
    });

    it('POSTs search to MarkLogic', done => {
      const searchResponse = require('../helpers/qtextSearchResponse').henry;
      nock(marklogicHttpsURL)
        .post('/v1/search', {
          search: {
            query: {
              qtext: 'henry'
            },
            options: {}
          }
        })
        .query({
          format: 'json',
          start: 1,
          pageLength: 10,
          options: 'all'
        })
        .reply(200, searchResponse);
      const executedQuery = {
        filters: {
          type: 'queryText',
          value: 'henry'
        },
        options: {
          start: 1,
          pageLength: 10
        }
      };
      agent
        .post('/api/search/all')
        .send(executedQuery)
        .then(response => {
          expect(response.status).to.equal(
            200,
            'Received response: ' + JSON.stringify(response.body)
          );
          expect(response.body).to.include.all.keys(
            'results',
            'facets',
            'total',
            'metrics'
          );
          expect(response.body.results).to.deep.equal(
            searchResponse.results.map(r => ({
              ...r,
              id: encodeURIComponent(r.uri)
            }))
          );
          expect(response.body.facets).to.deep.equal(searchResponse.facets);
          expect(response.body.total).to.equal(2);
          expect(response.body.metrics).to.include({
            'total-time': 'PT0.010867S'
          });
          done();
        });
    });
  });
});
