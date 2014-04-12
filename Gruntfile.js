'use strict';

module.exports = function(grunt) {

  var HTTPD_PORT = 28080 + Math.floor(Math.random() * 10);
  var TEST_URL = 'http://localhost:' + HTTPD_PORT + '/test/?localtest=true';

  grunt.initConfig({
    shell: {
      'qunit-slimerjs': {
        command: './test/run-slimerjs.sh ' + TEST_URL,
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        }
      }
    },
    connect: {
      test: {
        options: {
          port: HTTPD_PORT
        }
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      all: ['src/*.js']
    },
    qunit: {
      test: {
        options: {
          urls: [TEST_URL]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('test', ['jshint', 'test-slimerjs']);

  // Run the test suite with QUnit on PhantomJS (currently broken.)
  grunt.registerTask('test-phantomjs', ['connect', 'qunit']);

  // Run the test suite with QUnit on SlimerJS
  grunt.registerTask('test-slimerjs', ['connect', 'shell:qunit-slimerjs']);
};
