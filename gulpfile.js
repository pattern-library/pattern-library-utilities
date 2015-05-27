
var doxxOptions = {

  config: {
    title: 'Pattern Library Utilities',
    urlPrefix: '/pattern-library-utilities'
  },
  src: [
  '!./node_modules/**/*',
  '!./test/**/*',
  '!./gulpfile.js',
  '!./local/**/*',
  './**/*.js',
  './README.md'],
  dest: './docs',
  dependencies: [] // gulp tasks which should be run before this task

};
require('./').gulpDoxx(require('gulp'),doxxOptions);


var ghPagesOptions = {

  src: ['./docs/**/*'],
  dependencies: [] // gulp tasks which should be run before this task

};
require('./').gulpGhPages(require('gulp'),ghPagesOptions);