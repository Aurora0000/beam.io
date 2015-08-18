angular.module('beam.directives')
  .directive('beamUserList', function() {
    return {
      restrict: 'E',
      templateUrl: '../templates/beamUserList.html',
      scope: {
        connection: '@',
        channel: '@',
      },
      controller: function($scope, $rootScope) {
        var md5 = require('md5');
        this.genIdenticon = function(nick) {
          return new Identicon(md5(nick), 100);
        };

        this.onChannelNames = function(nicks) {
          // We're given the nicks in a useless way (nick is key, mode is value)
          // but we want to sort, so we map it into an array.
          var userList = [];
          for (var key in nicks) {
            if (nicks.hasOwnProperty(key)) {
              var value = nicks[key];
              var identicon = this.genIdenticon(key).toString();
              userList.push({
                name: key,
                mode: value,
                identicon: identicon,
              });
            }
          }

          // TODO: Sort
          this.users = userList;
          $scope.$apply();
        }.bind(this);

        this.onChannelJoin = function(nick) {
          if (this.users != null) {
            var identicon = this.genIdenticon(nick).toString();
            this.users.push({
              name: nick,
              mode: '',
              identicon: identicon,
            });
            $scope.$apply();
          }
        }.bind(this);

        this.onChannelPart = function(nick) {
          this.users = this.users.filter(function(item) {
            return item.name !== nick;
          });

          $scope.$apply();
        }.bind(this);

        this.onChannelKick = function(nick) {
          this.users = this.users.filter(function(item) {
            return item.name !== nick;
          });

          $scope.$apply();
        }.bind(this);

        this.onAddMode = function(channel, by, mode, argument) {
          if (channel !== this.channel) {
            return;
          }

          if (mode === 'o') {
            // Someone has been oped. Search through and update
            for (var i = 0; i < this.users.length; i++) {
              if (this.users[i].name === argument) {
                this.users[i].mode = '@';
                return;
              }
            }
          } else if (mode === 'v') {
            // Someone has been voiced.
            for (var i = 0; i < this.users.length; i++) {
              if (this.users[i].name === argument) {
                this.users[i].mode = '+';
                return;
              }
            }
          }

          $scope.$apply();
        }.bind(this);

        this.onTakeMode = function(channel, by, mode, argument) {
          // TODO: edge cases where user has + and @
          if (channel !== this.channel) {
            return;
          }

          if (mode === 'o' || mode === 'v') {
            for (var i = 0; i < this.users.length; i++) {
              if (this.users[i].name === argument) {
                this.users[i].mode = '';
                return;
              }
            }
          }

          $scope.$apply();
        }.bind(this);

        this.onQuit = function(nick, reason, channels) {
          var len = this.users.filter(function(item) {
            return item.name === nick;
          }).length;
          if (len !== 0) {
            this.users = this.users.filter(function(item) {
              return item.name !== nick;
            });

            // HACK: Tell message list that user has quit.
            $rootScope.$broadcast(('quit|' + this.channel), [nick, reason]);
          }
        }.bind(this);

        this.channel = $scope.channel;

        $scope.$on('$destroy', function() {
          $scope.$parent.$parent.clientCtrl.connection.removeListener(('names' + this.channel), this.onChannelNames);
          $scope.$parent.$parent.clientCtrl.connection.removeListener(('join' + this.channel), this.onChannelJoin);
          $scope.$parent.$parent.clientCtrl.connection.removeListener(('part' + this.channel), this.onChannelPart);
          $scope.$parent.$parent.clientCtrl.connection.removeListener(('kick' + this.channel), this.onChannelKick);
          $scope.$parent.$parent.clientCtrl.connection.removeListener('+mode', this.onAddMode);
          $scope.$parent.$parent.clientCtrl.connection.removeListener('-mode', this.onTakeMode);
          $scope.$parent.$parent.clientCtrl.connection.removeListener('quit', this.onQuit);
        }.bind(this));

        // HACK: This ain't right...
        $scope.$parent.$parent.clientCtrl.connection.on(('names' + this.channel), this.onChannelNames);
        $scope.$parent.$parent.clientCtrl.connection.on(('join' + this.channel), this.onChannelJoin);
        $scope.$parent.$parent.clientCtrl.connection.on(('part' + this.channel), this.onChannelPart);
        $scope.$parent.$parent.clientCtrl.connection.on(('kick' + this.channel), this.onChannelKick);
        $scope.$parent.$parent.clientCtrl.connection.on('+mode', this.onAddMode);
        $scope.$parent.$parent.clientCtrl.connection.on('-mode', this.onTakeMode);
        $scope.$parent.$parent.clientCtrl.connection.on('quit', this.onQuit);
      },

      controllerAs: 'userListCtrl',
    };
  });
