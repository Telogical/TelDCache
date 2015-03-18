'use strict';

function StubRedisClient(emitter) {

  function on(eve, cb) {
    this._emitter.on(eve, cb);
  }

  function set(key, value, cb) {
    cb(null, 'OK');
  }

  function hset(key, object, cb) {
    cb(null, 0);
  }

  function end() {
    this._emitter.emit('end');
  }

  this._emitter = emitter;
  this.on = on;
  this.set = set;
  this.hset = hset;
  this.end = end;
}

module.exports = StubRedisClient;
