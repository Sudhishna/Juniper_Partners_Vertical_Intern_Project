/**
 * A view that uses the barChartWidget to produce a sample bar chart
 * This example shows a bar chart displaying Top 10 Source IP Addresses
 * Hostnames are displayed within the tooltips
 *
 * @module Application Test Top Source IPs Bar Chart View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'text!widgets/barChart/templates/barChart.html',
    'widgets/barChart/barChartWidget'
], function(Backbone, sampleBarChartTemplate, BarChartWidget){
    var BarChartView = Backbone.View.extend({

        // initialize: function () {
        //     this.render();
        // },

        render: function () {
            var barChartElement = this.$el;

            var tooltipArr = ['88,000,000', '81,000,000', '75,000,000', '73,000,000', '72,000,000', '63,000,000', '39,000,000', '32,000,000', '21,000,000', '100'];

            var options = {
                type: 'bar',
                title: 'Bar: Top 10 Source IP Addresses (with tooltips)',
                xAxisTitle: 'Source IP Addresses',
                yAxisTitle: 'Count',
                categories: ['192.168.1.1', '192.168.1.2', '192.168.1.3', '192.168.1.4', '192.168.1.5', '192.168.1.6', '192.168.1.7', '192.168.1.8', '192.168.1.9', '192.168.1.10'],
                tooltip: tooltipArr,
                data: [88000000, 81000000, 75000000, 73000000, 72000000, 63000000, 39000000, 32000000, 21000000, 100]
            };

            var conf = {
                container: barChartElement,
                options: options
            }

            var barChartWidgetObj = new BarChartWidget(conf);
            barChartWidgetObj.build();
            return this;
        }

    });

    return BarChartView;
});
