'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var Download = require('download');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the geometric ' + chalk.red('Yo Electron') + ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'Sass',
      message: 'Would you like to use Sass ?',
      default: true
    }, {
      type: 'confirm',
      name: 'Angular',
      message: 'Would you like to use Angular ,',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;
      done();
    }.bind(this));
  },
  styles: function(){
    var _self = this;
    if(this.props.Sass){
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
    if(this.props.Angular){
      console.log('use angular');
    } else {
      new Download({mode: '755', extract: true})
        .get('https://github.com/Art2B/starter-js/archive/master.zip')
        .dest(_self.destinationPath())
        .run(function(err, files){
          fs.renameSync(_self.destinationPath()+'/starter-js-master', _self.destinationPath()+'/scripts');
          fs.unlinkSync(_self.destinationPath()+'/scripts/README.md');
        });
    }
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
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
      this.fs.copy(
        this.templatePath('_main.js'),
        this.destinationPath('main.js')
      );
      this.fs.copy(
        this.templatePath('_index.html'),
        this.destinationPath('index.html')
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

  // install: function () {
  //   this.installDependencies();
  // }
});
