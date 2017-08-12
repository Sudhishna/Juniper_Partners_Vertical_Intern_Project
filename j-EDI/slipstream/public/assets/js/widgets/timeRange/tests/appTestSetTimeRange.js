/**
 * A view that uses the TimeRangeWidget to produce a sample time range
 * This example shows how to set min/max extremes for the time range
 *
 * @module Application Test Time Range View
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/timeRange/timeRangeWidget',
    './testData',
    'mockjax'
], function(Backbone, TimeRangeWidget, TestData, mockjax){
    var TimeRangeView = Backbone.View.extend({
        events: {
            'click #set': 'setTimeRange'
        },
        initialize: function () {
            this.render();
        },

        render: function () {
            var timeRangeElement = this.$el.find('#timeRange4Container');

            this.timeRangeWidgetObj = new TimeRangeWidget(this.returnConf(timeRangeElement));
            this.timeRangeWidgetObj.build();   
        
            return this;
        },
        returnConf: function(el){
            return {
                container: el,
                options: { data: TestData.navigatorData.data }
            }
        },
        
        setTimeRange: function(){
            var extremes = this.timeRangeWidgetObj.getTimeRange();
                min = extremes.max - 300 * 1000,
                max = extremes.max;
            this.timeRangeWidgetObj.setTimeRange(min, max);
        }

    });

    return TimeRangeView;
});