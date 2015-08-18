angular.module('beam.services')
  .service('ircService', function() {
    var irc = require('irc');
    this.connections = {};
    this.settings = {};
    this.connect = function(settings) {
      this.settings[settings.host] = {
        userName: (settings.user || 'beam'),
        realName: (settings.real || 'beam.io IRC (https://github.com/Aurora0000/beam.io)'),
        port: (settings.port || 6667),
        autoRejoin: (settings.autoRejoin || true),
        secure: (settings.tls || false),
        certExpired: (settings.ignoreSecure || false),
        selfSigned: (settings.ignoreSecure || false),
        channels: (settings.channels || []),
      };
      this.connections[settings.host] = new irc.Client(settings.host,
        settings.nick, this.settings[settings.host]);
    };

    this.get = function(host) {
      return this.connections[host] || null;
    };
  });
