'use strict';

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var redis = require('redis');
var _ = require('lodash');

var telDCache = require('./../index.js');
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var StubRedisClient = require('./mocks/stubRedisClient');
var stubRedisClient = new StubRedisClient(emitter);

describe('Given I have a module to cache data', function() {
  var key = 'someKey';
  var options = {};
  var retrievePromise;

  describe('And I have instantiated it', function() {
    before(function () {
      sinon.stub(redis, 'createClient').returns(stubRedisClient);
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
            expect(errorMessage.message).to.equal(expectedError);
            done();
          }

          retrievePromise.then(notConnectedResolve, notConnectedReject)
            .catch(done);
        });

      }); // end 'when I attempt to retrieve data from the cache

    }); // end 'have not connected to the cache'

    describe('And I have connected to the cache', function() {

      beforeEach(function() {
        telDCache.connect(options);
        telDCache._state.connected = true;
      });

      describe('And the key does not exist in the cache', function() {
        function missingKeyStub(key, cb) {
          cb(null, null);
        }

        beforeEach(function() {
          sinon.stub(stubRedisClient, 'get', missingKeyStub);
        });

        afterEach(function() {
          stubRedisClient.get.restore();
        });

        describe('When I retrieve the key', function() {
          var expectedErrorMessage = 'Key does not exist';

          beforeEach(function() {
            retrievePromise = telDCache.retrieve(key);
          });

          it('Should reject with an error', function(done) {
            function noKeyResolve() {
              expect('not run').to.equal('this should');
            }

            function noKeyReject(error) {
              expect(expectedErrorMessage).to.equal(error.message);
              done();
            }

            retrievePromise.then(noKeyResolve, noKeyReject)
              .catch(done);
          });
        });
      });

      describe('And that key represents a string value', function() {
        var expectedValue = 'I am what redis might return';

        function getKeyValueStub(key, cb) {
          cb(null, expectedValue);
        }

        beforeEach(function() {
          sinon.stub(stubRedisClient, 'get', getKeyValueStub);
        });

        afterEach(function() {
          stubRedisClient.get.restore();
        });

        describe('When I retrieve the value', function() {
          beforeEach(function() {
            retrievePromise = telDCache.retrieve(key);
          });

          it('Should return a string', function(done) {
            function stringResolve(returnedValue) {
              expect(returnedValue).to.equal(expectedValue);
              done();
            }

            function stringReject() {
              expect('not run').to.equal('this should');
            }

            retrievePromise.then(stringResolve, stringReject).catch(done);
          });
        });

      }); // end 'and that key represents a string value'

      describe('And that key represents an object', function() {
        var expectedObject = {
          'this': 'is what',
          'redis': 'might return'
        };

        var objectRetrieveOptions = {
          'typeHint': 'object'
        };

        function getObjectValueStub(key, cb) {
          cb(null, expectedObject);
        }

        beforeEach(function() {
          sinon.stub(stubRedisClient, 'hgetall', getObjectValueStub);
        });

        afterEach(function() {
          stubRedisClient.hgetall.restore();
        });

        describe('When I retrieve the value', function() {

          beforeEach(function() {
            retrievePromise = telDCache.retrieve(key, objectRetrieveOptions);
          });

          it('Should return an object', function(done) {
            function objectResolved(returnedObject) {
              expect(returnedObject).to.deep.equal(expectedObject);
              done();
            }

            function objectRejected() {
              expect('not run').to.equal('this should');
            }

            retrievePromise.then(objectResolved, objectRejected).catch(done);
          });

        });

      }); // end 'And that key represents an object'

    }); // end 'I have connected to the cache'

  }); // end 'And I have instantiated it'

});
