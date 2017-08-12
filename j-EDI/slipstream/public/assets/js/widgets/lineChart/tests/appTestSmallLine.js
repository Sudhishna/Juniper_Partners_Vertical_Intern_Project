/**
 * A view that uses the lineChartWidget to produce a sample line chart
 * This example shows a small line chart
 *
 * @module Application Test Line Chart View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/lineChart/lineChartWidget'
], function(Backbone, LineChartWidget){
    var LineChartView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            var lineChartElement = this.$el;

            var options = {
                xAxisTitle: '',
                yAxisTitle: 'Count',
                categories: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5'],
                maxLabelSize: 10,

                // Legend at the bottom
                legend: {
                    enabled: true,
                    position: 'bottom'
                },

                // Line chart data
                lines: [{
                    name: 'Device 1',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2]
                }, {
                    name: 'Device 2',
                    data: [2.0, 5.0, 5.7, 11.3, 17.0]
                }, {
                    name: 'Device 3',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9]
                }]
            };

            var conf = {
                container: lineChartElement,
                options: options
            }

            var lineChartWidgetObj = new LineChartWidget(conf);
            lineChartWidgetObj.build();

            return this;
        }

    });

    return LineChartView;
});