angular.module('beam.controllers')
  .controller('beamSettingsController', function($scope, configService) {

    this.save = function() {
      configService.set('host', $scope.settings.host);
      configService.set('tls', $scope.settings.tls === undefined ? false : $scope.settings.tls);
      configService.set('nick', $scope.settings.nick);
      var channels = $scope.settings.channels.map(function(item) {
        return item.text;
      });

      configService.set('channels', channels);
      if ($scope.settings.advanced) {
        configService.set('port', $scope.settings.port);
        configService.set('user', $scope.settings.user);
        configService.set('real', $scope.settings.real);
        configService.set('ignoreSecure', $scope.settings.ignoreSecure);
      } else {
        configService.set('port', $scope.settings.tls ? 6697 : 6667);
      }

      configService.save();
      require('ipc').send('welcome-done', true);
    };
  });
