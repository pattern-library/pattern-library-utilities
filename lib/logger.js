/**
 * @file Abtracted logging properties and methods.
 *
 * If for any reason, they need a different logging tool or need to be extended,
 * the changes can be made here. 
 */
var util = require('util');
var logger = require('winston');

exports.logger = logger;

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

exports.i = function (obj, showHidden, depth) {
  'use strict';

  depth = depth ? depth : 2;
  return util.inspect(obj, showHidden, depth);
};

exports.info = logger.info;

exports.log = exports.isTest() ? function () { 'use strict'; } : logger.info;

exports.warn = logger.warn;

exports.error = logger.error;
