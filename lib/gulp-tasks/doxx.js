/**
 *  @fileoverview Uses Gulpjs and Browser-Sync to create a server
 *
 *  @author  Scott Nath
 *
 *  @requires  NPM:gulp-doxx
 *  @requires  ./lib/get-options
 */
var gulpDoxx = require('gulp-doxx');
var path = require('path');
var getOptions = require('../get-options').getOptions;

/**
 * Function to get default options for an implementation of gulp-doxx
 *
 * @return {Object}  options  an object of default doxx options
 */
var getDefaultOptions = function () {
  'use strict';

  // default options for doxx gulp task
  var options = {

    config: {
      title: 'Project Title',
      urlPrefix: null,
      template: path.join(__dirname, '../templates/doxx.template.jade')
    },
    src: [
      '!./node_modules/**/*',
      './**/*.js'
    ],
    dest: './docs',
    dependencies: [] // gulp tasks which should be run before this task

  };

  return options;
};

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
 */
exports.gulpDoxx = function (gulp, projectOptions) {
  'use strict';
  var options = getOptions(getDefaultOptions(), projectOptions);

  gulp.task('doxx', options.dependencies, function () {

    return gulp.src(options.src)
      .pipe(gulpDoxx(options.config))
      .pipe(gulp.dest(options.dest));

  });

};
