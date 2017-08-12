/**
 * Time Range Test Page.
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
        text: 'vendor/require/text',
        validator: 'vendor/validator/validator',
        highcharts: 'vendor/highcharts/highstock',
        highchartsmore: 'vendor/highcharts/highcharts-more',
        gridLocale: 'vendor/jquery/jqGrid/i18n/grid.locale-en',
        jqGrid: 'vendor/jquery/jqGrid/jquery.jqGrid',
        jqueryDatepicker: 'vendor/jquery/jquery-ui-datepicker',
        'jquery.tooltipster': 'vendor/jquery/jqTooltipster/jquery.tooltipster',
        'jquery-i18n': 'lib/jquery-i18n-properties/jquery.i18n.properties',
        'jquery.contextMenu': 'vendor/jquery/jqContextMenu/jquery.contextMenu',
        'backbone.modal': "vendor/backbone/backbone.modal",
        'backbone.marionette.modals': "vendor/backbone/backbone.marionette.modals",
        'mockjax': 'vendor/jquery/jquery.mockjax',
        tagit: 'widgets/search/lib/tag-it',
        jqueryTabs: 'vendor/jquery/tabs/jquery-ui-tabs',
        jqueryVerticalTabs: 'vendor/jquery/tabs/vertical-tabs',
        infiniteScroll: 'vendor/jquery/jqInfiniteScroll/jquery.infinite.scroll.helper.min',
        isInViewport: 'vendor/jquery/isInViewport/isInViewport',
        progressbar: 'vendor/progressbar/progressbar.min'            
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
        'highcharts': {
            deps: ['jquery'],
            exports: 'highcharts'
        },
        'highchartsmore': {
            deps: ['highcharts', 'jquery'],
            exports: 'highchartsmore'
        },
        jqGrid: {
            deps: ['jquery','jqueryui','gridLocale'],
            exports: 'jqGrid'
        },
        'jquery.tooltipster': {
            deps: [
                'jquery'
            ],
            exports: 'tooltipster'
        },
        'jquery-i18n': {
            deps: ['jquery'],
            exports: 'jQuery.i18n'
        },
        'jquery.contextMenu': {
            deps: ['jquery'],
            exports: '$.contextMenu'
        },
        'backbone.modal': {
            deps: ['backbone'],
            exports: 'Backbone.Modal'
        },
        'backbone.marionette.modals': {
            deps: ['backbone', 'marionette'],
            exports: 'Backbone.Marionette.Modals'
        },
        'isInViewport': {
            deps: ['jquery']
        },
        'infiniteScroll': {
          deps: ['jquery'],
          exports: 'infiniteScroll'
        }
    }
});

define([
    'jquery',
    'underscore'
], function ($) {
    require([ 'widgets/timeRange/tests/appTestGrid'], function (TimeRangeView) {
        new TimeRangeView({
            el: $('#timeRange1')
        });
    });

    require([ 'widgets/timeRange/tests/appTestBarChart'], function (TimeRangeView) {
        new TimeRangeView({
            el: $('#timeRange2')
        });
    });

    require([ 'widgets/timeRange/tests/appTestMultiData'], function (TimeRangeView) {
        new TimeRangeView({
            el: $('#timeRange3')
        });
    });

    require([ 'widgets/timeRange/tests/appTestSetTimeRange'], function (TimeRangeView) {
        new TimeRangeView({
            el: $('#timeRange4')
        });
    });
});

