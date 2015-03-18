'use strict';
var options = require('./options');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

function runJsHint() {
  gulp.src(options.libFiles)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
}

gulp.task('lint', runJsHint);
