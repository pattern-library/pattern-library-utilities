var path = require('path');
var fs = require('fs-extra');
var utility = require('./utility');
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

  options = utility.getPatternUtilOptions(options);

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
exports.testIfSinglePattern = function (patternPath) {
  'use strict';

  // get project options
  var projectOptions = utility.getPatternUtilOptions();

  if (typeof patternPath !== 'string') {
    throw new Error('Pattern path must be a string');
  }

  // check that the patternPath ends with the dataFileName (pattern.yml); if not, add it to the path
  if (path.basename(patternPath) !== projectOptions.dataFileName) {
    patternPath = path.join(patternPath, projectOptions.dataFileName);
  }

  // test for existence of patternDataFile
  try {
    fs.statSync(patternPath);
  }
  catch (e) {
    console.log("Pattern data file does not exist.");
    console.log(e);
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
      console.log('A pattern directory for ' + paths.directory + ' already exists in ' + clonedPatternDest);
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

