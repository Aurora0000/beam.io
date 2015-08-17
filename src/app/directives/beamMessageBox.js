angular.module('beam.directives')
  .directive('beamMessageBox', function() {
    return {
      restrict: 'E',
      templateUrl: '../templates/beamMessageBox.html',
      scope: {
        channel: '@'
      },
      controller: function($rootScope, $scope) {
        this.channel = $scope.channel;
        this.send = function() {
          $scope.$parent.$parent.clientCtrl.connection.say(this.channel, $scope.message);
          $rootScope.$broadcast(('selfMessage' + this.channel), $scope.message);
          $scope.message = '';
        };
      },
      controllerAs: 'messageBoxCtrl'
    };
  });
