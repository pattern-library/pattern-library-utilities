'use strict';

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

  var categoryPath = '',
    subcategoryPath = '',
    categoryObject = '';

  /* grab the conversion data object */
  if(options.convertCategoryTitles && options.convertCategoryTitlesData){
    categoryObject = options.convertCategoryTitlesData;
  }
  /* make sure we're dealing with an object */
  var patternObject = patternObject || {};

  /* Checking for category structure */
  if(patternObject.category){
    if(categoryObject){
      categoryPath = utility.categoryNameConverter(categoryObject.categories, patternObject.category);
    } else {
      categoryPath = patternObject.category;
    }

    if(patternObject.subcategory){
      if(categoryObject){
        subcategoryPath = utility.categoryNameConverter(categoryObject.subcategories[categoryPath], patternObject.subcategory);
      } else {
        subcategoryPath = patternObject.subcategory;
      }
    }

  /* no category specified, give up and use option: uncategorizedDir */
  } else {
    return options.uncategorizedDir;
  }

  if(subcategoryPath){
    return path.join(categoryPath, subcategoryPath);
  }else{
    return path.join(categoryPath);
  }
}