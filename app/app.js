require('moment').lang('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s",
        s:  "now",
        m:  "1m",
        mm: "%dm",
        h:  "1h",
        hh: "%dh",
        d:  "1d",
        dd: "%dd",
        M:  "1m",
        MM: "%dm",
        y:  "1y",
        yy: "%dy"
    }
});

// Create beam.io module globally.
angular.module('beam.services', []);
angular.module('beam.directives', ['angularMoment', 'beam.services', 'luegg.directives']);
angular.module('beam', ['beam.directives', 'beam.services'])
  .config(function($logProvider) {
    $logProvider.debugEnabled(true);
  });
