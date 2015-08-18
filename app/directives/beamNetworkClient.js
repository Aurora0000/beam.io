var irc = require('irc');

angular.module('beam.directives')
  .directive('beamNetworkClient', function() {
    return {
      restrict: 'E',
      templateUrl: '../templates/beamNetworkClient.html',
      scope: {
        settings: '@',
      },
      controller: function($compile, $scope, $rootScope, ircService, configService) {
        this.channels = [];
        this.currentChannel = '';
        this.host = configService.get('host');

        this.connect = function(settings) {
          ircService.connect(settings);
        };

        this.connect({
          host: this.host,
          port: configService.get('port'),
          nick: configService.get('nick'),
          channels: configService.get('channels'),
        });
        this.connection = ircService.get(this.host);

        this.connection.on('error', function(message) {
          console.log('Error in IRC library: ', message);
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
            this.addChannel(nick);
            $scope.$apply();

            $rootScope.$broadcast(('message|' + nick), text);
          }
        }.bind(this));

        // Called on /msg
        $rootScope.$on('selfMessage', function(event, data) {
          this.addChannel(data[0]);
          $rootScope.$broadcast(('selfMessage|' + data[0]), data[1]);
        }.bind(this));

        this.addChannel = function(channel) {
          if (this.channels.indexOf(channel) === -1) {
            this.channels.push(channel);
          }
        };

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

      controllerAs: 'clientCtrl',
    };
  });
