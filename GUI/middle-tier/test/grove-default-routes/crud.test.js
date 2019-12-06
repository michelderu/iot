/* eslint-env mocha */
'use strict';
const express = require('express');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const setup = require('../helpers/setup');
const mockMLDocument = setup.mockMLDocument;
const minAuthProvider = setup.minAuthProvider;

const uri = '/all/id1%20.json';
const id = '%2Fall%2Fid1%2520.json';
const encodedId = '%252Fall%252Fid1%252520.json';

describe('defaultCrudRoute', () => {
  let crudProvider;
  beforeEach(() => {
    crudProvider = require('../../grove-default-routes/crud.js');
  });

  it('requires an authProvider', () => {
    expect(() => crudProvider({})).to.throw(
      'defaultCrudRoute configuration must include an authProvider'
    );
  });

  describe('with CRUD server', () => {
    let app;
    beforeEach(() => {
      app = express();
    });

    it('performs a simple READ', done => {
      mockMLDocument();
      const crud = crudProvider({
        authProvider: minAuthProvider
      });
      app.use(crud);
      chai
        .request(app)
        .get('/' + encodedId)
        .set('Accept', '*/*')
        .then(response => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it('reports if a document is not found', done => {
      mockMLDocument({ reply: { statusCode: 404 } });
      const crud = crudProvider({
        authProvider: minAuthProvider
      });
      app.use(crud);
      chai
        .request(app)
        .get('/' + encodedId)
        .set('Accept', '*/*')
        .then(response => {
          expect(response).to.have.status(404);
          done();
        });
    });

    it('allows config of default view transform', done => {
      mockMLDocument({ query: { transform: 'default' } });
      const crud = crudProvider({
        authProvider: minAuthProvider,
        views: {
          _default: {
            transform: 'default'
          }
        }
      });
      app.use(crud);
      chai
        .request(app)
        .get('/' + encodedId)
        .then(response => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it('contains a `metadata` view by default', done => {
      // the metadata view does a double-pass to get content-type
      mockMLDocument({
        query: query => query.uri === uri,
        reply: {
          headers: {
            'content-type': 'application/pdf',
            'content-length': '100',
            'vnd.marklogic.document-format': 'pdf'
          }
        }
      });
      mockMLDocument({
        query: { category: 'metadata' },
        reply: { body: {} }
      });
      const crud = crudProvider({
        authProvider: minAuthProvider
      });
      app.use(crud);
      chai
        .request(app)
        .get('/' + encodedId + '/metadata')
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body.contentType).to.equal('application/pdf');
          expect(response.body.fileName).to.equal('id1%20.json');
          expect(response.body.size).to.equal('100');
          expect(response.body.format).to.equal('pdf');
          expect(response.body.uri).to.equal(uri);
          done();
        });
    });

    it('allows different view transform to be specified', done => {
      mockMLDocument({ query: { transform: 'view2' } });
      const crud = crudProvider({
        authProvider: minAuthProvider,
        views: {
          _default: {
            transform: 'default'
          },
          view2: {
            transform: 'view2'
          }
        }
      });
      app.use(crud);
      chai
        .request(app)
        .get('/' + encodedId + '/view2')
        .then(response => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it('allows view category to be specified', done => {
      mockMLDocument({ query: { category: 'category2' } });
      const crud = crudProvider({
        authProvider: minAuthProvider,
        views: {
          view2: {
            category: 'category2'
          }
        }
      });
      app.use(crud);
      chai
        .request(app)
        .get('/' + encodedId + '/view2')
        .then(response => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it('allows view format to be overridden', done => {
      mockMLDocument({ query: { format: 'xml' } });
      const crud = crudProvider({
        authProvider: minAuthProvider,
        views: {
          view2: {
            format: 'xml'
          }
        }
      });
      app.use(crud);
      chai
        .request(app)
        .get('/' + encodedId + '/view2')
        .then(response => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it('errors if request does not accept json', done => {
      const crud = crudProvider({
        authProvider: minAuthProvider
      });
      app.use(crud);
      chai
        .request(app)
        .get('/' + encodedId)
        .set('Accept', 'application/pdf')
        .then(response => {
          expect(response).to.have.status(406);
          done();
        });
    });

    it('allows view-specific contentType', done => {
      mockMLDocument();
      const crud = crudProvider({
        authProvider: minAuthProvider,
        views: {
          _default: {
            contentType: 'image/png'
          }
        }
      });
      app.use(crud);
      chai
        .request(app)
        .get('/' + encodedId)
        .set('accept', 'image/png')
        .then(response => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it('allows overriding of `call`', done => {
      let customCallInvoked = false;
      let customCallCalledWithId, customCallCalledWithView;
      const crud = crudProvider({
        authProvider: minAuthProvider,
        views: {
          _default: {
            call: (req, res, config, id, view) => {
              customCallInvoked = true;
              customCallCalledWithId = id;
              customCallCalledWithView = view;
              return res.end();
            }
          }
        }
      });
      app.use(crud);
      chai
        .request(app)
        .get('/' + encodedId)
        .then(() => {
          expect(customCallInvoked).to.equal(true);
          expect(customCallCalledWithId).to.equal(id);
          expect(customCallCalledWithView).to.equal('_default');
          done();
        });
    });

    it('allows create with id', done => {
      const crud = crudProvider({
        authProvider: minAuthProvider
      });
      app.use(crud);
      mockMLDocument({
        verb: 'PUT',
        query: query => query.uri === uri
      });
      chai
        .request(app)
        .post('/' + encodedId)
        .set('Content-Type', 'application/json')
        .send({ hello: 'world' })
        .then(response => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it('allows create without id', done => {
      const crud = crudProvider({
        authProvider: minAuthProvider
      });
      app.use(crud);
      mockMLDocument({
        verb: 'POST',
        query: () => true
      });
      chai
        .request(app)
        .post('/')
        .set('Content-Type', 'application/json')
        .send({ hello: 'world' })
        .then(response => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it('reports errors in create without id', done => {
      const crud = crudProvider({
        authProvider: minAuthProvider
      });
      app.use(crud);
      mockMLDocument({
        verb: 'POST',
        query: () => true,
        reply: { statusCode: 500 }
      });
      chai
        .request(app)
        .post('/')
        .set('Content-Type', 'application/json')
        .send({ hello: 'world' })
        .then(response => {
          expect(response).to.have.status(500);
          done();
        });
    });

    it('allows edit', done => {
      const crud = crudProvider({
        authProvider: minAuthProvider
      });
      app.use(crud);
      mockMLDocument({
        verb: 'PUT',
        query: query => query.uri === uri
      });
      chai
        .request(app)
        .put('/' + encodedId)
        .set('Content-Type', 'application/json')
        .send({ hello: 'world' })
        .then(response => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it('notifies when edit fails', done => {
      const crud = crudProvider({
        authProvider: minAuthProvider
      });
      app.use(crud);
      mockMLDocument({
        verb: 'PUT',
        query: query => query.uri === uri,
        reply: { statusCode: 500 }
      });
      chai
        .request(app)
        .put('/%252Fall%252Fid1%252520.json')
        .set('Content-Type', 'application/json')
        .send({ hello: 'world' })
        .then(response => {
          expect(response).to.have.status(500);
          done();
        });
    });

    it('allows delete', done => {
      const crud = crudProvider({
        authProvider: minAuthProvider
      });
      app.use(crud);
      mockMLDocument({
        verb: 'DELETE',
        query: query => query.uri === uri
      });
      chai
        .request(app)
        .delete('/' + encodedId)
        .then(response => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it('notifies when delete fails', done => {
      const crud = crudProvider({
        authProvider: minAuthProvider
      });
      app.use(crud);
      mockMLDocument({
        verb: 'DELETE',
        query: query => query.uri === uri,
        reply: { statusCode: 500 }
      });
      chai
        .request(app)
        .delete('/%252Fall%252Fid1%252520.json')
        .then(response => {
          expect(response).to.have.status(500);
          done();
        });
    });
  });
});
