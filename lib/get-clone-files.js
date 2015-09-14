'use strict';

var path = require('path'),
  fs = require('fs'),
  utility = require('./utility');

/*
 * Gets details on an html pattern (and its supporting files) being CLONED
 *
 * @param {Array} paths  path info on pattern
 * @param {Object} options  pattern-importer options
*/
exports.getCloneFiles = function (paths, options) {

  // open the individual pattern's data file
  var patternYml = fs.readFileSync(path.join(paths.folder, options.dataFileName), {encoding:'utf8'});

  // get metadata from pattern.yml file
  var patternObject = utility.convertYamlToObject(patternYml);

  // get the pattern's category directory
  patternFiles.patternCategoryPath = utility.getCategoryPath(patternObject, options);

  // determine the cloned pattern's destination directory inside the local patterns directory
  options.localPatternsDir = options.localPatternsDir || './patterns';
  patternFiles.clonedPatternPath = path.resolve(path.join(options.localPatternsDir,patternFiles.patternCategoryPath));

  // use defined template type or default to html
  var patternTemplate = utility.getPatternTemplateName(patternObject, options);

  patternFiles.files = [];

  if(patternTemplate){

    // template file source
    var fileSrc = path.join(paths.folder,patternTemplate);

    // template file destination
    var fileDest = path.join(patternFiles.clonedPatternPath,patternTemplate);

    // create the vinyl version
    var file = utility.createFile(fileSrc,path.resolve('./'),'','',fileDest);

    // push to our files array
    patternFiles.files.push(file);
  }

  // add source pattern info to metadata
  patternObject.cloneSource = {
    path: paths.folder,
    name: patternObject.data.name
  }

  // pattern.yml file destination
  var fileDest = path.join(patternFiles.clonedPatternPath,options.dataFileName);

  // create the vinyl version of pattern.yml
  var file = utility.createNewFile(fileDest,path.resolve('./'),'',new Buffer(utility.convertObjectToYaml(patternObject)));

  // push vinyl version of pattern.yml to our files array
  patternFiles.files.push(file);

    if(options.importStyles){

      // determine style file
      var patternStyle = utility.getPatternStyles(patternObject, options);

      if(patternStyle){
        // iterate over array of style files
        patternStyle.forEach(function (style) {
          if(style.type === 'sass'){
            style.dir = 'scss';
          } else {
            style.dir = 'css';
          }

          // // determin the pattern's styles destination directory
          patternFiles.patternStylesPath = path.join(options.stylesDest,style.dir,patternFiles.patternCategoryPath);

          // source style file
          var fileSrc = path.join(paths.folder,style.name);

          // destination style file
          var fileDest = path.join(patternFiles.patternStylesPath,style.name);

          // create the vinyl version
          var file = utility.createFile(fileSrc,path.resolve('./'),'','',fileDest);

          // push to our files array
          patternFiles.files.push(file);
        });
      }

    }

    // add javascript file(s)
    if(patternObject.script && options.importScripts){
      var scriptArray = [];

      // check if list of scripts is an array; creates an array of scripts
      if(Array.isArray(patternObject.script)){
        patternObject.script.forEach(function (script) {
          scriptArray.push(
            {
              name: script
            }
          )
        })
      } else {
        scriptArray.push(
          {
            name: patternObject.script
          }
        )
      }
      // iterate over an array of scripts
      scriptArray.forEach(function (script) {

        // get the relative path to the js file source
        var fileSrc = path.join(paths.folder,script.name);

        // get the relative path to the js file destination
        var fileDest = path.join(patternFiles.clonedPatternPath,script.name);

        // create the vinyl version
        var file = utility.createFile(fileSrc,path.resolve('./'),'','',fileDest);

        // push to our files array
        patternFiles.files.push(file);
      });

    }

  }
  return patternFiles;
};
