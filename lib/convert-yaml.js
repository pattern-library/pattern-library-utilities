var yaml = require('js-yaml');

/**
 * Returns an object from yaml data
 *
 * @param  {string}  a string of yaml-formatted data
 */
exports.convertYamlToObject = function (yml) {
  'use strict';
  return yaml.safeLoad(yml);
}

/**
 * Returns yaml data from an object
 *
 * @param  {object}  an object of data to be converted to yaml
 */
exports.convertObjectToYaml = function (object) {
  'use strict';
  return yaml.safeDump(object);
}
