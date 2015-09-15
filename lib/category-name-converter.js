/**
 * Converts a category's name
 *
 * @param {Object} categoriesObject  an object with category names and their corresponding desired name
 * @param {String} category  original category name
 *
 * @return {String} category  new category name
 */
exports.categoryNameConverter = function (categoriesObject, category) {
  'use strict';
  if (typeof categoriesObject === 'object') {
    return categoriesObject[category] || category;
  } else {
    return category;
  }

}
