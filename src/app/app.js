// Create beam.io module globally.
angular.module('beam.services', []);
angular.module('beam.directives', ['angularMoment', 'beam.services']);
angular.module('beam', ['beam.directives', 'beam.services'])
  .config(function($logProvider) {
    $logProvider.debugEnabled(true);
  });
