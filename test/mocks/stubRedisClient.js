'use strict';

function StubRedisClient(emitter) {

  var _self = this;

  function on(eve, cb) {
    _self._emitter.on(eve, cb);
  }

  function set(key, value, cb) {
    cb(null, 'OK');
  }

  function get(key, cb) {
    cb(null, null);
  }

  function hset(key, value, cb) {
    cb(null, 0);
  }

  function hmset(key, object, cb) {
    cb(null, 0);
  }

  function hgetall(key, cb) {
    cb(null, null);
  }

  function end() {
    _self._emitter.emit('end');
  }

  this._emitter = emitter;
  this.on = on;
  this.get = get;
  this.set = set;
  this.hset = hset;
  this.hmset = hmset;
  this.hgetall = hgetall;
  this.end = end;
}

module.exports = StubRedisClient;
