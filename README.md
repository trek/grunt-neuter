# grunt-neuter [![Build Status](https://travis-ci.org/trek/grunt-neuter.png)](https://travis-ci.org/trek/grunt-neuter)


> Concatenate files in the order you `require`.

## Archive Notice
Although grunt is still alive as a task runner, changes over the years have removed the need for this library:

* People generally have moved to gulp, webpack, or other tools for package building.
* While `require` is still used heavily, the future is clearly `import`.

This repo and published npm package remain for older projects, but this repo is archived. 

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

_This task is a [multi task][] so any targets, files and options should be specified according to the [multi task][] documentation._

[multi task]: http://gruntjs.com/configuring-tasks

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

## Example
Given the following files:

`a.js`
```javascript
require('b');

var myVariable = 'hello';
```

`b.js`
```javascript
var variableFromB = 'b';
window.availableEverywhere = true;
```

Resulting output would be

```javascript
(function(){
  var variableFromB = 'b';
  window.availableEverywhere = true;
})();

(function(){

  var myVariable = 'hello';
})();
```

## Relative Paths
Relative paths using a dot to indicate the file's current directory are valid as well:

`a.js`
```javascript
require('dir/b');

var variableFromA = 'a';
```

`dir/b.js`
```javascript
require('./c');

var variableFromB = 'b';
```

`dir/c.js`
```javascript
var variableFromC = 'c';
```

Outputs

```javascript
(function(){
  var variableFromC = 'c';
})();

(function(){

  var variableFromB = 'b';
})();

(function(){

  var variableFromA = 'a';
})();
```

Note that directory traversal using `../` is **not** supported.

## Example Gruntfile Use
```javascript
grunt.initConfig({
  neuter: {
    application: {
      src: 'tmp/application.js',
      dest: 'app/index.js'
    }
  }
});
```

or

```javascript
grunt.initConfig({
  neuter: {
      'tmp/application.js' :'app/index.js'
  }
});
```



### Options

### template
Type: `String`

Default: `"(function){ {%= src %} })();"`

The wrapper around your code. Defaults to a closure-style function so locally declared variables
won't leak into the global scope. The text of your source JavaScript file is available as `src`
within a template.

### basePath
Type: `String`

Default: `""`

Specifying a base path allows you to omit said portion of the filepath from your require statements. For example: when using `basePath: "lib/js/"` in your task options, `require("lib/js/file.js");` can instead be written as `require("file.js");`. Note that the trailing slash *must* be included.

### filepathTransform
Type: `Function`

Default: `function(filepath){ return filepath; }`

Specifying a filepath transform allows you to control the path to the file that actually gets concatenated. For example, when using `filepathTransform: function(filepath){ return 'lib/js/' + filepath; }` in your task options, `require("lib/js/file.js");` can instead be written as `require("file.js");` (This achieves the same result as specifying `basePath: "lib/js/"`). When used in conjunction with the `basePath` option, the base path will be prepended to the `filepath` argument and a second argument will be provided that is the directory of the file **without** the `basePath`.

### includeSourceMap
Type: `Boolean`

Default: `false`

Generates a source map for your JavaScript file using the [Mozilla source map generator](https://github.com/mozilla/source-map). Appends `//@ sourceMappingURL=my-file.js.map`, and drops a file named my-file.js.map in the same directory as the original.

Unlike the previous sourceURL support, this *can* be used in production, because it becomes up to the client to do something about the source map or not (e.g. Firefox doesn't use them by default, though Chrome currently appears to always download the source map file).

Note: this does _not_ generate named mappings (e.g. this will generate warnings if you're feeding it into [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify) via the `sourceMapIn` option).

### separator
Type: `String`

Default: `"\n\n"`

Neutered files will be joined on this string. If you're post-processing concatenated JavaScript files with a minifier, you may need to use a semicolon `';'` as the separator although the semicolon at the end of the template should suffice.

### skipFiles
Type: `Array`

Default: `[]`

A list of files being required that should not be checked for further require statements.
Useful for libraries that support other module building methods and leave their requires
around in a way that isn't meaningful to neutering.

### process
Type: `Boolean` `Object` `Function` Default: `false`

Process source files before concatenating, either as [templates](https://github.com/gruntjs/grunt/wiki/grunt.template) or with a custom function (similar to [grunt-contrib-concat](https://github.com/gruntjs/grunt-contrib-concat)). When using grunt for templating, the delimiters default to neuter's own special type (`{% %}`), which helps avoid errors when requiring libraries like [Underscore](http://underscorejs.org/) or [Lo-Dash](http://lodash.com/).

* `false` - No processing will occur.
* `true` - Process source files using [grunt.template.process][] without any data.
* `options` object - Process source files using [grunt.template.process][], using the specified options.
* `function(src, filepath)` - Process source files using the given function, called once for each file. The returned value will be used as source code.

_(Default processing options are explained in the [grunt.template.process][] documentation)_

  [grunt.template.process]: https://github.com/gruntjs/grunt/wiki/grunt.template#grunttemplateprocess
