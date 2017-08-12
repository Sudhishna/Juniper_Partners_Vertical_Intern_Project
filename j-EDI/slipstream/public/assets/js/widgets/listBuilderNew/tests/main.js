/**
 * The List Builder test page.
 * @copyright Juniper Networks, Inc. 2015
 * @author Eva Wang <iwang@juniper.net>
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
        gridLocale: 'vendor/jquery/jqGrid/i18n/grid.locale-en',
        jqGrid: 'vendor/jquery/jqGrid/jquery.jqGrid',
        marionette: 'vendor/backbone/backbone.marionette',
        jqueryTabs: 'vendor/jquery/tabs/jquery-ui-tabs',
        jqueryVerticalTabs: 'vendor/jquery/tabs/vertical-tabs',
        'foundation.core': 'vendor/foundation/js/foundation/foundation',
        jqueryDatepicker: 'vendor/jquery/jquery-ui-datepicker',
        'jquery.tooltipster': 'vendor/jquery/jqTooltipster/jquery.tooltipster',
        'jquery.contextMenu': 'vendor/jquery/jqContextMenu/jquery.contextMenu',
        'mockjax': 'vendor/jquery/jquery.mockjax',
        'backbone.modal': "vendor/backbone/backbone.modal",
        progressbar: 'vendor/progressbar/progressbar.min',
        isInViewport: 'vendor/jquery/isInViewport/isInViewport',
        'backbone.marionette.modals': "vendor/backbone/backbone.marionette.modals"
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
        jqGrid: {
            deps: ['jquery','jqueryui','gridLocale'],
            exports: 'jqGrid'
        },
        'backbone.modal': {
            deps: ['backbone'],
            exports: 'Backbone.Modal'
        },
        'backbone.marionette.modals': {
            deps: ['backbone', 'marionette'],
            exports: 'Backbone.Marionette.Modals'
        },
        'jquery.tooltipster': {
            deps: [
                'jquery'
            ],
            exports: 'tooltipster'
        },
        'isInViewport': {
            deps: ['jquery']
        }
    }

});

define([
    'jquery',
    'foundation.core',
    'underscore'
], function ($, foundation) {

    $(document).foundation();
    //Renders a list builder from the elements configuration file
    require(['widgets/listBuilderNew/tests/appListBuilder'], function(ListBuilderView){
        new ListBuilderView({
            el: $('#main_content')
        });
    });
});
