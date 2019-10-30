'use strict';

var os = require('os');
var grunt = require('grunt');

var read = os.EOL === '\n' ? grunt.file.read : function(filename) {
  return grunt.file.read(filename).replace(new RegExp(os.EOL, 'g'), '\n');
};

exports.neuterTests = {
  simple_require_statements: function(test) {

    var actual = read('tmp/simple_require_statements');
    var expected = read('test/expected/simple_require_statements');
    test.equal(actual, expected, 'files are combined in correct order');

    test.done();
  },
  simple_require_filepath_transforms: function(test) {

    var actual = read('tmp/simple_require_filepath_transforms');
    var expected = read('test/expected/simple_require_filepath_transforms');
    test.equal(actual, expected, 'files are combined in correct order');

    test.done();
  },
  simple_basepath_options: function(test) {

    var actual = read('tmp/simple_basepath_options');
    var expected = read('test/expected/simple_require_filepath_transforms');
    test.equal(actual, expected, 'files are correctly combined');

    test.done();
  },
  relative_require_statements: function(test) {

    var actual = read('tmp/relative_require_statements');
    var expected = read('test/expected/relative_require_statements');
    test.equal(actual, expected, 'files are correctly combined');

    test.done();
  },
  relative_requires_with_basepath: function(test) {

    var actual = read('tmp/relative_requires_with_basepath');
    var expected = read('test/expected/relative_requires_with_basepath');
    test.equal(actual, expected, 'files are correctly combined');

    test.done();
  },
  custom_separator_options: function(test){

    var actual = read('tmp/custom_separator_options');
    var expected = read('test/expected/custom_separator_options');
    test.equal(actual, expected, 'statment separator can be customized');

    test.done();
  },
  duplicate_require_statements: function(test){

    var actual = read('tmp/duplicate_require_statements');
    var expected = read('test/expected/duplicate_require_statements');
    test.equal(actual, expected, 'duplicate require statemants are ignored');

    test.done();
  },
  circular_require_statements: function(test){

    var actual = read('tmp/circular_require_statements');
    var expected = read('test/expected/circular_require_statements');
    test.equal(actual, expected, 'recursive require statemants are handled');

    test.done();
  },
  respects_code_order_between_requires: function(test){

    var actual = read('tmp/respects_code_order_between_requires');
    var expected = read('test/expected/respects_code_order_between_requires');
    test.equal(actual, expected, 'code order between requires is respected');

    test.done();
  },
  accepts_file_patterns: function(test){

    var actual = read('tmp/accepts_file_patterns');
    var expected = read('test/expected/accepts_file_patterns');
    test.equal(actual, expected, 'file patterns can be correctly read');

    test.done();
  },

  ignores_files_when_told: function(test){

    var actual = read('tmp/ignores_files_when_told');
    var expected = read('test/expected/ignores_files_when_told');
    test.equal(actual, expected, 'ignores files when told');

    test.done();
  },

  do_not_replace_requires_in_statements: function(test){

    var actual = read('tmp/do_not_replace_requires_in_statements');
    var expected = read('test/expected/do_not_replace_requires_in_statements');
    test.equal(actual, expected, 'require() statements in javascript statements are ignored');

    test.done();
  },
  comment_out_require: function(test){

    var actual = read('tmp/comment_out_require');
    var expected = read('test/expected/comment_out_require');
    test.equal(actual, expected, 'single line commented require() statements are ignored');

    test.done();
  },

  require_fail: function(test){
    grunt.util.spawn({grunt: true, args: ['test-require-fail', '--no-color']}, function(err, result, code) {
      test.ok(result.stdout.indexOf('Running "test-require-fail" task\n\nRunning "neuter:require_fail" (neuter) task\nWarning: File not found: file-does-not-exist.js Use --force to continue.\n\nAborted due to warnings.') !== -1, 'Failing require test should fail with warning. Output = ' + JSON.stringify(result.stdout));
      test.done();
    });
  },

  require_fail_force: function(test){
    grunt.util.spawn({grunt: true, args: ['test-require-fail', '--no-color', '--force']}, function(err, result, code) {
      test.ok(result.stdout.indexOf('Running "test-require-fail" task\n\nRunning "neuter:require_fail" (neuter) task\nWarning: File not found: file-does-not-exist.js Used --force, continuing.\n\nDone, but with warnings.') !== -1, 'Failing require test with --force should warn. Output = ' + JSON.stringify(result.stdout));
      test.done();
    });
  },

  glob_require_fail: function(test){
    grunt.util.spawn({grunt: true, args: ['test-glob-require-fail', '--no-color']}, function(err, result, code) {
      test.ok(result.stdout.indexOf('Running "test-glob-require-fail" task\n\nRunning "neuter:glob_require_fail" (neuter) task\n>> No files found at "directory-does-not-exist/*.js".\n\nDone, without errors.') !== -1, 'Failing glob require test should fail with warning. Output = ' + JSON.stringify(result.stdout));
      test.done();
    });
  },

  glob_require: function(test){
    var actual = read('tmp/glob_require');
    var expected = read('test/expected/glob_require');
    test.equal(actual, expected, 'require("glob/*") requires all files in that directory');

    test.done();
  },

  spaces_allowed_within_require_statement: function(test){
    var actual = read('tmp/spaces_allowed_within_require_statement');
    var expected = read('test/expected/spaces_allowed_within_require_statement');
    test.equal(actual, expected, 'spaces work within require statements');

    test.done();
  },
  optional_semicolons: function(test){
    var actual = read('tmp/optional_semicolons');
    var expected = read('test/expected/optional_semicolons');
    test.equal(actual, expected, 'semicolons are optional as long as there\'s a newline');

    test.done();
  },
  optional_dotjs: function(test){
    var actual = read('tmp/optional_dotjs');
    var expected = read('test/expected/optional_dotjs');
    test.equal(actual, expected, 'the .js extension is optional');

    test.done();
  },

  source_maps: function(test) {
    var actualJs = read('tmp/source_maps');
    var actualMap = read('tmp/source_maps.map');
    var expectedJs = read('test/expected/source_maps');
    var expectedMap = read('test/expected/source_maps.map');

    test.equal(actualJs, expectedJs, 'the js includes sourceMap output');
    test.equal(actualMap, expectedMap, 'the map is generated');

    test.done();
  },

  process_as_template: function(test) {
    var actual = read('tmp/process_as_template');
    var expected = read('test/expected/process_as_template');
    test.equal(actual, expected, 'files are processed as templates');

    test.done();
  },

  process_with_function: function(test) {
    var actual = read('tmp/process_with_function');
    var expected = read('test/expected/process_with_function');
    test.equal(actual, expected, 'files are processed with a function');

    test.done();
  }
};
