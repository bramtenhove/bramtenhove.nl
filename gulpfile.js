'use strict';

// ===================================================
// Load Gulp plugins
// ===================================================

var importOnce  = require('node-sass-import-once'),
  path          = require('path'),
  notify        = require("gulp-notify"),
  gulp          = require('gulp'),
  $             = require('gulp-load-plugins')(),
  del           = require('del'),
  // gulp-load-plugins will report "undefined" error unless you load gulp-sass manually.
  sass          = require('gulp-sass'),
  postcss       = require('gulp-postcss'),
  autoprefixer  = require('autoprefixer'),
  mqpacker      = require('css-mqpacker'),
  runSequence   = require('run-sequence');

var options = {
  root       : __dirname,
  source     : __dirname + '/source/',
  build      : __dirname + '/assets/',
  css        : __dirname + '/assets/css/',
  js         : __dirname + '/assets/js/'
};

// Define the node-sass configuration. The includePaths is critical!
options.scss = {
  importer: importOnce,
  includePaths: [
    options.source
  ],
  outputStyle: 'compressed'
};

var sassFiles = [
  options.source + 'styles/**/*.scss',
  // Do not open Sass partials as they will be included as needed.
  '!' + options.source + 'styles/**/_*.scss'
];

var sassProcessors = [
  autoprefixer({browsers: ['> 1%', 'last 2 versions']}),
  mqpacker({sort: true})
];

var onError = function(err) {
  notify.onError({
    title:    "Gulp error in " + err.plugin,
    message:  "<%= error.message %>",
    sound: "Beep"
  })(err);
  this.emit('end');
};

// #################
//
// Compile the Sass
//
// #################
//
// This task will look for all scss files and run postcss and rucksack.
// For performance review we will display the file sizes
// Then the files will be stored in the assets folder
// At the end we check if we should inject new styles in the browser
// ===================================================

gulp.task('styles', ['clean:css', 'copy-css-framework'], function () {
  return gulp.src(sassFiles)
    .pipe($.sass(options.scss).on('error', sass.logError))
    .pipe($.plumber({ errorHandler: onError }) )
    .pipe($.postcss(sassProcessors) )
    .pipe($.rucksack() )
    .pipe($.rename({dirname: ''}))
    .pipe($.size({showFiles: true}))
    .pipe(gulp.dest(options.css))
});

gulp.task('copy-css-framework', function () {
  gulp.src('node_modules/milligram/dist/milligram.min.css')
    .pipe(gulp.dest('assets/css/vendor/milligram/'));

  gulp.src('node_modules/normalize.css/normalize.css')
    .pipe(gulp.dest('assets/css/vendor/normalize.css/'));
});

// #################
//
// Minify JS
//
// #################
//
// First clean the JS folder, then search all components for js files.
// Also search in the libraries folder for specific files.
// Then compress the files, give them an explicit .min filename and
// save them to the assets folder.
// ===================================================

gulp.task('minify-js', ['clean:js', 'copy-js-libraries'], function () {
  return gulp.src([
      options.source + 'js/*.js'
    ]
  )
    .pipe($.uglify())
    .pipe($.flatten())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(options.js));
});

gulp.task('copy-js-libraries', function () {
  gulp.src('node_modules/velocity-animate/velocity.min.js')
    .pipe(gulp.dest('assets/js/vendor/velocity/'));
});

// ######################
//
// Clean all directories.
//
// ######################

// Clean CSS files.
gulp.task('clean:css', function () {
  return del([
    options.css + '**/*.css',
    options.css + '**/*.map'
  ], {force: true});
});

// Clean JS files.
gulp.task('clean:js', function () {
  return del([
    options.js + '**/*.js'
  ], {force: true});
});

// ######################
//
// Default task (no watching)
//
// ######################
// ===================================================

gulp.task('default', function(done) {
  runSequence(['styles', 'minify-js'], done);
});