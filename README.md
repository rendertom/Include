# Include #

A helper class for Adobe ExtendScript to embed the contents of all files, referenced in preprocessor directives, into a single file.

It reads the contents of the provided file line by line. If a line contains `#include` or `// @include` preprocessor, then inserts the contents of the named file into this file at the location of this statement. If the file to be included cannot be found, ExtendScript throws a run-time error.

Given the entry file `index.js`, that contains 3 `include` directives to files `foo.js`, `bar.js`, `baz.js`,

```javascript
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
```javascript
// Contens of file 'foo.js'
// Contens of file 'bar.js'
// Contens of file 'baz.js'
```

## Usage ##

```javascript
// Inlcude the class
#include 'Include.js'

Include.process(
	'filePath', // Path to a file to be processed.

	// Optional object with user defined parameters:
	{
		addTrailingLineBrake: true, // Adds trailing line brake after including the content of a file. Optional, defaults to `true`.
		indentIncludedContent: true, // Adds indentation level of sources include directive. Optional, defaults to `true`.
		saveFilePath: 'test_finished.js', // Path to file to save final content. If not speficied, saves new file with prefix '_included.js'. Option is ignored if callback is provided.
		skipFiles: [], // List of file names with extension that shouldn't be included.
	},

	// Optional callback function that receives two parameters: final content and a list of included file paths.
	function(content, includedFiles) {
		var count = includedFiles.length;
		if (count === 0) {
			alert('There was nothing to include');
		} else {
			alert('Included ' + count + ' files. Great success!');
		}
	}
);
```

### Case 1 ###

```javascript
// Process 'test.js' file with default parameters.
// Returns file object 'test_included.js'.
Include.process('test.js');
```

### Case 2 ###

```javascript
// Process 'test.js' file with user parameters:
//	- do not add trailing line brakes,
// 	- do not add additional indentation,
//	- save final file as 'test_finished.js',
//	- do not include contents of 'bar.js' file.
//
// Returns file object 'test_finished.js'.
Include.process('test.js', {
	addTrailingLineBrake: false,
	indentIncludedContent: false,
	saveFilePath: 'test_finished.js',
	skipFiles: ['bar.js'],
});
```

### Case 3 ###

```javascript
// Process 'test.js' file with default parameters, but provide a callback function.
// Returns the result of callback function, in this case `undefined`.
Include.process('test.js', undefined,
	function(content, includedFiles) {
		var count = includedFiles.length;
		if (count === 0) {
			alert('There was nothing to include');
		} else {
			alert('Included ' + count + ' files. Great success!');
		}
	}
);
```

## Todo ##

* Add support for `#includepath` directive,
* Add saupport for multiple paths, separated by semicolon;