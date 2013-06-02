module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine : {
      src : 'test/index.html',
      options : {
        specs : 'test/spec/**/*.js'
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/spec/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    watch: {
      files: ['./src/**/*.js', './src/**/*.html'],
      tasks: 'default'
    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          './style/guides.css': './style/guides.scss'
        }
      },
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          './style/guides.css': './style/guides.scss'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('watch', ['watch']);
  grunt.registerTask('sass', ['sass']);
  grunt.registerTask('server', 'Start and hold a web server open.', function() {
    var done = this.async();
    grunt.log.writeln('Starting web server on port 3502.');
    require('./lib/server.js').listen(3502).on('close', done);
  });
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('default', ['test']);
};