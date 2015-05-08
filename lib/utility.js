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
.and(require('./create-file'))
.to(module.exports);