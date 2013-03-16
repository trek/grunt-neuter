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
  }
  
};
