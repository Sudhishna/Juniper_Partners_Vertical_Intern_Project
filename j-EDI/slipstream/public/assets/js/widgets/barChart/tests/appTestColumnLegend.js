/**
 * A view that uses the barChartWidget to produce a sample column chart
 * This example shows a column chart displaying legend at the bottom
 * Legend is a box that displays name and color for items appearing on the chart
 *
 * @module Application Test Legend Column Chart View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'text!widgets/barChart/templates/barChart.html',
    'widgets/barChart/barChartWidget'
], function (Backbone, sampleBarChartTemplate, BarChartWidget) {
    var BarChartView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            var barChartElement = this.$el;

            var options = {
                type: 'column',
                width: 500,
                height: 300,
                title: 'Column: Displaying Legend (multi-color with tooltips)',
                xAxisTitle: 'Features',
                yAxisTitle: 'Number of Attacks',
                categories: ['DNS-1', 'DNS-2','DNS-3', 'TCP-1', 'TCP-2', 'TCP-3','LPR-1','LPR-2', 'VNC-1', 'VNC-2'],
                tooltip: ['DNS-1', 'DNS-2','DNS-3', 'TCP-1', 'TCP-2', 'TCP-3','LPR-1','LPR-2', 'VNC-1', 'VNC-2'],
                legend: [{ name: 'Critical', color: '#EC1C24'},
                         { name: 'Major', color: '#F58b39'},
                         { name: 'Minor', color: '#ECEC20'},
                         { name: 'Warning', color: '#800080'},
                         { name: 'Info', color: '#0000FF'}],
                data: [{ y: 90, color: '#EC1C24'},
                       { y: 80, color: '#F58B39'},
                       { y: 75, color: '#ECEC20'},
                       { y: 73, color: '#800080'},
                       { y: 72, color: '#EC1C24'},
                       { y: 63, color: '#0000FF'},
                       { y: 39, color: '#ECEC20'},
                       { y: 32, color: '#800080'},
                       { y: 20, color: '#0000FF'},
                       { y: 10, color: '#EC1C24'}]
            };

            var conf = {
                container: barChartElement,
                options: options
            };

            var barChartWidgetObj = new BarChartWidget(conf);
            barChartWidgetObj.build();
            return this;
        }

    });

    return BarChartView;
});