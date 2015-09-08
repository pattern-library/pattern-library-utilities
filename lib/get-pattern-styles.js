'use strict';
/*
 * Gets name and type of pattern style file. Defaults to .css file (if it exists)
 *
 * @param {Object} patternObject  metadata from pattern data file (default: pattern.yml)
 * @param {Object} options  pattern-importer options
 *
 * @returns {Object} styleObj.name (name of style file or false)
 * @returns {Object} styleObj.type (styling file type)
*/
exports.getPatternStyles = function (patternObject, options) {

  if(patternObject[options.cssCompiler]) {
    var styleObj = {
      name: patternObject[options.cssCompiler],
      type: options.cssCompiler
    }
    return styleObj;
  } else if(patternObject.css) {
    var styleObj = {
      name: patternObject.css,
      type: 'css'
    }
    return styleObj;
  } else {
    return false;
  }
}