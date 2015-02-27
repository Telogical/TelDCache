'use strict'; 

var options = require('./options');
var gulp = require('gulp');
var mocha = require('gulp-mocha'); 

function handleError(error) {
  // "Pepsi bottle; Coca-Cola gloss [sic: glass] - I don't give a _damn_."
  console.log('There was an error', error);
}

function runUnitTests() {
  gulp.src(options.testFiles)
    .pipe(mocha({
      'reporter': 'nyan'
    }))
    .on('error', handleError);
}

gulp.task('test', runUnitTests);

