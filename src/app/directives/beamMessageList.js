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
            identicon: identicon
          });
          $scope.$apply();
        }.bind(this));

        $rootScope.$on(('selfMessage' + this.channel), function(event, data) {
          var nick = $scope.$parent.$parent.clientCtrl.connection.nick;
          var identicon = this.genIdenticon(nick).toString();
          this.messages.push({
            nick: nick,
            message: data,
            time: new Date(),
            identicon: identicon
          });
        }.bind(this));
      },
      controllerAs: 'messageListCtrl'
    };
  });
