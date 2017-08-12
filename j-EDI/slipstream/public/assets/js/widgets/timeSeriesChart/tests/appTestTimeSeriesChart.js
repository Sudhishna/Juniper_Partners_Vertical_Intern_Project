/**
 * A view that uses the timeSeriesChartWidget to produce a sample timeSeries chart
 * This example shows a timeSeries chart displaying legend at the bottom
 * Legend is a box that displays name and color for items appearing on the chart
 *
 * @module Application Test TimeSeries Chart View
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'text!widgets/timeSeriesChart/templates/timeSeriesChart.html',
    'widgets/timeSeriesChart/timeSeriesChartWidget',
    './testData'
], function(Backbone, sampleTimeSeriesChartTemplate, TimeSeriesChartWidget, TestData){
    var TimeSeriesChartView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            var timeSeriesChartElement = this.$el;

            var options = {
                title: 'TimeSeries Chart with Legend',
                yAxisTitle: 'yAxis-Title',
                yAxisThreshold: {
                    value: 900,
                    color: '#ff0000'
                },
                //timeRangeSelectorEnabled: false,
                presetTimeRangesEnabled: true,
                data: TestData.data
            };

            var conf = {
                container: timeSeriesChartElement,
                options: options
            }
            
            var timeSeriesChartWidgetObj = new TimeSeriesChartWidget(conf);
            timeSeriesChartWidgetObj.build();        
            return this;
        }

    });

    return TimeSeriesChartView;
});