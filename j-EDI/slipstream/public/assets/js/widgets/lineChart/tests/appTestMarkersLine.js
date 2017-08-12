/**
 * A view that uses the lineChartWidget to produce a sample line chart
 * This example shows lines with markers displayed
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
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                maxLabelSize: 10,

                // Enable markers
                markers: {
                    enabled: true,
                },

                // Line chart data
                lines: [{
                    name: 'Device 1',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'Device 2',
                    data: [2.0, 5.0, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }, {
                    name: 'Device 3',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
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