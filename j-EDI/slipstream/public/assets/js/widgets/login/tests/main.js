/**
 * The Login test page.
 * @copyright Juniper Networks, Inc. 2014
 * @author Miriam Hadfield <mhadfield@juniper.net>
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
        'backbone.picky': 'vendor/backbone/backbone.picky',
        validator: 'vendor/validator/validator',
        text: 'vendor/require/text',
        marionette: 'vendor/backbone/backbone.marionette',
        'backbone.modal': "vendor/backbone/backbone.modal",
        'backbone.marionette.modals': "vendor/backbone/backbone.marionette.modals",
        'backbone.syphon': 'vendor/backbone/backbone.syphon',
        'foundation.core': 'vendor/foundation/js/foundation/foundation',
        jqueryDatepicker: 'vendor/jquery/jquery-ui-datepicker',
        'jquery.tooltipster': 'vendor/jquery/jqTooltipster/jquery.tooltipster',
        'mockjax': 'vendor/jquery/jquery.mockjax',
        progressbar: 'vendor/progressbar/progressbar.min'
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
        },
        'jqueryDatepicker': {
            deps: ['jquery'],
            exports: 'jqueryDatepicker'
        },
        'backbone.modal': {
            deps: [ 'backbone'],
            exports: 'Backbone.Modal'
        },
        'backbone.marionette.modals': {
            deps: [ 'backbone', 'marionette'],
            exports: 'Backbone.Marionette.Modals'
        },
        'backbone.syphon': {
            deps: [ 'backbone'],
            exports: 'Backbone.Syphon'
        },
        'jquery.tooltipster': {
            deps: [
                'jquery'
            ],
            exports: 'tooltipster'
        }
    }

});

define([
    'jquery',
    'foundation.core',
    'underscore'
], function ($, foundation) {
    $(document).foundation();

    require(['widgets/login/tests/appLogin'], function(LoginView){
        new LoginView({
            el: '#main_content'
        }).render();
    });

});

