/**
 * @file Abstracted logging properties and methods.
 *
 * If for any reason, they need a different logging tool or need to be extended,
 * the changes can be made here. 
 */
var util = require('util');
var logger = require('winston');

/**
 * @module logger
 * Abstracts fully-fleshed logging module to the logger property of this module.
 *
 * If logging with metadata, or requiring winston.log's more advanced features,
 * use exports.logger.log() instead of exports.log().
 * @example
 * // exports.logger.log('info', 'Test Log Message', { anything: 'This is metadata' });
 */
exports.logger = logger;

/**
 * @function isTest
 * Checks if this utility is called from a unit test.
 *
 * @returns {boolean}
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
 * @function inspect
 * Recursively prints the properties of an object.
 *
 * @param {Object} obj - The object to be inspected.
 * @param {boolean} showHidden - Whether or not to show hidden properties.
 * @param {number} depth - The number of recursion levels to traverse.
 */
exports.inspect = function (obj, showHidden, depth) {
  'use strict';

  depth = depth ? depth : 2;
  logger.info(util.inspect(obj, showHidden, depth));
};

/**
 * @function log
 * The lazy dev's default method for this utility.
 *
 * Should be a drop-in replacement for console.log, although it can abstract
 * something more extensible like Winston. This logs at the info level. If run
 * from a unit test, this will not output anything.
 * Accepts the same parameters as the unabstracted tool's info() method.
 */
exports.log = exports.isTest() ? function () { 'use strict'; } : logger.info;

/**
 * @function info
 * Log at the info level.
 *
 * Accepts the same parameters as the unabstracted tool's info() method.
 */
exports.info = logger.info;

/**
 * @function warn
 * Log at the warn level.
 *
 * Accepts the same parameters as the unabstracted tool's warn() method.
 */
exports.warn = logger.warn;

/**
 * @function error
 * Log at the error level.
 *
 * Accepts the same parameters as the unabstracted tool's error() method.
 */
exports.error = logger.error;
