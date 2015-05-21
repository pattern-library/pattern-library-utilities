/**
 *  @fileOverview Uses Gulpjs and gulp-inject to glob files
 *
 *  @author       Scott Nath
 *
 *  @requires     NPM:gulp-inject
 *  @requires     ./lib/get-options
 */
'use strict';

var inject = require('gulp-inject'),
  path = require('path'),
  getOptions = require('../get-options').getOptions;

/**
 * Gulp stream functionality which performs globbing/injecting pipeline
 *
 * @returns gulp-inject task pipeline
 */
function globInjectTask (gulp, options) {

  var sources = gulp.src(options.files);

  return gulp.src(options.src)
    .pipe(inject(sources, options.config))
    .pipe(gulp.dest(options.dest));
}

/**
 * Function to get default options for an implementation of gulp-inject
 *
 * @returns {Object}  options  an object of options
 */
function getDefaultOptions () {

  var options = {
    config: {
      relative: true
    },
    src: './app/index.html',
    files: [
      '!./app/bower_components/**/*',
      '!./app/_gulp/*',
      './app/**/*'

    ],
    dest: './app',
    dependencies: []
  }

  return options;
}

/**
 * General gulp task to glob files
 *
 * @example
 * // include in gulpfile.js
 * require('pattern-library-utilities').gulpFileGlobInject(require('gulp'),globbingOptions);
 *
 * @param {Object} gulp including file should in inject the gulp module
 * @param {Object} projectOptions  object of options
 *
 * @requires NPM:gulp-inject
 */
exports.gulpFileGlobInject = function (gulp, projectOptions) {

  var options = getOptions(getDefaultOptions(),projectOptions);

  gulp.task('file-glob-inject', options.dependencies, function() {
    globInjectTask(gulp, options);
  });
}


/**
 * Function to get default options for globbing scss files with gulp-inject
 *
 * @returns {Object}  options  an object of default options
 */
function getDefaultScssOptions () {

  var options = {
    config: {
      starttag: '// inject:{{ext}}',
      endtag: '// endinject',
      addRootSlash: false,
      relative: true,
      transform: function (filepath) {
        return '@import \'' + filepath + '\';';
      }
    },
    src: './app/styles/styles.scss',
    files: [ // Application scss files
      '!./app/bower_components/**/*',
      '!./app/styles/styles.scss',
      './app/**/*.scss'
    ],
    dest: './app/styles',
    dependencies: []
  }

  return options;
}

/**
 * Gulp task to glob scss files and write css imports
 *
 * @example
 * // include in gulpfile.js
 * require('pattern-library-utilities').gulpScssGlobInject(require('gulp'),scssGlobbingOptions);
 *
 * @param {Object} gulp including file should in inject the gulp module
 * @param {Object} projectOptions  object of options
 *
 * @requires NPM:gulp-inject
 */
exports.gulpScssGlobInject = function (gulp, projectOptions) {

  var options = getOptions(getDefaultScssOptions(),projectOptions);

  gulp.task('scss-glob-inject', options.dependencies, function() {
    globInjectTask(gulp, options);
  });

}
