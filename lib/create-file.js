var File = require('vinyl');
var fs = require('fs');

/**
 * Creates a vinyl file
 *
 * @param {STRING}  filePath  relative path to file
 * @param {STRING}  cwd  current working directory
 * @param {STRING}  base  directory where we start looking for the file
 * @param {STRING}  type  stream|null
 * @param {STRING}  newDest  destination different from filePath
 *
 * @return {object} a vinyl file
 */
exports.createFile = function (filePath, cwd, base, type, newDest) {
  'use strict';
  var contents;

  if (type === 'stream') {
    contents = fs.createReadStream(filePath);
  }
  else {

    try {
      contents = fs.readFileSync(filePath);
    }
    catch (e) {
      throw new Error(filePath + ' cannot be read');
    }

  }

  // use new destination path if there is one
  filePath = newDest || filePath;

  return new File({
    path: filePath,
    cwd: cwd,
    base: base,
    contents: contents
  });

};

/**
 * Creates a new vinyl file
 *
 * @param {STRING}  filePath  relative path to file
 * @param {STRING}  cwd  current working directory
 * @param {STRING}  base  directory where we start looking for the file
 * @param {STRING}  contents  the file's contents
 *
 * @return {object} a vinyl file
 */
exports.createNewFile = function (filePath, cwd, base, contents) {
  'use strict';

  return new File({
    path: filePath,
    cwd: cwd,
    base: base,
    contents: contents
  });

};
