var yaml = require('js-yaml');

/**
 * Returns an object from yaml data
 *
 * @param  {string}  yml  string of yaml-formatted data
 *
 * @return {object} json object from a yaml variable
 */
exports.convertYamlToObject = function (yml) {
  'use strict';

  return yaml.safeLoad(yml);
};

/**
 * Returns yaml data from an object
 *
 * @param  {object}  object  object of data to be converted to yaml
 *
 * @return {string} yaml string from a json object
 */
exports.convertObjectToYaml = function (object) {
  'use strict';

  return yaml.safeDump(object);
};
