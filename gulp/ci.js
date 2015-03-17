'use strict';

var gulp = require('gulp');
var plato = require('gulp-plato');
var runSequence = require('run-sequence');

function complexity() {

  var jsHintArgs = {
    options: {
      strict: true
    }
  },
  complexityArgs = {
    trycatch: true
  },
  platoArgs = {
    jshint: jsHintArgs,
    complexity: complexityArgs
  };


  gulp.src(['src/**/*.js'])
    .pipe(plato('plato', platoArgs));
}

function ci(cb) {
  runSequence('build', 'test', 'complexity', cb);
}

gulp
  .task('complexity', complexity)
  .task('ci', ci);
