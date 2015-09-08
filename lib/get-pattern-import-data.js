'use strict';

var path = require('path'),
  fs = require('fs'),
  utility = require('./utility');

/*
 * Gets details on an html pattern (and its supporting files) coming from a Pattern Library-structured directory
 *
 * @param {Array} paths  path info on pattern
 * @param {Object} options  pattern-importer options
*/
exports.getPatternImportData = function (paths, options) {

  // open the individual pattern's data file
  var patternYml = fs.readFileSync(path.join(paths.folder, options.dataFileName), {encoding:'utf8'});

  // create an object to store data about this pattern's files
  var patternFiles = {};
  patternFiles.data = {};
  patternFiles.filesToWrite = [];
  patternFiles.filesToCopy = [];

  // get metadata from pattern.yml file
  var patternObject = utility.convertYamlToObject(patternYml);

  // get the pattern's category directory
  patternFiles.patternCategoryPath = utility.getCategoryPath(patternObject, options);

  // determine the pattern's template destination directory
  patternFiles.patternTemplatePath = path.join(options.htmlTemplateDest,patternFiles.patternCategoryPath);

  // determin the pattern's styles destination directory
  patternFiles.patternScriptsPath = path.join(options.scriptsDest,patternFiles.patternCategoryPath);

  // use defined template type or default to html
  var patternTemplate = utility.getPatternTemplateName(patternObject, options);

  var fileType = path.extname(patternTemplate).replace('.','');

  var fileSrc = path.join(paths.folder,patternTemplate);

  if(patternTemplate){

    // convert twig includes IF we are switching category directory titles in our destination directory
    if(options.convertCategoryTitles && options.convertCategoryTitlesData && (options.templateEngine === 'twig') && (patternObject.twig)){
      
      var twigContent = utility.convertTwigIncludes(options,fs.readFileSync(path.join(paths.folder,patternTemplate), {encoding:'utf8'}))

      // add file to our filesToWrite array
      patternFiles.filesToWrite.push({
        'type': 'pattern',
        'dest': path.join(patternFiles.patternTemplatePath,paths.directory+'.twig'),
        'contents': twigContent
      });
      
    } else {
      // no conversion, add pattern template to files-to-copy array
      var patternFileToCopy = {
        type: 'pattern',
        src: path.join(paths.folder,patternTemplate),
        dest: path.join(patternFiles.patternTemplatePath,patternTemplate)
      }
      patternFiles.filesToCopy.push(patternFileToCopy);
    }

    // add data file to files-to-write array
    if(patternObject.data){
      var patternDataFile = paths.directory + '.json';
      var patternFileToWrite = {
        type: 'data',
        dest: path.join(patternFiles.patternTemplatePath,patternDataFile),
        contents: patternObject.data
      }
      patternFiles.filesToWrite.push(patternFileToWrite);
      // add the data to main patternFiles object for easy reference later
      patternFiles.data = patternObject.data;
    }

    if(options.importStyles){

      // determine style file
      var patternStyle = utility.getPatternStyles(patternObject, options);

      // add pattern style file to files-to-copy array
      if(patternStyle){
        if(patternStyle.type === 'sass'){
          patternStyle.dir = 'scss';
        } else {
          patternStyle.dir = 'css';
        }
        
        // determin the pattern's styles destination directory
        patternFiles.patternStylesPath = path.join(options.stylesDest,patternStyle.dir,patternFiles.patternCategoryPath);
        var patternFileToCopy = {
          type: 'styles',
          src: path.join(paths.folder,patternStyle.name),
          dest: path.join(patternFiles.patternStylesPath,patternStyle.name)
        }
        patternFiles.filesToCopy.push(patternFileToCopy);
      }

    }

    // add javascript file(s)
    if(patternObject.script && options.importScripts){

      // get the relative path to the js file source
      var jsFileSourcePath = path.join(paths.folder,patternObject.script);

      // get the relative path to the js file destination
      var jsFileDestinationPath = path.join(patternFiles.patternScriptsPath,patternObject.script);

      // add an object about this file to the filesToWrite array
      var jsFileToCopy = {
        type: 'js',
        src: jsFileSourcePath,
        dest: jsFileDestinationPath
      }
      patternFiles.filesToCopy.push(jsFileToCopy);

    }

  }
  return patternFiles;
};
