var ArrayEx = (function() {
	var module = {};

	module.castArray = function(array) {
		if (!module.isArray(array)) {
			array = [array];
		}

		return array;
	};

	module.forEach = function(array, callback) {
		for (var i = 0, il = array.length; i < il; i++) {
			callback(array[i], i, array);
		}
	};

	module.includes = function(array, item) {
		for (var i = 0, il = array.length; i < il; i++) {
			if (array[i] === item) {
				return true;
			}
		}
		return false;
	};

	module.isArray = function(array) {
		return Object.prototype.toString.call(array) === '[object Array]';
	};

	module.map = function(array, callback) {
		var mappedArray = [];
		module.forEach(array, function(item, i, array) {
			mappedArray[i] = callback(item, i, array);
		});

		return mappedArray;
	};

	return module;
})();