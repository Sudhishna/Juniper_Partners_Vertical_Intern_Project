/**
 * The Time widget test page.
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

require.config({
    baseUrl: '/assets/js',
    paths: {
        jquery: 'vendor/jquery/jquery',
        "jquery-i18n": 'lib/jquery-i18n-properties/jquery.i18n.properties',
        jqueryui: 'vendor/jquery/jquery-ui',
        modernizr: 'vendor/modernizr/modernizr',
        underscore: 'vendor/underscore/underscore',
        template: 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
        hogan: 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
        backbone: 'vendor/backbone/backbone',
        marionette: 'vendor/backbone/backbone.marionette',
        validator: 'vendor/validator/validator',
        text: 'vendor/require/text',
        'foundation.core': 'vendor/foundation/js/foundation/foundation',
        'foundation.tooltip': 'vendor/foundation/js/foundation/foundation.tooltip',
        'backbone.picky': 'vendor/backbone/backbone.picky',
        jqueryDatepicker: 'vendor/jquery/jquery-ui-datepicker'

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
        'marionette': {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        'foundation.core': {
            deps: [
                'jquery',
                'modernizr'
            ]
        },
        'foundation.tooltip': {
            deps: ['foundation.core']
        },
        'jquery-i18n': {
            deps: ['jquery'],
            exports: 'jQuery.i18n'
        },
        'backbone.picky': ['backbone'],
        'jqueryDatepicker': {
            deps: ['jquery'],
            exports: 'jqueryDatepicker'
        }
    }
});

define([
    'jquery',
    'foundation.core',
    /* 'Slipstream',*/
    'foundation.tooltip'
], function ($, foundation/*,Slipstream*/) {
    $(document).foundation();
//    Slipstream.boot();
//    Slipstream.vent.on("framework:booted", function () {
    //Renders a programmatic form and incorporates the elements of Time widget
        require(['widgets/time/tests/appTestProgrammatic'], function (TimeView) {
            new TimeView({});
        });

    //Renders a declarative form and incorporates the elements of Time widget
    require(['widgets/time/tests/appTestDeclarative'], function (TimeView) {
        new TimeView({
            el: '#test_widget_declarative'
        });
    });

    // Test example to show Time widget integrated with Form widget
        require(['widgets/time/tests/appFormIntegration'], function (TimeFormWidgetView) {
            new TimeFormWidgetView({
                el: '#test_integrated_timeWidget'
            });
        });
//    });
});
