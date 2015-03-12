'use strict';

function StubRedisClient(emitter) {

  function on(eve, cb) {
    this._emitter.on(eve, cb);
  }

  function set(key, value) {
    if(typeof value === 'string') {
      return 'OK';
    }

    if(typeof value === 'object') {
      return 0;
    }
  }

  this._emitter = emitter;
  this.on = on;
  this.set = set;
}

module.exports = StubRedisClient;
