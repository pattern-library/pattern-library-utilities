'use strict';

var utility = require('./utility');



/*
 * Convert file paths in twig include statements
 *
 * @param {Object} options  pattern importer options
 * @param {String} twigContent  content from a twig file
 *
 * @returns {String} twigContent twig file content with converted paths
*/
function convertTwigIncludes (options,twigContent) {

  if(!options.convertCategoryTitles){
    return twigContent;
  }

  // regex expression to find twig include code blocks
  var twigIncludeRegex = /{%.*?include.*?%}/g;

  var twigIncludes;
  // go through twig's contents and find the includes
  while ((twigIncludes = twigIncludeRegex.exec(twigContent)) !== null) {

    // get clean path from twig include statement
    var includePath = extractTwigIncludePath(twigIncludes[0]);

    // get the new include path
    var newIncludePath = createNewCategoryPath(options,includePath[1]);

    // replace old include path with new one
    twigContent = twigContent.replace(includePath[1],newIncludePath);

  }

  return twigContent;
}

/*
 * Create new category path
 *
 * @param {String} includePath  current category path
 *
 * @returns {String} converted category path
*/
function createNewCategoryPath (options,includePath) {

  // split up the include path
  var paths = includePath.split('/');

  var newIncludePath = Array();
  // convert main category
  var one = utility.categoryNameConverter(options.convertCategoryTitlesData['categories'], paths[0]);
  newIncludePath.push(one);

  // check paths for four parts - denotes a subcategory
  if(paths.length === 4){
    var two = utility.categoryNameConverter(options.convertCategoryTitlesData.subcategories[one], paths[1]);
    newIncludePath.push(two);
  }

  // add our twig file's name
  newIncludePath.push(paths[paths.length - 1]);

  // return the new include path
  return newIncludePath.join('/');
}

/*
 * Extracts the path for a file from a twig include statement using regex
 *
 * @param {String} twigInclude  twig include statement
 *
 * @returns {String} template file path
*/
function extractTwigIncludePath (twigInclude) {

  // regex searches for single or double quotes with a .twig inside them
  var includeRegex = /['"](.+\.twig)['"]/;
  return includeRegex.exec(twigInclude);
}

module.exports = {
  convertTwigIncludes: convertTwigIncludes,
  createNewCategoryPath: createNewCategoryPath,
  extractTwigIncludePath: extractTwigIncludePath
}
