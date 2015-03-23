'use strict';

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var redis = require('redis');
var _ = require('lodash');
var q = require('@telogical/telq');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var StubRedisClient = require('./mocks/stubRedisClient');;
var stubRedisClient = new StubRedisClient(emitter);

describe('Given I have a module to cache data', function() {
  var TelDCache = require('./../index.js');
  var telDCache;

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
        var retrievePromise,
            expectedError;

        beforeEach(function() {
          var key = 'someKey',
              expectedError = 'Cache is not connected',
              options = {};
        });

        it('Should reject with an error', function(done) {
          function notConnectedResolve() {
            expect('not run').to.equal('this should');
          }

          function notConnectedReject(errorMessage) {
            expect(errorMessage).to.equal(expectedError);
            done();
          }

          done();
        });

      }); // end 'when I attempt to retrieve data from the cache

    }); // end 'have not connected to the cache'

    //describe('And I have connected to the cache', function() {
      //var key = 'yetAnotherKey';

      //describe('And I attempt to retrieve a key that does not exist in the cache', function() {
        //var expectedErrorMessage = 'Key does not exist';

        //beforeEach(function() {

        //});
      //});


      //describe('And that key represents a string value', function() {
        //var expectedValue = 'I am what redis might return';
      //});

      //describe('And I have a hash key to retrieve with the primary key', function() {
        //var hashKey = 'subKey';
        //var expectedValue = 'I am an expected hash value from redis';
      //});

    //});

  }); // end 'And I have instantiated it'

});
