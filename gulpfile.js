var babel = require('babelify');
var browserify = require('browserify');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var forEach = require('gulp-foreach');
var jasmineBrowser = require('gulp-jasmine-browser');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var extend = require('lodash/object/extend');
var path = require('path');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

var outDir = './dist';
var srcFilesAll = ['src/**/*.js', 'spec/**/*.js'];

var rootSrcFile = './src/index.js';
var rootTestFile = './spec/tests.js';

var rootTestFileName = path.basename(rootTestFile);
var rootTestOutFile = path.join(outDir, rootTestFileName);

var rootSrcFiles = [rootSrcFile, rootTestFile];

var isDebug = !(gutil.env.type === 'ship');
var shipSuffix = '.min';

/**
 * Extracts the file name from the given path and appends given suffix.
 * @param  {string} filePath
 * @param  {string} suffix to apply to file name.
 * @return {string}      new path with suffix appended to file name.
 */
function appendSuffixToFileBase(filePath, suffix){
  var extName = path.extname(filePath);
  var fileName = path.basename(filePath, extName);

  return path.join(path.dirname(filePath), fileName + suffix + extName);
}

function getBundler(file, options) {
  options = extend(options || {}, {
    debug: isDebug
  });

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
    .pipe(isDebug ? sourcemaps.init({ loadMaps: true }) : gutil.noop())
    .pipe(isDebug ? sourcemaps.write('./') : gutil.noop())
    .pipe(!isDebug ? uglify() : gutil.noop())
    .pipe(!isDebug ? rename({ suffix: shipSuffix }) : gutil.noop())
    .pipe(gulp.dest(outDir));

};

gulp.task('bundle', function() {
  return gulp.src(rootSrcFiles)
  .pipe(forEach(function(stream, file) {
    var bundler = getBundler(file);

    return bundle(file, bundler);
  }));
});

gulp.task('autoBundle', function() {
  return gulp.src(rootSrcFiles)
  .pipe(forEach(function(stream, file) {
    var bundler = watchify(getBundler(file));

    function rebundle() {
      gutil.log('Updated', file.path);

      return bundle(file, bundler);
    }

    bundler.on("update", rebundle);
    bundler.on("log", gutil.log);

    return rebundle();
  }));
});

gulp.task('jasmine', function() {
  var testFileRoot = isDebug ?
                      rootTestOutFile :
                      appendSuffixToFileBase(rootTestOutFile, shipSuffix);
  var filesForTest = [testFileRoot];
  return gulp.src(filesForTest)
    .pipe(watch(filesForTest))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
});

gulp.task('autoLint', function() {
  return gulp.src(srcFilesAll)
  .pipe(watch(srcFilesAll))
  .pipe(forEach(function(stream, file) {
    gutil.log('Linting', file.path);
    return stream;
  }))
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failOnError());
});

gulp.task('watch', ['autoBundle', 'jasmine', 'autoLint']);

gulp.task('default', ['bundle']);
