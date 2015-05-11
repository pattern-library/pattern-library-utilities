var utils = require('../');
var should = require('should');
var chai = require('chai');
var expect = chai.expect;
var gutil = require('gulp-util');
var File = require('vinyl');
var es = require('event-stream');
var fs = require('fs');
var path = require('path');

var createTestFilePath = function(filePath) {
  
  return path.join(__filename, '..', 'fixtures', filePath);

};

describe('test file ', function () {

  it('should create proper file paths', function () {

    var filePath = createTestFilePath('test-elm-h1/pattern.yml');
    String(filePath).should.containEql('test/fixtures/test-elm-h1/pattern.yml');

  })
})

describe('pattern utilities', function () {

  it('should create a vinyl file', function () {

    var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'), 'test/', 'test/fixtures', 'just some content');
    var paths = utils.getFilePaths(file);

    String(paths.absolute).should.equal(path.join(path.resolve(),'test/fixtures/test-elm-h1/pattern.yml'));
    String(paths.relative).should.equal('test/fixtures/test-elm-h1/pattern.yml');
    String(paths.folder).should.equal('test/fixtures/test-elm-h1');
    String(paths.directory).should.equal('test-elm-h1');

    String(file.path).should.equal(path.join(path.resolve(),'test/fixtures/test-elm-h1/pattern.yml'));
    String(file.base).should.equal('test/fixtures');
    String(file.cwd).should.equal('test/');
    String(file.contents).should.containEql('twig: ./test-elm-h1.twig');

  });

  it('should return pattern paths', function () {

    var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'));
    var paths = utils.getFilePaths(file);

    String(paths.absolute).should.equal(path.join(path.resolve(),'test/fixtures/test-elm-h1/pattern.yml'));
    String(paths.relative).should.equal('test/fixtures/test-elm-h1/pattern.yml');
    String(paths.folder).should.equal('test/fixtures/test-elm-h1');
    String(paths.directory).should.equal('test-elm-h1');

  });

});



