angular.module('beam.controllers')
  .controller('beamSettingsController', function($scope, configService) {

    this.save = function() {
      configService.set('host', $scope.settings.host);
      configService.set('tls', $scope.settings.tls || false);
      configService.set('nick', $scope.settings.nick);
      var channels = [];
      if ($scope.settings.channels != null) {
        channels = $scope.settings.channels.map(function(item) {
          return item.text;
        });
      }

      configService.set('channels', channels);
      if ($scope.settings.advanced) {
        configService.set('port', $scope.settings.port);
        configService.set('user', $scope.settings.user || 'beam');
        configService.set('real', $scope.settings.real || 'Beam.io');
        configService.set('ignoreSecure', $scope.settings.ignoreSecure || false);
      } else {
        configService.set('port', $scope.settings.tls ? 6697 : 6667);
      }

      configService.save();
      require('ipc').send('welcome-done', true);
    };
  });
