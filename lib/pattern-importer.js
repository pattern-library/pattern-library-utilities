var through = require('through2');
var utility = require('./utility');
var merge = require('lodash.merge');
var gutil = require('gulp-util');
var fs = require('fs');
var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'pattern-importer';

/*
 * Imports html patterns that are following the standards at github.com/pattern-library
 *
 * @param {Object} options
*/
exports.patternImporter = function (options) {
  'use strict';
  options = getOptions(options);

  var stream = through.obj(function (file, encoding, cb) {

    if (file.isNull()) {
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported'));
      return cb();
    }

    // get path details for our pattern
    var paths = utility.getFilePaths(file);

    var patternFiles = utility.getPatternFiles(paths, options);

    patternFiles.files.forEach(function (file) {
      this.push(file);
    }, this);

    cb();
  });

  return stream;

};

var getOptions = function (options) {
  'use strict';
  var optionsDefaults = {
    dataSource: 'pattern',
    dataFileName: 'pattern.yml',
    htmlTemplateDest: './source/_patterns',
    stylesDest: './source',
    importStyles: true,
    scriptsDest: './source/js',
    importScripts: true,
    cssCompiler: 'sass', // sass, less, stylus, none
    templateEngine: 'twig',
    convertCategoryTitles: true, // default: true
    convertCategoryTitlesDataFile: './node_modules/pattern-library-utilities/lib/data/pattern-lab-categories.yml',
    uncategorizedDir: 'uncategorized'
  };

  /* merge project and default options */
  options = merge(optionsDefaults, options, function (a, b) {
    return Array.isArray(a) ? b : '';
  });

  // determine data source
  options.dataSource = options.dataSource || optionsDefaults.dataSource;
  if (typeof options.dataSource !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Pattern dataSource name must be a string');
  }

  // determine pattern datafileName name
  options.dataFileName = options.dataFileName || optionsDefaults.dataFileName;
  if (typeof options.dataFileName !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Pattern dataFileName name must be a string');
  }

  // determine html template destination
  options.htmlTemplateDest = options.htmlTemplateDest || optionsDefaults.htmlTemplateDest;
  if (typeof options.htmlTemplateDest !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'HTML Template destination folder must be a string');
  }

  // determine styling files destination
  options.stylesDest = options.stylesDest || optionsDefaults.stylesDest;
  if (typeof options.stylesDest !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Styling files destination folder must be a string');
  }

  // should we import styles?
  options.importStyles = options.importStyles || optionsDefaults.importStyles;

  if (typeof options.importStyles !== 'boolean') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Choosing to import styles should be true of false.');
  }

  // determine script files destination
  options.scriptsDest = options.scriptsDest || optionsDefaults.scriptsDest;
  if (typeof options.scriptsDest !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Script files destination folder must be a string');
  }

  // should we import scripts?
  options.importScripts = options.importScripts || optionsDefaults.importScripts;

  if (typeof options.importScripts !== 'boolean') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Choosing to import scripts should be true of false.');
  }

  // determine pattern template compiling engine
  options.templateEngine = options.templateEngine || optionsDefaults.templateEngine;
  if (typeof options.templateEngine !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Pattern template engine must be a string');
  }

  // should we convert the category directories when importing them?
  options.convertCategoryTitles = options.convertCategoryTitles || optionsDefaults.convertCategoryTitles;

  if (typeof options.convertCategoryTitles !== 'boolean') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Choosing to convert category titles should be true of false.');
  }

  // determine category title-conversion data file
  options.convertCategoryTitlesDataFile = options.convertCategoryTitlesDataFile || optionsDefaults.convertCategoryTitlesDataFile;
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
  options.cssCompiler = options.cssCompiler || optionsDefaults.cssCompiler;
  if (typeof options.cssCompiler !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'CSS compiler name must be a string');
  }

  // determine directory name for patterns without a category
  options.uncategorizedDir = options.uncategorizedDir || optionsDefaults.uncategorizedDir;
  if (typeof options.uncategorizedDir !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Pattern dataFileName name must be a string');
  }

  return options;
};
