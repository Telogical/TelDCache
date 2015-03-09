'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var sinon = require('sinon');
var redis = require('redis');
var expect = chai.expect;
var _ = require('lodash');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter;

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

      it('Should have an init function', function() {
        var hasInit = _.has(telDCache, 'init');

        expect(hasInit).to.equal(true);
      });
    });

    describe('And I can successfully connect to the cache', function() {
      beforeEach(function() {
        function emitConnected() {
          emitter.emit('connect');
        }

        sinon.stub(redis, 'createClient', emitConnected);
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

        it('Should return with a successful connection message', function(done) {
          var expectedConnection = {
            connected: true
          };

          expect(connection).to.eventually.deep.equal(expectedConnection).and.notify(done);
        });
      });
    });
  });
});
