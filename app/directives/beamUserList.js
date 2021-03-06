angular.module('beam.directives')
  .directive('beamUserList', function() {
    return {
      restrict: 'E',
      templateUrl: '../templates/beamUserList.html',
      scope: {
        host: '@',
        channel: '@',
      },
      controller: function($scope, $rootScope, ircService) {
        var md5 = require('md5');
        this.host = $scope.host;
        this.connection = ircService.get(this.host);

        this.genIdenticon = function(nick) {
          return new Identicon(md5(nick), 100);
        };

        this.orderFunction = function(user) {
          switch (user.mode) {
            case '~':
              return 0;
            case '@':
              return 1;
            case '%':
              return 2;
            case '+':
              return 3;
            default:
              return 4;
          }
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

        this._addMode = function(user, mode) {
          for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].name === user) {
              this.users[i].mode = mode;
              return;
            }
          }
        };

        this._takeMode = function(user) {
          for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].name === user) {
              this.users[i].mode = '';
              return;
            }
          }
        };

        this.onAddMode = function(channel, by, mode, argument) {
          if (channel !== this.channel) {
            return;
          }

          if (mode === 'o') {
            // Someone has been oped. Search through and update
            this._addMode(argument, '@');
          } else if (mode === 'v') {
            // Someone has been voiced.
            this._addMode(argument, '+');
          } else if (mode === 'h') {
            this._addMode(argument, '%');
          } else if (mode === 'q') {
            this._addMode(argument, '~');
          }

          $scope.$apply();
        }.bind(this);

        this.onTakeMode = function(channel, by, mode, argument) {
          // TODO: edge cases where user has multiple modes
          if (channel !== this.channel) {
            return;
          }

          if (mode === 'o' || mode === 'v' || mode === 'q' || mode === 'h') {
            this._takeMode(argument);
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

        this.onNick = function(old, _new) {
          var len = this.users.filter(function(item) {
            return item.name === old;
          }).length;

          if (len !== 0) {
            this.users = this.users.map(function(item) {
              if (item.name === old) {
                item.name = _new;
                var identicon = this.genIdenticon(_new);
                item.identicon = identicon;
              }

              return item;
            }.bind(this));

            // HACK: Tell message list that user has changed nick.
            $rootScope.$broadcast(('nick|' + this.channel), [old, _new]);
          }
        }.bind(this);

        this.channel = $scope.channel;

        $scope.$on('$destroy', function() {
          this.connection.removeListener(('names' + this.channel), this.onChannelNames);
          this.connection.removeListener(('join' + this.channel), this.onChannelJoin);
          this.connection.removeListener(('part' + this.channel), this.onChannelPart);
          this.connection.removeListener(('kick' + this.channel), this.onChannelKick);
          this.connection.removeListener('+mode', this.onAddMode);
          this.connection.removeListener('-mode', this.onTakeMode);
          this.connection.removeListener('quit', this.onQuit);
          this.connection.removeListener('nick', this.onNick);
        }.bind(this));

        this.connection.on(('names' + this.channel), this.onChannelNames);
        this.connection.on(('join' + this.channel), this.onChannelJoin);
        this.connection.on(('part' + this.channel), this.onChannelPart);
        this.connection.on(('kick' + this.channel), this.onChannelKick);
        this.connection.on('+mode', this.onAddMode);
        this.connection.on('-mode', this.onTakeMode);
        this.connection.on('quit', this.onQuit);
        this.connection.on('nick', this.onNick);
      },

      controllerAs: 'userListCtrl',
    };
  });
