'use strict';

var grunt = require('grunt');

exports.neuterTests = {
  simple_require_statements: function(test) {

    var actual = grunt.file.read('tmp/simple_require_statements');
    var expected = grunt.file.read('test/expected/simple_require_statements');
    test.equal(actual, expected, 'files are combined in correct order');

    test.done();
  },
  simple_require_filepath_transforms: function(test) {

    var actual = grunt.file.read('tmp/simple_require_filepath_transforms');
    var expected = grunt.file.read('test/expected/simple_require_filepath_transforms');
    test.equal(actual, expected, 'files are combined in correct order');

    test.done();
  },
  simple_basepath_options: function(test) {

    var actual = grunt.file.read('tmp/simple_basepath_options');
    var expected = grunt.file.read('test/expected/simple_require_filepath_transforms');
    test.equal(actual, expected, 'files are correctly combined');

    test.done();
  },
  relative_require_statements: function(test) {

    var actual = grunt.file.read('tmp/relative_require_statements');
    var expected = grunt.file.read('test/expected/relative_require_statements');
    test.equal(actual, expected, 'files are correctly combined');

    test.done();
  },
  relative_requires_with_basepath: function(test) {

    var actual = grunt.file.read('tmp/relative_requires_with_basepath');
    var expected = grunt.file.read('test/expected/relative_requires_with_basepath');
    test.equal(actual, expected, 'files are correctly combined');

    test.done();
  },
  custom_separator_options: function(test){

    var actual = grunt.file.read('tmp/custom_separator_options');
    var expected = grunt.file.read('test/expected/custom_separator_options');
    test.equal(actual, expected, 'statment separator can be customized');

    test.done();
  },
  duplicate_require_statements: function(test){

    var actual = grunt.file.read('tmp/duplicate_require_statements');
    var expected = grunt.file.read('test/expected/duplicate_require_statements');
    test.equal(actual, expected, 'duplicate require statemants are ignored');

    test.done();
  },
  circular_require_statements: function(test){

    var actual = grunt.file.read('tmp/circular_require_statements');
    var expected = grunt.file.read('test/expected/circular_require_statements');
    test.equal(actual, expected, 'recursive require statemants are handled');

    test.done();
  },
  respects_code_order_between_requires: function(test){

    var actual = grunt.file.read('tmp/respects_code_order_between_requires');
    var expected = grunt.file.read('test/expected/respects_code_order_between_requires');
    test.equal(actual, expected, 'code order between requires is respected');

    test.done();
  },
  accepts_file_patterns: function(test){

    var actual = grunt.file.read('tmp/accepts_file_patterns');
    var expected = grunt.file.read('test/expected/accepts_file_patterns');
    test.equal(actual, expected, 'file patterns can be correctly read');

    test.done();
  },

  ignores_files_when_told: function(test){

    var actual = grunt.file.read('tmp/ignores_files_when_told');
    var expected = grunt.file.read('test/expected/ignores_files_when_told');
    test.equal(actual, expected, 'ignores files when told');

    test.done();
  },

  do_not_replace_requires_in_statements: function(test){

    var actual = grunt.file.read('tmp/do_not_replace_requires_in_statements');
    var expected = grunt.file.read('test/expected/do_not_replace_requires_in_statements');
    test.equal(actual, expected, 'require() statements in javascript statements are ignored');

    test.done();
  },
  comment_out_require: function(test){

    var actual = grunt.file.read('tmp/comment_out_require');
    var expected = grunt.file.read('test/expected/comment_out_require');
    test.equal(actual, expected, 'single line commented require() statements are ignored');

    test.done();
  },

  glob_require: function(test){
    var actual = grunt.file.read('tmp/glob_require');
    var expected = grunt.file.read('test/expected/glob_require');
    test.equal(actual, expected, 'require("glob/*") requires all files in that directory');

    test.done();
  },

  spaces_allowed_within_require_statement: function(test){
    var actual = grunt.file.read('tmp/spaces_allowed_within_require_statement');
    var expected = grunt.file.read('test/expected/spaces_allowed_within_require_statement');
    test.equal(actual, expected, 'spaces work within require statements');

    test.done();
  },
  optional_semicolons: function(test){
    var actual = grunt.file.read('tmp/optional_semicolons');
    var expected = grunt.file.read('test/expected/optional_semicolons');
    test.equal(actual, expected, 'semicolons are optional as long as there\'s a newline');

    test.done();
  },
  optional_dotjs: function(test){
    var actual = grunt.file.read('tmp/optional_dotjs');
    var expected = grunt.file.read('test/expected/optional_dotjs');
    test.equal(actual, expected, 'the .js extension is optional');

    test.done();
  },

  source_maps: function(test) {
    var actualJs = grunt.file.read('tmp/source_maps');
    var actualMap = grunt.file.read('tmp/source_maps.map');
    var expectedJs = grunt.file.read('test/expected/source_maps');
    var expectedMap = grunt.file.read('test/expected/source_maps.map');

    test.equal(actualJs, expectedJs, 'the js includes sourceMap output');
    test.equal(actualMap, expectedMap, 'the map is generated');

    test.done();
  },

  process_as_template: function(test) {
    var actual = grunt.file.read('tmp/process_as_template');
    var expected = grunt.file.read('test/expected/process_as_template');
    test.equal(actual, expected, 'files are processed as templates');

    test.done();
  },

  process_with_function: function(test) {
    var actual = grunt.file.read('tmp/process_with_function');
    var expected = grunt.file.read('test/expected/process_with_function');
    test.equal(actual, expected, 'files are processed with a function');

    test.done();
  }
};
