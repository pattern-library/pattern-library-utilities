/*
 * Gets name of pattern template file. Defaults to .html file (if it exists)
 *
 * @param {Object} patternObject  metadata from pattern data file (default: pattern.yml)
 * @param {Object} options  pattern-importer options
 *
 * @return {String} name of template file or false
*/
exports.getPatternTemplateName = function (patternObject, options) {
  'use strict';
  if (patternObject[options.templateEngine]) {
    return patternObject[options.templateEngine];
  }
  else if (patternObject.html) {
    return patternObject.html;
  }
  else {
    return false;
  }
};
