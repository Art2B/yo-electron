// Generated on <%= (new Date).toISOString().split('T')[0] %>
// <%= pkg.name %> <%= pkg.version %>
'use strict';

module.exports = function(grunt){

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required grunt tasks
  require('jit-grunt')(grunt, {
    electron: 'grunt-electron-builder'
  });

  var config = {
    title: '<%= title %>',
    build: './build'
  }

  grunt.initConfig({
    config: config,

    <% if (useSass) { %>
    sass: {
      options: {
        sourceMap: true,
        sourceMapEmbed: true,
        sourceMapContents: true,
        includePaths: ['.']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'APP_FOLDER_HERE/styles',
          src: 'main.scss',
          dest: '',
          ext: '.css'
        }]
      }
    },
    <% } %>


    electron: {
      options: {
        appName: 'PUT TITLE HERE',
      },
      build: {
        options: {
          dest: 'PUT APP BUILD FOLDER',
          src: __dirname+'/app',
          platforms: ['linux-x64']
        }
      },
    }
  });

  grunt.registerTask('build', [
    'electron:build'
  ]);


};