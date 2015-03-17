'use strict';

var chai = require('chai');
var expect = chai.expect;
//var chaiAsPromised = require('chai-as-promised');

//chai.use(chaiAsPromised);

var sinon = require('sinon');
var redis = require('redis');
var _ = require('lodash');
var q = require('@telogical/telq');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var StubRedisClient = require('./mocks/stubRedisClient');;
var stubRedisClient = new StubRedisClient(emitter);

// If these tests fail due to timeout you may need to adjust the setTimeout
// calls made in the beforeEach()s that use it.
describe('Given I have a module to cache data', function() {
  var TelDCache = require('./../index.js');
  var telDCache;

  describe('And I have instantiated it', function() {
    before(function() {
      telDCache = new TelDCache();
    });
    
    describe('When I inspect the module', function() {
      it('Should have an insert function', function() {
        var hasInsert = _.has(telDCache, 'insert');

        expect(hasInsert).to.equal(true);
      });
    });

    describe('And I have not connected to the cache', function() {
      describe('When I insert data to the cache', function() {
        var insertPromise,
            expectedError;

        beforeEach(function() {
          var key = 'theKey',
              value = 'theValue',
              options = {};

          expectedError = 'Cache is not connected';
          insertPromise = telDCache.insert(key, value, options);
        });

        it('Should reject with an error', function(done) {
          function success() {
            expect(true).to.equal(false);
          }

          function failure(err) {
            expect(err.message).to.equal(expectedError);
            done();
          }

          insertPromise.then(success, failure).catch(done);
        });
      });
    });

    describe('And I have connected to the cache', function() {
      var testData = {
        'key': 'myTestKey',
        'value': 'myTestValue'
      }

      var testHashdata = {
        'key': 'myHash',
        'value': {
          'key1': 'value1',
          'key2': 'value2',
          'key3': 'value3'
        }
      };

      var options = {
        host: 'someHost',
        port: 'somePort'
      };

      describe('When I insert a string to the cache', function() {
        var insertPromise;

        beforeEach(function() {
          telDCache._state.connected = true;
          insertPromise = telDCache.insert(testData.key, testData.value);
        });

        it('Should resolve with the key that was set', function(done) {
          function success(data) {
            expect(data).to.equal('myTestKey');
            done();
          }

          function fail(err) {
            expect(true).to.equal(false);
          }

          insertPromise.then(success, fail).catch(done);
        });

      });

      /*
      describe('When I insert an object to the cache', function() {
        it('Should resolve with the keys that were set', function(done) {
          expect(true).to.equal(false);
          done();
        });
      });
     */
    });

  });
});
