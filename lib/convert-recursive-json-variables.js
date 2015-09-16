var resolve = require('jsonplus').resolve;

/**
 * Convert variables in a json object recursively
 *
 * @param {Object}  object  self-referencing object with variables
 * @param {Object}  regex  regular expression to find variables within the object
 *
 * @return {Object}  JSON object of variables
 */
exports.convertRecursiveJsonVariables = function (object, regex) {
  'use strict';

  var checkForVariables;
  // go through objects's contents, find the variables, replace them
  while ((checkForVariables = regex.exec(JSON.stringify(object))) !== null) {
    object = resolve(object);
    checkForVariables = regex.exec(JSON.stringify(object));
  }
  return object;
};
