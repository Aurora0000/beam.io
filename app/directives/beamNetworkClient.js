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
        this.topics = {};
        this.currentChannel = '';
        this.connectionClosed = true;
        this.connectionError = 'Unknown error';
        this.showChannelModal = false;

        this.displayChannelModal = function() {
          this.showChannelModal = true;
        }.bind(this);

        this.onRegistered = function() {
          this.connected = true;
        }.bind(this);

        this.setTopic = function(channel, topic) {
          this.topics[channel] = topic;
        };

        this.connect = function(settings) {
          ircService.connect(settings);
        };

        if (!configService.canLoad()) {
          // Signal main process to open welcome dialog because settings aren't
          // available.
          require('ipc').send('show-welcome', true);
        }

        this.host = configService.get('host');
        this.connect({
          host: this.host,
          port: configService.get('port'),
          nick: configService.get('nick'),
          userName: configService.get('userName'),
          realName: configService.get('realName'),
          channels: configService.get('channels'),
          autoRejoin: configService.get('autoRejoin'),
          tls: configService.get('tls'),
          ignoreSecure: configService.get('ignoreSecure'),
        });
        this.connection = ircService.get(this.host);

        this.connection.on('registered', this.onRegistered);

        this.connection.on('ctcp-version', function(from, to) {
          if (to === this.connection.nick) {
            var os = require('os');
            var platform = os.platform() + ' ' + os.arch();
            this.connection.ctcp(from, 'notice', 'VERSION beam.io v0.1.0-a3 on ' + platform);
          }
        }.bind(this));

        this.connection.on('error', function(message) {
          console.log('Error in IRC library: ', message);
        }.bind(this));

        this.connection.conn.addListener('close', function() {
          this.connectionClosed = true;
        }.bind(this));

        this.connection.conn.addListener('error', function(err) {
          this.connectionError = err;
          $scope.$apply();
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

        this.connection.on('pm', function(nick, text) {
          this.addChannel(nick);
          $scope.$apply();
          $rootScope.$broadcast(('message|' + nick), text);
        }.bind(this));

        // Called on /msg
        $rootScope.$on('selfMessage', function(event, data) {
          this.addChannel(data[0]);
          $rootScope.$broadcast(('selfMessage|' + data[0]), data[1]);
        }.bind(this));

        this.addChannel = function(channel) {
          if (this.channels.indexOf(channel) === -1) {
            this.channels.push(channel);
            this.topics[channel] = '';
          }
        };

        this.setActiveChannel = function(channel) {
          this.currentChannel = channel;
        }.bind(this);

        this.joinChannel = function() {
          if ($scope.channelToJoin == '' || $scope.channelToJoin == null) {
            $scope.showChannelModal = false;
            return;
          }

          if (!$scope.channelToJoin.startsWith('#')) {
            $scope.channelToJoin = '#' + $scope.channelToJoin;
          }

          this.connection.join($scope.channelToJoin);
          $scope.channelToJoin = '';
          this.showChannelModal = false;
        }.bind(this);

        this.partChannel = function(channel) {
          // Check if only channel open.
          if (this.channels.indexOf(channel) == 0 & this.channels.length == 1) {
            // Close connection? Close window? Destroy the universe?
            ;
          } else {
            // If not, close channel.
            this.connection.part(channel);

            // Check if first channel in list.
            if (this.channels.indexOf(channel) == 0) {
              // If so, select next channel.
              this.currentChannel = this.channels[this.channels.indexOf(channel) + 1];
            } else {
              // If not, select previous channel.
              this.currentChannel = this.channels[this.channels.indexOf(channel) - 1];
            }

            // Remove channel tab.
            this.removeTab(channel);
          }
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
