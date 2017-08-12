require.config({
    baseUrl: '/assets/js',
    paths: {
        jquery: 'vendor/jquery/jquery',
        modernizr: 'vendor/modernizr/modernizr',
        foundation: 'vendor/foundation/foundation',
        underscore: 'vendor/underscore/underscore',
        template: 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
        hogan: 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
        backbone: 'vendor/backbone/backbone',
        text: 'vendor/require/text',
        'foundation.core': 'vendor/foundation/js/foundation/foundation',
        'foundation.dropdown': 'vendor/foundation/js/foundation/foundation.dropdown'
    },

    shim: {
        underscore: {
            exports: '_'
        },
        template: {
            exports: 'template'
        },
        hogan: {
            deps: [ 'template' ],
            exports: 'Hogan'
        },
        backbone: {
            deps: [ 'underscore', 'jquery'],
            exports: 'Backbone'
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        'foundation.core': {
            deps: [
                'jquery',
                'modernizr'
            ],
            exports: 'Foundation'
        },
        'foundation.dropdown': {
            deps: [
                'foundation.core'
            ]
        }
    }
});



define([
    'jquery',
    'modernizr',
    'foundation.dropdown'
], function ($, Modernizr) {
  $(document).foundation();

  require([ './views/appTimeZone.js'], function(TimeZoneView){
      new TimeZoneView({});
  });
});

