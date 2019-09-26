var Include = (function() {

	// @include 'lib/ArrayEx.js'
	// @include 'lib/FileEx.js'
	// @include 'lib/FolderEx.js'
	// @include 'lib/ObjectEx.js'
	// @include 'lib/StringEx.js'

	var includedFiles, module, options, patterns;

	module = {};

	options = {
		addTrailingLineBrake: true,
		indentIncludedContent: true,
		saveFilePath: '',
		skipFiles: [],
	};

	patterns = {
		includeDirective: /^\s*(\/\/\s*@|#)include\s*['"]/m,
		indentation: /^\s*/,
		nonWhiteCharacter: /\S/,
		quotedString: /['"](.*?)['"]/,
		trailingLineBreak: /(\r|\n)$/,
	};

	/**
	 * Includes contents of all files, referenced in `#include` or `// @include` preprocessor directives.
	 * 
	 * @param  {String|File} 	file 								Path to a file to be processed.
	 * @param  {[Object]}		userOptions							Optional object with user defined parameters.
	 * @param  {[Boolean]}		userOptions.addTrailingLineBrake 	Adds trailing line brake after including the content of a file. Optional, defaults to `true`.
	 * @param  {[Boolean]}		userOptions.indentIncludedContent 	Adds indentation level of sources include directive. Optional, defaults to `true`.
	 * @param  {[String]}		userOptions.saveFilePath 			Path to file to save final content. If not speficied, saves new file with prefix '_included.js'. Option is ignored if callback is provided.
	 * @param  {[Array]}		userOptions.skipFiles 				List of file names with extension that shouldn't be included.
	 * @param  {[Function]} 	callback							Optional callback function that receives two parameters: final content and a list of included file paths.
	 * @return {[File]}												File object. If callback is defined, then returns the result of callback function.
	 */
	module.process = function(file, userOptions, callback) {
		includedFiles = [];
		ObjectEx.assign(options, userOptions);

		var content = replaceIncludeDirectivesInFile(file);
		if (callback && isFunction(callback)) {
			return callback(content, includedFiles);
		} else {
			return saveContent(file, content);
		}
	};

	return module;



	function addTrailingLineBrake(content) {
		if (!patterns.trailingLineBreak.test(content)) {
			content += '\n';
		}

		return content;
	}

	function hasIncludeDirective(string) {
		return patterns.includeDirective.test(string);
	}

	function indentContent(line, content) {
		var indentation = line.match(patterns.indentation);
		if (indentation[0] !== '') {
			content = StringEx.mapLines(content, function(line) {
				if (patterns.nonWhiteCharacter.test(line)) {
					line = indentation[0] + line;
				}

				return line;
			});
		}
		return content;
	}

	function isFunction(value) {
		return typeof value === 'function';
	}

	function replaceIncludeDirectivesInFile(file) {
		file = FileEx.getFileObject(file);
		if (!file.exists) {
			throw 'File does not exist at path ' + file.fsName;
		}

		var content = FileEx.read(file);

		if (hasIncludeDirective(content)) {
			content = StringEx.mapLines(content, function(line) {
				if (!hasIncludeDirective(line)) {
					return line;
				}

				Folder.current = file.parent;
				return replaceLineWithIncludedFileContent(line);
			});
		}

		return content;
	}

	function replaceLineWithIncludedFileContent(line) {
		var content, filePath;

		filePath = line.match(patterns.quotedString)[1];

		if (shouldSkipFile(filePath)) {
			return line;
		}

		content = replaceIncludeDirectivesInFile(filePath);

		if (options.indentIncludedContent) {
			content = indentContent(line, content);
		}

		if (options.addTrailingLineBrake) {
			content = addTrailingLineBrake(content);
		}

		includedFiles.push(Folder.current.fsName + '/' + filePath);

		return content;
	}

	function saveContent(file, content) {
		var saveFilePath = getSaveFilePath(file);
		if (options.saveFilePath && options.saveFilePath !== '') {
			saveFilePath = new File(options.saveFilePath);
		}

		return FileEx.write(saveFilePath, content);



		function getSaveFilePath(file) {
			var baseName, extension, folder;

			file = FileEx.getFileObject(file);
			folder = file.parent.fsName;
			baseName = FileEx.getBaseName(file);
			extension = FileEx.getExtension(file);

			return folder + '/' + baseName + '_included.' + extension;
		}
	}

	function shouldSkipFile(filePath) {
		var file, fileName;

		file = FileEx.getFileObject(filePath);
		fileName = File.decode(file.name);

		return options.skipFiles && ArrayEx.includes(options.skipFiles, fileName);
	}
})();