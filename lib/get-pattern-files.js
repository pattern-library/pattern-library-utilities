var path = require('path');
var fs = require('fs');
var log = require('./logger').logger;
var utility = require('./utility');

/*
 * Gets details on an html pattern (and its supporting files) coming from a Pattern Library-structured directory
 *
 * @param {Array} paths  path info on pattern
 * @param {Object} options  pattern-importer options
*/
exports.getPatternFiles = function (paths, options) {
  'use strict';

  // open the individual pattern's data file
  var patternYml = fs.readFileSync(path.join(paths.folder, options.dataFileName), {encoding: 'utf8'});

  // create an object to store data about this pattern's files
  var patternFiles = {};
  patternFiles.data = {};

  // get metadata from pattern.yml file
  var patternObject = utility.convertYamlToObject(patternYml);

  // get the pattern's category directory
  patternFiles.patternCategoryPath = utility.getCategoryPath(patternObject, options);

  // determine the pattern's template destination directory
  patternFiles.patternTemplatePath = path.resolve(path.join(options.htmlTemplateDest, patternFiles.patternCategoryPath));

  // determine the pattern's javascripts' destination directory
  patternFiles.patternScriptsPath = path.join(options.scriptsDest, patternFiles.patternCategoryPath);

  // use defined template type or default to html
  var patternTemplate = utility.getPatternTemplateName(patternObject, options);

  patternFiles.files = [];

  if (patternTemplate) {

    var patternTemplateFileDest;
    var patternTemplateFile;
    // convert twig includes IF we are switching category directory titles in our destination directory
    if (options.convertCategoryTitles && options.convertCategoryTitlesData && (options.templateEngine === 'twig') && (patternObject.twig)) {

      // convert the include statements in our twig files
      var twigContent = utility.convertTwigIncludes(options, fs.readFileSync(path.join(paths.folder, patternTemplate), {encoding: 'utf8'}));

      // our html template file destination
      patternTemplateFileDest = path.join(patternFiles.patternTemplatePath, paths.directory + '.twig');

      // create the vinyl version
      patternTemplateFile = utility.createNewFile(patternTemplateFileDest, path.resolve('./'), '', new Buffer(twigContent));

    }
    else {

      if (!patternObject[options.templateEngine]) {
        log.warn('non-default templateEngine template found, import of ' + patternObject.name + 'skipped.');
        return false;
      }

      // no conversion

      // template file source
      var fileSrc = path.join(paths.folder, patternTemplate);

      // template file destination
      patternTemplateFileDest = path.join(patternFiles.patternTemplatePath, patternTemplate);

      // create the vinyl version
      patternTemplateFile = utility.createFile(fileSrc, path.resolve('./'), '', '', patternTemplateFileDest);

    }

    // push pattern template file to our files array
    patternFiles.files.push(patternTemplateFile);

    // add data file to files-to-write array
    if (patternObject.data) {

      // add the data to main patternFiles object for easy reference later
      patternFiles.data = patternObject.data;

      // add the pattern source path
      patternFiles.data.patternSource = paths.folder;

      // if the pattern is a clone, add that to data object
      if (patternObject.cloneSource) {
        patternFiles.data.cloneSource = patternObject.cloneSource;
      }

      // JSON data file destination
      var fileDest = path.join(patternFiles.patternTemplatePath, paths.directory + '.json');

      // create the vinyl version
      var file = utility.createNewFile(fileDest, path.resolve('./'), '', new Buffer(JSON.stringify(patternObject.data, null, 2)));

      // push to our files array
      patternFiles.files.push(file);
    }

    if (options.importStyles) {

      // determine style file
      var patternStyle = utility.getPatternStyles(patternObject, options);

      if (patternStyle) {
        // iterate over array of style files
        patternStyle.forEach(function (style) {
          if (style.type === 'sass') {
            style.dir = 'scss';
          }
          else {
            style.dir = 'css';
          }

          // // determin the pattern's styles destination directory
          patternFiles.patternStylesPath = path.join(options.stylesDest, style.dir, patternFiles.patternCategoryPath);

          // source style file
          var fileSrc = path.join(paths.folder, style.name);

          // destination style file
          var fileDest = path.join(patternFiles.patternStylesPath, style.name);

          // create the vinyl version
          var file = utility.createFile(fileSrc, path.resolve('./'), '', '', fileDest);

          // push to our files array
          patternFiles.files.push(file);
        });
      }

    }

    // add javascript file(s)
    if (patternObject.script && options.importScripts) {
      var scriptArray = [];

      // check if list of scripts is an array; creates an array of scripts
      if (Array.isArray(patternObject.script)) {
        patternObject.script.forEach(function (script) {
          scriptArray.push(
            {
              name: script
            }
          );
        });
      }
      else {
        scriptArray.push(
          {
            name: patternObject.script
          }
        );
      }

      // iterate over an array of scripts
      scriptArray.forEach(function (script) {

        // get the relative path to the js file source
        var fileSrc = path.join(paths.folder, script.name);

        // get the relative path to the js file destination
        var fileDest = path.join(patternFiles.patternScriptsPath, path.basename(script.name));

        // create the vinyl version
        var file = utility.createFile(fileSrc, path.resolve('./'), '', '', fileDest);

        // push to our files array
        patternFiles.files.push(file);
      });

    }

  }
  return patternFiles;
};
