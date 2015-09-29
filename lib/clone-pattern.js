var path = require('path');
var fs = require('fs-extra');
var utility = require('./utility');
var log = require('./logger').logger;
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'pattern-importer';

/*
 * Takes a stream of patterns to-be-cloned
 *
 * @param {Object} options
 *
 * @return {Object} an empty stream
*/
exports.patternCloner = function (options) {
  'use strict';

  // check options
  options = options || utility.getProjectOptions();

  var stream = through.obj(function (file, encoding, cb) {

    if (file.isNull()) {
      return cb();
    }
    if (file.isStream()) {
      log.error('error', new PluginError(PLUGIN_NAME, 'Streams not supported'));
      return cb();
    }

    // get path details for our pattern
    var paths = utility.getFilePaths(file);

    utility.clonePattern(paths, options, options.localPatternsDir, function () {});

    cb();
  });

  return stream;

};

/*
 * Test that a string returns an existing pattern
 *
 * @param {Object} options application options
 * @param {String} patternPath path to pattern; accepts pattern directory and patternDataFile
 *
 * @return {Object} path to a patternDataFile (pattern.yml)
*/
exports.testIfSinglePattern = function (patternPath, options) {
  'use strict';

  // check options
  options = options || utility.getProjectOptions();

  if (typeof patternPath !== 'string') {
    log.error('Pattern path must be a string');
    return;
  }

  // check that the patternPath ends with the dataFileName (pattern.yml); if not, add it to the path
  if (path.basename(patternPath) !== options.dataFileName) {
    patternPath = path.join(patternPath, options.dataFileName);
  }

  // test for existence of patternDataFile
  try {
    fs.statSync(patternPath);
  }
  catch (e) {
    log.error(options.dataFileName + ' does not exist at ' + patternPath);
    log.error(e);
    return;
  }

  return patternPath;
};

/*
 * Clone a pattern's entire directory to destination directory
 *
 * @param {Array} paths  path info on original pattern
 * @param {Object} options  pattern-importer options
 * @param {String} destDir  the top of destination directory for the cloned pattern
*/
exports.clonePattern = function (paths, options, destDir, cb) {
  'use strict';

  // make sure the destination directory is a string and exists
  destDir = destDir || './patterns';
  if (typeof destDir !== 'string') {
    log.error('Destination directory must be a string.');
    throw new Error();
  }

  // open the pattern's data file
  var patternYml = fs.readFileSync(path.join(paths.folder, options.dataFileName), {encoding: 'utf8'});

  // get metadata from pattern.yml file
  var patternObject = utility.convertYamlToObject(patternYml);

  // get the pattern's category directory
  var patternCategoryPath = utility.getCategoryPath(patternObject, options);

  // determine the cloned pattern's destination directory inside the local patterns directory
  var clonedPatternDest = path.resolve(path.join(destDir, patternCategoryPath, paths.directory));

  // if the destination directory doesn't exist, just copy the pattern
  try {
    fs.statSync(clonedPatternDest);
  }
  catch (e) {
    copyPatternDir(paths, clonedPatternDest, options, cb);
    return;
  }

  // check if overwrite is allowed
  if (!options.config.overwrite) {
    log.info('A pattern directory for ' + paths.directory + ' already exists in ' + clonedPatternDest);
    return;
  }

  // copy the pattern
  copyPatternDir(paths, clonedPatternDest, options, cb);

};

/*
 * Copy the pattern directory and adjust it's data file
 *
 * @param {String} paths  pattern source
 * @param {String} dest  destination for pattern
 * @param {Object} options  project options
 * @param {Func} cb  callback function
 *
*/
var copyPatternDir = function (paths, dest, options, cb) {
  'use strict';

  // copy the entire pattern directory, as-is, to our destination directory
  fs.copy(String(paths.folder), dest, function (err) {
    if (err && err.code !== 'ENOENT') {return log.error(err); }

    // success in cloning the directory
    log.info(paths.directory + ' pattern cloned into ' + dest);

    // create the cloned pattern's data file's path
    var clonedPatternYmlFile = paths.relative;

    // open the cloned pattern's data file
    var clonedPatternYml = fs.readFileSync(clonedPatternYmlFile, {encoding: 'utf8'});

    // get metadata from the data file
    var clonedPatternObject = utility.convertYamlToObject(clonedPatternYml);

    // new file contents
    var newDataFileContents = utility.convertObjectToYaml(addCloneSource(paths, clonedPatternObject));

    // overwrite the cloned pattern's data file with the adjusted contents
    fs.writeFile(clonedPatternYmlFile, newDataFileContents, function (err) {
      if (err) { throw err; }
      log.info(clonedPatternYmlFile + ' cloned source added to ' + options.dataFileName);
      cb();
    });
  });
};

/*
 * Add data about a cloned pattern's source
 *
 * @param {Array} paths  path info on original pattern
 * @param {Object} patternObject  data object from the pattern data file
 *
 * @return {Object} patternObject  updated data object
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

