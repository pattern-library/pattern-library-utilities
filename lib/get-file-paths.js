var path = require('path');

/**
 * Returns an object of file path data
 *
 * @param {object}  file  a vinyl file object
 *
 * @return {object} object of file paths
 */
exports.getFilePaths = function (file) {
  'use strict';

  // get relative path
  var relPath = file.path.replace(process.cwd() + '/', '');

  return {
    absolute: file.path,
    relative: relPath,
    folder: path.dirname(relPath),
    directory: path.basename(path.dirname(relPath))
  };
};
