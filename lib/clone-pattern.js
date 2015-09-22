var path = require('path');
var fs = require('fs-extra');
var utility = require('./utility');
var through = require('through2');
var merge = require('lodash.merge');

exports.patternCloner = function (options) {
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

    utility.clonePattern(paths, options, './patterns', function(){});

    cb();
  });

  return stream;

};

/*
 * Clone a pattern's entire directory to destination directory
 *
 * @param {Array} paths  path info on original pattern
 * @param {Object} options  pattern-importer options
 * @param {String} destDir  the top of destination directory for the cloned pattern
*/
exports.clonePattern = function (paths, options, destDir, callback) {
  'use strict';

  // make sure the destination directory is a string and exists
  destDir = destDir || './patterns';
  if (typeof destDir !== 'string') {
    throw new Error('Destination directory must be a string.');
  }

  // open the pattern's data file
  var patternYml = fs.readFileSync(path.join(paths.folder, options.dataFileName), {encoding: 'utf8'});

  // get metadata from pattern.yml file
  var patternObject = utility.convertYamlToObject(patternYml);

  // get the pattern's category directory
  var patternCategoryPath = utility.getCategoryPath(patternObject, options);

  // determine the cloned pattern's destination directory inside the local patterns directory
  var clonedPatternDest = path.resolve(path.join(destDir, patternCategoryPath, paths.directory));

  // check if a directory already exists in our destination
  fs.open(clonedPatternDest, 'r', function (err, fd) {
    if (err && err.code === 'ENOENT') {

      // copy the entire pattern directory, as-is, to our destination directory
      fs.copy(paths.folder, clonedPatternDest, function (err) {
        if (err) { return console.error(err); }

        // success in cloning the directory
        console.log(paths.directory + ' pattern cloned into ' + clonedPatternDest);

        // create the cloned pattern's data file's path
        var clonedPatternYmlFile = path.join(clonedPatternDest, options.dataFileName);

        // open the cloned pattern's data file
        var clonedPatternYml = fs.readFileSync(clonedPatternYmlFile, {encoding: 'utf8'});

        // get metadata from the data file
        var clonedPatternObject = utility.convertYamlToObject(clonedPatternYml);

        // new file contents
        var newDataFileContents = utility.convertObjectToYaml(addCloneSource(paths, clonedPatternObject));

        // overwrite the cloned pattern's data file with the adjusted contents
        fs.writeFile(clonedPatternYmlFile, newDataFileContents, function (err) {
          if (err) { throw err; }
          console.log(clonedPatternYmlFile + 'cloned source added to ' + options.dataFileName);
          callback();
        });
      });
    }
    else {
      console.log('A pattern directory for ' + paths.directory + 'already exists in ' + clonedPatternDest);
      callback();
    }
  });

};

/*
 * Add data about a cloned pattern's source
 *
 * @param {Array} paths  path info on original pattern
 * @param {Object} patternObject  data object from the pattern data file
 *
 * @return {Pbject} patternObject  updated data object
*/
var addCloneSource = function (paths, patternObject) {
  'use strict';

  // copy data object and remove from patternObject - this is for proper ordering of the pattern.yml file
  var patternData = patternObject.data;
  delete patternObject.data;

  // add this cloned pattern's source
  patternObject.cloneSource = {
    path: paths.folder,
    name: patternObject.name
  };

  // return the data object so it is the last property in the final file
  patternObject.data = patternData;

  return patternObject;
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
    return Array.isArray(a) ? b : undefined;
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
