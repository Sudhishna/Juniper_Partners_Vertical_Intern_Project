/**
 * Spinner Test Page.
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

require.config({
    baseUrl: '/assets/js',
    paths: {
        jquery: 'vendor/jquery/jquery',
        jqueryui: 'vendor/jquery/jquery-ui',
        underscore: 'vendor/underscore/underscore',
        template: 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
        hogan: 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
        backbone: 'vendor/backbone/backbone',
        marionette: 'vendor/backbone/backbone.marionette',
        progressbar: 'vendor/progressbar/progressbar.min',
        text: 'vendor/require/text',
        validator: 'vendor/validator/validator',
        jqueryDatepicker: 'vendor/jquery/jquery-ui-datepicker',
        'backbone.modal': "vendor/backbone/backbone.modal",
        'jquery.tooltipster': 'vendor/jquery/jqTooltipster/jquery.tooltipster',
        'backbone.marionette.modals': "vendor/backbone/backbone.marionette.modals"
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
        'progressbar': {
            exports: 'progressbar'
        },
        'backbone.modal': {
            deps: ['backbone'],
            exports: 'Backbone.Modal'
        },
        'backbone.marionette.modals': {
            deps: ['backbone', 'marionette'],
            exports: 'Backbone.Marionette.Modals'
        }
    }
});

define([
    'jquery',
    'underscore'
], function ($) {
    require([ 'widgets/spinner/tests/appDeterminateSpinner'], function (SpinnerView) {
        new SpinnerView({
            el: $('#spinner1')
        });
    });

    require([ 'widgets/spinner/tests/appIndeterminateSpinner'], function (SpinnerView) {
        new SpinnerView({
            el: $('#spinner2')
        });
    });

    require([ 'widgets/spinner/tests/appOverlaySpinner'], function (SpinnerView) {
        new SpinnerView({
            el: $('#spinner3')
        });
    });
});

