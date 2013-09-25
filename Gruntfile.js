var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};


module.exports = function(grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var appConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    config: appConfig,

    watch: {
      compass: {
        files: ['<%= config.app %>/stylesheets/**/*.{scss,sass}'],
        tasks: ['compass:server']
      },
      styles: {
        files: ['<%= config.app %>/stylesheets/**/*.css'],
        tasks: ['copy:styles']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= config.app %>/*.html',
          '.tmp/stylesheets/**/*.css',
          '{.tmp,<%= config.app %>}/javascripts/**/*.js',
          '<%= config.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },


    clean: {
      dist: {
        files:[{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },


    compass: {
      options: {
        sassDir: '<%= config.app %>/stylesheets',
        cssDir: '.tmp/stylesheets',
        generatedImagesDir: '<%= config.app %>/images',
        imagesDir: '<%= config.app %>/images',
        javascriptsDir: '<%= config.app %>/javascripts',
        fontsDir: '<%= config.app %>/stylesheets/fonts',
        importPath: '<%= config.app %>/bower',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images',
        httpFontsPath: '/stylesheets/fonts',
        relativeAssets: false
      },
      dist: {
        options: {
          generatedImagesDir: '<%= config.dist %>/images'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: '<%= config.app %>/index.html'
    },

    usemin: {
      options: {
        dirs: ['<%= config.dist %>']
      },
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/stylesheets/{,*/}*.css']
    },

    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, appConfig.dist)
            ];
          }
        }
      }
    },

    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },

    rev: {
      dist: {
        files: {
          src: [
            '<%= config.dist %>/javascripts/{,*/}*.js',
            '<%= config.dist %>/stylesheets/{,*/}*.css',
            '<%= config.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%= config.dist %>/stylesheets/fonts/{,*/}*.*'
          ]
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          src: '*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/{,*/}*.{webp,gif}',
            'stylesheets/fonts/{,*/}*.*'
          ]
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/stylesheets',
        dest: '.tmp/stylesheets',
        src: '{,*/}*.css'
      }
    },

    concurrent: {
      server: [
        'compass',
        'copy:styles'
      ],
      dist: [
        'compass',
        'copy:styles',
        // 'imagemin',
        // 'svgmin',
        'htmlmin'
      ]
    },
  });


  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
        'clean:server',
        'concurrent:server',
        'connect:livereload',
        'open',
        'watch'
      ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'rev',
    'usemin'
  ]);

};
