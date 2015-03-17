'use strict'; 

var options = require('./options');
var gulp = require('gulp');
var mocha = require('gulp-mocha'); 

function handleError(error) {
  throw new Error("Unit tests has failed! pls2befixingkthx");
}

function runUnitTests() {
  gulp.src(options.testFiles)
    .pipe(mocha({
      'reporter': 'nyan'
    }))
    .on('error', handleError);
}

gulp.task('test', runUnitTests);

