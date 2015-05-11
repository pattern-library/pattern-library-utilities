'use strict';
var twig = require('twig');

/**
 * Compiles a twig file into html
 * @function twigCompiler
 *
 * @param	{string}	src 	path to twig template
 * @param	{object}	data 	data object, should match data in twig template
 */

exports.twigCompiler = function (src, data) {
  var tpl = twig.twig({
    path: src,
    async: false
  }); //read the file with Twig
  return tpl.render(data);
}

