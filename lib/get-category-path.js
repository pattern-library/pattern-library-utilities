var path = require('path'),
  utility = require('./utility');

/**
 * Determines the category directory structure from the pattern's data
 *
 * @param {Object} patternObject  individual pattern's data (from /pattern-name/pattern.yml)
 * @param {Object} options  pattern-importer options
 *
 * @return {String} categoryPath  internal path url to category
 *
 * @requires ./lib/utility
 * @requires ./lib/category-name-converter
 */
exports.getCategoryPath = function (patternObject, options) {
  'use strict';
  var categoryPath = '',
    subcategoryPath = '',
    categoryObject = '';

  // grab the conversion data object
  if(options.convertCategoryTitles && options.convertCategoryTitlesData){
    categoryObject = options.convertCategoryTitlesData;
  }

  // make sure we're dealing with an object
  var patternObject = patternObject || {};

  // return the uncategorized directory name if no category in the pattern's object
  if(!patternObject.category){
    return options.uncategorizedDir;
  }

  // check if we have a categoryObject
  switch(categoryObject) {
    case '':
      return categoryPathPlain(patternObject);
      break;
    default:
      return categoryPathConverted(categoryObject, patternObject);
  }
}

/**
 * Determines the category directory structure without any conversion
 *
 * @param {Object} patternObject  individual pattern's data (from /pattern-name/pattern.yml)
 *
 * @return {String} categoryPath  internal path url to category
 *
 */
function categoryPathPlain (patternObject) {
  'use strict';

  // check for subcategory
  if(patternObject.subcategory){
    return path.join(patternObject.category, patternObject.subcategory);
  } else {
    return patternObject.category;
  }
}

/**
 * Determines the category directory structure by converting names according to a category object
 *
 * @param {Object} categoryObject  object of category names and their conversion titles
 * @param {Object} patternObject  individual pattern's data (from /pattern-name/pattern.yml)
 *
 * @return {String} categoryPath  internal path url to category
 *
 * @requires ./lib/utility
 * @requires ./lib/category-name-converter
 */
function categoryPathConverted (categoryObject, patternObject) {
  'use strict';

  // convert our category path using the categoryObject
  var categoryPath = utility.categoryNameConverter(categoryObject.categories, patternObject.category);

  // check for subcategory
  if(patternObject.subcategory){
    var subcategoryPath = utility.categoryNameConverter(categoryObject.subcategories[categoryPath], patternObject.subcategory);
    return path.join(categoryPath, subcategoryPath);
  } else {
    return categoryPath;
  }
}
