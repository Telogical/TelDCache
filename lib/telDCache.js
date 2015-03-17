'use strict';

var q = require('@telogical/telq');
var redis = require('redis');
var _ = require('lodash');

function TelDCache() {
  var _client;

  var _self = this;

  function init(options) {
    function resolveSuccess() {
      _self._state.connected = true;
      connectionDeferred.resolve(_self._state);
    }

    function resolveError(err) {
      _self._state.connected = false;
      _self._state.error = err;
      connectionDeferred.reject(_self._state);
    }

    var connectionDeferred = q.defer();

    _client = redis.createClient(options.port, options.host);
    _client.on('ready', resolveSuccess);
    _client.on('error', resolveError);

    return connectionDeferred.promise;
  }

  function insert(key, value) {
    var insertDfd = q.defer();

    function hashInsertCB(err) {
      if(err) {
        insertDfd.reject(err);
        return;
      }

      insertDfd.resolve(_.keys(value));
    }

    function singleInsertCB(err) {
      if(err) {
        insertDfd.reject(err);
        return;
      }

      insertDfd.resolve(key);
    }

    if(!_self._state.connected) {
      var connectionError = new Error('Cache is not connected');
      insertDfd.reject(connectionError);
    } else {
      
      if(typeof value === 'object') {
        _client.hset(key, value, hashInsertCB);
      } else {
        _client.set(key, value, singleInsertCB);
      }

    }

    return insertDfd.promise;
  }

  this._state = {
    'connected': false
  };

  this.init = init;
  this.insert = insert;
}

module.exports = TelDCache;
