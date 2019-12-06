/* eslint-env mocha */
'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('defaultStaticRoute', () => {
  let staticProvider;
  beforeEach(() => {
    staticProvider = require('../../grove-default-routes/static');
  });

  it('requires a staticUIDirectory', () => {
    expect(() => staticProvider({})).to.throw(
      'defaultStaticRoute configuration must include a staticUIDirectory'
    );
  });
});
