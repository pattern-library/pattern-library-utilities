/**
 *  @fileoverview Uses Gulpjs and gulp-inject to glob files
 *
 *  @author       Scott Nath
 *
 *  @requires     NPM:gulp-inject
 *  @requires     ./lib/get-options
 */

var inject = require('gulp-inject');
var getOptions = require('../get-options').getOptions;

/**
 * Gulp stream functionality which performs globbing/injecting pipeline
 *
 * @return {Object} true if gulp stream is complete
 *
 * @param {Object}  gulp  including file should inject the gulp module
 * @param {Object}  options  object of options
 */
function globInjectTask(gulp, options) {
  'use strict';
  var sources = gulp.src(options.files);

  return gulp.src(options.src)
    .pipe(inject(sources, options.config))
    .pipe(gulp.dest(options.dest));
}

/**
 * Function to get default options for an implementation of gulp-inject
 *
 * @return {Object}  options  an object of options
 */
var getDefaultOptions = function () {
  'use strict';
  var options = {
    config: {
      relative: true
    },
    src: './index.html', // source file with types of files to be glob-injected
    files: [// relative paths to files to be globbed
      '!./node_modules/**/*',
      '!./_gulp/*',
      './**/*'

    ],
    dest: './', // destination directory where we'll write our ammended source file
    taskName: 'file-glob-inject', // default task name
    dependencies: [] // gulp tasks which should be run before this task
  };

  return options;
};

/**
 * General gulp task to glob files
 *
 * @example
 * // include in gulpfile.js
 * require('pattern-library-utilities').gulpFileGlobInject(require('gulp'),globbingOptions);
 *
 * @param {Object} gulp including file should in inject the gulp module
 * @param {Object} projectOptions  object of options
 */
exports.gulpFileGlobInject = function (gulp, projectOptions) {
  'use strict';
  var options = getOptions(getDefaultOptions(), projectOptions);

  gulp.task(options.taskName, options.dependencies, function () {
    return globInjectTask(gulp, options);
  });
};


/**
 * Function to get default options for globbing scss files with gulp-inject
 *
 * @return {Object}  options  an object of default options
 */
var getDefaultScssOptions = function () {
  'use strict';
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
    src: './styles/style.scss',
    files: [// Application scss files
      '!./node_modules/**/*',
      '!./styles/style.scss',
      './**/*.scss'
    ],
    dest: './styles',
    taskName: 'scss-glob-inject', // default task name
    dependencies: []
  };

  return options;
};

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
 */
exports.gulpScssGlobInject = function (gulp, projectOptions) {
  'use strict';
  var options = getOptions(getDefaultScssOptions(), projectOptions);

  gulp.task(options.taskName, options.dependencies, function () {
    return globInjectTask(gulp, options);
  });

};
