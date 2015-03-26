'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var sinon = require('sinon');
var redis = require('redis');
var expect = chai.expect;
var _ = require('lodash');
var telDCache = require('./../index.js');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var StubRedisClient = require('./mocks/stubRedisClient');;
var stubRedisClient = new StubRedisClient(emitter);

// If these tests fail due to timeout you may need to adjust the setTimeout
// calls made in the beforeEach()s that use it.
describe('Given I have a module to cache data', function() {

  describe('And I have instantiated it', function() {

    describe('When I inspect the cache module', function() {

      it('Should have a connect function', function() {
        var hasInit = _.has(telDCache, 'connect');

        expect(hasInit).to.equal(true);
      });

      it('Should have a disconnect function', function() {
        var hasDisconnect = _.has(telDCache, 'disconnect');

        expect(hasDisconnect).to.equal(true);
      });
    });

    describe('And I connect to the secured cache with a correct password', function () {

      var connection; 

      beforeEach(function() {
        sinon.stub(redis, 'createClient', function stubCreateClientSuccess() {
          setTimeout(function() {
            emitter.emit('ready');
          }, 250);
          return stubRedisClient;
        });

        var options = {
          host: 'someHost',
          port: 'somePort',
          // make sure to never set this password to the real local development 
          // redis's password. If something happens to the mocks and you end
          // up connecting to it then the tests won't mean anything.
          password: 'thisisavalidpassword'
        };

        connection = telDCache.connect(options);
      });

      afterEach(function() {
        redis.createClient.restore();
      });


      describe('When I examine the state', function() {

        it('Should return with a successful connection message', function(done) {
          function success(data) {
            expect(data.authorized).to.equal(true);
            expect(data.connected).to.equal(true);
            done();
          }

          function failure() {
            expect(true).to.equal(false);
          }

          connection.then(success, failure).catch(done);
        });
      });

      describe('And I disconnect the cache session', function() {

        var closePromise;

        beforeEach(function() {
          closePromise = connection.then(telDCache.disconnect);
        });

        it('Should return with a successful disconnect message', function(done) {

          function success(data) {
            expect(data.connected).to.equal(false);
            done();
          }

          function failure() {
            expect(true).to.equal(false);
          }

          closePromise.then(success, failure).catch(done);
        });
      });
    }); // end 'connect to secured cache with a password'


    describe('And I connect to the secured cache without a correct password', function () {

      var connection; 

      beforeEach(function() {
        sinon.stub(redis, 'createClient', function stubCreateClientError() {
          setTimeout(function() {
            emitter.emit('error', {'message': 'There needs to be NOAUTH in this string'});
          }, 250);
          return stubRedisClient;
        });

        var options = {
          host: 'someHost',
          port: 'somePort',
          password: null
        };

        connection = telDCache.connect(options);
      });

      afterEach(function() {
        redis.createClient.restore();
      });

      describe('When I examine the state', function() {

        it('Should return with an unsuccessful connection state', function(done) {
          function successfulPasswordShouldntHappen(data) {
            expect(true).to.equal(false);
          }

          function passwordIsWrong(data) {
            expect(data.authorized).to.equal(false);
            expect(data.connected).to.equal(false);
            done();
          }

          connection.then(successfulPasswordShouldntHappen, passwordIsWrong).catch(done);
        });
      });

      describe('And I disconnect the cache session', function() {

        var closePromise;

        beforeEach(function() {
          closePromise = connection.then(telDCache.disconnect);
        });

        it('Should already be disconnected', function(done) {

          function success(data) {
            expect('run').to.equal('this should not');
          }

          function failure(data) {
            expect(data.authorized).to.equal(false)
            expect(data.connected).to.equal(false)
            done();
          }

          closePromise.then(success, failure).catch(done);
        });
      });
    }); // end 'connect without a correct password'




  });
});
