/**
 * @file Abstracted logging properties and methods.
 *
 * If for any reason, they need a different logging tool or need to be extended,
 * the changes can be made here.
 */
var getOptions = require('./get-options');
var util = require('util');
var winston = require('winston');

/**
 * Get options for logging system. Checks project's options against defaults, and sets up Winston's transport requirements
 *
 * @return {Object} Contains Winston-specific options for transports and exiting on errors.
 */
function getLoggerOptions() {
  'use strict';

  var defaultOptions = {
    logger: {
      level: 'info',
      silent: false,
      exitOnError: true,
      logFile: ''
    }
  };

  var loggerOptions = {};

  // get the project's options
  var projectOptions = getOptions.getProjectOptions();

  // merge project options with default options; project options take precedence
  var options = getOptions.mergeOptions(defaultOptions, projectOptions);

  // check if we're unit testing
  if (isTest()) {
    options.logger.level = 'warn';
  }

  // basic transports from options
  loggerOptions.transports = [
    new winston.transports.Console({
      level: options.logger.level,
      silent: options.logger.silent,
      colorize: true
    })
  ];

  // check if we should add a log file
  if (options.logger.logFile) {
    loggerOptions.transports.push(
      new winston.transports.File({
        filename: options.logger.logFile,
        level: options.logger.level
      })
    );
  }

  loggerOptions.exitOnError = options.logger.exitOnError;

  return loggerOptions;

}

/**
 * Instantiate winston
 *
 * Can use metadata at any logging level
 * @example
 *   var log = require('/path/to/this/logger.js');
 *   // with metadata
 *   log.info('Test Log Message', { anything: 'This is metadata' });
 *   // general
 *   log.info('Test Log Message');
 *
 */
exports.logger = new winston.Logger(getLoggerOptions());

/**
 * Checks if this utility is called from a unit test.
 *
 * @return {boolean} True or false.
 */
function isTest() {
  'use strict';

  var isTest = false;

  for (var i = 0; i < process.argv.length; i++) {
    if (process.argv[i].substr(-5) === 'mocha') {
      isTest = true;
      break;
    }
  }

  return isTest;
}

/**
 * Recursively prints the properties of an object.
 *
 * @param {Object} obj - The object to be inspected.
 * @param {boolean} showHidden - Whether or not to show hidden properties.
 * @param {number} depth - The number of recursion levels to traverse.
 */
exports.inspectObj = function (obj, showHidden, depth) {
  'use strict';

  if (typeof obj === 'object') {
    depth = depth ? depth : 2;
    winston.info(util.inspect(obj, showHidden, depth));
  }
  else {
    winston.info(obj);
  }
};
