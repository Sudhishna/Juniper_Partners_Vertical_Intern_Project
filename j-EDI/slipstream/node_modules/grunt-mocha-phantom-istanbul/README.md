# grunt-mocha-phantom-istanbul

> Automatically run *client-side* mocha specs via grunt/mocha/PhantomJS and support tracking code coverage with istanbul.

This is a very slight modification of [grunt-mocha](https://github.com/kmiyashiro/grunt-mocha) which only adds the capability to extract istanbul coverage data, so see [grunt-mocha](https://github.com/kmiyashiro/grunt-mocha) for usage and options.

At this time, only the extraction capability is provided, so it is still dependent on the user to instrument the source files ahead of time with istanbul in order to actually have coverage data tracked when the tests are run.

### Settings

See [grunt-mocha](https://github.com/kmiyashiro/grunt-mocha) for all additional options that it supports.

#### options.coverage

The options for this are specified in the coverage object.

#### options.coverage.jsonReport
Type: `String`
Default: `undefined`

The folder to write a `coverage.json` file to, defaults to no report being generated.

#### options.coverage.htmlReport
Type: `String`
default: `undefined`

Destination folder to write an HTML report to, defaults to no report being generated.

#### options.coverage.coberturaReport
Type: `String`
default: `undefined`

Destination folder to write a `cobertura-coverage.xml` file to, defaults to no report being generated.

#### options.coverage.lcovReport
Type: `String`
default: `undefined`

Destination folder to write a `lcov.info` file to, defaults to no report being generated.

#### options.coverage.cloverReport
Type: `String`
default: `undefined`

Destination folder to write a `clover.xml` file to, defaults to no report being generated.

Example:
```js
mocha: {
  test: {
    files: ['tests/**/*.html'],
    options: {
      coverage: {
        htmlReport: 'coverage/html'
      }
    }
  },
},
```

## TODO
* Add option to instrument the source files on the fly with istanbul so that pre-instrumenting with another task is no longer required.

## License
Licensed under the MIT license.
