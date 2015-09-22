/**
 *  @fileoverview Uses Gulpjs and Browser-Sync to create a server
 *
 *  @author       Scott Nath
 *
 *  @requires     NPM:browser-sync
 *  @requires     ./lib/get-options
 */
var browsersync = require('browser-sync');
var mergeOptions = require('../get-options').mergeOptions;

/**
 * Function to get default options for an implementation of browser-sync
 *
 * @return {Object}  options  an object of default browser-sync options
 */
var getDefaultOptions = function () {
  'use strict';

  // default options for pattern-importer
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
};

/**
 * Gulp task to create a server using browser-sync
 *
 * @param {Object} gulp including file should in inject the gulp module
 * @param {Object} projectOptions  object of options
 *
 */
exports.gulpBrowserSync = function (gulp, projectOptions) {
  'use strict';
  var options = mergeOptions(getDefaultOptions(), projectOptions);

  /* the gulp task */
  gulp.task('browsersync', options.dependencies, function () {

    browsersync.init(null, options.environment.config, function (err, bs) {

    });

  });

};

exports.getBrowsersyncDefaultOptions = getDefaultOptions;
