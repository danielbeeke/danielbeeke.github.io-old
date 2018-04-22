'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var inline = require('gulp-inline');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');

gulp.task('clean', () => {
  return gulp.src('dist', {read: false, allowEmpty: true})
  .pipe(clean());
});


gulp.task('copy', () => {
  return gulp.src(['src/**/*', '!src/jspm/**', '!src/jspm_packages/**', '!src/scss/**', '!src/index.html'])
  .pipe(gulp.dest('dist/'));
});


gulp.task('inline', () => {
  return gulp.src(['src/index.html'])
  .pipe(inline({
      base: 'src/',
      js: uglify,
      css: [minifyCss, autoprefixer({ browsers:['last 2 versions'] })],
      disabledTypes: ['svg', 'img', 'js'], // Only inline css files
      ignore: ['css/styles.css']
    }))
  .pipe(gulp.dest('dist/'));
});


gulp.task('build', gulp.series('clean', 'compile', 'css', 'inline', 'copy'));
