
var doxxOptions = {

  config: {
    title: 'Pattern Library Utilities',
    urlPrefix: '/pattern-library-utilities'
  },
  src: [
  '!./node_modules/**/*',
  '!./.publish/**/*',
  '!./test/**/*',
  '!./gulpfile.js',
  '!./local/**/*',
  '!./docs/**/*',
  './**/*.js',
  './README.md'],
  dest: './docs',
  dependencies: [] // gulp tasks which should be run before this task

};
require('./').gulpDoxx(require('gulp'),doxxOptions);


var ghPagesOptions = {
  config:{
    remoteUrl: 'git@github.com:pattern-library/pattern-library-utilities.git'
  },
  src: ['./docs/**/*'],
  dependencies: [] // gulp tasks which should be run before this task

};
require('./').gulpGhPages(require('gulp'),ghPagesOptions);