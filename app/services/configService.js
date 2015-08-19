angular.module('beam.services')
  .service('configService', function() {
    var yaml = require('js-yaml');
    var fs = require('fs');
    var homedir = require('homedir');
    this.doc = null;
    this.storageLocation = homedir() + '/settings.yaml';
    this.get = function(name) {
      if (this.doc === null) {
        this.load();
      }

      return this.doc[name];
    };

    this.set = function(name, value) {
      if (this.doc === null) {
        this.load();
      }

      this.doc[name] = value;
      fs.writeFile(this.storageLocation, function(err) {
        if (!err) {
          return;
        }

        console.error('Error! File could not be saved');
      });
    };

    this.load = function() {
      this.doc = yaml.safeLoad(fs.readFileSync(this.storageLocation, 'utf8'));
    };

    this.canLoad = function() {
      return fs.existsSync(this.storageLocation);
    };
  });
