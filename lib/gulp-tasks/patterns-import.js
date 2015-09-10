/**
 *  @fileOverview
 * Uses Gulpjs to import html patterns
 *
 *  @author       Scott Nath
 *
 *  @requires     NPM:gulp
 *  @requires     NPM:lodash.merge
 *  @requires     NPM:pattern-importer
 */
'use strict';

var gulp = require('gulp'),
  merge = require('lodash.merge'),
  utility = require('../utility'),
  print = require('gulp-print');

/**
 * Function to get default options for an implementation of patternlab-import
 * @returns {Object}  options  an object of default patternlab-import options
 */
function getDefaultOptions () {

  /* default options for angularTemplatecache gulp task */
  var options = {
    config: {
      compilePatternsOnImport: false,
      dataSource: 'pattern',
      dataFileName: 'pattern.yml',
      htmlTemplateDest: './source/_patterns',
      stylesDest: './source/css/scss',
      scriptsDest: './source/js',
      cssCompiler: 'sass', // sass, less, stylus, none
      templateEngine: 'twig',
      templateEngineOptions: {
        'base': 'node_modules/pattern-library/patterns/',
        'async': false
      },
      templateDonut: {
        'twig': './node_modules/pattern-importer/templates/donut.twig'
      },
      convertCategoryTitles: true
    },
    src: ['./node_modules/pattern-library/patterns/**/pattern.yml'],
    taskName: 'patterns-import', // default task name
    dependencies: [] // gulp tasks which should be run before this task
  };

  return options;
}

/**
 * Gulp task to import raw patterns and convert them to browser-ready html/css/js
 * @name patternsImport
 * @param {Object} options custom options
 * @param {Array|String} options.patternFiles  project-relative path to sets of un-compiled patterns
 * @param {Object}  options.patternImporterOptions  options needed for the pattern-importer
 * @requires NPM:Gulp
 * @requires NPM:lodash.merge
 */
exports.gulpImportPatterns = function (gulp, projectOptions) {

  var options = utility.getOptions(getDefaultOptions(),projectOptions);

  /* the gulp task */
  gulp.task(options.taskName, options.dependencies, function() {

    return gulp.src(options.src)
      .pipe(print())
      .pipe(utility.patternImporter(options.config))
      .pipe(print())
      .pipe(gulp.dest('./'));

  });

}
