/**
 * Line Chart Test Page.
 * @copyright Juniper Networks, Inc. 2016
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
        highcharts: 'vendor/highcharts/highcharts'
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
        }
    }
});

require([ 'widgets/lineChart/tests/appTestBasicLine'], function (LineChartView) {
    new LineChartView({
        el: $('#linechart-basic')
    });
});

require([ 'widgets/lineChart/tests/appTestMarkersLine'], function (LineChartView) {
    new LineChartView({
        el: $('#linechart-markers')
    });
});

require([ 'widgets/lineChart/tests/appTestMultipleMarkersLine'], function (LineChartView) {
    new LineChartView({
        el: $('#linechart-multiple-markers')
    });
});

require([ 'widgets/lineChart/tests/appTestCustomColorsLine'], function (LineChartView) {
    new LineChartView({
        el: $('#linechart-custom-colors')
    });
});
require([ 'widgets/lineChart/tests/appTestSmallLine'], function (LineChartView) {
    new LineChartView({
        el: $('#linechart-small')
    });
});