'use strict';

var q = require('@telogical/telq');
var redis = require('redis');
var _ = require('lodash');

function TelDCache() {
  var _client;

  var _self = this;

  function connect(options) {

    function resolveSuccess() {
      _self._state.connected = true;

      // We can assume this, 'ready' is only emitted after conn/auth.
      _self._state.authorized = true;

      connectionDeferred.resolve(_self._state);
    }

    function resolveError(err) {
      _self._state.connected = false;
      _self._state.authorized = err.message.indexOf('NOAUTH') === -1;
      
      _self._state.error = err;
      connectionDeferred.reject(_self._state);
    }

    var connectionDeferred = q.defer();

    var redisOptions = {};

    if(options.password) {
      redisOptions.auth_pass = options.password;
    }

    _client = redis.createClient(options.port, options.host, redisOptions);
    _client.on('ready', resolveSuccess);
    _client.on('error', resolveError);

    return connectionDeferred.promise;
  }

  function disconnect() {
    var disconnectDfd = q.defer();

    function handleDisconnect() {
      _self._state.connected = false;
      delete _self._state.authorized;

      disconnectDfd.resolve(_self._state);
    }

    if(!_self._state.connected) {
      disconnectDfd.resolve(_self._state);
      return;
    }

    _client.on('end', handleDisconnect);

    try {
      _client.end();
    } catch(error) {
      disconnectDfd.reject(error);
    }

    return disconnectDfd.promise;
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
      
      if(_.isObject(value)) {
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

  this.connect = connect;
  this.disconnect = disconnect;
  this.insert = insert;
}

module.exports = TelDCache;
