angular.module('beam.services')
  .service('configService', function() {
    var yaml = require('js-yaml');
    var fs = require('fs');
    var homedir = require('homedir');
    this.doc = null;
    this.get = function(name) {
      if (this.doc === null) {
        this.doc = yaml.safeLoad(fs.readFileSync(homedir() + '/settings.yaml', 'utf8'));
      }

      return this.doc[name];
    };
  });
