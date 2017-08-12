/**
 * A view that uses the TimeRangeWidget to produce a sample time range
 * This example shows how to interact between charts and time range
 *
 * @module Application Test Time Range View
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/timeRange/timeRangeWidget',
    'widgets/barChart/barChartWidget',
    './testData',
    'mockjax'
], function(Backbone, TimeRangeWidget, BarChartWidget, TestData, mockjax){
    var TimeRangeView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            var self = this,
                timeRangeWidgetObj = new TimeRangeWidget(this.returnConf(this.$el));
            
            timeRangeWidgetObj.build();    

            var options = {
                type: 'bar',
                title: 'Bar: Top 10 Source IP Addresses (with tooltips)',
                xAxisTitle: 'Source IP Addresses',
                yAxisTitle: 'Count',
                categories: ['192.168.1.1', '192.168.1.2', '192.168.1.3', '192.168.1.4', '192.168.1.5', '192.168.1.6', '192.168.1.7', '192.168.1.8', '192.168.1.9', '192.168.1.10'],
                tooltip: ['hostname-1', 'hostname-2', 'hostname-3', 'hostname-4', 'hostname-5', 'hostname-6', 'hostname-7', 'hostname-8', 'hostname-9' ,'hostname-10'],
                data: [88, 81, 75, 73, 72, 63, 39, 32, 21, 1]                   
            };

            var conf = {
                container: $('#barchart'),
                options: options
            }
            
            this.barChartWidgetObj = new BarChartWidget(conf);
            this.barChartWidgetObj.build();
         
            return this;
        },
        returnConf: function(el){
            var self = this,
                afterSetTimeRangeFn = function(event, data){
                    var options = {
                        categories: ['192.168.1.1', '192.168.1.2', '192.168.1.3', '192.168.1.4', '192.168.1.5', '192.168.1.6', '192.168.1.7', '192.168.1.8', '192.168.1.9', '192.168.1.10'],
                        data:[8, 11, 25, 43, 76, 63, 39, 32, 21, 1]
                    };
                    self.barChartWidgetObj.update(options);
                };

            return {
                container: el,
                options: { data: TestData.navigatorData.data,  
                           afterSetTimeRange: afterSetTimeRangeFn
                }
            }
        }

    });

    return TimeRangeView;
});