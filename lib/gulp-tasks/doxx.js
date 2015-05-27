/**
 *  @fileoverview Uses Gulpjs and Browser-Sync to create a server
 *
 *  @author  Scott Nath
 *
 *  @requires  NPM:gulp-doxx
 *  @requires  ./lib/get-options
 */
'use strict';
var gulp = require('gulp'),
  gulpDoxx = require('gulp-doxx'),
  path = require('path'),
  getOptions = require('../get-options').getOptions;

/**
 * Function to get default options for an implementation of gulp-doxx
 *
 * @returns {Object}  options  an object of default doxx options
 */
function getDefaultOptions () {

  /* default options for doxx gulp task */
  var options = {

    config: {
      title: 'Project Title',
      urlPrefix: null,
      template: path.join(__dirname, '../templates/doxx.template.jade')
    },
    src: ['!./node_modules/**/*','./**/*.js'],
    dest: './docs',
    dependencies: [] // gulp tasks which should be run before this task

  };

  return options;
}

/**
 * Gulp task to create javascript documentation using doxx
 *
 * @example
 * // include in gulpfile.js
 * require('pattern-library-utilities').gulpDoxx(require('gulp'),doxxOptions);
 *
 * @param {Object}  gulp  including file should inject the gulp module
 * @param {Object}  projectOptions  object of options
 *
 * @requires NPM:gulp-inject
 */
exports.gulpDoxx = function (gulp, projectOptions) {

  var options = getOptions(getDefaultOptions(),projectOptions);

  gulp.task('doxx', options.dependencies, function() {

    return gulp.src(options.src)
      .pipe(gulpDoxx(options.config))
      .pipe(gulp.dest(options.dest));

  });

}
