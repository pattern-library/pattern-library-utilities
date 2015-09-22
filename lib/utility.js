/**
 * Module dependencies.
 */

var copy = require('copy-to');

copy(require('./category-name-converter'))
.and(require('./clone-pattern'))
.and(require('./compilers/css-compilers/sass-compiler'))
.and(require('./compilers/html-compilers/twig-compiler'))
.and(require('./convert-recursive-json-variables'))
.and(require('./convert-twig-include-paths'))
.and(require('./convert-yaml'))
.and(require('./create-file'))
.and(require('./get-category-path'))
.and(require('./get-file-paths'))
.and(require('./get-options'))
.and(require('./get-pattern-files'))
.and(require('./get-pattern-styles'))
.and(require('./get-pattern-template-name'))
.and(require('./gulp-tasks/angular-templatecache'))
.and(require('./gulp-tasks/browsersync'))
.and(require('./gulp-tasks/clone'))
.and(require('./gulp-tasks/doxx'))
.and(require('./gulp-tasks/file-glob-inject'))
.and(require('./gulp-tasks/gh-pages'))
.and(require('./gulp-tasks/patterns-import'))
.and(require('./logger'))
.and(require('./pattern-importer'))
.to(module.exports);
