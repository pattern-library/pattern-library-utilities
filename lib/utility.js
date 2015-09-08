/*!
 * utility - lib/utility.js
 *
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var copy = require('copy-to');

copy(require('./get-file-paths'))
.and(require('./get-options'))
.and(require('./category-name-converter'))
.and(require('./get-category-path'))
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
.to(module.exports);