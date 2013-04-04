# grunt-neuter

> Concatenate files in the order you `require`.

_Note that this plugin has not yet been released, and only works with the latest bleeding-edge, in-development version of grunt. See the [When will I be able to use in-development feature 'X'?](https://github.com/gruntjs/grunt/wiki/Frequently-Asked-Questions) FAQ entry for more information._

## Getting Started
If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```shell
npm install grunt-neuter --save-dev
```
or for the latest version

```shell
npm install git://github.com/trek/grunt-neuter.git --save-dev
```

Then include the tasks in your project's Gruntfile

```javascript
grunt.loadNpmTasks('grunt-neuter');
```


[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/wiki/Getting-started


## Neuter task
_Run this task with the `grunt neuter` command._

_This task is a [multi task](https://github.com/gruntjs/grunt/wiki/Configuring-tasks) so any targets, files and options should be specified according to the [multi task](https://github.com/gruntjs/grunt/wiki/Configuring-tasks) documentation._

Use a neutering task for

  1. Breaking up a project into files: some applications are easier to reason about
     when their source is divided into files and organzied with directories

  2. Keep intra-project dependency management inline: rather than have to track
     and updated files and their order in a Make/Cake/Rakefile or a JSON object.

  3. Have files separated in debugging, combined in production: When using
     good development tools you want to easily map your debugging efforts to
     a specific file, not read through one giant file.

  4. Not need a dependency management library deployed: for applications
     deployed as a single file the benefits of modular file loaders like
     [require.js](http://requirejs.org/) is minimized.

Neuter is based on the [Rake pipline web-filter of the same name](https://github.com/wycats/rake-pipeline-web-filters)

### Options

### template
Type: `String`

Default: `"(function){ {%= src %} })();"`

The wrapper around your code. Defaults to a closure-style function so locally declared variables
won't leak into the global scope. The text of your source JavaScript file is available as `src`
within a template.

### filepathTransform
Type: `Function`

Default: `function(filepath){ return filepath; }`

Specifying a filepath transform allows you to omit said portion of the filepath from your require statements. For example: when using `filepathTransform: function(filepath){ return 'lib/js/' + filepath; }` in your task options, require("lib/js/file.js") can instead be written as require("file.js").

### includeSourceURL
Type: Boolean`

Default: `false`

Includes the path to your source JavaScript file as `//@ sourceURL="path/to/my/file.js"` for
[nicer debugging](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl). Note that this wraps your source JavaScript file (as a string) with `eval` and should not be used in prouduction.

### separator
Type: `String`

Default: `"\n"`

Neutered files will be joined on this string. If you're post-processing concatenated JavaScript files with a minifier, you may need to use a semicolon `';'` as the separator although the semicolon at the end of the template should suffice.

### skipFiles
Type: `Array`

Default: `[]`

A list of files being required that should not be checked for further require statements.
Useful for libraries that support other module building methods and leave their requires
around in a way that isn't meaningful to neutering.
