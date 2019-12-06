/* eslint-env mocha */
'use strict';
const express = require('express');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const setup = require('../helpers/setup');
const marklogicURL = setup.marklogicURL;
const minAuthProvider = setup.minAuthProvider;

const nock = require('nock');

describe('defaultSearchRoute', () => {
  let searchProvider;
  beforeEach(() => {
    searchProvider = require('../../grove-default-routes/search.js');
  });

  it('requires an authProvider', () => {
    expect(() => searchProvider({})).to.throw(
      'defaultSearchRoute configuration must include an authProvider'
    );
  });

  describe('with search server', () => {
    let app;
    beforeEach(() => {
      app = express();
    });

    it('works for empty search', done => {
      const search = searchProvider({
        authProvider: minAuthProvider
      });
      app.use(search);
      nock(marklogicURL)
        .post('/v1/search')
        .query(() => true)
        .reply(200, {});
      chai
        .request(app)
        .post('/', {})
        .then(response => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it('correctly parses a geospatial constraint filter', done => {
      // TODO: add unit tests for the parsing of different kinds of geospatial
      // queries
      const search = searchProvider({
        authProvider: minAuthProvider
      });
      const myBox = {
        north: 100,
        south: 0,
        west: 150,
        east: -150
      };
      // TODO: if we allow execution to be configurable with a func, we could
      // eliminate the network mocking ('nock'-ing)
      nock(marklogicURL)
        .post('/v1/search', {
          search: {
            query: {
              'geospatial-constraint-query': {
                'constraint-name': 'Location',
                box: [myBox],
                point: [],
                circle: [],
                polygon: []
              }
            },
            options: {}
          }
        })
        .query(() => true)
        .reply(200, {});
      app.use(search);
      chai
        .request(app)
        .post('/')
        .send({
          filters: {
            type: 'selection',
            constraintType: 'geospatial',
            constraint: 'Location',
            mode: 'and',
            value: [myBox]
          }
        })
        .then(response => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it('correctly parses custom constraint with 2 values', done => {
      const search = searchProvider({
        authProvider: minAuthProvider
      });
      const myBox1 = {
        north: 100,
        south: 0,
        west: 150,
        east: -150
      };
      const myBox2 = {
        north: 150,
        south: 50,
        west: 125,
        east: -100
      };
      const myBoxes = [myBox1, myBox2];
      // TODO: if we allow execution to be configurable with a func, we could
      // eliminate the network mocking ('nock'-ing)
      nock(marklogicURL)
        .post('/v1/search', {
          search: {
            query: {
              'or-query': {
                queries: [
                  {
                    'custom-constraint-query': {
                      'constraint-name': 'CustomLocation',
                      value: myBox1,
                      operator: 'EQ'
                    }
                  },
                  {
                    'custom-constraint-query': {
                      'constraint-name': 'CustomLocation',
                      value: myBox2,
                      operator: 'EQ'
                    }
                  }
                ]
              }
            },
            options: {}
          }
        })
        .query(() => true)
        .reply(200, {});
      app.use(search);
      chai
        .request(app)
        .post('/')
        .send({
          filters: {
            // not sure if this type makes sense
            type: 'selection',
            constraintType: 'custom',
            constraint: 'CustomLocation',
            // is this the right mode?
            mode: 'or',
            value: myBoxes
          }
        })
        .then(response => {
          expect(response).to.have.status(200);
          done();
        });
    });
  });
});
