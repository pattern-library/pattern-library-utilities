var utils = require('../');
var log = require('../lib/logger').logger;
var should = require('should');
var chai = require('chai');
var expect = chai.expect;
var gutil = require('gulp-util');
var File = require('vinyl');
var es = require('event-stream');
var fs = require('fs-extra');
var os = require('os');
var path = require('path');

var createTestFilePath = function(filePath) {

  return path.join(__filename, '..', 'fixtures', filePath);

};

var testConfigFile = './test/fixtures/config.yml';
// create our options
var options = {
  dataFileName: 'pattern.yml',
  htmlTemplateDest: './test',
  stylesDest: './test/styles',
  importStyles: true,
  scriptsDest: './test/js',
  importScripts: true,
  cssCompiler: 'sass', // sass, less, stylus, none
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

  it('should return default options', function () {

    var defaultOptions = utils.getDefaultPatternUtilOptions();

    defaultOptions.should.have.property('dataSource', 'pattern');
    defaultOptions.should.have.property('dataFileName', 'pattern.yml');
    defaultOptions.should.have.property('localPatternsDir', './patterns');

  });

  it('should return project options when told the configuration file', function () {

    var mergedOptions = utils.getProjectOptions(testConfigFile);

    mergedOptions.should.have.property('dataSource', 'spiderpig');
    mergedOptions.should.have.property('testChange', 'Does whatever he does');
    mergedOptions.should.have.property('localPatternsDir', './patterns');

  });

  it('should return project options with a known CWD, but unknown configuration file', function () {

    var mergedOptions = utils.getProjectOptions('','./test/fixtures');

    mergedOptions.should.have.property('dataSource', 'spiderpig');
    mergedOptions.should.have.property('testChange', 'Does whatever he does');
    mergedOptions.should.have.property('localPatternsDir', './patterns');

  });

  it('should return project options with a unknown CWD and unknown configuration file', function () {

    var mergedOptions = utils.getProjectOptions();

    mergedOptions.should.have.property('dataSource', 'pattern');
    mergedOptions.should.have.property('localPatternsDir', './patterns');
    mergedOptions.should.have.property('githubrepo', 'pattern-library-utilities');

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

  describe('pattern style filename', function (){

    it('should get pattern\'s style filename matching the default cssCompiler', function () {

      var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);

      patternObject.should.have.property('name', 'Heading Level 1 Test H1');
      patternObject.should.have.property('sass', './test-elm-h1.scss');

      var patternStyle = utils.getPatternStyles(patternObject, options);
      patternStyle[0].name.should.equal('./test-elm-h1.scss');
      patternStyle[0].type.should.equal('sass');

    })

    it('should default to css for pattern styles that do not match the default cssCompiler', function () {

      var file = utils.createFile(createTestFilePath('atoms/test-img/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);

      patternObject.should.have.property('name', 'Base Image');
      patternObject.should.have.property('css', './img.css');

      var patternStyle = utils.getPatternStyles(patternObject, options);
      patternStyle[0].name.should.equal('./img.css');
      patternStyle[0].type.should.equal('css');

    })

    it('should allow for an array of style files', function () {

      var file = utils.createFile(createTestFilePath('components/test-include-header/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);

      patternObject.should.have.property('name', 'Header html5 element');

      var patternStyle = utils.getPatternStyles(patternObject, options);
      patternStyle[0].name.should.equal('./test-include-header-1.scss');
      patternStyle[0].type.should.equal('sass');
      patternStyle[1].name.should.equal('./test-include-header-2.scss');
      patternStyle[1].type.should.equal('sass');

    })

  })

  describe('parsing pattern data file for importing', function () {

    it('should determine the destination for files matching defaults', function () {

      var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'));
      var paths = utils.getFilePaths(file);
      var patternFiles = utils.getPatternFiles(paths, options);

      patternFiles.should.have.property('files');
      patternFiles.files[0].history[0].should.containEql('test/base/subcatbase/test-elm-h1.twig');
      String(patternFiles.files[0].contents).should.equal('<h1 class="{{header.class}}">{{ header.text }}</h1>\n');
      patternFiles.files[1].history[0].should.containEql('test/base/subcatbase/test-elm-h1.json');
      String(patternFiles.files[1].contents).should.containEql('    "text": "Test Header 1",');
      patternFiles.files[2].history[0].should.containEql('test/styles/scss/base/subcatbase/test-elm-h1.scss');
      patternFiles.files[3].history[0].should.containEql('test/js/base/subcatbase/test-elm-h1.js');

    });

    it('should include the original pattern source path in the data', function () {

      var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'));
      var paths = utils.getFilePaths(file);
      var patternFiles = utils.getPatternFiles(paths, options);

      patternFiles.should.have.property('data');
      patternFiles.data.should.have.property('patternSource');
      patternFiles.data.patternSource.should.containEql('test/fixtures/test-elm-h1');

    });


    it('should determine the destination for patterns with multiple files per type', function () {

      var file = utils.createFile(createTestFilePath('components/test-include-header/pattern.yml'));
      var paths = utils.getFilePaths(file);
      var patternFiles = utils.getPatternFiles(paths, options);

      patternFiles.should.have.property('files');
      patternFiles.files[0].history[0].should.containEql('test/base/subcatbase23/test-include-header.twig');
      String(patternFiles.files[0].contents).should.containEql('<!-- PATTERN START - /fixtures/test-include-header -->');
      patternFiles.files[1].history[0].should.containEql('test/base/subcatbase23/test-include-header.json');
      String(patternFiles.files[1].contents).should.containEql('    "text": "Test Header 1",');
      patternFiles.files[2].history[0].should.containEql('test/styles/scss/base/subcatbase23/test-include-header-1.scss');
      patternFiles.files[3].history[0].should.containEql('test/styles/scss/base/subcatbase23/test-include-header-2.scss');
      patternFiles.files[4].history[0].should.containEql('test/js/base/subcatbase23/test-include-header-1.js');
      patternFiles.files[5].history[0].should.containEql('test/js/base/subcatbase23/test-include-header-2.js');

    });

    it('should determine the destination for patterns without a default templateEngine file', function () {

      var file = utils.createFile(createTestFilePath('atoms/test-em/pattern.yml'));
      var paths = utils.getFilePaths(file);
      var patternFiles = utils.getPatternFiles(paths, options);

      patternFiles.should.have.property('files');
      patternFiles.files[0].history[0].should.containEql('test/00-atoms/em.html');
      String(patternFiles.files[0].contents).should.containEql('<em class="{{em.class}}">{{ em.text }}</em>\n');
      patternFiles.files[1].history[0].should.containEql('test/00-atoms/test-em.json');
      String(patternFiles.files[1].contents).should.containEql('"text": "Emphasized text",');

    });

    it('should determine the destination for patterns without a default cssCompiler file', function () {

      var file = utils.createFile(createTestFilePath('atoms/test-img/pattern.yml'));
      var paths = utils.getFilePaths(file);
      var patternFiles = utils.getPatternFiles(paths, options);

      patternFiles.should.have.property('files');
      patternFiles.files[0].history[0].should.containEql('test/00-atoms/03-images/test-img.twig');
      String(patternFiles.files[0].contents).should.containEql('<!-- PATTERN START - /pattern-library/patterns/base/img -->');
      patternFiles.files[1].history[0].should.containEql('test/00-atoms/03-images/test-img.json');
      String(patternFiles.files[1].contents).should.containEql('"src": "http://placehold.it/350x150&text=base--img",');

    });
  })


  describe('cloning a pattern', function () {

    it('should clone an entire pattern directory to a destination', function (done) {

      var TEST_DIR = path.join(os.tmpdir(), 'pattern-library-utilities', 'clone');
      var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);
      var paths = utils.getFilePaths(file);
      // get the pattern's category directory
      var patternCategoryPath = utils.getCategoryPath(patternObject, options);
      // determine the cloned pattern's destination directory inside the local patterns directory
      var clonedPatternDest = path.resolve(path.join(TEST_DIR, patternCategoryPath, paths.directory));
      // delete the pattern destination directory, if it exists
      fs.removeSync(clonedPatternDest);

      utils.clonePattern(paths, options, TEST_DIR, function () {
        var patternCategoryPath = utils.getCategoryPath(patternObject, options);

        var clonedTemplate = utils.createFile(path.join(TEST_DIR, patternCategoryPath, 'test-elm-h1/test-elm-h1.twig'));
        should.exist(clonedTemplate);
        String(clonedTemplate.contents).should.containEql('<h1 class="{{header.class}}">{{ header.text }}</h1>');
        var clonedFile = utils.createFile(path.join(TEST_DIR, patternCategoryPath, 'test-elm-h1/pattern.yml'));

        var clonedSass = utils.createFile(path.join(TEST_DIR, patternCategoryPath, 'test-elm-h1/test-elm-h1.scss'));
        should.exist(clonedSass);
        String(clonedSass.contents).should.containEql('$font-size: 1em;');

        var clonedJs = utils.createFile(path.join(TEST_DIR, patternCategoryPath, 'test-elm-h1/test-elm-h1.js'));
        should.exist(clonedJs);
        String(clonedJs.contents).should.containEql('// test-elm-h1.js javascript test file');

        var clonedDataFile = utils.createFile(path.join(TEST_DIR, patternCategoryPath, 'test-elm-h1/pattern.yml'));
        should.exist(clonedDataFile);
        String(clonedDataFile.contents).should.containEql('name: Heading Level 1 Test H1');

        var clonedSubdirSass = utils.createFile(path.join(TEST_DIR, patternCategoryPath, 'test-elm-h1/subdirectory/test.scss'));
        should.exist(clonedSubdirSass);
        String(clonedSubdirSass.contents).should.containEql('// a test subdirectory pattern file');

        // var clonedPatternObject = utils.convertYamlToObject(clonedFile.contents);

        // clonedPatternObject.should.have.property('name', 'Heading Level 1 Test H1');
        // clonedPatternObject.should.have.property('cloneSource');

        done();
      });
    });

    it('should include the original pattern source path in the data', function (done) {

      var TEST_DIR = path.join(os.tmpdir(), 'pattern-library-utilities', 'clone');
      var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);
      var paths = utils.getFilePaths(file);
      // get the pattern's category directory
      var patternCategoryPath = utils.getCategoryPath(patternObject, options);
      // determine the cloned pattern's destination directory inside the local patterns directory
      var clonedPatternDest = path.resolve(path.join(TEST_DIR, patternCategoryPath, paths.directory));
      // delete the pattern destination directory, if it exists
      fs.removeSync(clonedPatternDest);

      utils.clonePattern(paths, options, TEST_DIR, function () {

        var clonedDataFile = utils.createFile(path.join(TEST_DIR, patternCategoryPath, 'test-elm-h1/pattern.yml'));
        should.exist(clonedDataFile);
        String(clonedDataFile.contents).should.containEql('name: Heading Level 1 Test H1');

        var clonedPatternObject = utils.convertYamlToObject(clonedDataFile.contents);

        clonedPatternObject.should.have.property('name', 'Heading Level 1 Test H1');
        clonedPatternObject.should.have.property('cloneSource');
        clonedPatternObject.cloneSource.should.have.property('path', 'test/fixtures/test-elm-h1');
        clonedPatternObject.cloneSource.should.have.property('name', 'Heading Level 1 Test H1');

        done();
      });
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

    it('should not make changes to pattern category path without a convert data file', function () {

      var file = utils.createFile(createTestFilePath('atoms/test-img/pattern.yml'));
      var patternObject = utils.convertYamlToObject(file.contents);

      patternObject.should.have.property('name', 'Base Image');
      patternObject.should.have.property('category', 'atoms');

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

      String(cssOutput).should.containEql('.base--h1,\n.base--STYLED h1 {');

    });

  });

  describe('html compiling', function () {

    describe('twig functions', function () {

      it('should extract a file path from a twig include', function () {
        // double quote test
        var twigInclude = '{% include "link/to/some/twigFile.twig" %}';
        var includePath = utils.extractTwigIncludePath(twigInclude);
        includePath[1].should.equal('link/to/some/twigFile.twig');
        // single quote test
        var twigInclude = "{% include 'link/to/some/twigFile.twig' %}";
        var includePath = utils.extractTwigIncludePath(twigInclude);
        includePath[1].should.equal('link/to/some/twigFile.twig');
        // more complex code test
        var twigInclude = "{% include 'link/to/some/twigFile.twig' with {'promo': hero} %}";
        var includePath = utils.extractTwigIncludePath(twigInclude);
        includePath[1].should.equal('link/to/some/twigFile.twig');
        // test with other stuff on the same line
        var twigInclude = "{% include 'link/to/some/twigFile.twig' with {'promo': hero} %} <!-- what if this is here: '%}'? -->";
        var includePath = utils.extractTwigIncludePath(twigInclude);
        includePath[1].should.equal('link/to/some/twigFile.twig');
      });

      it('should create new file paths from categories', function () {
        // two-category path
        var twoCatPath = 'atoms/global/pattern1/pattern1.twig';
        var newPath = utils.createNewCategoryPath(options,twoCatPath);
        String(newPath).should.containEql('00-atoms/00-global/pattern1.twig');
        // one-category path
        var oneCatPath = 'templates/pattern1/pattern1.twig';
        var newPath = utils.createNewCategoryPath(options,oneCatPath);
        String(newPath).should.containEql('03-templates/pattern1.twig');
        // unmatched category path
        var nomatchCatPath = 'nomatch/pattern1/pattern1.twig';
        var newPath = utils.createNewCategoryPath(options,nomatchCatPath);
        String(newPath).should.containEql('nomatch/pattern1.twig');
      });

      it('should convert all includes in a single twig file', function () {
        var twigFile = utils.createFile(createTestFilePath('molecules/media/figure-image/figure-image.twig'));
        // with conversion
        var twigContent = utils.convertTwigIncludes(options,twigFile.contents.toString('utf8'));
        String(twigContent).should.containEql("{% include '00-atoms/03-images/img.twig' with img %}");
        String(twigContent).should.not.containEql("{% include 'atoms/images/img/img.twig' with img %}");

        //without conversion
        options.convertCategoryTitles = false;
        var twigContent = utils.convertTwigIncludes(options,twigFile.contents.toString('utf8'));
        String(twigContent).should.not.containEql("{% include '00-atoms/03-images/img.twig' with img %}");
        String(twigContent).should.containEql("{% include 'atoms/images/img/img.twig' with img %}");
        options.convertCategoryTitles = true;
      })

      it.skip('should compile twig into html', function () {
        var file = utils.createFile(createTestFilePath('test-elm-h1/pattern.yml'));
        var paths = utils.getFilePaths(file);
        var patternObject = utils.convertYamlToObject(file.contents);

        var compiledHtml = utils.twigCompiler({path: path.join(paths.folder,patternObject.twig)},patternObject.data);

        String(compiledHtml).should.equal('<h1 class="test--h1">Test Header 1</h1>\n');

      });

    });

  });
})

