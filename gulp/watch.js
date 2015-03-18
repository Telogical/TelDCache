'use strict';

var options = require('./options');
var gulp = require('gulp');

function watchJavascript() {
  gulp.watch([options.testFiles, options.libFiles], ['lint', 'test']);
}

gulp.task('watch', watchJavascript);
