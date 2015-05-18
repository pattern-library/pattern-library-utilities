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
.and(require('./create-file'))
.and(require('./convert-yaml'))
.and(require('./compilers/css-compilers/sass-compiler'))
.and(require('./compilers/html-compilers/twig-compiler'))
.and(require('./gulp-tasks/browsersync'))
.to(module.exports);