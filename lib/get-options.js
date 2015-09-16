/**
 *  @fileoverview Takes two options objects and merges them
 *
 *  @author  Scott Nath
 *
 *  @requires  NPM:lodash.merge
 */

var merge = require('lodash.merge');

/**
 * Returns an merged object of two options objects
 *
 * @param  {object}  options  the app's default options
 * @param  {object}  projectOptions  the project's options
 *
 * @return {object} options  the final options object
 */
exports.getOptions = function (options, projectOptions) {
  'use strict';

  // merge project and default options
  merge(options, projectOptions, function (a, b) {
    return Array.isArray(a) ? b : '';
  });

  if (!Array.isArray(options.dependencies)) {
    options.dependencies = [String(options.dependencies)];
  }

  return options;
};
