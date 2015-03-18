'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var sinon = require('sinon');
var redis = require('redis');
var expect = chai.expect;
var _ = require('lodash');

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

    describe('And I successfully connect to the cache', function() {

      beforeEach(function() {
        sinon.stub(redis, 'createClient', function stubCreateClientSuccess() {
          setTimeout(function() {
            emitter.emit('ready');
          }, 250);
          return stubRedisClient;
        });
      });

      afterEach(function() {
        redis.createClient.restore();
      });

      describe('And I connect to the cache', function () {

        var connection; 

        beforeEach(function() {
          var options = {
            host: 'someHost',
            port: 'somePort'
          };

          connection = telDCache.connect(options);
        });

        describe('When I examine the state', function() {

          it('Should return with a successful connection message', function(done) {
            function success(data) {
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

          it('Should return with a successful disconnect message rabbits', function(done) {

            function success(data) {
              expect(data.connected).to.equal(false);
              done();
            }

            function failure() {
              console.log('shit');
              expect(true).to.equal(false);
            }

            closePromise.then(success, failure).catch(done);
          });
        });
      });
    });

  });
});
