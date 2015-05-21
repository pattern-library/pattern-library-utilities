/**
 *  @fileOverview Uses Gulpjs and Browser-Sync to create a server
 *
 *  @author       Scott Nath
 *
 *  @requires     NPM:browser-sync
 *  @requires     ./lib/get-options
 */
'use strict';

var browsersync = require('browser-sync'),
  getOptions = require('../get-options').getOptions;

/**
 * Function to get default options for an implementation of browser-sync
 * @function
 * @name getDefaultOptions
 *
 * @returns {Object}  options  an object of default browser-sync options
 */
function getDefaultOptions () {

  /* default options for pattern-importer */
  var options = {

    environment: {
      config: {
        server: {
          baseDir: './app'
        },
        host: 'localhost',
        port: 8001,
        debugInfo: false,
        open: true
      }
    },
    showConsoleLog: true,
    dependencies: [] // gulp tasks which should be run before this task

  };

  return options;
}

/**
 * Gulp task to create a server using browser-sync
 * @function
 * @name gulpBrowserSync
 *
 * @param {Object} gulp including file should in inject the gulp module
 * @param {Object} projectOptions  object of options
 *
 * @requires NPM:browser-sync
 */
exports.gulpBrowserSync = function (gulp, projectOptions) {

  var options = getOptions(getDefaultOptions(),projectOptions);

  /* the gulp task */
  gulp.task('browsersync', options.dependencies, function() {

    browsersync.init(null, options.environment.config, function (err, bs) {

    });

  });

}

exports.getBrowsersyncDefaultOptions = getDefaultOptions;
