# Include #

A helper class for **Adobe ExtendScript** to embed the contents of all files, referenced via `#include` and `#includepath` directives into a single output file.

Given the entry file `index.js`, that contains 3 include directives to files `foo.js`, `bar.js`, `baz.js`,

``` js
// index.js:
#include 'foo.js'
#include 'bar.js'
#include 'baz.js'

// foo.js:
// Contens of file 'foo.js'

// bar.js:
// Contens of file 'bar.js'

// baz.js:
// Contens of file 'baz.js'
```

the result becomes one single file `index_included.js`

``` js
// Contens of file 'foo.js'
// Contens of file 'bar.js'
// Contens of file 'baz.js'
```

## 🚀 Usage ##

``` js
// Inlcude the class
#include 'Include.js'

Include.process(
  'filePath', // Path to a file to be processed.

  // Optional object with user defined parameters:
  {
    addTrailingLineBreak: true, // Adds trailing line break after including the content of a file. Optional, defaults to `true`.
    indentIncludedContent: true, // Adds indentation level of sources include directive. Optional, defaults to `true`.
    saveFilePath: 'test_finished.js', // Path to file to save final content. If not speficied, saves new file with prefix '_included.js'. Option is ignored if callback is provided.
    skipFiles: [], // List of file names with extension that shouldn't be included.
  },

  // Optional callback function that receives two parameters: final content and a list of included file paths.
  function(content, includedFiles) {
    //
  }
);
```

### Case 1 ###

``` js
// Process 'index.js' file with default parameters.
// Returns file object 'index_included.js'.
Include.process('index.js');
```

### Case 2 ###

``` js
// Process 'index.js' file with user parameters:
//  - do not add trailing line breaks,
//  - do not add additional indentation,
//  - save final file as 'index_finished.js',
//  - do not include contents of 'bar.js' file.
//
// Returns file object 'index_finished.js'.
Include.process('index.js', {
  addTrailingLineBreak: false,
  indentIncludedContent: false,
  saveFilePath: 'index_finished.js',
  skipFiles: ['bar.js'],
});
```

### Case 3 ###

``` js
// Process 'index.js' file with default parameters, but provide a callback function.
// Returns the result of callback function, in this case `void`.
Include.process('index.js', undefined,
  function(content, includedFiles) {
    var count = includedFiles.length;
    if (count === 0) {
      alert('No file included');
    } else {
      alert('Included ' + count + ' files. Great success!');
    }
  }
);
```

## 🧩 Supported Directives ##

``` js
#include "file.js"
// @include "file.js"

#includepath "relative/path"
// @includepath "relative/path"
```

## 📁 Multiple Include Paths ##

`includepath` supports **multiple directories separated by semicolons**:

``` js
#includepath "lib;vendor;../shared"
```

Paths are resolved relative to the current file's directory.

When resolving an `include`, the processor searches in this order:

1. The current file's directory
2. Each declared `includepath` directory (in declaration order)

## ⚠ Error Handling ##

The processor throws a runtime error if:

- An included file cannot be found
- An `includepath` directory does not exist
- A circular include is detected

## 📜 License ##

MIT License
