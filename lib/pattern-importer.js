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

  // get the project's options
  var projectOptions = utility.getProjectOptions();

  // merge the project's options with the pattern importing options
  options = utility.mergeOptions(projectOptions, options);

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
