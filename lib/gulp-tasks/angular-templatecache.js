/**
 *  @fileoverview Uses Gulpjs and angular-templatecache to convert html to javascript templates
 *
 *  @author  Scott Nath
 *
 *  @requires  NPM:angular-templatecache
 *  @requires  ./lib/get-options
 */
var angularTemplatecache = require('gulp-angular-templatecache');
var getOptions = require('../get-options').getOptions;

/**
 * Function to get default options for an implementation of gulp-angular-templatecache
 *
 * @return {Object}  options  an object of default angular-templatecache options
 */
var getDefaultOptions = function () {
  'use strict';

  // default options for angularTemplatecache gulp task
  var options = {
    config: {
      module: 'templatescache',
      standalone: true
    },
    src: ['./bower_components/pattern-library/patterns/**/*.html'],
    dest: './scripts',
    dependencies: [] // gulp tasks which should be run before this task

  };

  return options;
};

/**
 * Gulp task that uses gulp-angular-templatecache to create $templateCache.put javascript templates from app html files
 *
 * @example
 * // include in gulpfile.js
 * require('pattern-library-utilities').gulpAngularTemplatecache(require('gulp'),atcOptions);
 *
 * @param {Object}  gulp  including file should inject the gulp module
 * @param {Object}  projectOptions  object of options
 *
 */
exports.gulpAngularTemplatecache = function (gulp, projectOptions) {
  'use strict';
  var options = getOptions(getDefaultOptions(), projectOptions);

  gulp.task('angularTemplatecache', options.dependencies, function () {

    return gulp.src(options.src)
      .pipe(angularTemplatecache(options.config))
      .pipe(gulp.dest(options.dest));
  });
};
