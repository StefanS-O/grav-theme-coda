var config = require('./config');
var gulp = require('gulp');
var changed = require('gulp-changed');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;


var onError = function(err) {
  notify.onError({
    title:    "<%= error.fileName %>",
    subtitle: "<%= error.lineNumber %>",
    message: "<%= error.message %>"
  })(err);

  this.emit('end');
};

gulp.task('scss', function () {
  gulp.src([config.sass.src + '*.scss'])
    .pipe(changed(config.sass.dest))
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [config.sass.dest].concat()
    }))
    .pipe(autoprefixer({
      browsers: [
        'Chrome >= 35',
        'Firefox >= 38',
        'Edge >= 12',
        'Explorer >= 9',
        'iOS >= 8',
        'Safari >= 8',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12'
      ]
    }))
    // .pipe(concat('styles.css'))
    // .pipe(cleanCSS())
    //.pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.sass.dest))
    .pipe(browserSync.stream());
});

gulp.task('browser-sync', function() {
  browserSync(config.server.development);
});

gulp.task('template', function () {
  browserSync.reload();
});

gulp.task('default', ['scss', 'browser-sync'], function () {
    gulp.watch(config.sass.src + '**/*.scss', ['scss']);
    gulp.watch(config.twig.path + '**/*.twig', ['template']);
    gulp.on('err', function(err){
      console.log(err);
    });
});
