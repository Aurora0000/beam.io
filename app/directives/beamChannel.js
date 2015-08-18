angular.module('beam.directives')
  .directive('beamChannel', function() {
    return {
      restrict: 'E',
      templateUrl: '../templates/beamChannel.html',
      scope: {
        channel: '@',
        host: '@',
      },
      controller: function($scope, ircService) {
        this.channel = $scope.channel;
        this.host = $scope.host;
        this.connection = ircService.get(this.host);
        this.setTopic = function(channel, topic, nick, message) {
          if (channel === this.channel) {
            this.topic = topic;
            $scope.$apply();
          }
        }.bind(this);
        this.connection.on('topic', this.setTopic);
        $scope.$on('$destroy', function() {
          this.connection.removeListener('topic', this.setTopic);
        }.bind(this));
      },

      controllerAs: 'channelCtrl',
    };
  });
