(function() {
	try {

		// @include '../source/Include.js'

		/*
			Case 1.
			Processes 'test.js' file with default parameters.
			Returns file object 'test_included.js'.
		 */
		Include.process('test.js');



		/*
			Case 2.
			Process 'test.js' file with user parameters:
				- do not add trailing line brakes,
				- do not add additional indentation,
				- save final file as 'test_finished.js',
				- do not include contents of 'bar.js' file.
			Returns file object 'test_finished.js'.
		 */
		Include.process('test.js', {
			addTrailingLineBrake: false,
			indentIncludedContent: false,
			saveFilePath: 'test_finished.js',
			skipFiles: ['bar.js'],
		});



		/*
			Case 3.
			Process 'test.js' file with default parameters, but provide a callback function.
			Returns the result of callback function, in this case `undefined`.
		 */
		// Include.process('test.js', undefined,
		// 	function(content, includedFiles) {
		// 		var count = includedFiles.length;
		// 		if (count === 0) {
		// 			alert('There was nothing to include');
		// 		} else {
		// 			alert('Included ' + count + ' files. Great success!');
		// 		}
		// 	}
		// );

	} catch (error) {
		alert(error);
	}
})();