'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var sinon = require('sinon');
var redis = require('redis');
var expect = chai.expect;
var _ = require('lodash');
var q = require('@telogical/telq');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();
var stubRedisClient;

// If these tests fail due to timeout you may need to adjust the setTimeout
// calls made in the beforeEach()s that use it.
describe('Given I have a module to cache data', function() {
  var TelDCache = require('./../index.js');
  var telDCache;

  describe('And I have instantiated it', function() {
    before(function() {
      telDCache = new TelDCache();

      stubRedisClient = {
        'on': function handleCallback(eve, cb) {
          emitter.on(eve, cb);
        },
        'set': function clientSetStub(key, value) {
          if(typeof value === 'string') {
            return 'OK';
          }

          if(typeof value === 'object') {
            return 0;
          }
        }
      };

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

          expectedError = new Error('Cache is not connected');
          insertPromise = telDCache.insert(key, value, options);
        });

        it('Should reject with an error', function(done) {
          expect(insertPromise)
            .to.eventually.deep.equal(expectedError);

          expect(insertPromise)
            .to.eventually.be.rejected.and.notify(done);
        });
      });
    });

    describe('And I have connected to the cache', function() {
      var initPromise;

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

      beforeEach(function() {
        sinon.stub(redis, 'createClient', function stubCreateClientSuccess() {
          setTimeout(function() {
            emitter.emit('ready');
          }, 250);
          return stubRedisClient;
        });

        initPromise = telDCache.init();
      });

      afterEach(function() {
        redis.createClient.restore();
        redis.set.restore();
      });

      describe('When I insert a string to the cache', function() {
        var insertPromise;

        beforeEach(function() {
          initPromise.then(function doInsert() {
            insertPromise = telDCache.insert();
          });
        });

        it('Should resolve with the key that was set', function(done) {
          expect(true).to.equal(false);
          done();
        });
      });

      describe('When I insert an object to the cache', function() {
        it('Should resolve with the keys that were set', function(done) {
          expect(true).to.equal(false);
          done();
        });
      });

    });

  });
});
