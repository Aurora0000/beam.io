angular.module('beam.directives')
  .directive('beamUserList', function() {
    return {
      restrict: 'E',
      templateUrl: '../templates/beamUserList.html',
      scope: {
        connection: '@',
        channel: '@'
      },
      controller: function($scope, $rootScope) {
        var md5 = require('md5');
        this.genIdenticon = function(nick) {
          return new Identicon(md5(nick), 100);
        };

        this.channel = $scope.channel;
        // HACK: This ain't right...
        $scope.$parent.$parent.clientCtrl.connection.on(('names' + this.channel), function(nicks) {
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
                identicon: identicon
              });
            }
          }
          // TODO: Sort
          this.users = userList;
          $scope.$apply();
        }.bind(this));

        $scope.$parent.$parent.clientCtrl.connection.on(('join' + this.channel), function(nick) {
          if (this.users != null) {
            var identicon = this.genIdenticon(nick).toString();
            this.users.push({
              name: nick,
              mode: '',
              identicon: identicon
            });
            $scope.$apply();
          }
        }.bind(this));

        $scope.$parent.$parent.clientCtrl.connection.on(('part' + this.channel), function(nick) {
          this.users = this.users.filter(function(item) {
            return item.name !== nick;
          });
          $scope.$apply();
        }.bind(this));

        $scope.$parent.$parent.clientCtrl.connection.on(('kick' + this.channel), function(nick) {
          this.users = this.users.filter(function(item) {
            return item.name !== nick;
          });
          $scope.$apply();
        }.bind(this));

        $scope.$parent.$parent.clientCtrl.connection.on('+mode', function(channel, by, mode, argument) {
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
        }.bind(this));

        $scope.$parent.$parent.clientCtrl.connection.on('-mode', function(channel, by, mode, argument) {
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
        }.bind(this));

        $scope.$parent.$parent.clientCtrl.connection.on('quit', function(nick, reason, channels) {
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
        }.bind(this));
      },
      controllerAs: 'userListCtrl'
    };
  });
