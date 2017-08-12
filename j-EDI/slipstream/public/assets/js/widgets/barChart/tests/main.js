/**
 * Bar Chart Test Page.
 * @copyright Juniper Networks, Inc. 2014
 * @author Sujatha Subbarao <sujatha@juniper.net>
 */

require.config({
    baseUrl: '/assets/js',
    paths: {
        jquery: 'vendor/jquery/jquery',
        underscore: 'vendor/underscore/underscore',
        template: 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
        hogan: 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
        backbone: 'vendor/backbone/backbone',
        marionette: 'vendor/backbone/backbone.marionette',
        text: 'vendor/require/text',
        validator: 'vendor/validator/validator',
        highcharts: 'vendor/highcharts/highcharts',
        highchartsmore: 'vendor/highcharts/highcharts-more'
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
        }
    }
});

require([ 'widgets/barChart/tests/appTestStackedBar'], function (BarChartView) {
    new BarChartView({
        el: $('#stacked-barchart')
    });
});

require([ 'widgets/barChart/tests/appTestTopSourceIPs'], function (BarChartView) {
    new BarChartView({
        el: $('#barchart-top-source-ips')
    });
});

require([ 'widgets/barChart/tests/appTestTopDestIPs'], function (BarChartView) {
    new BarChartView({
        el: $('#barchart-top-dest-ips')
    });
});

require([ 'widgets/barChart/tests/appTestDeviceUtil'], function (BarChartView) {
    new BarChartView({
        el: $('#barchart-device-util')
    });
});

require([ 'widgets/barChart/tests/appTestNatPoolUsage'], function (BarChartView) {
    new BarChartView({
        el: $('#barchart-nat-pool')
    });
});

require([ 'widgets/barChart/tests/appTestBarThreshold'], function (BarChartView) {
    new BarChartView({
        el: $('#barchart-threshold')
    });
});

require([ 'widgets/barChart/tests/appTestBarLegend'], function (BarChartView) {
    new BarChartView({
        el: $('#barchart-legend')
    });
});

require([ 'widgets/barChart/tests/appTestColumnLegend'], function (BarChartView) {
    new BarChartView({
        el: $('#columnchart-legend')
    });
});