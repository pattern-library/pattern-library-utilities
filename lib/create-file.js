'use strict';

var File = require('vinyl'),
	fs = require('fs'),
  fsp = require('fs-promise');

/**
 * Creates a vinyl file
 * @function createFile
 *
 * @param {STRING}  filePath  relative path to file
 * @param {STRING}  cwd  current working directory
 * @param {STRING}  base  directory where we start looking for the file
 * @param {STRING}  type  stream|null
 */
exports.createFile = function createFile (filePath, cwd, base, type) {
  var contents;

  if (type == 'stream') {
    contents = fs.createReadStream(filePath);
    return new File({
      path: filePath,
      cwd: cwd,
      base: base,
      contents: contents
    });
  } else {
    try {
      contents = fs.readFileSync(filePath);
      return new File({
        path: filePath,
        cwd: cwd,
        base: base,
        contents: contents
      });
    } catch (e) {
      //ERROR handling
    }
    
  }

};