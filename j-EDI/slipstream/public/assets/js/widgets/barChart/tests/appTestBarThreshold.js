/**
 * A view that uses the barChartWidget to produce a sample bar chart
 * This example shows a bar chart displaying individual bars with configurable threshold values.
 * Each bar has a different threshold value & threshold color respectively
 * No threshold is displayed when threshold parameter set to empty array
 * Labels have a % string appended at the end
 *
 * @module Application Sample chart with threshold values for individual bars
 * @author Vidushi Gupta <vidgupta@juniper.net>
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
                title: 'Bar: Different combinations of threshold values and colors',
                xAxisTitle: '',
                yAxisTitle: '',
                yAxisLabelFormat: '%',
                categories: ['Bar 1', 'Bar 2', 'Bar 3', 'Bar 4', 'Bar 5', 'Bar 6'],
                data: [
                    // different combination of threshold & threshold colors to indicate how the different bars will look.
                    { y: 85, threshold: {values: [], colors: []}},
                    { y: 85, threshold: {values: [], colors: ['#78bb4c']}},
                    { y: 50, threshold: {values: [25], colors: ['#78bb4c', '#f58b39']}},
                    { y: 70, threshold: {values: [20, 45], colors: ['#78bb4c', '#f58b39', '#ec1c24']}},
                    { y: 80, threshold: {values: [25, 50, 60], colors: ['#78bb4c', '#f58b39', '#ec1c24', '#ec1c24']}},
                    { y: 10, threshold: {values: [30, 55], colors: ['#78bb4c', '#f58b39', '#ec1c24']}}
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