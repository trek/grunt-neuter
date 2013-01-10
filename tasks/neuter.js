/*
 * grunt-neuter
 *
 * Copyright (c) 2012 Trek Glowacki, contributors.
 * Licensed under the MIT license.
 */

'use strict';

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
    var requireSplitter = /(require\([\'||\"].*[\'||\"]\));+\n*/;
    var requireMatcher = /require\([\'||\"](.*)[\'||\"]\)/;

    var options = this.options({
      template: "(function() {\n\n<%= src %>\n\n})();",
      separator: "\n\n",
      includeSourceURL: false
    });

    var finder = function(filepath){
      if (!grunt.file.exists(filepath)) {
        grunt.log.error('Source file "' + filepath + '" not found.');
        return '';
      }

      // once a file has been required its source will 
      // never be written to the resulting destination file again.
      if (required.indexOf(filepath) === -1) {
        required.push(filepath);

        // read the file and split it into code sections
        // these will be either require(...) statements
        // or blocks of code.
        var src = grunt.file.read(filepath);
        var sections = src.split(requireSplitter);
        
        // loop through sections appending to out buffer.
        sections.forEach(function(section){
          if (!section.length) { return; }

          // if the section is a require statement
          // recursively call find again. Otherwise
          // push the code section onto the buffer.
          var match = requireMatcher.exec(section);
          if (match) {
            finder(match[1] + '.js');
          } else {
            out.push({filepath: filepath, src: section});
          }
        });
      }
    };

    // kick off the process. Find code sections, combine them
    // in the correct order by wrapping in the template
    // which defaults to a functional closure.
    this.files.forEach(function(file) {
      grunt.file.expand({nonull: true}, file.src).map(finder, this);
      var outStr = out.map(function(section){
        var templateData = {
          data: section
        };

        if (options.includeSourceURL) {
          return "eval(" + JSON.stringify(grunt.template.process(options.template, templateData) + "//@ sourceURL=" + section.filepath) +")";
        } else {
          return grunt.template.process(options.template, templateData);
        }
      }).join(options.separator);

      grunt.file.write(file.dest, outStr);
    });
  });
};
