'use strict';

var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');

describe('Given I have a module to cache data', function() {
  var TelDCache = require('./../index.js');
  var telDCache;

  describe('And I have instantiated it', function() {
    before(function() {
      telDCache = new TelDCache();
    });

    describe('When I inspect the cache module', function() {
      it('Should have an insert function', function() {
        var hasInsert = _.has(telDCache, 'insert');

        expect(hasInsert).to.equal(true);
      });
    });
  });
});
