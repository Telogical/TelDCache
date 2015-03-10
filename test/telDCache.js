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
var stubEventHandler;

// If these tests fail due to timeout you may need to adjust the setTimeout
// calls made in the beforeEach()s that use it.
describe('Given I have a module to cache data', function() {
  var TelDCache = require('./../index.js');
  var telDCache;

  describe('And I have instantiated it', function() {
    before(function() {
      telDCache = new TelDCache();

      stubEventHandler = {
        'on': function handleCallback(eve, cb) {
          emitter.on(eve, cb);
        }
      };

    });

    describe('When I inspect the cache module', function() {
      it('Should have an insert function', function() {
        var hasInsert = _.has(telDCache, 'insert');

        expect(hasInsert).to.equal(true);
      });

      it('Should have an init function', function() {
        var hasInit = _.has(telDCache, 'init');

        expect(hasInit).to.equal(true);
      });
    });

    describe('And I successfully connect to the cache', function() {

      beforeEach(function() {
        sinon.stub(redis, 'createClient', function stubCreateClientSuccess() {
          setTimeout(function() {
            emitter.emit('ready');
          }, 250);
          return stubEventHandler;
        });
      });

      afterEach(function() {
        redis.createClient.restore();
      });

      describe('When I initialize the cache skittles', function () {

        var connection; 

        beforeEach(function() {
          var options = {
            host: 'someHost',
            port: 'somePort'
          };

          connection = telDCache.init(options);
        });

        it('Should return with a successful connection message', function(done) {
          expect(connection)
            .to.eventually.have.property('connected')
            .and.equal(true);

          expect(connection).to.eventually.be.fulfilled.and.notify(done);
        });
      });
    });

    describe('And I unsuccessfully connect to the cache', function() {
      var errorObject = {
        'message': 'Loose butthole'
      };

      beforeEach(function() {

        sinon.stub(redis, 'createClient', function stubCreateClientError() {
          setTimeout(function() {
            emitter.emit('error', errorObject);
          }, 250);
          return stubEventHandler;
        });
      });

      afterEach(function() {
        redis.createClient.restore();
      });

      describe('When I initialize the cache', function () {

        var connection; 

        beforeEach(function() {
          var options = {
            host: 'someHost',
            port: 'somePort'
          };

          connection = telDCache.init(options);

        });

        it('Should return with a unsuccessful connection message', function(done) {
          expect(connection)
            .to.eventually.have.property('connected')
            .and.equal(false);

          expect(connection).to.eventually.be.rejected.and.notify(done);
        });

      });
    });

  });
});
