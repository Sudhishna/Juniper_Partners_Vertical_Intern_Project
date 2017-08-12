/**
 * A view that uses the barChartWidget to produce a sample bar chart
 * This example shows a bar chart displaying NAT Pool Usage
 * Each bar has a different color
 * Labels have a % string appended at the end
 * Threshold lines are displayed on the y axis
 *
 * @module Application Test NAT Pool Usage Bar Chart View
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
                type: 'bar',
                title: 'NAT Pool Usage (with 2 vertical threshold lines)',
                xAxisTitle: '',
                yAxisTitle: '',
                yAxisThreshold: [50, 80],
                yAxisLabelFormat: '%',
                categories: ['Pool 1', 'Pool 2', 'Pool 3', 'Pool 4'],
                data: [{ y: 90, color: getColor(90)},
                       { y: 70, color: getColor(70)},
                       { y: 45, color: getColor(45)},
                       { y: 32, color: getColor(32)}]
            };

            var conf = {
                container: barChartElement,
                options: options
            };

            // Example showing how to call functions within conf
            function getGreenColor() {
                return '#78BB4C';
            }

            function getColor(datum){
                if(datum <= 32){
                    return '#78BB4C'
                }else if(datum <= 45){
                    return getGreenColor();
                }else if(datum <= 70){
                    return '#F58B39';
                }else if(datum <=90){
                    return '#EC1C24';
                }
            }

            var barChartWidgetObj = new BarChartWidget(conf);
            barChartWidgetObj.build();
            return this;
        }

    });

    return BarChartView;
});