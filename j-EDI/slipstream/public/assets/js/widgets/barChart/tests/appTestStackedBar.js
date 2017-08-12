/**
 * A view that uses the barChartWidget to produce a sample bar chart
 * This example shows a stacked bar chart displaying devices with most alarms
 *
 * @module Application Test Stacked Bar Chart View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
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

            var tooltipArr = [ 'Device: 192.168.1.1' + '<br>' + 'Minor: 30' + '<br>' + 'Major: 40', 
                               'Device: 192.168.1.2' + '<br>' + 'Minor: 25' + '<br>' + 'Major: 35',
                               'Device: 192.168.1.3' + '<br>' + 'Minor: 20' + '<br>' + 'Major: 25',
                               'Device: 192.168.1.4' + '<br>' + 'Minor: 20' + '<br>' + 'Major: 20',
                               'Device: 192.168.1.5' + '<br>' + 'Minor: 25' + '<br>' + 'Major: 10'
                             ];
            
            var options = {
                type: 'stacked-bar',
                title: 'Stacked Bar Chart',
                xAxisTitle: 'Devices',
                yAxisTitle: 'Alarm Count',
                categories: ['192.168.1.1', '192.168.1.2', '192.168.1.3', '192.168.1.4', '192.168.1.5'],
                tooltip: tooltipArr,
                data: [ {
                            name: 'Major',
                            color: '#ec1c24', //red
                            //color: '#f17a21', //orange
                            y: [40, 35, 25, 20, 10]
                        },
                        {
                            name: 'Minor',
                            color: '#fbae17', //yellow
                            y: [30, 25, 20, 20, 25]
                        }
                ]
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