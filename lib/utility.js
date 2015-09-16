/**
 * Module dependencies.
 */

var copy = require('copy-to');

copy(require('./get-file-paths'))
.and(require('./get-options'))
.and(require('./category-name-converter'))
.and(require('./get-category-path'))
.and(require('./get-pattern-template-name'))
.and(require('./get-pattern-files'))
.and(require('./pattern-importer'))
.and(require('./get-pattern-styles'))
.and(require('./convert-twig-include-paths'))
.and(require('./convert-recursive-json-variables'))
.and(require('./create-file'))
.and(require('./convert-yaml'))
.and(require('./compilers/css-compilers/sass-compiler'))
.and(require('./compilers/html-compilers/twig-compiler'))
.and(require('./gulp-tasks/angular-templatecache'))
.and(require('./gulp-tasks/browsersync'))
.and(require('./gulp-tasks/doxx'))
.and(require('./gulp-tasks/file-glob-inject'))
.and(require('./gulp-tasks/gh-pages'))
.and(require('./gulp-tasks/patterns-import'))
.to(module.exports);
