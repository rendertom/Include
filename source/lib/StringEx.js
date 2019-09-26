var StringEx = (function() {
	var module = {};

	module.mapLines = function(string, callback) {
		return ArrayEx.map(module.splitLines(string), function(line, i, lines) {
			return callback(line, i, lines, string);
		}).join('\n');
	};

	module.splitLines = function(string) {
		return string.split(/\r?\n/);
	};

	return module;
})();