var irc = require('irc');

angular.module('beam.directives')
  .directive('beamNetworkClient', function() {
    return {
      restrict: 'E',
      templateUrl: '../templates/beamNetworkClient.html',
      scope: {
        settings: '@'
      },
      controller: function($compile, $scope, configService) {
        this.channels = [];
        this.currentChannel = '';

        this.connect = function(settings) {
          return new irc.Client(settings.host, settings.nick, {
            userName: (settings.user || 'beam'),
            realName: (settings.real || 'beam.io IRC (https://github.com/Aurora0000/beam.io)'),
            port: (settings.port || 6667),
            autoRejoin: (settings.autoRejoin || true),
            secure: (settings.tls || false),
            certExpired: (settings.ignoreSecure || false),
            selfSigned: (settings.ignoreSecure || false),
            channels: (settings.channels || [])
          });
        };

        this.connection = this.connect({
          host: configService.get('host'),
          port: configService.get('port'),
          nick: configService.get('nick'),
          channels: configService.get('channels')
        });
        
        this.connection.on('error', function(message) {
          console.log("Error in IRC library: ", message);
        }.bind(this));

        this.connection.on('join', function(channel, nick) {
          if (nick === this.connection.nick) {
            this.channels.push(channel);
            $scope.$apply();
            this.currentChannel = channel;
          }
        }.bind(this));

        this.connection.on('part', function(channel, nick) {
          if (nick === this.connection.nick) {
            this.channels.splice(this.channels.indexOf(channel), 1);
            $scope.$apply();
          }
        }.bind(this));

        this.setActiveChannel = function(channel) {
          this.currentChannel = channel;
        }.bind(this);

        this.joinChannel = function() {
          this.connection.join($scope.channel);
          $scope.channel = '';
          $('.ui.modal').modal('hide');
        }.bind(this);

        this.partChannel = function(channel) {
          this.connection.part(channel);
        }.bind(this);

        this.showModal = function() {
          $('.ui.modal').modal('show');
        }
      },
      controllerAs: 'clientCtrl'
    };
  });