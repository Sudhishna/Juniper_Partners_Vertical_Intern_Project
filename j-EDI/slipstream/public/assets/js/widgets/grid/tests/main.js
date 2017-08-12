/**
 * The Grid Widget test page.
 * @copyright Juniper Networks, Inc. 2014
 * @author Miriam Hadfield <mhadfield@juniper.net>
 */

require.config({
    baseUrl: '/assets/js',
    paths: {
        jquery: 'vendor/jquery/jquery',
        jqueryui: 'vendor/jquery/jquery-ui',
        modernizr: 'vendor/modernizr/modernizr',
        underscore: 'vendor/underscore/underscore',
        template: 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
        hogan: 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
        backbone: 'vendor/backbone/backbone',
        validator: 'vendor/validator/validator',
        text: 'vendor/require/text',
        'foundation.core': 'vendor/foundation/js/foundation/foundation',
        jqueryDatepicker: 'vendor/jquery/jquery-ui-datepicker',
        gridLocale: 'vendor/jquery/jqGrid/i18n/grid.locale-en',
        jqGrid: 'vendor/jquery/jqGrid/jquery.jqGrid',
        marionette: 'vendor/backbone/backbone.marionette',
        'backbone.modal': "vendor/backbone/backbone.modal",
        'backbone.marionette.modals': "vendor/backbone/backbone.marionette.modals",
        'jquery.contextMenu': 'vendor/jquery/jqContextMenu/jquery.contextMenu',
        'jquery.tooltipster': 'vendor/jquery/jqTooltipster/jquery.tooltipster',
        'select2': 'vendor/jquery/select2/select2.full',
        'mockjax': 'vendor/jquery/jquery.mockjax',
        tagit: 'widgets/search/lib/tag-it',
        jqueryTabs: 'vendor/jquery/tabs/jquery-ui-tabs',
        jqueryVerticalTabs: 'vendor/jquery/tabs/vertical-tabs',
        isInViewport: 'vendor/jquery/isInViewport/isInViewport',
        infiniteScroll: 'vendor/jquery/jqInfiniteScroll/jquery.infinite.scroll.helper.min',
        progressbar: 'vendor/progressbar/progressbar.min',
        'MutationObserver': 'vendor/MutationObserver.js/MutationObserver'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        template: {
            exports: 'template'
        },
        hogan: {
            deps: ['template'],
            exports: 'Hogan'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'marionette': {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        modernizr: {
            exports: 'Modernizr'
        },
        'foundation.core': {
            deps: ['jquery','modernizr']
        },
        jqueryDatepicker: {
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
        'jquery.contextMenu': {
            deps: ['jquery'],
            exports: '$.contextMenu'
        },
        'jquery.tooltipster': {
            deps: ['jquery'],
            exports: 'tooltipster'
        },
        'select2': {
            deps: ['jquery'],
            exports: 'select2'
        },
        tagit: {
            deps: ['jquery','jqueryui'],
            exports: 'tagit'
        },
        'jqueryTabs': {
            deps: ['jquery'],
            exports: 'tabs'
        },
        'jqueryVerticalTabs': {
            deps: ['jqueryTabs']
        },
        'isInViewport': {
            deps: ['jquery']
        },
        infiniteScroll: {
          deps: ['jquery'],
          exports: 'infiniteScroll'
        },        
        'MutationObserver': {
            exports: 'MutationObserver'
        }
    }
});

define([
    'jquery',
    'foundation.core',
    'underscore'
], function ($, foundation) {
    $(document).foundation();

    //Renders a list of the available test for the grid widget
    require(['widgets/grid/tests/appGrid'], function(GridWidgetView){
        new GridWidgetView({
            el: '.test_grid_widget'
        });
    });

});
