/**
 *  @fileoverview Pattern Library Utilities options management functions
 *
 *  @author  Scott Nath
 *
 *  @requires  NPM:lodash.merge
 */

var merge = require('lodash.merge');
var fs = require('fs');
var path = require('path');
var utility = require('./utility');
var gutil = require('gulp-util');
var PLUGIN_NAME = 'Pattern Library Utilities';

/**
 * Returns an merged object of two options objects
 *
 * @param  {object}  options  the app's default options
 * @param  {object}  projectOptions  the project's options
 *
 * @return {object} options  the final options object
 */
var mergeOptions = exports.mergeOptions = function (options, projectOptions) {
  'use strict';

  // merge project and default options
  merge(options, projectOptions, function (a, b) {
    return Array.isArray(a) ? b : undefined;
  });

  if (!Array.isArray(options.dependencies)) {
    options.dependencies = [String(options.dependencies)];
  }

  return options;
};

/**
 * Function to get complete default options for Pattern Library Utilities
 *
 * @return {Object}  options  an object of all default Pattern Library Utilities options
 */
var getDefaultPatternUtilOptions = exports.getDefaultPatternUtilOptions = function () {
  'use strict';

  var options = {
    dataSource: 'pattern',
    dataFileName: 'pattern.yml',
    localPatternsDir: './patterns',
    htmlTemplateDest: './source/_patterns',
    stylesDest: './source',
    importStyles: true,
    scriptsDest: './source/js',
    importScripts: true,
    cssCompiler: 'sass', // sass, less, stylus, none
    templateEngine: 'twig',
    convertCategoryTitles: true, // default: true
    convertCategoryTitlesDataFile: path.join(__dirname, '../lib/data/pattern-lab-categories.yml'),
    uncategorizedDir: 'uncategorized'
  };

  return options;
};


/**
 * Function to test the final options for incorrect data types
 *
 * @param  {object}  projectOptions  the project's options
 *
 * @return {Object}  options  an object of all default Pattern Library Utilities options
 */
exports.getPatternUtilOptions = function (projectOptions) {
  'use strict';

  var options = mergeOptions(getDefaultPatternUtilOptions(), projectOptions);

  // Source for data object used to populate patterns. 'pattern' means data is coming from the dataFileName file
  if (typeof options.dataSource !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Pattern dataSource name must be a string');
  }

  // Name of directory that houses this pattern library's local patterns
  if (typeof options.localPatternsDir !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Local patterns directory name must be a string');
  }

  // Name of file that is the source for a pattern's info and dummy content
  if (typeof options.dataFileName !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Pattern dataFileName name must be a string');
  }


  // Location the importer will send html template; template type determined by templateEngine
  if (typeof options.htmlTemplateDest !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'HTML Template destination folder must be a string');
  }

  // determine styling files destination
  if (typeof options.stylesDest !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Styling files destination folder must be a string');
  }

  // should we import styles?
  if (typeof options.importStyles !== 'boolean') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Choosing to import styles should be true of false.');
  }

  // determine script files destination
  if (typeof options.scriptsDest !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Script files destination folder must be a string');
  }

  // should we import scripts?
  if (typeof options.importScripts !== 'boolean') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Choosing to import scripts should be true of false.');
  }

  // determine pattern template compiling engine
  if (typeof options.templateEngine !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Pattern template engine must be a string');
  }

  // should we convert the category directories when importing them?
  if (typeof options.convertCategoryTitles !== 'boolean') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Choosing to convert category titles should be true of false.');
  }

  // determine category title-conversion data file
  if (typeof options.convertCategoryTitlesDataFile !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'The category title-conversion data file must be a string');
  }

  // open and convert data from category title-conversion data file
  if (options.convertCategoryTitles && options.convertCategoryTitlesDataFile) {
    var convertCategoryTitlesDataFile;
    // attempt to open our category title-conversion data file
    try {
      convertCategoryTitlesDataFile = fs.readFileSync(options.convertCategoryTitlesDataFile, {encoding: 'utf8'});
    }
    catch (err) {
      // If the type is not what you want, then just throw the error again.
      throw new gutil.PluginError(PLUGIN_NAME, 'Error opening category title-conversion data file: ' + options.convertCategoryTitlesDataFile + '\n Error: ' + err);
    }
    options.convertCategoryTitlesData = utility.convertYamlToObject(convertCategoryTitlesDataFile);
  }

  // determine css compiler
  if (typeof options.cssCompiler !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'CSS compiler name must be a string');
  }

  // determine directory name for patterns without a category
  if (typeof options.uncategorizedDir !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Pattern dataFileName name must be a string');
  }

  return options;
};
