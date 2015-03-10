'use strict';

var q = require('@telogical/telq');
var redis = require('redis');

function TelDCache() {
  var _client;
  var _state = {
    'connected': false
  };

  function init(options) {

    function resolveSuccess() {
      _state.connected = true;
      connectionDeferred.resolve(_state);
    }

    function resolveError(err) {
      _state.connected = false;
      _state.error = err;
      connectionDeferred.reject(_state);
    }

    var connectionDeferred = q.defer();

    _client = redis.createClient(options.port, options.host);
    _client.on('ready', resolveSuccess);
    _client.on('error', resolveError);

    return connectionDeferred.promise;
  }

  function insert(/*key, value, options*/) {
    return;
  }

  this.init = init;
  this.insert = insert;
}

module.exports = TelDCache;
