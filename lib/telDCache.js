'use strict';

var q = require('@telogical/telq');
var redis = require('redis');

function TelDCache() {
  var _client;

  function init(options) {
    function resolveSuccess() {
      console.log('EMITTED SUCCESS');
    }

    var connectionDeffered = q.defer();

    _client.on('connect', resolveSuccess);

    return connectionDeffered.promise;
  }
  function insert(key, value, options) {
    return;
  }

  this.init = init;
  this.insert = insert;
}

module.exports = TelDCache;
