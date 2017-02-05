'use strict';

const gulp   = require('gulp');
const jshint = require('gulp-jshint');
const nodemon = require('gulp-nodemon');
const plato = require('plato');
const jsdoc = require('gulp-jsdoc3');

gulp.task('lint', function() {
  return gulp.src('./server/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('start', [ 'lint' ], function () {
  nodemon({
    script: 'server',
    ext: 'js',
    env: { HOME_DISPATCHER_NODE_ENV: 'local' },
    tasks: ['lint']
  })
    .on('restart', function () {
      console.log('server restarted!');
    });
});


gulp.task('plato', function () {
  let files = [
    './server/api/**/*.js'
  ];
  let outputDir = './plato-reports';
  let options = {
    title: 'Denizen aggregator report'
  };

  let callback = function (report){
    console.log('Plato report finished');
  };
  plato.inspect(files, outputDir, options, callback);
});

gulp.task('techdoc', function (cb) {
  gulp.src(['README.md', './server/**/*.js'], {read: false})
    .pipe(jsdoc(cb));
});


gulp.task('default', ['start']);
