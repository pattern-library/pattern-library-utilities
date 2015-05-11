'use strict';

var yaml = require('js-yaml');




/**
 * Returns an object from yaml data
 * @function convertYamlToObject
 *
 * @param	{string}	a string of yaml-formatted data
 */
exports.convertYamlToObject = function (yml) {
  return yaml.safeLoad(yml);
}

/**
 * Returns yaml data from an object
 * @function convertObjectToYaml
 *
 * @param	{object}	an object of data to be converted to yaml
 */
exports.convertObjectToYaml = function (object) {
  return yaml.safeDump(object);
}