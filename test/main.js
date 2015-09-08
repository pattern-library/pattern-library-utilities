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

// create our options
var options = {
  templateEngine: 'twig',
  convertCategoryTitles: true,
  uncategorizedDir: 'uncategorized',
  convertCategoryTitlesData: {
    "categories": {
      "atoms": "00-atoms",
      "molecules": "01-molecules",
      "components": "02-organisms",
      "organisms": "02-organisms",
      "templates": "03-templates",
      "pages": "04-pages"
    },
    "subcategories": {
      "00-atoms": {
        "global": "00-global",
        "text": "01-text",
        "lists": "02-lists",
        "images": "03-images",
        "forms": "04-forms",
        "buttons": "05-buttons",
        "tables": "06-tables",
        "media": "07-media"
      },
      "01-molecules": {
        "text": "00-text",
        "layout": "01-layout",
        "blocks": "02-blocks",
        "media": "03-media",
        "forms": "04-forms",
        "navigation": "05-navigation",
        "components": "06-components",
        "messaging": "07-messaging",
        "global": "08-global"
      },
      "02-organisms": {
        "global": "00-global",
        "article": "01-article",
        "comments": "02-comments",
        "components": "03-components",
        "sections": "04-sections"
      }
    }
  }
}

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

  describe('pattern template name', function (){
    
    it('should get pattern filename matching the default templateEngine', function () {

      var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);

      patternObject.should.have.property('name', 'Heading Level 1 Test H1');
      patternObject.should.have.property('twig', './test-elm-h1.twig');

      var patternTemplate = utils.getPatternTemplateName(patternObject, options);
      patternTemplate.should.equal('./test-elm-h1.twig');

    })
    
    it('should default to html for patterns that do not match the default templateEngine', function () {

      var file = utils.createFile(createTestFilePath('atoms/test-em/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);

      patternObject.should.have.property('name', 'Em');
      patternObject.should.have.property('html', './em.html');

      var patternTemplate = utils.getPatternTemplateName(patternObject, options);
      patternTemplate.should.equal('./em.html');

    })

  })

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

describe('category utilities', function () {

  describe('category name converter', function () {

    it('should convert category names from an object', function () {

      var file = utils.createFile(createTestFilePath('atoms/test-img/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);

      patternObject.should.have.property('name', 'Base Image');
      patternObject.should.have.property('category', 'atoms');
      patternObject.should.have.property('subcategory', 'images');

      var newPatternCategory = utils.categoryNameConverter(options.convertCategoryTitlesData.categories,patternObject.category);
      newPatternCategory.should.equal('00-atoms');
      var newPatternSubCategory = utils.categoryNameConverter(options.convertCategoryTitlesData.subcategories[newPatternCategory],patternObject.subcategory);
      newPatternSubCategory.should.equal('03-images');

    });

    it('should not convert a category name missing from an object', function () {

      var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);

      patternObject.should.have.property('name', 'Heading Level 1 Test H1');
      patternObject.should.have.property('category', 'base');
      patternObject.should.have.property('subcategory', 'subcatbase');

      var newPatternCategory = utils.categoryNameConverter(options.convertCategoryTitlesData.categories,patternObject.category);
      newPatternCategory.should.equal('base');
      var newPatternSubCategory = utils.categoryNameConverter(options.convertCategoryTitlesData.subcategories[newPatternCategory],patternObject.subcategory);
      newPatternSubCategory.should.equal('subcatbase');

    });

    it('should not convert a subcategory name missing from an object', function () {

      var file = utils.createFile(createTestFilePath('test-elm-p/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);

      patternObject.should.have.property('name', 'Paragraph tag tester testing');
      patternObject.should.have.property('category', 'atoms');
      patternObject.should.have.property('subcategory', 'sometestsubcat');

      var newPatternCategory = utils.categoryNameConverter(options.convertCategoryTitlesData.categories,patternObject.category);
      newPatternCategory.should.equal('00-atoms');
      var newPatternSubCategory = utils.categoryNameConverter(options.convertCategoryTitlesData.subcategories[newPatternCategory],patternObject.subcategory);
      newPatternSubCategory.should.equal('sometestsubcat');

    });

  });

  describe('get category paths', function () {

    it('should get a pattern category path', function () {

      var file = utils.createFile(createTestFilePath('atoms/test-em/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);

      patternObject.should.have.property('name', 'Em');
      patternObject.should.have.property('category', 'atoms');
      patternObject.should.not.have.property('subcategory');

      var patternCategoryPath = utils.getCategoryPath(patternObject, options);
      patternCategoryPath.should.equal('00-atoms');

      options.convertCategoryTitles = false;
      var patternCategoryPath = utils.getCategoryPath(patternObject, options);
      patternCategoryPath.should.equal('atoms');
      options.convertCategoryTitles = true;

    });

    it('should get a pattern category path with a subcategory', function () {

      var file = utils.createFile(createTestFilePath('atoms/test-img/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);

      patternObject.should.have.property('name', 'Base Image');
      patternObject.should.have.property('category', 'atoms');

      var patternCategoryPath = utils.getCategoryPath(patternObject, options);
      patternCategoryPath.should.equal('00-atoms/03-images');

      options.convertCategoryTitles = false;
      var patternCategoryPath = utils.getCategoryPath(patternObject, options);
      patternCategoryPath.should.equal('atoms/images');
      options.convertCategoryTitles = true;

    });


    it('should get an uncategorized pattern category path', function () {

      var file = utils.createFile(createTestFilePath('generic-elm-h2/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);

      patternObject.should.have.property('name', 'Heading Level 2 Generic H2');
      patternObject.should.not.have.property('category');

      var patternCategoryPath = utils.getCategoryPath(patternObject, options);

      patternCategoryPath.should.equal('uncategorized');

    });

    it('should get an options-defined uncategorized pattern category path', function () {

      options.uncategorizedDir = 'made-up-directory';
      var file = utils.createFile(createTestFilePath('generic-elm-h2/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);

      patternObject.should.have.property('name', 'Heading Level 2 Generic H2');
      patternObject.should.not.have.property('category');

      var patternCategoryPath = utils.getCategoryPath(patternObject, options);

      patternCategoryPath.should.equal('made-up-directory');

    });

  })



})

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

    it.skip('should compile twig into html', function () {
      var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'));
      var paths = utils.getFilePaths(file);
      var patternObject = utils.convertYamlToObject(file.contents);

      var compiledHtml = utils.twigCompiler({ path: path.join(paths.folder,patternObject.twig) },patternObject.data);
      
      String(compiledHtml).should.equal('<h1 class="test--h1">Test Header 1</h1>\n');

    });
  
  });
})

