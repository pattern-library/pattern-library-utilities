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
 * @return {Object}  options  an object of default clone options
 */
var getDefaultOptions = function () {
  'use strict';

  // default options for clone-pattern gulp task
  var options = {
    config: {}, // empty, but a placeholder for later
    taskName: 'clone-pattern',
    dependencies: [] // gulp tasks which should be run before this task

  };

  return options;
};

var checkForClassArguments = function (args) {
  'use strict';

  if (!args.pattern) {
    utility.log('To clone, you must include a pattern flag. example: "--pattern /path/to/pattern/directory"');
    return false;
  }

  if (typeof args.pattern !== 'string') {
    utility.log('The path to the pattern-to-clone must be a string.');
    return false;
  }

  if (args.overwrite && ((typeof args.overwrite !== 'string') || (args.overwrite !=='YES'))) {
    utility.log('You must type YES in all caps to overwrite your local pattern');
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
 * // on the command line
 * `$ gulp clone-pattern --pattern node_modules/pattern-library/patterns/molecules/images/logo
 *
 * @param {Object}  gulp  including file should inject the gulp module
 * @param {Object}  projectOptions  object of options
 *
 */
exports.gulpClonePattern = function (gulp, projectOptions) {
  'use strict';

  var projectOptions = mergeOptions(getDefaultOptions(), projectOptions);

  var options = utility.getProjectOptions();

  var options = mergeOptions(options, projectOptions);

  gulp.task(options.taskName, options.dependencies, function () {

    var args = checkForClassArguments(minimist(process.argv.slice(2)));

    if (!args) {
      console.log('Exiting without cloning.');
      return;
    }

    // single pattern cloning
    if (args.pattern) {
      var patternDataFile = utility.testIfSinglePattern(args.pattern, options);

      if (!patternDataFile) {
        utility.log('The pattern you want to clone does not exist. Exiting without cloning.');
        return;
      }
    }

    // overwrite option
    if (args.overwrite) {
      options.config = {
        overwrite: true
      }
    }


    return gulp.src(patternDataFile)
    .pipe(utility.patternCloner(options));

  });

};

