/**
 * A view that uses the barChartWidget to produce a sample bar chart
 * This example shows a bar chart displaying Top 10 Destination IP Addresses
 * Hostnames are displayed within the tooltips
 *
 * @module Application Test Top Destination IPs Bar Chart View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'text!widgets/barChart/templates/barChart.html',
    'widgets/barChart/barChartWidget'
], function(Backbone, sampleBarChartTemplate, BarChartWidget){
    var BarChartView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            var barChartElement = this.$el;

            var options = {
                type: 'column',
                width: 600,
                height: 400,
                title: 'Column: Top 10 Destination IP Addresses (with tooltips)',
                xAxisTitle: 'Destination IP Addresses',
                yAxisTitle: 'Count',
                categories: ['192.168.1.11', '192.168.1.12', '192.168.1.13', '192.168.1.14', '192.168.1.15', '192.168.1.16', '192.168.1.17', '192.168.1.18', '192.168.1.19', '192.168.1.20'],
                tooltip: ['hostname-11', 'hostname-12', 'hostname-13', 'hostname-14', 'hostname-15', 'hostname-16', 'hostname-17', 'hostname-18', 'hostname-19' ,'hostname-20'],
                data: [90, 80, 75, 73, 72, 63, 39, 32, 20, 10]
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