/**
 *  @fileOverview Uses Gulpjs to clone a pattern
 *
 *  @author       Scott Nath
 *
 *  @requires  ./lib/utility
 *  @requires  ./lib/clone-pattern
 *  @requires  ./lib/get-options
 */
var utility = require('../utility');
var mergeOptions = require('../get-options').mergeOptions;
var minimist = require('minimist');

/**
 * Function to get default options for an implementation of a clone-pattern task
 *
 * @return {Object}  options  an object of default gulp-gh-pages options
 */
var getDefaultOptions = function () {
  'use strict';

  // default options for ghPages gulp task
  var options = {
    config: {},
    taskName: 'clone-pattern',
    dependencies: [] // gulp tasks which should be run before this task

  };

  return options;
};

var checkForClassArguments = function (args) {
  'use strict';

  if (!args.pattern) {
    console.log('To clone, you must include a pattern flag. example: "--pattern /path/to/pattern/directory"');
    return false;
  }

  if (typeof args.pattern !== 'string') {
    console.log('The path to the pattern-to-clone must be a string.');
    return false;
  }

  return args;

};

/**
 * Gulp task that clones a pattern-library pattern
 *
 * @example
 * // include in gulpfile.js
 * require('pattern-library-utilities').gulpClonePattern(require('gulp'),cloneOptions);
 *
 * @param {Object}  gulp  including file should inject the gulp module
 * @param {Object}  projectOptions  object of options
 *
 */
exports.gulpClonePattern = function (gulp, projectOptions) {
  'use strict';

  var options = mergeOptions(getDefaultOptions(), projectOptions);

  gulp.task(options.taskName, options.dependencies, function () {

    var args = checkForClassArguments(minimist(process.argv.slice(2)));

    if (!args) {
      console.log('Exiting without cloning.');
      return;
    }

    var patternDataFile = utility.testIfSinglePattern(args.pattern);

    if (!patternDataFile) {
      console.log('No patternDataFile, exiting without cloning.');
      return;
    }

    return gulp.src(patternDataFile)
    .pipe(utility.patternCloner(options.config));

  });

};

