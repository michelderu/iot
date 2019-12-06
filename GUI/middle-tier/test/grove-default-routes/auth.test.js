/* eslint-env mocha */
'use strict';
const express = require('express');
const chai = require('chai');
const expect = chai.expect;

const setup = require('../helpers/setup');
const minAuthProvider = setup.minAuthProvider;

describe('defaultAuthRoute', () => {
  let authRouteProvider;
  beforeEach(() => {
    authRouteProvider = require('../../grove-default-routes/auth.js');
  });

  it('requires an authProvider', () => {
    expect(() => authRouteProvider({})).to.throw(
      'defaultAuthRoute configuration must include an authProvider'
    );
  });

  describe('with auth server', () => {
    let app;
    beforeEach(() => {
      app = express();
    });

    describe('while logged out', () => {
      it('performs a simple GET to status with wildcard Accept', done => {
        const auth = authRouteProvider({
          authProvider: minAuthProvider
        });
        app.use(auth);
        chai
          .request(app)
          .get('/status')
          .set('Accept', '*/*')
          .then(response => {
            expect(response).to.have.status(200);
            expect(response.body).to.deep.include({
              authenticated: false,
              profile: {}
            });
            done();
          });
      });
    });
  });
});
