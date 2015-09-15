var path = require('path');

/**
 * Returns an object of file path data
 *
 * @param {object}  file  a vinyl file object
 */
exports.getFilePaths = function (file) {
  'use strict';
  var paths = {
    absolute: file.path,
    relative: file.path.replace(process.cwd() + '/', ''),
    folder: file.path.replace(process.cwd() + '/', '').split('/').slice(0, -1).join('/'),
    directory: path.basename(file.path.replace(process.cwd() + '/', '').split('/').slice(0, -1).join('/'))
  };
  return paths;
}
