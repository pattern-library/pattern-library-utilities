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

  describe('data manipulation', function (){

    it('should convert yaml data to an object', function () {

      var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);

      patternObject.should.have.property('name', 'Heading Level 1 Test H1');
      patternObject.should.have.property('description', 'First level heading inside a test');
      patternObject.should.have.property('category', 'base');
      patternObject.should.have.property('twig', './test-elm-h1.twig');
      patternObject.should.have.property('sass', './test-elm-h1.scss');

    });

    it('should create the compiled yaml object', function () {

      var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'));
      var paths = utils.getFilePaths(file);
      var patternObject = utils.convertYamlToObject(file.contents);

      var compiledYmlObject = utils.convertObjectToYaml(patternObject);

      String(compiledYmlObject).should.containEql('name: Heading Level 1 Test H1');
      String(compiledYmlObject).should.containEql('description: First level heading inside a test');
      String(compiledYmlObject).should.containEql('category: base');
      String(compiledYmlObject).should.containEql('twig: ./test-elm-h1.twig');
      String(compiledYmlObject).should.containEql('sass: ./test-elm-h1.scss');
      String(compiledYmlObject).should.containEql('subcategory: subcatbase');

    });

  })

});

describe('compilers', function () {


  describe('css compiling', function () {

    it('should compile sass into css', function () {

      var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'));
      var paths = utils.getFilePaths(file);
      var patternObject = utils.convertYamlToObject(file.contents);
      
      var cssCompilerData = {
        src: patternObject.sass
      }

      var cssOutput = utils.sassCompiler(paths, cssCompilerData);

      String(cssOutput).should.containEql('.base--h1, .base--STYLED h1 {');

    });

  });

  describe('html compiling', function () {

    it('should compile twig into html', function () {
      var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'));
      var paths = utils.getFilePaths(file);
      var patternObject = utils.convertYamlToObject(file.contents);

      var compiledHtml = utils.twigCompiler(path.join(paths.folder,patternObject.twig),patternObject.data);
      
      String(compiledHtml).should.equal('<h1 class="test--h1">Test Header 1</h1>\n');

    });
  
  });
})

