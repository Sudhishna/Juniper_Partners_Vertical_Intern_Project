/**
 * The Datepicker test page.
 * @copyright Juniper Networks, Inc. 2014
 * @author vidushi gupta <vidushi@juniper.net>
 */

require.config({
    baseUrl: '/assets/js',
    paths: {
        jquery: 'vendor/jquery/jquery',
        "jquery-i18n": 'lib/jquery-i18n-properties/jquery.i18n.properties',
        underscore: 'vendor/underscore/underscore',
        template: 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
        hogan: 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
        backbone: 'vendor/backbone/backbone',
        marionette: 'vendor/backbone/backbone.marionette',
        text: 'vendor/require/text',
        validator: 'vendor/validator/validator',
        'backbone.picky': 'vendor/backbone/backbone.picky',
        jqueryDatepicker: 'vendor/jquery/jquery-ui-datepicker'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'template': {
            exports: 'template'
        },
        'hogan': {
            deps: [ 'template' ],
            exports: 'Hogan'
        },
        'backbone': {
            deps: [ 'underscore', 'jquery'],
            exports: 'Backbone'
        },
        'marionette': {
            deps: ['backbone'],
            exports: 'Marionette'
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

//    Renders a programmatic approach of datepicker
require([ 'widgets/datepicker/tests/appTestProgrammatic'/*, 'Slipstream'*/], function (DatepickerView/*, Slipstream*/) {
//    Slipstream.boot();
//    Slipstream.vent.on("framework:booted", function () {
    new DatepickerView({});
//    });
});

//    Renders a declarative form from the declarativeFormSample.html in template folder
require([ 'widgets/datepicker/tests/appTestDeclarative'/*, 'Slipstream'*/], function (DatepickerView/*, Slipstream*/) {
//    Slipstream.vent.on("framework:booted", function () {
    new DatepickerView({
        el: $('#test_widget')
    });
//    });
});

//    Renders a declarative form to validate different dateformats
require([ 'widgets/datepicker/tests/appTestDatepickerFormats'/*, 'Slipstream'*/], function (DatepickerView/*, Slipstream*/) {
//    Slipstream.vent.on("framework:booted", function () {
    new DatepickerView({
        el: $('#test_date_formats')
    });
//    });
});
//    Renders a declarative form to validate different dateformats
require([ 'widgets/datepicker/tests/appTestDateRange'/*, 'Slipstream'*/], function (DatepickerView/*, Slipstream*/) {
//    Slipstream.vent.on("framework:booted", function () {
    new DatepickerView({
        el: $('#test_date_range')
    });
//    });
});