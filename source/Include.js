var Include = (function () {

  // @include 'lib/ArrayEx.js'
  // @include 'lib/FileEx.js'
  // @include 'lib/FolderEx.js'
  // @include 'lib/ObjectEx.js'
  // @include 'lib/StringEx.js'

  var cache = {};
  var includedFiles = [];
  var includePaths = [];
  var stack = {};

  var options = {
    addTrailingLineBreak: true,
    indentIncludedContent: true,
    saveFilePath: '',
    skipFiles: [],
  };

  var module = {};

  /**
   * Includes contents of all files referenced in `#include`, `// @include`, `#includepath`, or `// @includepath` preprocessor directives.
   * The `includepath` directive defines one or more additional folders (semicolon-separated) that are searched when resolving subsequent
   * `include` directives within the same file.
   *
   * @param {string|File} file Path to a file to be processed.
   * @param {Object} [userOptions={}] Optional object with user defined parameters.
   * @param {Boolean} [userOptions.addTrailingLineBreak=true] Adds trailing line break after including the content of a file. Optional, defaults to `true`.
   * @param {Boolean} [userOptions.indentIncludedContent=true] Adds indentation level of source include directive. Optional, defaults to `true`.
   * @param {string} [userOptions.saveFilePath=''] Path to file to save final content. If not specified, saves new file with prefix '_included.js'. Option is ignored if callback is provided.
   * @param {Array} [userOptions.skipFiles=[]] List of file names with extension that shouldn't be included.
   * @param {Function} [callback] Optional callback function that receives two parameters: final content and a list of included file paths.
   * @return {File|*} File object. If callback is defined, then returns the result of callback function.
   */
  module.process = function (file, userOptions, callback) {
    cache = {};
    includedFiles = [];
    includePaths = [];
    stack = {};

    ObjectEx.assign(options, userOptions);

    var content = handleInclude(file);

    return typeof callback === 'function'
      ? callback(content, includedFiles)
      : saveContent(file, content);
  };

  return module;

  ///

  /**
   * @param {string|File} file
   * @returns {string}
   */
  function handleInclude(file) {
    file = FileEx.getFileObject(file);

    if (!file.exists) {
      throw 'File does not exist at path ' + file.fsName;
    }

    if (stack[file.fsName]) {
      throw 'Circular include detected: ' + file.fsName;
    }

    if (cache[file.fsName]) {
      return cache[file.fsName];
    }

    stack[file.fsName] = true;

    var content = FileEx.read(file);
    var lines = StringEx.splitLines(content);

    var processedLines = [];
    ArrayEx.forEach(lines, function (line) {
      var result = processLine(file, line);
      if (result !== null) {
        processedLines.push(result);
      }
    });

    var result = processedLines.join('\n');

    if (StringEx.hasTrailingNewline(content)) {
      result += '\n';
    }

    cache[file.fsName] = result;
    delete stack[file.fsName];

    return result;
  }

  /**
   * @param {File} file
   * @param {string} path
   */
  function handleIncludepath(file, path) {
    var paths = path.split(';');
    ArrayEx.forEach(paths, function (path) {
      path = StringEx.trim(path);
      if (!path) return;

      var folder = new Folder(file.parent.fsName + '/' + path);

      if (!folder.exists) {
        throw ('The directory "' + path + '" does not exist.' + '\n' +
          'Referenced in: ' + file.fsName
        );
      }

      if (!ArrayEx.includes(includePaths, folder.fsName)) {
        includePaths.push(folder.fsName);
      }
    });
  }

  /**
   * @param {string} content
   * @param {string} line
   * @returns {string}
   */
  function handleIndentation(content, line) {
    var indent = StringEx.getLeadingWhitespaces(line);
    var lines = StringEx.splitLines(content);
    var minIndent = Infinity;

    ArrayEx.forEach(lines, function (line) {
      if (StringEx.trim(line)) {
        var candidate = StringEx.getLeadingWhitespaces(line).length;
        minIndent = Math.min(minIndent, candidate);
      }
    });

    if (minIndent === Infinity) minIndent = 0;

    ArrayEx.forEach(lines, function (line, index) {
      if (StringEx.trim(line)) {
        lines[index] = indent + line.substr(minIndent);
      }
    });

    var result = lines.join('\n');

    if (StringEx.hasTrailingNewline(content)) {
      result += '\n';
    }

    return result;
  }

  /**
   * @param {File} file
   * @param {string} line
   * @returns {string|null}
   */
  function processLine(file, line) {
    var includepathMatch = line.match(/^\s*(?:\/\/\s*@|#)includepath\s+(['"])(.*?)\1/);
    if (includepathMatch) {
      handleIncludepath(file, includepathMatch[2]);
      return null;
    }

    var includeMatch = line.match(/^\s*(?:\/\/\s*@|#)include\s+(['"])(.*?)\1/);
    if (includeMatch) {
      return replaceLineWithIncludedFileContent(file, includeMatch[2], line);
    }

    return line;
  }

  /**
   * @param {File} file
   * @param {string} path
   * @param {string} line
   * @returns {string}
   */
  function replaceLineWithIncludedFileContent(file, path, line) {
    var includedFile = resolveIncludeFilePath(file, path);

    if (ArrayEx.includes(options.skipFiles, File.decode(includedFile.name))) {
      return '// skipped include: ' + path;
    }

    var content = handleInclude(includedFile);

    if (options.indentIncludedContent) {
      content = handleIndentation(content, line);
    }

    if (options.addTrailingLineBreak && !StringEx.hasTrailingNewline(content)) {
      content += '\n';
    }

    includedFiles.push(includedFile.fsName);

    return content;
  }

  /**
   * @param {File} file
   * @param {string} path
   */
  function resolveIncludeFilePath(file, path) {
    var candidate = new File(file.parent.fsName + '/' + path);
    if (candidate.exists) return candidate;

    for (var i = 0, il = includePaths.length; i < il; i++) {
      candidate = new File(includePaths[i] + '/' + path);
      if (candidate.exists) return candidate;
    }

    throw ('Include file not found: ' + path + '\n' +
      'Referenced from: ' + file.fsName
    );
  }

  /**
   * @param {string|File} file
   * @param {string} content
   */
  function saveContent(file, content) {
    file = FileEx.getFileObject(file);

    var saveFilePath = options.saveFilePath ||
      file.parent.fsName + '/' + FileEx.getBaseName(file) + '_included.' + FileEx.getExtension(file);

    return FileEx.write(saveFilePath, content);
  }
})();
