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
    var required = [];

    // matches `require('some/path/file');` statements.
    // no need to include a .js as this will be appended for you.
    var requireMatcher = /require\([\'||\"](.*)[\'||\"]\);+/gi;

    var options = this.options({
      template: "(function() {\n<%= text %>\n})();",
      separator: grunt.util.linefeed,
      includeSourceURL: false
    });

    var finder = function(filepath){

      // the bufffer string that appened to over this run. 
      var out = "";

      if (!grunt.file.exists(filepath)) {
        grunt.log.error('Source file "' + filepath + '" not found.');
        return '';
      }

      // once a file has been required it will never be written to
      // the resulting destination file again.
      if (required.indexOf(filepath) === -1) {
        required.push(filepath);
      } else {
        return '';
      }

      var src = grunt.file.read(filepath);

      // an object that will be used as rendering
      // context for the template.
      var templateData = {
        data: {
          // requires are stripped from the file
          // since 'require' doesn't have consistent
          // meaning in browsers.
          text: src.replace(requireMatcher, '')
        }
      };

      // find instances of `require('some/path/to/file')`
      // and recursively call this method again for any
      // referenced files. The source of these files will
      // be appended before writing out the source of
      // the file being processed.
      var matches;
      while ((matches = requireMatcher.exec(src)) != null) {
        var foundRequirePath = matches[1] + ".js";
        out += finder(foundRequirePath);
      }

      if (options.includeSourceURL) {
        // wraps the source of a file in an `eval`ed string followed by
        // a `@ sourceURL` declaration.
        // see http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
        // for why this is handy. 
        out += "eval(" + JSON.stringify(grunt.template.process(options.template, templateData) + "//@ sourceURL=" + filepath) +")";
      } else {
        out += grunt.template.process(options.template, templateData);
      }
      out += options.separator;
      return out;
    };

    // Start the processing by expanding all the files provided to the task
    // iteratre over them calling the finder method defined above.
    // write out the resulting string the destination.
    var outStr = grunt.file.expand({nonull: true}, this.file.srcRaw).map(finder, this);
    grunt.file.write(this.file.dest, outStr);
  });
};
