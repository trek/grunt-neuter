/*
 * grunt-neuter
 *
 * Copyright (c) 2012 Trek Glowacki, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var glob = require("glob");
var path = require("path");

var SourceNode = require('source-map').SourceNode;
var SourceMapGenerator = require('source-map').SourceMapGenerator;
var SourceMapConsumer = require('source-map').SourceMapConsumer;

module.exports = function(grunt) {
  grunt.registerMultiTask('neuter', 'Concatenate files in the order you require', function() {
    // track required files for this task.
    // once a file has been required it will be added to this array
    // which will be checked before attempting to add a file.
    // each file can be required only once.
    var required = [];

    // the bufffer that we appened to over this run.
    var out = [];

    // matches `require('some/path/file');` statements.
    // no need to include a .js as this will be appended for you.
    var requireSplitter = /^\s*(require\(\s*[\'||\"].*[\'||\"]\s*\));*\n*/m;
    var requireMatcher = /^require\(\s*[\'||\"](.*?)(?:\.js)?[\'||\"]\s*\)/m;

    // add mustache style delimiters
    grunt.template.addDelimiters('neuter', '{%', '%}');

    var options = this.options({
      basePath: '',
      filepathTransform: function(filepath){ return filepath; },
      template: "(function() {\n\n{%= src %}\n\n})();",
      separator: "\n\n",
      includeSourceMap: false,
      skipFiles: [],
      process: false
    });

    // process, but with no data
    if (options.process === true) {
      options.process = {};
    }

    // default to using 'neuter' style templates for processing
    // (this avoids issues with requiring underscore or lodash)
    if (grunt.util.kindOf(options.process) === 'object') {
      options.process.delimiters = options.process.delimiters || 'neuter';
    }

    // a poor man's Set
    var skipFiles = {};
    options.skipFiles.forEach(function(file){
      skipFiles[file] = true;
    });

    var finder = function(globPath){
      var files = glob.sync(globPath, {});
      if (!files) {
        grunt.log.error('No files found at "' + globPath + '".');
        return '';
      }
      files.forEach(function(filepath) {
        // save the file's directory without the 'basePath' prefix
        var dirname = (path.dirname(filepath) + '/').replace(options.basePath, '');

        // create an absolute path to the file and prepend the 'basePath'
        var normalizePath = function(path) {
          return options.basePath + path.replace(/^\.\//, dirname) + '.js';
        };

        // once a file has been required its source will
        // never be written to the resulting destination file again.
        if (required.indexOf(filepath) === -1) {
          required.push(filepath);

          var src = grunt.file.read(filepath);

          // process file as a template if specified
          if (typeof options.process === 'function') {
            src = options.process(src, filepath);
          } else if (options.process) {
            src = grunt.template.process(src, options.process);
          }

          // if a file should not be nuetered
          // it is part of the skipFiles option
          // and is simply included
          if (skipFiles[filepath]) {
            out.push({filepath: filepath, src: src});
          } else {
            // split the source into code sections
            // these will be either require(...) statements
            // or blocks of code.
            var sections = src.split(requireSplitter);

            // loop through sections appending to out buffer.
            sections.forEach(function(section){
              if (!section.length) { return; }

              // if the section is a require statement
              // recursively call find again. Otherwise
              // push the code section onto the buffer.
              // apply the filepathTransform for matched files.
              var match = requireMatcher.exec(section);
              if (match) {
                finder(options.filepathTransform(normalizePath(match[1]), dirname));
              } else {
                out.push({filepath: filepath, src: section});
              }
            });
          }
        }
      });
    };

    // kick off the process. Find code sections, combine them
    // in the correct order by wrapping in the template
    // which defaults to a functional closure.

		// source map support adapted from Koji NAKAMURA's grunt-concat-sourcemap
		// https://github.com/kozy4324/grunt-concat-sourcemap
    this.files.forEach(function(file) {
      grunt.file.expand({nonull: true}, file.src).map(finder, this);

			var sourceNode = new SourceNode(null, null, null);

			out = out.map(function(section) {
				return {
					src: grunt.template.process(options.template, {data: section, delimiters: 'neuter'}),
					filepath: section.filepath
				};
			});

      // test if template block has newlines to offset against
      var m, n;
      if (m = options.template.match(/([\S\s]*)(?={%= src %})/)) {
        var beforeOffset = m[0].split("\n").length - 1;
      }
      if (n = options.template.match(/{%= src %}([\S\s]*)/)) {
        var afterOffset = n[1].split("\n").length - 1;
      }

			for (var i = 0; i < out.length; i++) {
				var src = out[i].src;

				// split on newline and re-add
				var chunks = src.split('\n');
				for (var j=0; j < chunks.length - 1; j++) {
					chunks[j] = chunks[j] + '\n';
				}

        // Lines that map to their original file are added as SourceNodes
        // (with line data). Others are added as dataless chunks.
        for (var k=0; k < chunks.length; k++) {
          var line = chunks[k];
          if (k > beforeOffset && k < chunks.length - afterOffset) {
            sourceNode.add(new SourceNode(k + 1 - beforeOffset, 0, out[i].filepath, line));
          }
          else {
            sourceNode.add(line);
          }
				};

        // If this isn't the last file, add the separator as a dataless
        // chunk.
				if (i != out.length - 1) {
					sourceNode.add(options.separator);
				}
			}

			if (options.includeSourceMap) {
				var mapFilePath = file.dest.split('/').pop() + '.map';
				sourceNode.add('//@ sourceMappingURL=' + mapFilePath);
			}

			var codeMap = sourceNode.toStringWithSourceMap({
				file: file.dest,
				sourceRoot: options.sourceRoot
			});

			grunt.file.write(file.dest, codeMap.code);

			if (options.includeSourceMap) {
				var generator = SourceMapGenerator.fromSourceMap(new SourceMapConsumer(codeMap.map.toJSON()));
				var newSourceMap = generator.toJSON();
				newSourceMap.file = path.basename(newSourceMap.file);
				grunt.file.write(file.dest + ".map", JSON.stringify(newSourceMap, null, '  '));
			}
    });
  });
};
