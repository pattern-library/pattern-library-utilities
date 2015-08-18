/**
 *  @fileOverview Uses Gulpjs to publish code to gh-pages
 *
 *  @author       Scott Nath
 *
 *  @requires  NPM:gulp-gh-pages
 *  @requires  ./lib/get-options
 */
'use strict';
var gulp = require('gulp'),
  ghPages = require('gulp-gh-pages'),
  getOptions = require('../get-options').getOptions;

/**
 * Function to get default options for an implementation of a gulp-gh-pages task
 *
 * @returns {Object}  options  an object of default gulp-gh-pages options
 */
function getDefaultOptions () {

  /* default options for ghPages gulp task */
  var options = {
  	config: {},
    src: ['./patternlab/public/**'],
    taskName: 'ghPages',
    dependencies: [] // gulp tasks which should be run before this task

  };

  return options;
}

/**
 * Gulp task that sends files to the gh-pages branch on github.com
 *
 * @example
 * // include in gulpfile.js
 * require('pattern-library-utilities').gulpGhPages(require('gulp'),ghPagesOptions);
 *
 * @param {Object}  gulp  including file should inject the gulp module
 * @param {Object}  projectOptions  object of options
 *
 * @requires NPM:gulp-gh-pages
 */
exports.gulpGhPages = function (gulp, projectOptions) {

  var options = getOptions(getDefaultOptions(),projectOptions);
	
	gulp.task(options.taskName, options.dependencies, function () {
    return gulp.src(options.src)
      .pipe(ghPages(options.config));
	});
}
