'use strict';

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var redis = require('redis');
var _ = require('lodash');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var StubRedisClient = require('./mocks/stubRedisClient');
var stubRedisClient = new StubRedisClient(emitter);

describe('Given I have a module to cache data', function() {
  var TelDCache = require('./../index.js');
  var telDCache;
  var key = 'someKey';
  var options = {};
  var retrievePromise;

  describe('And I have instantiated it', function() {
    before(function () {
      sinon.stub(redis, 'createClient').returns(stubRedisClient);
      telDCache = new TelDCache();
    });

    after(function() {
      redis.createClient.restore();
    });

    describe('When I inspect the module', function() {
      it('Should have a retrieve function', function() {
        var hasRetrieve = _.has(telDCache, 'retrieve');
        expect(hasRetrieve).to.equal(true);
      });
    }); // end 'when i inspect the module'

    describe('And I have not connected to the cache', function() {
      describe('When I attempt to retrieve data from the cache', function() {
        var expectedError = 'Cache is not connected';

        beforeEach(function() {
          retrievePromise = telDCache.retrieve(key);
        });

        it('Should reject with an error', function(done) {
          function notConnectedResolve() {
            expect('not run').to.equal('this should');
          }

          function notConnectedReject(errorMessage) {
            console.log(errorMessage, typeof errorMessage);
            expect(errorMessage.message).to.equal(expectedError);
            done();
          }

          retrievePromise.then(notConnectedResolve, notConnectedReject)
            .catch(done);
        });

      }); // end 'when I attempt to retrieve data from the cache

    }); // end 'have not connected to the cache'

    describe('And I have connected to the cache', function() {

      describe('And the key does not exist in the cache', function() {
        describe('When I retrieve the key', function() {
          var expectedErrorMessage = 'Key does not exist';

          beforeEach(function() {
            telDCache.connect(options);
            telDCache._state.connected = true;

            retrievePromise = telDCache.retrieve(key);
          });

          it('Should reject with an error', function(done) {
            function noKeyResolve() {
              expect('not run').to.equal('this should');
            }

            function noKeyReject(errorMessage) {
              expect(expectedErrorMessage).to.equal(errorMessage);
              done();
            }

            retrievePromise.then(noKeyResolve, noKeyReject)
              .catch(done);
          });
        });
      });

      describe('And that key represents a string value', function() {
        var expectedValue = 'I am what redis might return';

        var stringOptions = {
          'typeHint': 'string'
        };

        beforeEach(function() {
          telDCache.connect(options);
          telDCache._state.connected = true;

          retrievePromise = telDCache.retrieve(key, stringOptions);
        });

        it('Should return a string', function(done) {
          function stringResolve(returnedValue) {
            expect(returnedValue).to.equal(expectedValue);
            done();
          }

          function stringReject() {
            expect('not run').to.equal('should not');
          }

          retrievePromise.then(stringResolve, stringReject).catch(done);
        });
      });

      //describe('And I have a hash key to retrieve with the primary key', function() {
        //var hashKey = 'subKey';
        //var expectedValue = 'I am an expected hash value from redis';
      //});

    });

  }); // end 'And I have instantiated it'

});
