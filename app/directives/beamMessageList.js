angular.module('beam.directives')
  .directive('beamMessageList', function() {
    return {
      restrict: 'E',
      templateUrl: '../templates/beamMessageList.html',
      scope: {
        channel: '@'
      },
      controller: function($rootScope, $scope) {
        var md5 = require('md5');
        this.genIdenticon = function(nick) {
          return new Identicon(md5(nick), 100);
        };

        this.channel = $scope.channel;
        this.messages = [];
        $scope.$parent.$parent.clientCtrl.connection.on(('message' + this.channel), function(nick, text, message) {
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: text,
            time: new Date(),
            identicon: identicon,
            type: 'message'
          });
          $scope.$apply();
        }.bind(this));


        $rootScope.$on(('selfMessage|' + this.channel), function(event, data) {
          var nick = $scope.$parent.$parent.clientCtrl.connection.nick;
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: data,
            time: new Date(),
            identicon: identicon,
            type: 'message'
          });
        }.bind(this));

        // Private messages are sent via $rootScope
        $rootScope.$on(('message|' + this.channel), function(event, data) {
          var nick = this.channel;
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: data,
            time: new Date(),
            identicon: identicon,
            type: 'message'
          });
        }.bind(this));

        $scope.$parent.$parent.clientCtrl.connection.on('action', function(from, to, text) {
          if (to !== this.channel) {
            return;
          }
          var identicon = this.genIdenticon(from).toString();
          this.messages.push({
            nick: from,
            message: text,
            time: new Date(),
            identicon: identicon,
            type: 'action'
          });
          $scope.$apply();
        }.bind(this));

        $rootScope.$on(('selfAction|' + this.channel), function(event, data) {
          var nick = $scope.$parent.$parent.clientCtrl.connection.nick;
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: data,
            time: new Date(),
            identicon: identicon,
            type: 'action'
          });
        }.bind(this));

        $scope.$parent.$parent.clientCtrl.connection.on(('join' + this.channel), function(nick) {
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: 'has joined ' + this.channel,
            time: new Date(),
            identicon: identicon,
            type: 'action'
          });
          $scope.$apply();
        }.bind(this));

        $scope.$parent.$parent.clientCtrl.connection.on(('part' + this.channel), function(nick) {
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: 'has left ' + this.channel,
            time: new Date(),
            identicon: identicon,
            type: 'action'
          });
          $scope.$apply();
        }.bind(this));

        $scope.$parent.$parent.clientCtrl.connection.on(('kick' + this.channel), function(nick, by, reason) {
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: 'has been kicked from ' + this.channel + ' by ' + by + ' (' + reason + ')',
            time: new Date(),
            identicon: identicon,
            type: 'action'
          });
          $scope.$apply();
        }.bind(this));

        $rootScope.$on(('quit|' + this.channel), function(event, data) {
          var nick = data[0];
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: 'has quit (' + data[1] + ')',
            time: new Date(),
            identicon: identicon,
            type: 'action'
          });
          $scope.$apply();
        }.bind(this));
      },
      controllerAs: 'messageListCtrl'
    };
  });
