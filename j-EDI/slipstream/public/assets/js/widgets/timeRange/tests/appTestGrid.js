/**
 * A view that uses the timeRangeWidget to produce a sample time range
 * This example shows how to interact between grid and time range
 *
 * @module Application Test Time Range View
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/timeRange/timeRangeWidget',
    'widgets/grid/gridWidget',
    'widgets/timeRange/tests/conf/gridConfiguration',
    './testData',
    'mockjax'
], function(Backbone, TimeRangeWidget, GridWidget, GridConfiguration, TestData, mockjax){
    var TimeRangeView = Backbone.View.extend({

        initialize: function () {
            this.mockApiResponse();
            this.render();
        },

        render: function () {
            var self = this,
                timeRangeWidgetObj = new TimeRangeWidget(this.returnConf(this.$el));
            
            timeRangeWidgetObj.build();   

            this.grid = new GridWidget({
                container: $('#grid'),
                elements: GridConfiguration.smallGrid
            });
            this.grid.build();

            return this;
        },
        returnConf: function(el){

            var self = this,
                afterSetTimeRangeFn = function(event, data){
                    self.grid.search('test');
                };

            return {
                container: el,
                options: { data: TestData.navigatorData.data,  
                           afterSetTimeRange: afterSetTimeRangeFn
                }
            }
        },

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function(){
            var data = TestData;
            $.mockjax({
                url: '/api/get-data',
                dataType: 'json',
                response: function(settings) {
                    var urlHash = {},
                        seg = settings.data.split('&');
                    for (var i=0;i<seg.length;i++) {
                        if (!seg[i]) { continue; }
                        var s = seg[i].split('=');
                        urlHash[s[0]] = s[1];
                    }
                    switch(urlHash.searchAll){
                        case "true":
                            this.responseText = data.gridFilterData;
                            break;
                        default:
                            this.responseText = data.gridData;
                    }
                },
                responseTime: 10
            });
        }
    });

    return TimeRangeView;
});