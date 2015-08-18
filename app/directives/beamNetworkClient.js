var irc = require('irc');

angular.module('beam.directives')
  .directive('beamNetworkClient', function() {
    return {
      restrict: 'E',
      templateUrl: '../templates/beamNetworkClient.html',
      scope: {
        settings: '@'
      },
      controller: function($compile, $scope, $rootScope, configService) {
        this.channels = [];
        this.currentChannel = '';

        this.connect = function(settings) {
          this.settings = {
            userName: (settings.user || 'beam'),
            realName: (settings.real || 'beam.io IRC (https://github.com/Aurora0000/beam.io)'),
            port: (settings.port || 6667),
            autoRejoin: (settings.autoRejoin || true),
            secure: (settings.tls || false),
            certExpired: (settings.ignoreSecure || false),
            selfSigned: (settings.ignoreSecure || false),
            channels: (settings.channels || []),
            host: settings.host
          };
          return new irc.Client(settings.host, settings.nick, this.settings);
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
            this.removeTab(channel);
            $scope.$apply();
          }
        }.bind(this));

        this.connection.on('message', function(nick, to, text) {
          if (to === this.connection.nick) {
            // Private message, pass on to PM tab (if created)
            if (this.channels.indexOf(nick) === -1) {
              this.channels.push(nick);
              $scope.$apply();
            }
            $rootScope.$broadcast(('message|' + nick), text);
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
          this.removeTab(channel);
        }.bind(this);

        this.showModal = function() {
          $('.ui.modal').modal('show');
        }.bind(this);

        this.removeTab = function(channel) {
          var chan = this.channels.indexOf(channel);
          // Channel may have alredy been removed on part. check.
          if (chan !== -1) {
            this.channels.splice(chan, 1);
          }
        };
      },
      controllerAs: 'clientCtrl'
    };
  });
