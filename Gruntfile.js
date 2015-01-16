module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate
        src: ['public/client/*.js'],
        // the location of the resulting JS file
        dest: 'public/dist/test.js'

      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
          // the banner is inserted at the top of the output
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        dist: {
          files: {
            'public/dist/test.min.js': ['public/dist/test.js']
          }
        }
      },


      jshint: {
        files: [
        'Gruntfiles.js', 'public/client/*.js','dist/*.js',
        ],
        options: {
          force: 'true',
          jshintrc: '.jshintrc',
          ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
          ]
        }
      },

      cssmin: {
        target: {
          files: {
            'public/dist/output.min.css': ['public/style.css']
          }
        }
      },

      clean: {
        build: {
          src: ['public/dist/test.js', 'public/dist/test.min.js','public/dist/output.css']
        }
      },

      watch: {
        scripts: {
          files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
          ],
          tasks: [
          'concat',
          'uglify'
          ]
        },
        css: {
          files: 'public/*.css',
          tasks: ['cssmin']
        }
      },

      shell: {
        prodServer: {
          command: 'git push azure master',
          options: {
            stdout: true,
            stderr: true,
            failOnError: true
          }
        }
      },
    });

grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-mocha-test');
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-nodemon');

grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
     cmd: 'grunt',
     grunt: true,
     args: 'nodemon'
   });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'clean','jshint' ,'mochaTest'
    ]);

  grunt.registerTask('build', [
    'clean','concat','uglify','cssmin'
    ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['shell:prodServer']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', ['test','build', 'upload'
    // add your deploy tasks here
    ]);


};
