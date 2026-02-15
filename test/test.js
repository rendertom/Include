(function () {
  try {
    // @include '../source/Include.js'

    /*
			Case 1.
			Processes 'index.js' file with default parameters.
			Returns file object 'test_included.js'.
      Expected content:
        // content of file "logger.js"

        // content of file "math.js"

          // content of file "bootstrap.js"

          // content of file "storage.js"

        // content of file "helper.js"

        // content of file "logger.js"

        // content of file "index.js"
		 */
    Include.process('./index.js');

    /*
			Case 2.
			Process 'index.js' file with user paramxeters:
				- do not add trailing line breaks,
				- do not add additional indentation,
				- save final file as 'test_finished.js',
				- do not include contents of 'logger.js' file.
			Returns file object 'index_finished.js'.
      Expected content:
        // skipped include: logger.js
        // content of file "math.js"
        // content of file "bootstrap.js"
        // content of file "storage.js"
        // content of file "helper.js"
        // skipped include: lib/logger.js
        // content of file "index.js"
		 */
    // Include.process('index.js', {
    // 	addTrailingLineBreak: false,
    // 	indentIncludedContent: false,
    // 	saveFilePath: 'index_finished.js',
    // 	skipFiles: ['logger.js'],
    // });

    /*
			Case 3.
			Process 'index.js' file with default parameters, but provide a callback function.
			Returns the result of callback function, in this case `void`.
      Expected result: 6 includes.
		 */
    // Include.process('index.js', undefined,
    // 	function(content, includedFiles) {
    // 		var count = includedFiles.length;
    // 		if (count === 0) {
    // 			alert('No file included.');
    // 		} else {
    // 			alert('Included ' + count + ' files. Great success!');
    // 		}
    // 	}
    // );
  } catch (error) {
    alert(error);
  }
})();
