angular.module('beam.services')
  .service('configService', function() {
    var yaml = require('js-yaml');
    var fs = require('fs');
    var homedir = require('homedir');
    this.doc = null;
    this.storageLocation = './settings.yaml';
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
    };

    this.save = function() {
      fs.writeFile(this.storageLocation, yaml.safeDump(this.doc), function(err) {
        if (err) throw err;
      });
    };

    this.load = function() {
      if (!this.canLoad()) {
        this.doc = {};
        return;
      }

      this.doc = yaml.safeLoad(fs.readFileSync(this.storageLocation, 'utf8'));
      if (this.doc === undefined) {
        this.doc = {};
      }
    };

    this.canLoad = function() {
      return fs.existsSync(this.storageLocation);
    };
  });
