'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var Download = require('download');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../../package.json');
  },
  setup: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the geometric ' + chalk.red('Yo Electron') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'title',
      message: 'Your project name'
    }, {
      type: 'checkbox',
      name: 'features',
      message: 'Maybe add some nice features ?',
      choices: [{
        name: 'Sass',
        value: 'includeSass',
        checked: false
      }, {
        name: 'jQuery',
        value: 'includejQuery',
        checked: false
      // }, {
      //   name: 'Angular',
      //   value: 'includeAngular',
      //   checked: false,
      }]
    }];

    this.prompt(prompts, function (answers) {
      var features = answers.features;
      // To access props later use this.props.someOption;
      this.project = {
        title: answers.title
      };

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      };

      this.features = {};
      this.features.sass = hasFeature('includeSass');
      this.features.jquery = hasFeature('includejQuery');
      // this.features.angular = hasFeature('includeAngular');


      done();
    }.bind(this));
  },
  styles: function(){
    var _self = this;
    if(this.features.sass){
      new Download({mode: '755', extract: true})
        .get('https://github.com/Art2B/starter-sass/archive/master.zip')
        .dest(_self.destinationPath())
        .run(function(err, files){
          fs.renameSync(_self.destinationPath()+'/starter-sass-master', _self.destinationPath()+'/styles');
          fs.unlinkSync(_self.destinationPath()+'/styles/README.md');
        });
    } else {
      this.fs.copy(
        this.templatePath('styles/*.css'),
        this.destinationPath('styles/')
      );
    }
  },
  scripts: function(){
    var _self = this;
    // if(this.features.angular){
    //   console.log('use angular');
    //   // new Download({mode: '755', extract: true})
    //   //   .get('https://github.com/Art2B/starter-angular/archive/master.zip')
    //   //   .dest(_self.destinationPath())
    //   //   .run(function(err, files){
    //   //     fs.renameSync(_self.destinationPath()+'/starter-js-master', _self.destinationPath()+'/scripts');
    //   //     fs.unlinkSync(_self.destinationPath()+'/scripts/README.md');
    //   //   });
    // } else {
      new Download({mode: '755', extract: true})
        .get('https://github.com/Art2B/starter-js/archive/master.zip')
        .dest(_self.destinationPath())
        .run(function(err, files){
          fs.renameSync(_self.destinationPath()+'/starter-js-master', _self.destinationPath()+'/scripts');
          fs.unlinkSync(_self.destinationPath()+'/scripts/README.md');
        });
    // }
  },
  assets: function(){
    this.fs.copy(this.templatePath('assets/*'), this.destinationPath('assets/'));
  },
  views: function(){
    this.fs.copy(this.templatePath('views/*.html'), this.destinationPath('views/'));
  },
  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_main.js'),
        this.destinationPath('main.js')
      );
      this.fs.copyTpl(
        this.templatePath('_index.html'),
        this.destinationPath('index.html'),
        { title: this.project.title, year: new Date().getFullYear()}
      );
    },
    bower: function(){
      var bower = {
        name: this.project.title,
        version: '0.1.0',
        dependencies: {
          'jquery': '~2.1.4',
          'underscore': '~1.8.3'
        }
      };

      this.fs.writeJSON('bower.json', bower);
    },
    npm: function(){
      var packages = {
        name: this.project.title,
        version: '0.1.0',
        dependencies: {
          'grunt': '~0.4.5',
          'grunt-electron-builder': '~0.2.1'
        }
      };

      if(this.features.sass){
        packages.dependencies['grunt-contrib-sass'] = '~0.9.2';
      }

      this.fs.writeJSON('package.json', packages);
    },
    grunt: function(){
      this.fs.copyTpl(
        this.templatePath('Gruntfile.js'),
        this.destinationPath('Gruntfile.js'),
        {
          title: this.project.title,
          pkg: this.pkg,
          useSass: this.features.sass
        }
      );
    },
    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },
  // Uncomment to final tests, will install everything missing
  // install: function () {
  //   this.installDependencies();
  // }
});
