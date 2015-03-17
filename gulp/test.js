'use strict'; 

var options = require('./options');
var gulp = require('gulp');
var mocha = require('gulp-mocha'); 

function runUnitTests() {
  gulp.src(options.testFiles)
    .pipe(mocha({
      'reporter': 'nyan'
    }));
}

gulp.task('test', runUnitTests);

