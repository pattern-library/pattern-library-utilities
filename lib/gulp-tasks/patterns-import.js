/**
 *  @fileOverview
 * Uses Gulpjs to import html patterns
 *
 *  @author       Scott Nath
 *
 *  @requires     NPM:pattern-importer
 */
var utility = require('../utility');

/**
 * Function to get default options for an implementation of patternlab-import
 * @return {Object}  options  an object of default patternlab-import options
 */
var getDefaultOptions = function () {
  'use strict';

  // default options for angularTemplatecache gulp task
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
        base: 'node_modules/pattern-library/patterns/',
        async: false
      },
      templateDonut: {
        twig: './node_modules/pattern-importer/templates/donut.twig'
      },
      convertCategoryTitles: true
    },
    src: ['./node_modules/pattern-library/patterns/**/pattern.yml'],
    taskName: 'patterns-import', // default task name
    dependencies: [] // gulp tasks which should be run before this task
  };

  return options;
};

/**
 * Gulp task to import raw patterns and convert them to browser-ready html/css/js
 * @name patternsImport
 *
 * @param {Object} gulp gulpjs
 * @param {Object} projectOptions custom options
 *
 */
exports.gulpImportPatterns = function (gulp, projectOptions) {
  'use strict';
  var options = utility.getOptions(getDefaultOptions(), projectOptions);

  /* the gulp task */
  gulp.task(options.taskName, options.dependencies, function () {

    return gulp.src(options.src)
      .pipe(utility.patternImporter(options.config))
      .pipe(gulp.dest('./'));

  });

};
