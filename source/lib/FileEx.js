var FileEx = (function() {
	var module = {};

	module.getBaseName = function(file) {
		var baseName, name;

		file = module.getFileObject(file);

		name = File.decode(file.name);
		baseName = name.split('.').slice(0, -1).join('.');

		return baseName;
	};

	module.getExtension = function(file) {
		file = module.getFileObject(file);
		return file.fsName.split('.').pop();
	};

	module.getFileObject = function(file) {
		return (file instanceof File) ? file : new File(file);
	};

	module.read = function(filePath, encoding) {
		var contents, file;

		encoding = encoding || 'UTF-8';
		file = module.getFileObject(filePath);

		if (!file.exists) {
			throw new Error('File does not exist at path ' + file.fsName);
		}

		if (!File.isEncodingAvailable(encoding)) {
			throw new Error('Encoding ' + encoding + ' is not available for file ' + file.fsName);
		}

		file.encoding = encoding;
		file.open();
		contents = file.read();
		file.close();

		return contents;
	};

	module.write = function(file, contents, encoding, openMode) {
		file = module.getFileObject(file);
		FolderEx.ensureFolderExists(file.parent);

		encoding = encoding || 'UTF-8';
		openMode = openMode || 'w'; // 'a', 'e', 'r', 'w';

		file.encoding = encoding;
		file.open(openMode);
		var success = file.write(contents);
		file.close();

		if (!success) {
			throw new Error('Unable to write file ' + file.fsName);
		}

		return file;
	};

	return module;
})();