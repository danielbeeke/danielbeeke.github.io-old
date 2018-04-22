'use strict';

var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('compile', function (done) {
  exec('jspm build danielbeeke/app src/javascript/build.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done();
  });
});
