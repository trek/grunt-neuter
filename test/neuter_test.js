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
  custom_separator_options: function(test){

    var actual = grunt.file.read('tmp/custom_separator_options');
    var expected = grunt.file.read('test/expected/custom_separator_options');
    test.equal(actual, expected, 'statment separator can be customized');

    test.done();
  },
  custom_source_url_inclusion_option: function(test){

    var actual = grunt.file.read('tmp/custom_source_url_inclusion_option');
    var expected = grunt.file.read('test/expected/custom_source_url_inclusion_option');
    test.equal(actual, expected, '@ sourceURL can be included for debugging');

    test.done();
  },
  requires_are_only_included_once: function(test){

    var actual = grunt.file.read('tmp/custom_source_url_inclusion_option');
    var expected = grunt.file.read('test/expected/custom_source_url_inclusion_option');
    test.equal(actual, expected, '@ sourceURL can be included for debugging');

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
  can_accept_file_patterns: function(test){

    var actual = grunt.file.read('tmp/can_accept_file_patterns');
    var expected = grunt.file.read('test/expected/can_accept_file_patterns');
    test.equal(actual, expected, 'file patterns can be correctly read');

    test.done();
  }
};
