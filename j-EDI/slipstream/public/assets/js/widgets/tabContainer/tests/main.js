/**
 * The Tab Container test page.
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
        validator: 'vendor/validator/validator',
        text: 'vendor/require/text',
        marionette: 'vendor/backbone/backbone.marionette',
        'foundation.core': 'vendor/foundation/js/foundation/foundation',
        jqueryTabs: 'vendor/jquery/tabs/jquery-ui-tabs',
        jqueryVerticalTabs: 'vendor/jquery/tabs/vertical-tabs',
        'jquery.tooltipster': 'vendor/jquery/jqTooltipster/jquery.tooltipster',
        jqueryDatepicker: 'vendor/jquery/jquery-ui-datepicker',
        'select2': 'vendor/jquery/select2/select2.full',
        marionette: 'vendor/backbone/backbone.marionette',
        'backbone.modal': "vendor/backbone/backbone.modal",
        'backbone.marionette.modals': "vendor/backbone/backbone.marionette.modals",
        mockjax: 'vendor/jquery/jquery.mockjax',
        progressbar: 'vendor/progressbar/progressbar.min',
        isInViewport: 'vendor/jquery/isInViewport/isInViewport',
        jqGrid: 'vendor/jquery/jqGrid/jquery.jqGrid',
        tagit: 'widgets/search/lib/tag-it',
        infiniteScroll: 'vendor/jquery/jqInfiniteScroll/jquery.infinite.scroll.helper.min',
        highcharts: 'vendor/highcharts/highcharts',
        'jquery.contextMenu': 'vendor/jquery/jqContextMenu/jquery.contextMenu'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        'progressbar': {
            exports: 'progressbar'
        },
        tagit: {
            deps: ['jquery','jqueryui'],
            exports: 'tagit'
        },
        infiniteScroll: {
            deps: ['jquery'],
            exports: 'infiniteScroll'
        },
        'highcharts': {
            deps: ['jquery'],
            exports: 'highcharts'
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
        'backbone.modal': {
            deps: ['backbone'],
            exports: 'Backbone.Modal'
        },
        'backbone.marionette.modals': {
            deps: ['backbone', 'marionette'],
            exports: 'Backbone.Marionette.Modals'
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
        'jqueryTabs': {
            deps: ['jquery'],
            exports: 'tabs'
        },
        'jqueryVerticalTabs': {
            deps: ['jqueryTabs']
        },
        'jquery.tooltipster': {
            deps: ['jquery'],
            exports: 'tooltipster'
        },
        jqueryDatepicker: {
            deps: ['jquery'],
            exports: 'jqueryDatepicker'
        },
        'select2': {
            deps: ['jquery'],
            exports: 'select2'
        }
    }

});

define([
    'jquery',
    'foundation.core',
    'underscore'
], function ($, foundation) {

    $(document).foundation();
    //Renders a Tab Container widget from a configuration object
   require(['widgets/tabContainer/tests/view/standardTabContainerWidget'], function(TestTabContainerView){
        new TestTabContainerView({
            el: $('#main_content')
        });
    });
});
