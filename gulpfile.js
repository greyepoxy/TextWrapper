var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watch = require('gulp-watch');
var watchify = require('watchify');
var babel = require('babelify');
var jasmineBrowser = require('gulp-jasmine-browser');

function compileFiles(watch, files) {
  var tasks = files.map(function(file) {
    return compileFile(watch, file);
  });
  //return es.merge.apply(null, tasks);
};

function compileFile(watch, inFile) {
  var bundler = browserify(inFile, { debug: true }).transform(babel);

  if (watch) {
    bundler = watchify(bundler);
  }

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source(inFile))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
};

function watch(files) {
  return compileFiles(true, files);
};

gulp.task('build', function() { return compileFiles(false, ['./src/index.js', './spec/TestSpec.js']); });
gulp.task('watch', function() { return watch(['./src/index.js', './spec/TestSpec.js']); });

gulp.task('jasmine', function() {
  var filesForTest = ['build/src/index.js', 'build/spec/TestSpec.js'];
  return gulp.src(filesForTest)
    .pipe(watch(filesForTest))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
});

gulp.task('default', ['watch', 'build', 'jasmine']);
