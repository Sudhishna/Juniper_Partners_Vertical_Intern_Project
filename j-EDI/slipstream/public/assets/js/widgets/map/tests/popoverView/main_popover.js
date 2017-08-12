/**
 * The Map Widget test page.
 * @copyright Juniper Networks, Inc. 2015
 * @author Dennis Park <dpark@juniper.net>
 */

require.config({
    baseUrl: '/assets/js',
    paths: {
        jquery: 'vendor/jquery/jquery',
        'jquery-i18n': 'lib/jquery-i18n-properties/jquery.i18n.properties',
        jqueryui: 'vendor/jquery/jquery-ui',
        modernizr: 'vendor/modernizr/modernizr',
        underscore: 'vendor/underscore/underscore',
        template: 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
        hogan: 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
        backbone: 'vendor/backbone/backbone',
        'backbone.picky': 'vendor/backbone/backbone.picky',
        validator: 'vendor/validator/validator',
        text: 'vendor/require/text',
        marionette: 'vendor/backbone/backbone.marionette',
        'foundation.core': 'vendor/foundation/js/foundation/foundation',
        'leaflet': 'vendor/leaflet/leaflet-src' //'vendor/leaflet/leaflet-0.7.3'

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
        'backbone.picky': ['backbone'],
        'marionette': {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        'jquery-i18n': {
            deps: ['jquery'],
            exports: 'jQuery.i18n'
        },
        'foundation.core': {
            deps: [
                'jquery',
                'modernizr'
            ],
            exports: 'Foundation'
        }
    }

});

define([
    'jquery',
    'foundation.core',
    'underscore',
], function ($, foundation) {

    $(document).foundation();
    require(['widgets/map/tests/popoverView/appMapView', 'widgets/map/models/CountriesMap'], 
        function(MapView, CountriesMap){
            var model = new CountriesMap();
            new MapView({
                el: '#main_content',
                model: model
            }).render();
    });
});
