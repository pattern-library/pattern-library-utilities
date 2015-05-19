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
 * Function to get default options for an implementation of gulp-inject
 * @function
 * @name getDefaultOptions
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
    dest: './app'
  }

  return options;
}

/**
 * General gulp task to glob files
 * @function
 * @name gulpFileGlobbing
 *
 * @example
 * // include in gulpfile.js
 * require('pattern-library-utilities').gulpFileGlobbing(require('gulp'),globbingOptions);
 *
 * @param {Object} gulp including file should in inject the gulp module
 * @param {Object} projectOptions  object of options
 * 
 * @requires NPM:gulp-inject
 */
exports.gulpFileGlobbing = function (gulp, projectOptions) {

  var options = getOptions(getDefaultOptions(),projectOptions);

	gulp.task('file-globbing', function () {

		var sources = gulp.src(options.files);

		return gulp.src(options.src)
			.pipe(inject(sources, options.config))
			.pipe(gulp.dest(options.dest));
	});
}


/**
 * Function to get default options for globbing scss files with gulp-inject
 * @function
 * @name getDefaultScssOptions
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
    dest: './app/styles'
  }

  return options;
}

/**
 * Gulp task to glob scss files and write css imports
 * @function
 * @name gulpScssGlobbing
 *
 * @example
 * // include in gulpfile.js
 * require('pattern-library-utilities').gulpScssGlobbing(require('gulp'),scssGlobbingOptions);
 * 
 * @param {Object} gulp including file should in inject the gulp module
 * @param {Object} projectOptions  object of options
 * 
 * @requires NPM:gulp-inject
 */
exports.gulpScssGlobbing = function (gulp, projectOptions) {

  var options = getOptions(getDefaultScssOptions(),projectOptions);

	gulp.task('scss-globbing', function () {

		var sources = gulp.src(options.files);

		return gulp.src(options.src)
			.pipe(inject(sources, options.config))
			.pipe(gulp.dest(options.dest));
	});

}
