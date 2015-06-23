'use strict';
var twig = require('twig');

/**
 * Compiles twig templates into html
 *
 * @param {Object}  twigOptions  twig configuration options
 * @param {Object}  twigOptions.path  source file to be compiled
 * @param {Object}  data  object of template-matching data
 *
 * @return {String}  compiled html
 */

exports.twigCompiler = function (twigOptions, data) {

  var tpl = twig.twig(twigOptions); //read the file with Twig
  return tpl.render(data);
}

