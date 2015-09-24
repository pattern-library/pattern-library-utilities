var through = require('through2');
var utility = require('./utility');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'pattern-importer';

/*
 * Imports html patterns that are following the standards at github.com/pattern-library
 *
 * @param {Object} options
*/
exports.patternImporter = function (options) {
  'use strict';

  // merge project options with default options
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

    var patternFiles = utility.getPatternFiles(paths, options);

    patternFiles.files.forEach(function (file) {
      this.push(file);
    }, this);

    cb();
  });

  return stream;

};
