// Load plugins
var gulp          = require('gulp'),
    beep          = require('beepbeep'),
    gutil         = require('gulp-util'),
    compass       = require('gulp-compass'),
    autoprefixer  = require('gulp-autoprefixer'),
    imagemin      = require('gulp-imagemin'),
    plumber       = require('gulp-plumber'),
    cache         = require('gulp-cache'),
    cmq           = require('gulp-combine-media-queries'),
    notify        = require('gulp-notify'),
    rename        = require('gulp-rename'),
    uglify        = require('gulp-uglify'),
    minifyCSS     = require('gulp-minify-css'),
    concat        = require('gulp-concat');


var onError = function (err) {
  beep([0, 0, 0]);
  gutil.log(gutil.colors.green(err));
};

// Run compass to watch
gulp.task('styles', function() {
  gulp.src('app/assets/stylesheets/screen.scss')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(compass({
      config_file: 'config.rb',
      css: 'public/stylesheets',
      sass: 'app/assets/stylesheets'
    }))
    .pipe(autoprefixer('last 2 versions', '> 1%', 'Explorer >= 9'))
    .pipe(cmq())
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/stylesheets'));
});


// Optimize images
gulp.task('images', function() {
  return gulp.src('public/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/images'));
});

gulp.task('scripts', function() {
  return gulp.src('app/assets/javascripts/**/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/javascripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Watch
gulp.task('watch', function () {
  gulp.watch("app/assets/stylesheets/**/*.scss", ['styles']);
  gulp.watch('app/assets/javascripts/**/*.js', ['scripts']);
});
