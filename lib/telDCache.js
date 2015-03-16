'use strict';

var q = require('@telogical/telq');
var redis = require('redis');

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

  function insert(key, value, options) {
    var insertDfd = q.defer();

    if(!_self._state.connected) {
      var connectionError = new Error('Cache is not connected');
      insertDfd.reject(connectionError);
    } else {
      insertDfd.resolve('random string');
    }

    console.log('this promise i\'m sending out got back is', insertDfd.promise);
    return insertDfd.promise;
  }

  this._state = {
    'connected': false
  };

  this.init = init;
  this.insert = insert;
}

module.exports = TelDCache;
