'use strict';
var options = require('./options');
var path = require('path');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

function buildDevelopment() {
  gulp.src(options.libFiles)
    .pipe(sourcemaps.init())
      .pipe(concat(options.developmentFileName))
    .pipe(sourcemaps.write(path.join(options.buildDir, options.mapDir)))
    .pipe(gulp.dest(options.buildDir));
}

function buildProduction() {
  gulp.src(options.libFiles)
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat(options.productionFileName))
    .pipe(sourcemaps.write(path.join(options.buildDir, options.mapDir)))
    .pipe(gulp.dest(options.buildDir));
}

gulp.task('build-development', buildDevelopment);
gulp.task('build-production', buildProduction);

gulp.task('build', ['lint', 'build-development', 'build-production']);
