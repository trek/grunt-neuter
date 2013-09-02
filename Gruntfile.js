/*
 * grunt-neuter
 *
 * Copyright (c) 2012 Trek Glowacki, contributors.
 * Licensed under the MIT license.
 */


'use strict';

/*
This is the Gruntfule configuration used to develop and test this
grunt task.

When you run
```shell
  grunt
```

from within this project directory, the defualt task will run and

  * jshint your code according to the .jshintrc file.

  * run the `neuter` config below, which will generate a bunch of files
    with varying configuration optiones applied (usually by reading a
    fixture file from `test/fixtures` that incldues require statements)
    writing their output to a tmp directory in this project.

  * run node-unit, which executes any `_test` files in the `test` directory.
    these tests look at the output files generated from running neuter in
    the step above and compare the the ouputting file with a known exepctd file
    kept in `test/expected`.

  * if the test executes without error, the `tmp` directory is removed.
    if it failed, you'll see a notice about why and the `tmp` directory
    will remain for you to inspect.
*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Configurations to be run (and then tested).
    neuter: {
      // Run to test the default simple require options.
      default_options: {
        files: {
          'tmp/simple_require_statements' : ['test/fixtures/simple_require_statements.js']
        }
      },

      // Run to test the default simple require options with a filepath transform.
      filepath_transform_options: {
        files: {
          'tmp/simple_require_filepath_transforms' : ['test/fixtures/simple_require_filepath_transforms.js']
        },
        options: {
          filepathTransform: function(filepath){ return 'test/fixtures/' + filepath; }
        }
      },

      // Run to test the basePath option.
      simple_basepath_options: {
        // NOTE: this uses the filepath transform fixture because it performs the same operation
        files: {
          'tmp/simple_basepath_options' : ['test/fixtures/simple_require_filepath_transforms.js']
        },
        options: {
          basePath: 'test/fixtures/'
        }
      },

      // Run to test relative require statements.
      relative_require_statements: {
        files: {
          'tmp/relative_require_statements' : ['test/fixtures/relative_require_statements.js']
        }
      },

      // Run to test relative require statements in conjunction with the basePath option
      relative_requires_with_basepath: {
        files: {
          'tmp/relative_requires_with_basepath' : ['test/fixtures/relative_requires_with_basepath.js'],
        },
        options: {
          basePath: 'test/fixtures/'
        }
      },

      // Run to test the default simple require options.
      custom_separator_options: {
        files: {
          'tmp/custom_separator_options' : ['test/fixtures/simple_require_statements.js']
        },
        options: {
          separator: '!!!!'
        }
      },

      // Run to test that duplicate require statemtns only write a source file to the
      // destination once.
      duplicate_require_statements: {
        files: {
          'tmp/duplicate_require_statements' : ['test/fixtures/duplicate_require_statements.js']
        }
      },

      // Run to test that circular require statemtns don't infintely loop
      circular_require_statements: {
        files: {
          'tmp/circular_require_statements' : ['test/fixtures/circular_require_statements.js']
        }
      },
      respects_code_order_between_requires: {
        files: {
          'tmp/respects_code_order_between_requires': ['test/fixtures/respects_code_order_between_requires.js']
        }
      },
      accepts_file_patterns: {
        files: {
          'tmp/accepts_file_patterns': ['test/fixtures/glob/*.js']
        }
      },
      ignores_files_when_told: {
        files: {
          'tmp/ignores_files_when_told': ['test/fixtures/ignores_files_when_told.js']
        },
        options: {
          skipFiles: ['test/fixtures/contains_commonjs_require.js']
        }
      },
      do_not_replace_requires_in_statements: {
        files: {
          'tmp/do_not_replace_requires_in_statements': ['test/fixtures/do_not_replace_requires_in_statements.js']
        }
      },
      
      // test that single line commented out require statements are not loaded
      comment_out_require: {
        files: {
          'tmp/comment_out_require': ['test/fixtures/comment_out_require.js']
        }
      },

      // test that a file can require a glob
      glob_require: {
        files: {
          'tmp/glob_require': ['test/fixtures/glob_require.js']
        }
      },
      spaces_allowed_within_require_statement: {
        files: {
          'tmp/spaces_allowed_within_require_statement': ['test/fixtures/spaces_allowed_within_require_statement.js']
        }
      },
      optional_semicolons: {
        files: {
          'tmp/optional_semicolons': ['test/fixtures/optional_semicolons.js']
        }
      },
      optional_dotjs: {
        files: {
          'tmp/optional_dotjs': ['test/fixtures/optional_dotjs.js']
        }
      },
      source_maps: {
        files: {
          'tmp/source_maps': ['test/fixtures/glob_require.js']
        },
        options: {
          includeSourceMap: true
        }
      },
      process_as_template: {
        files: {
          'tmp/process_as_template': ['test/fixtures/process_as_template.js']
        },
        options: {
          process: {
            data: {
              foo: 5,
              bar: 'baz'
            }
          }
        }
      },
      process_with_function: {
        files: {
          'tmp/process_with_function': ['test/fixtures/simple_require.js']
        },
        options: {
          process: function(src, filepath) {
            return '// Source for: ' + filepath + '\n' + src;
          }
        }
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['neuter', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test', 'clean']);

};
