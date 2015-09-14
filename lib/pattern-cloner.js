'use strict';
var through = require('through2'),
  utility = require('./utility'),
  merge = require('lodash.merge'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs = require('fs'),
    PluginError = gutil.PluginError,
    PLUGIN_NAME = 'pattern-importer';

/*
 * Imports html patterns that are following the standards at github.com/pattern-library
 *
 * @param {Object} options
*/
exports.patternCloner = function (options) {

  options = getOptions(options);

  var stream = through.obj(function (file, encoding, cb) {

    if (file.isNull()) {
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported'));
      return cb();
    }

    // open the individual pattern's data file
    var patternYml = fs.readFileSync(path.join(paths.folder, options.dataFileName), {encoding:'utf8'});

    // get metadata from pattern.yml file
    var patternObject = utility.convertYamlToObject(patternYml);
    // get the pattern's category directory
    patternFiles.patternCategoryPath = utility.getCategoryPath(patternObject, options);

    // get path details for our pattern
    var paths = utility.getFilePaths(file);

    var patternFiles = utility.getPatternFiles(paths, options);

    patternFiles.files.forEach(function (file) {
      this.push(file);
    }, this)

    cb();
  });

  return stream;

}

function addCloneSourceToMetadata (paths, options) {

}
