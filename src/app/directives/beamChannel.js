angular.module('beam.directives')
  .directive('beamChannel', function() {
    return {
      restrict: 'E',
      templateUrl: '../templates/beamChannel.html',
      scope: {
        channel: '@',
        connection: '@'
      },
      controller: function($scope) {
        this.channel = $scope.channel;
        this.setTopic = function(channel, topic, nick, message) {
          if (channel === this.channel) {
            this.topic = topic;
            $scope.$apply();
          }
        };
        $scope.$parent.clientCtrl.connection.on('topic', this.setTopic.bind(this));

      },
      controllerAs: 'channelCtrl'
    };
  });
