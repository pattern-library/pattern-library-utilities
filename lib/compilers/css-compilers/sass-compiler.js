var path = require('path');
var sass = require('node-sass');

/**
 * Compiles our styles using the SASS compiling engine
 * @function sassCompiler
 *
 * @param	{object}	paths	set of file paths
 * @param	{object}	paths.folder	directory containing the file-to-be compiled
 * @param {object}  cssCompilerData   css compiler data
 * @param	{object}	cssCompilerData.src 	relative path to the file-to-be compiled
 *
 * @return {string}  compiled css
 */
exports.sassCompiler = function (paths, cssCompilerData) {
  'use strict';

  var result = sass.renderSync({
    file: path.join(paths.folder, cssCompilerData.src)
  });

  return result.css.toString().trim();
};
