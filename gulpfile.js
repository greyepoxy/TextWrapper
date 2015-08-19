var babel = require('babelify');
var browserify = require('browserify');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var forEach = require('gulp-foreach');
var jasmineBrowser = require('gulp-jasmine-browser');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps')
var watch = require('gulp-watch');
var extend = require('lodash/object/extend');
var path = require('path');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');

var srcFiles = ['src/**/*.js', 'spec/**/*.js'];
var rootSrc = ['./src/index.js', './spec/tests.js'];

function getBundler(file, options) {
  options = options || {};

  //Can extend options with defaults if needed
  //options = extend(options || {}, {
  // default options go here
  //});

  var bundler = browserify(file.path, options);
  bundler.transform(babel);

  return bundler;
};

function bundle(file, bundler) {
  var fileName = path.basename(file.path);

  return bundler
    .on("error", gutil.log.bind(gutil, "Browserify Error"))
    .bundle()
    .pipe(source(fileName))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));

};

gulp.task('bundle', function() {
  return gulp.src(rootSrc)
  .pipe(forEach(function(stream, file) {
    var bundler = getBundler(file, {
      debug: true
    });

    return bundle(file, bundler);
  }));
});

gulp.task('autoBundle', function() {
  return gulp.src(rootSrc)
  .pipe(forEach(function(stream, file) {
    var bundler = watchify(getBundler(file, {
      debug: true
    }));

    function rebundle() {
      gutil.log('Updated', gutil.colors.magenta(file.path));

      return bundle(file, bundler);
    }

    bundler.on("update", rebundle);
    bundler.on("log", gutil.log);

    return rebundle();
  }));
});

gulp.task('jasmine', function() {
  var filesForTest = ['dist/index.js', 'dist/tests.js'];
  return gulp.src(filesForTest)
    .pipe(watch(filesForTest))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
});

gulp.task('autoLint', function() {
  return gulp.src(srcFiles)
  .pipe(watch(srcFiles))
  .pipe(forEach(function(stream, file) {
    gutil.log('Linting', gutil.colors.magenta(file.path));
    return stream;
  }))
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failOnError());
});

gulp.task('watch', ['autoBundle', 'jasmine', 'autoLint']);

gulp.task('default', ['bundle']);
