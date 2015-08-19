angular.module('beam.directives')
  .directive('beamMessageList', function() {
    return {
      restrict: 'E',
      templateUrl: '../templates/beamMessageList.html',
      scope: {
        channel: '@',
        host: '@',
      },
      controller: function($rootScope, $scope, ircService) {
        var md5 = require('md5');
        this.genIdenticon = function(nick) {
          return new Identicon(md5(nick), 100);
        };

        this.host = $scope.host;
        this.connection = ircService.get(this.host);

        this.onChannelMessage = function(nick, text, message) {
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: text,
            time: new Date(),
            identicon: identicon,
            type: 'message',
          });
          $scope.$apply();
        }.bind(this);

        this.onChannelSelfMessage = function(event, data) {
          var nick = this.connection.nick;
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: data,
            time: new Date(),
            identicon: identicon,
            type: 'message',
          });
        }.bind(this);

        this.onChannelPrivMessage = function(event, data) {
          var nick = this.channel;
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: data,
            time: new Date(),
            identicon: identicon,
            type: 'message',
          });
        }.bind(this);

        this.onAction = function(from, to, text) {
          if (to !== this.channel) {
            return;
          }

          var identicon = this.genIdenticon(from).toString();
          this.messages.push({
            nick: from,
            message: text,
            time: new Date(),
            identicon: identicon,
            type: 'action',
          });
          $scope.$apply();
        }.bind(this);

        this.onChannelSelfAction = function(event, data) {
          var nick = this.connection.nick;
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: data,
            time: new Date(),
            identicon: identicon,
            type: 'action',
          });
        }.bind(this);

        this.onChannelJoin = function(nick) {
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: 'has joined ' + this.channel,
            time: new Date(),
            identicon: identicon,
            type: 'action',
          });
          $scope.$apply();
        }.bind(this);

        this.onChannelPart = function(nick) {
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: 'has left ' + this.channel,
            time: new Date(),
            identicon: identicon,
            type: 'action',
          });
          $scope.$apply();
        }.bind(this);

        this.onChannelKick = function(nick, by, reason) {
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: 'has been kicked from ' + this.channel + ' by ' + by + ' (' + reason + ')',
            time: new Date(),
            identicon: identicon,
            type: 'action',
          });
          $scope.$apply();
        }.bind(this);

        this.onChannelQuit = function(event, data) {
          var nick = data[0];
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: 'has quit (' + data[1] + ')',
            time: new Date(),
            identicon: identicon,
            type: 'action',
          });
          $scope.$apply();
        }.bind(this);

        this.onChannelNick = function(event, data) {
          var old = data[0];
          var _new = data[1];

          var identicon = this.genIdenticon(old).toString();
          this.messages.push({
            nick: old,
            message: 'is now known as ' + _new,
            time: new Date(),
            identicon: identicon,
            type: 'action',
          });
          $scope.$apply();
        }.bind(this);

        $scope.$on('$destroy', function() {
          this.cleanFunctions.forEach(function(f) {
            f();
          });

          this.connection.removeListener(('message' + this.channel), this.onChannelMessage);
          this.connection.removeListener('action', this.onAction);
          this.connection.removeListener(('join' + this.channel), this.onChannelJoin);
          this.connection.removeListener(('part' + this.channel), this.onChannelPart);
          this.connection.removeListener(('kick' + this.channel), this.onChannelKick);
        }.bind(this));

        this.channel = $scope.channel;
        this.messages = [];

        this.cleanFunctions = [];

        this.connection.on(('message' + this.channel), this.onChannelMessage);
        this.connection.on('action', this.onAction);
        this.connection.on(('join' + this.channel), this.onChannelJoin);
        this.connection.on(('part' + this.channel), this.onChannelPart);
        this.connection.on(('kick' + this.channel), this.onChannelKick);

        this.cleanFunctions.push($rootScope.$on(('selfMessage|' + this.channel), this.onChannelSelfMessage));

        // Private messages are sent via $rootScope
        this.cleanFunctions.push($rootScope.$on(('message|' + this.channel), this.onChannelPrivMessage));
        this.cleanFunctions.push($rootScope.$on(('selfAction|' + this.channel), this.onChannelSelfAction));
        this.cleanFunctions.push($rootScope.$on(('quit|' + this.channel), this.onChannelQuit));
        this.cleanFunctions.push($rootScope.$on(('nick|' + this.channel), this.onChannelNick));
      },

      controllerAs: 'messageListCtrl',
    };
  });
