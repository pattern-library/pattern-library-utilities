/*
 * Gets name and type of pattern style file.
 *
 * @param {Object} patternObject  metadata from pattern data file (default: pattern.yml)
 * @param {Object} options  pattern-importer options
 *
 * @returns {Array} styleArray (array of style info objects)
 * @returns {Object} styleArray[0].name (name of style file or false)
 * @returns {Object} styleArray[0].type (styling file type)
*/
exports.getPatternStyles = function (patternObject, options) {
  'use strict';

  if (patternObject[options.cssCompiler]) {
    return createStyleArray(patternObject[options.cssCompiler], options.cssCompiler);
  }
  else {
    return false;
  }
};

/*
 * Checks if styles is an array; creates an array of style files and types
 *
 * @param {Array|String} styles  array or string of style files
 * @param {String} type  type of style files
 *
 * @returns {Array} styleArray (array of style objects)
 * @returns {Object} styleArray[0].name (name of style file or false)
 * @returns {Object} styleArray[0].type (styling file type)
*/
function createStyleArray(styles, type) {
  'use strict';
  var styleArray = [];
  if (Array.isArray(styles)) {
    styles.forEach(function (style) {
      styleArray.push(
        {
          name: style,
          type: type
        }
      );
    });
  }
  else {
    styleArray.push(
      {
        name: styles,
        type: type
      }
    );
  }
  return styleArray;
}
