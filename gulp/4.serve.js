'use strict';

let gulp = require('gulp');
let reload = global.browserSync.reload;

gulp.task('browsersync', () => {
  global.browserSync.init({
    server: [global.paths.src],
    ghostMode: true
  });

  gulp.watch([global.paths.html, global.paths.js]).on('change', reload);
  gulp.watch(global.paths.scss, gulp.series('css'));
  gulp.watch([global.paths.js], gulp.series('compile'));
});

gulp.task('serve', gulp.series('compile', 'css', 'browsersync'));


