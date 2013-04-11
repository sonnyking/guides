module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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

  grunt.registerTask('default', ['server']);
  grunt.registerTask('watch', ['watch']);
  grunt.registerTask('sass', ['sass']);
  grunt.registerTask('server', 'Start a custom web server.', function() {
    var done = this.async();
    grunt.log.writeln('Starting web server on port 3502.');
    require('./lib/server.js').listen(3502).on('close', done);
  });

};