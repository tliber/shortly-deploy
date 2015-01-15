module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: [
          // 'app/*/*',
          // 'public/*/*'
          // 'public/client/app.js',
          // 'public/client/link.js',
          // 'public/client/links.js',
          // 'public/client/linkView.js',
          // 'public/client/linksView.js',
          // 'public/client/createLinkView.js',
          'public/client/*.js'
        ],
        dest: 'public/dist/production.js'
      }
    },
    clean: {
      build: {
        src: ["public/dist/production.js",
              "public/dist/production.min.js"]
      }
    },
    uglify: {
      dist: {
        src: 'public/dist/production.js',
        dest:'public/dist/production.min.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          bail : true,
          reporter: 'spec'
        },
        src: ['test/*.js']
      }
    },



    nodemon: {
      dev: {
        script: 'server.js'
      }
    },


    jshint: {
      files: [
        // Add filespec list here
        'test/ServerSpec.js',
        'public/dist/production.js'
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
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-clean');
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
 grunt.registerTask('default', ['test', 'clean','concat','uglify', 'jshint']
  );

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.registerTask('default', ['concat', 'uglify'])
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', function(){
    grunt.task.run(['default']);
    // add your deploy tasks here
  });


};
