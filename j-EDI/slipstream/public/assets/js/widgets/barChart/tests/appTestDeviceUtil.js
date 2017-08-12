/**
 * A view that uses the barChartWidget to produce a sample bar chart
 * This example shows a bar chart displaying Device Utilization with bar individual threshold values
 * Each bar has a different threshold value & threshold color respectively
 * Labels have a % string appended at the end
 *
 * @module Application Test Device Utilization Bar Chart View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
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
                title: 'Device Utilization (with 2 individual threshold lines per bar)',
                xAxisTitle: '',
                yAxisTitle: '',
                yAxisLabelFormat: '%',
                categories: ['CPU (Control)', 'CPU (Data)', 'Memory (Control)', 'Memory (Data)', 'Storage'],
                data: [
                    { y: 85, threshold: {values: [50, 80], colors: ['#78bb4c', '#f58b39', '#ec1c24']}},
                    { y: 50, threshold: {values: [50, 80], colors: ['#78bb4c', '#f58b39', '#ec1c24']}},
                    { y: 91, threshold: {values: [70, 90], colors: ['#78bb4c', '#f58b39', '#ec1c24']}},
                    { y: 30, threshold: {values: [70, 90], colors: ['#78bb4c', '#f58b39', '#ec1c24']}},
                    { y: 72, threshold: {values: [70, 90], colors: ['#78bb4c', '#f58b39', '#ec1c24']}}
                ]
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