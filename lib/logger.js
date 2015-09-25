/**
 * @file Abstracted logging properties and methods.
 *
 * If for any reason, they need a different logging tool or need to be extended,
 * the changes can be made here.
 */
var mergeOptions = require('./get-options').mergeOptions;
var util = require('util');
var utility = require('./utility');
var winston = require('winston');

/**
 * Abstracts fully-fleshed logging module to the logger property of this module.
 *
 * If logging with metadata, or requiring winston.log's more advanced features,
 * use exports.logger().log() instead of exports.log().
 * @example
 *   exports.logger(options).log('info', 'Test Log Message', { anything: 'This is metadata' });
 *
 * @return {Object} An instance of winston.Logger.
 */
exports.logger = function () {
  'use strict';

  var options = utility.getProjectOptions();

  var transports = [
    new winston.transports.Console({
      level: options.logger.level,
      silent: options.logger.silent,
      colorize: true
    })
  ];

  if (options.logger.logFile) {
    transports.push(
      new winston.transports.File({
        filename: options.logger.logFile,
        level: options.logger.level
      })
    );
  }

  var logger = new winston.Logger({
    transports: transports,
    exitOnError: options.logger.exitOnError
  });

  return logger;
};

/**
 * Checks if this utility is called from a unit test.
 *
 * @return {boolean} True or false.
 */
exports.isTest = function () {
  'use strict';

  var isTest = false;

  for (var i = 0; i < process.argv.length; i++) {
    if (process.argv[i].substr(-5) === 'mocha') {
      isTest = true;
      break;
    }
  }

  return isTest;
};

/**
 * Recursively prints the properties of an object.
 *
 * @param {Object} obj - The object to be inspected.
 * @param {boolean} showHidden - Whether or not to show hidden properties.
 * @param {number} depth - The number of recursion levels to traverse.
 */
exports.inspect = function (obj, showHidden, depth) {
  'use strict';

  depth = depth ? depth : 2;
  winston.info(util.inspect(obj, showHidden, depth));
};

/**
 * The lazy dev's default method for this utility.
 *
 * Should be a drop-in replacement for console.log, although it can abstract
 * something more extensible like Winston. This logs at the info level. If run
 * from a unit test, this will not output anything.
 * Accepts the same parameters as the unabstracted tool's info() method.
 */
exports.log = exports.isTest() ? function () { 'use strict'; } : winston.info;

/**
 * @function info
 * Log at the info level.
 *
 * Accepts the same parameters as the unabstracted tool's info() method.
 */
exports.info = winston.info;

/**
 * @function warn
 * Log at the warn level.
 *
 * Accepts the same parameters as the unabstracted tool's warn() method.
 */
exports.warn = winston.warn;

/**
 * @function error
 * Log at the error level.
 *
 * Accepts the same parameters as the unabstracted tool's error() method.
 */
exports.error = winston.error;
