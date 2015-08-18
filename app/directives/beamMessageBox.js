angular.module('beam.directives')
  .directive('beamMessageBox', function() {
    return {
      restrict: 'E',
      templateUrl: '../templates/beamMessageBox.html',
      scope: {
        channel: '@',
      },
      controller: function($rootScope, $scope) {
        this.channel = $scope.channel;
        this.send = function() {
          if ($scope.message.startsWith('//')) {
            $scope.message = $scope.message.substr(1);
            this._send(this.channel, $scope.message);
          } else if ($scope.message.startsWith('/')) {
            var bits = $scope.message.split(' ');
            switch (bits[0]) {
              case '/msg':
                var recipient = bits[1];
                var message = bits.slice(2);
                this._send(recipient, message.join(' '));
                break;
              case '/me':
                var message = bits.slice(1).join(' ');
                $scope.$parent.$parent.clientCtrl.connection.action(this.channel, message);
                $rootScope.$broadcast(('selfAction|' + this.channel), message);
                break;
              default:
                bits[0] = bits[0].substr(1);
                $scope.$parent.$parent.clientCtrl.connection.send.apply($scope.$parent.$parent.clientCtrl.connection, bits);
                break;
            }
          } else {
            this._send(this.channel, $scope.message);
          }

          $scope.message = '';
        };

        this._send = function(recipient, message) {
          $scope.$parent.$parent.clientCtrl.connection.say(recipient, message);
          $rootScope.$broadcast('selfMessage', [recipient, message]);

          // The selfMessage|channel is dealt with by beam-network-client.
        };
      },

      controllerAs: 'messageBoxCtrl',
    };
  });
