/**
 *  @fileOverview Uses Gulpjs to publish code to gh-pages
 *
 *  @author       Scott Nath
 *
 *  @requires  NPM:gulp-gh-pages
 *  @requires  ./lib/get-options
 */
var ghPages = require('gulp-gh-pages');
var getOptions = require('../get-options').getOptions;

/**
 * Function to get default options for an implementation of a gulp-gh-pages task
 *
 * @return {Object}  options  an object of default gulp-gh-pages options
 */
var getDefaultOptions = function () {
  'use strict';

  // default options for ghPages gulp task
  var options = {
    config: {},
    src: ['./patternlab/public/**'],
    taskName: 'ghPages',
    dependencies: [] // gulp tasks which should be run before this task

  };

  return options;
};

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
 */
exports.gulpGhPages = function (gulp, projectOptions) {
  'use strict';
  var options = getOptions(getDefaultOptions(), projectOptions);

  gulp.task(options.taskName, options.dependencies, function () {
    return gulp.src(options.src)
      .pipe(ghPages(options.config));
  });
};
