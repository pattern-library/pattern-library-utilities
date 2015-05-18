/**
 *  @fileOverview Takes two options objects and merges them
 *
 *  @author       Scott Nath
 *
 *  @requires     NPM:lodash.merge
 */
'use strict';

var merge = require('lodash.merge');

/**
 * Returns an merged object of two options objects
 * @function getOptions
 * 
 * @param	{object}	appDefaultOptions	the app's default options
 * @param	{object}	projectOptions	the project's options
 */
exports.getOptions = function (options, projectOptions) {

  /* merge project and default options */
  merge(options, projectOptions, function (a, b) {
    return Array.isArray(a) ? b : undefined;
  });

  return options;
}
