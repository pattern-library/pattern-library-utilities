'use strict';

var File = require('vinyl'),
	fs = require('fs');

/**
 * Creates a vinyl file
 * @function createFile
 *
 * @param {STRING}  filePath  relative path to file
 * @param {STRING}  cwd  current working directory
 * @param {STRING}  base  directory where we start looking for the file
 * @param {STRING}  type  stream|null
 */
exports.createFile = function (filePath, cwd, base, type) {
  var contents;

  if (type == 'stream') {
    contents = fs.createReadStream(filePath);
  } else {

    try {
      contents = fs.readFileSync(filePath);
    } catch (e) {
      throw new Error(filePath+ ' cannot be read');
    }
    
  }

  return new File({
    path: filePath,
    cwd: cwd,
    base: base,
    contents: contents
  });

};