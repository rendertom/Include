var StringEx = (function () {
  var module = {};

  module.getLeadingWhitespaces = function (string) {
    var match = string.match(/^\s*/);
    return match ? match[0] : '';
  };

  module.hasTrailingNewline = function (string) {
    return /\r?\n$/.test(string);
  };

  module.splitLines = function (string) {
    return string.split(/\r?\n/);
  };

  module.trim = function (string) {
    return string.replace(/^\s+/, '').replace(/\s+$/, '');
  };

  return module;
})();
