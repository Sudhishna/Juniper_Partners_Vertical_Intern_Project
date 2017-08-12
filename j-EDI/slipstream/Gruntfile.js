var path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      release: ["dist"],
      deploy: ["deploy"],
      ci: ["*.tap"],
      instrument: ["public/test/instrument"],
      coverage: ["test/coverage/report"]
    },
    env: {
        options: {
               //Shared Options Hash
        },
        dev: {
             build_number : grunt.option('bldno') || 'dev build',
             build_hash : grunt.option('bldhash')  || '',
             build_timestamp : grunt.option('bldtime') || 'dev build',
             build_version: grunt.option('bldversion') || '0.0.1'
        },
    },
    requirejs: {
      ugly: {
        options: {
          baseUrl: 'public/assets/js',
          mainConfigFile: 'public/assets/js/main.js',
          findNestedDependencies: true,
          name: 'main',
          out: 'dist/slipstream/main.min.js',
          optimize: 'uglify',
          // Work around for r.js bug.  See https://github.com/jrburke/requirejs/issues/1342
          onBuildRead: function (id, path, contents) {
              if (id === 'select2') {
                return contents.replace(/define.amd\s*=\s*\{/, 'define.amdTEMP = {'); 
              }
              return contents;
          },
          // Work around for r.js bug.  See https://github.com/jrburke/requirejs/issues/1342
          onBuildWrite: function (id, path, contents) {
              if (id === 'select2') {
                return contents.replace(/define.amdTEMP\s*=\s*\{/, 'define.amd = {'); 
              }
              return contents;
          }
        }
      },

      pretty: {
        options: {
          baseUrl: 'public/assets/js',
          mainConfigFile: 'public/assets/js/main.js',
          findNestedDependencies: true,
          name: 'main',
          out: 'dist/slipstream/main.cat.js',
          optimize: 'none',
          // Work around for r.js bug.  See https://github.com/jrburke/requirejs/issues/1342
          onBuildRead: function (id, path, contents) {
              if (id === 'select2') {
                return contents.replace(/define.amd\s*=\s*\{/, 'define.amdTEMP = {'); 
              }
              return contents;
          },
          // Work around for r.js bug.  See https://github.com/jrburke/requirejs/issues/1342
          onBuildWrite: function (id, path, contents) {
              if (id === 'select2') {
                return contents.replace(/define.amdTEMP\s*=\s*\{/, 'define.amd = {'); 
              }
              return contents; 
          }
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'tgz',
          archive: 'dist/<%= pkg.name %>.tar.gz'
        },
        src: ['dist/**']
      },
      total: {
        options: {
          mode: 'tgz',
          archive: 'dist/<%= pkg.name %>_total.tar.gz'
        },
        src: ['dist/all/**']
      }
    },
    mochaTest: {
      'framework-server-unit-tests': {
        options: {
          reporter: 'spec',
          slow: 1000
        },
        src: ['test/unit/**/*.js']
      },
      'framework-server-functional-tests': {
        options: {
          reporter: 'spec',
          slow: 1000
        },
        src: ['test/functional/**/*.js']
      },
      'ci-framework-server-unit-tests': {
        options: {
          reporter: 'tap',
          captureFile: './framework-server-unit-tests.tap',
          slow: 1000
        },
        src: ['test/unit/**/*.js']
      },
      'ci-framework-server-functional-tests': {
        options: {
          reporter: 'tap',
          captureFile: './framework-server-functional-tests.tap',
          slow: 1000
        },
        src: ['test/functional/**/*.js']
      }
    },
    blanket_mocha: {
      test: {
        src: ["public/test/testRunnerIndex.html"]
      },
      options: {
        threshold: 90,
        run: false,
        reporter: 'List',
        bail: false,
        log: true,
        logErrors: true,
        excludedFiles: [
          "public/assets/js/vendor/"
        ],
        modulePattern: "./public/assets/js/(.*?)/"
      }
    },
    express: {
      slipstream: {
        options: {
          port: 3000,
          bases: path.resolve('public'),
          server: path.resolve('./app')
        }
      }
    },
    mocha_phantomjs: {
      all: {
        options: {
          reporter: 'spec',
          timeout: 60000,
          urls: ['http://localhost:3000/test/testRunnerIndex.html']
        }
      },
      ci: {
        options: {
          reporter: 'tap',
          timeout: 60000,
          output: './framework-client-unit-tests.tap',
          urls: ['http://localhost:3000/test/testRunnerIndex.html']
        }
      }
    },
    // Uni-test coverage Istanbul integration.    
    instrument: {
        files : ['public/assets/js/widgets/**/*.js', 
                 'public/assets/js/lib/**/*.js', 
                 'public/assets/js/modules/**/*.js', 
                 'public/assets/js/entities/**/*.js',
                 'public/assets/js/sdk/**/*.js',
                 'public/assets/js/apps/**/*.js'
                 ],
        options : {    	  
          lazy : true,
          log: true,
          basePath : 'public/test/instrument/'
        }
    },
    connect: {
      server: {
        options: {
          port: 3000,
          base: 'public',
        },
      },
    },
    mocha: {
      test: {
        options: {
          urls: ['http://localhost:3000/test/codeCoverage.html'],
          reporter: 'Spec',
          log: true,
          logErrors: true,
          coverage: {
            jsonReport: 'test/results/coverage/json',
            htmlReport: 'test/results/coverage/html'
          }
        },
        dest: 'test/results/report/spec.out'
      }
    },    
    retire: {
      js: ['public/assets/js/vendor/**'],
      node: ['node_modules/*'],
      options: {
        verbose: false,
        ignore: 'public/assets/js/vendor/MutationObserver.js/test,public/assets/js/vendor/blanket/test,public/assets/js/vendor/hogan.js/test,public/assets/js/vendor/modernizr/test'
      }
    },
    watch: {
      jsFiles: {
        files: ['lib/**/*.js', 'modules/**/*.js', 'routes/**/*.js', 'test/**/*.js', 'public/assets/js/**/*.js', 'public/assets/test/**/*.js', '!public/assets/js/vendor/**/*.js'],
        tasks: ['mochaTest:framework-server-unit-tests', 'mochaTest:framework-server-functional-tests', 'express:slipstream', 'mocha']
      }
    },
    sass: {
      options: {
        style: 'expanded',
        trace: 'true'
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'public/assets/css/',
          src: ['app.scss'],
          dest: 'dist/slipstream/stylesheets/',
          ext: '.css'
        }]
      },
      inplace: {
        files: [{
          expand: true,
          cwd: 'public/assets/css/',
          src: ['app.scss'],
          dest: 'public/assets/css/',
          ext: '.css'
        }]
      }
    },
    cssmin: {
      css: {
        src: 'dist/slipstream/stylesheets/app.css',
        dest: 'dist/slipstream/stylesheets/app.min.css'
      }
    },
    copy: {      
      assetsfiles: {
        files: [{
          src: ['public/assets/js/**', 
                '!public/assets/js/vendor/**', 
                '!public/assets/js/widgets/**/*.js', 
                '!public/assets/js/lib/**/*.js', 
                '!public/assets/js/modules/**/*.js', 
                '!public/assets/js/entities/**/*.js',
                '!public/assets/js/sdk/**/*.js',
                '!public/assets/js/apps/**/*.js'
          ],
          dest: 'public/test/instrument',
          expand: true          
        }]
      },
      sdk: {
        files: [
          {
            src: ['app.js', 'package.json', 'public/**', 'README.md', 'scripts/**', 'modules/**', 'routes/**', 'lib/**', 'views/**', 'node_modules/**'],
            dest: 'dist/sdk/',
            expand:true,
            filter: function(filepath) {
              // add plugins directory:          
              if(filepath.match('public/assets/js/sdk')){
                return true;
              }
              
              return false;
            }
          }
        ]
      },
      minified: {
        files: [
          {
            src: ['app.js', 'package.json', 'public/**', 'README.md', 'scripts/**', 'modules/**', 'routes/**', 'lib/**', 'views/**', 'node_modules/**'],
            dest: 'dist/mini/',
            expand:true,
            filter: function(filepath) {
              return true;
              var doNotSkip = true;
              // add plugins directory:
              if(filepath.match('test')){
                return true;
              }
              if(filepath.match('public/assets/js/apps')){
                return false;
              }
              if(filepath.match('public/assets/js/fake_data')){
                return false;
              }
              if(filepath.match('public/assets/js/modules')){
                return false;
              }
              if(filepath.match('public/assets/js/views')){
                return false;
              }
              if(filepath.match('public/assets/js/entities')){
                return false;
              }              
              if(filepath.match('public/assets/js/sdk')){
                return false;
              }
              if(filepath.match('public/assets/js/widgets')){
                return false;
              }
              return doNotSkip;
            }
          },
          {
            nonull: true,
            expand:true,
            src: ['main.js'],
            dest: 'dist/mini/public/assets/js/',
            cwd: 'public/assets/js',
            rename: function(dest, src) {
               var newPath = dest + "/" + src.replace('main.js', 'main.debug.js');
               return newPath;
            }
          },           
          {
            nonull: true,
            expand:true,
            src: ['main.min.js'],
            dest: 'dist/mini/public/assets/js/',
            cwd: 'dist/slipstream',
            rename: function(dest, src) {
               var newPath = dest + "/" + src.replace('main.min.js', 'main.js');
               return newPath;
            }
          }         
        ]
      },
      widgetlib: {
          files: [
              {
                  src: ['js/vendor/**', 'js/modules/i18n.js', 'js/modules/template_renderer.js', 'js/modules/view_adapter.js', 'js/lib/**', 'js/widgets/**', 'js/sdk/preferences.js', 'nls/**'],
                  dest: 'dist/widgetlib/',
                  expand:true,
                  cwd: 'public/assets'
              },
              {
                  src: ['build-info.json'],
                  dest: 'dist/widgetlib',
                  expand:true,
                  cwd: 'public/assets/js'
              },
              {
                  src: ['css/app.css'],
                  dest: 'dist/widgetlib',
                  rename: function(dest, src) {
                      return dest + "/" + src.replace(/app/, "slipstream"); 
                  },
                  expand:true,
                  cwd: 'public/assets'
              },
              {
                  src: ['js/Slipstream_widgetlib.js'],
                  dest: 'dist/widgetlib',
                  rename: function(dest, src) {
                      return dest + "/" + src.replace(/Slipstream_widgetlib/, "slipstream"); 
                  },
                  expand:true,
                  cwd: 'public/assets'
              },
              {
                  src: ['assets/images/**'],
                  dest: 'dist/widgetlib',
                  expand:true,
                  cwd: 'public'
              }
          ]
      }
    },
    jsdoc: {
      client: {
        src: ['public/assets/js/**/*.js', 'public/test/**/*.js', '!public/assets/js/vendor/**/*.js'],
        options: {
          destination: 'dist/documentation/api/client/'
        }
      },
      server: {
        src: ['lib/**/*.js', 'modules/**/*.js', 'routes/**/*.js'],
        options: {
          destination: 'dist/documentation/api/server/'
        }
      }
    },
    'exec': {
      deploy: {
        command: 'cd deploy && npm install && chmod +x scripts/launch_server.sh && npm start'
      },
      chgperm: {
         command: 'cd dist && find . -name \'*.sh\' | xargs chmod +x'
      },
      tarpkg:{
          command: 'tar cfz ./<%= pkg.name %>.tar.gz dist/*'
      },
      tarwidgets:{
          command: 'tar cfz ./slipstream_widgetlib.tar.gz dist/widgetlib/*'
      }
    },
    svg_sprite : {
        basic: {
            expand : true,
            cwd : 'public/assets/images',
            src : ['icon_*.svg'],
            dest : 'public/assets',
            options : {
                mode : {
                  view: {
                       bust: false,
                       render: {
                           scss: true
                       },
                       dest: 'css',
                       sprite: '../images/icon-sprite.svg',
                       prefix: '.%s'
                  }
                }
            }
        }
    }
  });

  // Load the plugin that provides the requirejs optimization task
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-writefile');
  
  // Plugin to launch a server
  grunt.loadNpmTasks('grunt-express');

  // Plugins related to testing
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks("grunt-blanket-mocha");
  
  // Plugins related to code coverage
  grunt.loadNpmTasks('grunt-mocha');  
  grunt.loadNpmTasks('grunt-istanbul');
  grunt.loadNpmTasks("grunt-mocha-phantom-istanbul");

  // Plugin for watch
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Sass plugin
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  
  // Misc plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Doc related plugin
  grunt.loadNpmTasks('grunt-jsdoc');

  // exec plugin
  grunt.loadNpmTasks('grunt-exec');

  // third-party code checks against 
  grunt.loadNpmTasks('grunt-nsp-package');  // task: validate-package
  grunt.loadNpmTasks('grunt-retire');       // tasks: retire, retire:js, retire:node 

  grunt.loadNpmTasks('grunt-svg-sprite');

  // Register test related tasks
  grunt.registerTask('framework-server-unit-tests', ['mochaTest:framework-server-unit-tests']);
  grunt.registerTask('ci-framework-server-unit-tests', ['mochaTest:ci-framework-server-unit-tests']);  
  
  grunt.registerTask('framework-server-functional-tests', ['mochaTest:framework-server-functional-tests']);
  grunt.registerTask('ci-framework-server-functional-tests', ['mochaTest:ci-framework-server-functional-tests']);

  grunt.registerTask('framework-client-unit-tests', ['express:slipstream', 'mocha_phantomjs:all']);
  grunt.registerTask('ci-framework-client-unit-tests', ['express:slipstream', 'mocha_phantomjs:ci']);  

  grunt.registerTask('unit-tests', ['mochaTest:framework-server-unit-tests', 'framework-client-unit-tests' /*, 'blanket_mocha'*/ ]);
  grunt.registerTask('ci-unit-tests', ['mochaTest:ci-framework-server-unit-tests', 'ci-framework-client-unit-tests' /*, 'blanket_mocha'*/ ]);
  grunt.registerTask('functional-tests', ['mochaTest:framework-server-functional-tests']);
  grunt.registerTask('ci-functional-tests', ['mochaTest:ci-framework-server-functional-tests']);

  grunt.registerTask('server-tests', ['mochaTest:framework-server-unit-tests', 'mochaTest:framework-server-functional-tests']);
  grunt.registerTask('client-tests', ['framework-client-unit-tests' /*, 'blanket_mocha'*/ ]);

  grunt.registerTask('ci-server-tests', ['mochaTest:ci-framework-server-unit-tests', 'mochaTest:ci-framework-server-functional-tests']);
  grunt.registerTask('ci-client-tests', ['ci-framework-client-unit-tests' /*, 'blanket_mocha'*/ ]);


  grunt.registerTask('tests', ['server-tests', 'client-tests']);

  grunt.registerTask('ci-tests', ['ci-server-tests', 'ci-client-tests']);
  
  // Register code coverage task
  grunt.registerTask('code-coverage', [/*'express:slipstream', */'copy:assetsfiles', 'instrument', 'mocha:test', 'clean:instrument']);

  // Register task for launching server
  grunt.registerTask('slipstream', ['express:slipstream', 'express-keepalive']);
  
  //Build Task
   grunt.registerTask('createbldinfo', 'Creating build information file', function(arg) {
    grunt.log.write("Build_Number is " );
    grunt.log.write(grunt.config('env')['dev']['build_number']);
    grunt.log.write('\r\n');
    grunt.log.write("Build_Timestamp is " );
    grunt.log.write(grunt.config('env')['dev']['build_timestamp']);
    grunt.log.write('\r\n');
    grunt.log.write("Build_Hash is " );
    grunt.log.write(grunt.config('env')['dev']['build_hash']);
    grunt.log.write('\r\n');
    grunt.log.write("Build_Version is " );
    grunt.log.write(grunt.config('env')['dev']['build_version']);
    grunt.log.write('\r\n');
    var info = '{\r\n"build_number": ',
        outfile = "public/assets/js/build-info.json";
    info += '"' + grunt.config('env')['dev']['build_number'] + '"';
    info += ',\r\n';
    info += '"build_timestamp": ';
    info += '"' + grunt.config('env')['dev']['build_timestamp'] + '"';
    info += ',\r\n';
    info += '"build_hash": ';
    info += '"' + grunt.config('env')['dev']['build_hash'] + '"';
    info += ',\r\n';
    info += '"build_version": ';
    info += '"' + grunt.config('env')['dev']['build_version'] + '"';
    info += '\r\n}';
    grunt.file.write( outfile, [info] );
   });


  // Aggregate tasks
  // default task
  grunt.registerTask('default', ['clean', 'svg_sprite', 'sass', 'cssmin', 'requirejs', 'tests', 'copy']);

  // jenkins task
  grunt.registerTask('jenkins', ['clean', 'svg_sprite', 'sass', 'cssmin', 'requirejs' /*,'jsdoc'*/]); 

  // Nodespog task
  grunt.registerTask('nodespog', ['exec:chgperm', 'exec:tarpkg', 'exec:tarwidgets']);
  
  // perform checks for retired or vulnerable js-files or npm packages (third-party/open-source code)
  grunt.registerTask('check-thirdparty', ['validate-package', 'retire']);

  // Build task
  grunt.registerTask('build-all', ['ci-framework-server-unit-tests', 'mochaTest:ci-framework-server-functional-tests', 'ci-framework-client-unit-tests', 'jenkins']);
  
  // perform a full build.  An archived file of the entire dist folder will be created.
  grunt.registerTask('full', ['clean', 'svg_sprite', 'sass', 'cssmin', 'requirejs', 'tests', /*'jsdoc',*/ 'copy', 'compress']);

  // perform a build - no need to generate an uglified version of the js file.
  grunt.registerTask('dev', ['clean', 'svg_sprite', 'sass:inplace', 'requirejs:pretty']);

  // perform a build where the artifacts can be tested and validated after uglifying.
  grunt.registerTask('buildAllDist', ['clean',  'svg_sprite', 'sass', 'cssmin', 'requirejs', 'copy', 'compress']);
  grunt.registerTask('buildMinified', ['clean', 'svg_sprite', 'sass', 'cssmin', 'requirejs:ugly', 'copy:minified']);
};
