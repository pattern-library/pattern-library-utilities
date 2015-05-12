# Pattern Library Utilities

## Installation

`npm install pattern-library-utilities --save`

## Usage

var utils = require('pattern-import-utilities');

## Available Functions

### Get File Paths

`var paths = utils.getFilePaths(file);`

#### Returns

An object containing strings of paths to this file and its containing directory.

```
{ absolute: '/Users/someone/development/gitrepos/pattern-library-utilities/test/fixtures/test-elm-h1/pattern.yml',
  relative: 'test/fixtures/test-elm-h1/pattern.yml',
  folder: 'test/fixtures/test-elm-h1',
  directory: 'test-elm-h1' }
```

#### Parameters

##### file

a vinyl file object
