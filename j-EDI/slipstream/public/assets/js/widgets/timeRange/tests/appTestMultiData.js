/**
 * A view that uses the timeRangeWidget to produce a sample time range
 * This example shows how to add multiple series data into the time range
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
        events: {
            'click #remove': 'removeSeries',
            'click #critical, #major, #minor, #warning': 'toggleSeries'
        },

        initialize: function () {
            this.render();
            this.criticalStatus = this.majorStatus = this.minorStatus = this.warningStatus = false;

        },

        render: function () {
            var timeRangeElement = this.$el.find('#timeRange3Container');

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

        addSeries: function(data, el){
            this.timeRangeWidgetObj.addSeries({
                name: data.name,
                color: data.color,
                data : data.points
            });
            el.find('.default').css('background-color', data.color).next().css('color', '#333');
        },

        removeSeries: function(name, el){
            this.timeRangeWidgetObj.removeSeries(name);
            el.find('.default').css('background-color', '#CCC').next().css('color', '#CCC');
        },
     
        toggleSeries: function(e){
            var parent_node = e.target.parentNode,
                node_id = parent_node.id,
                variable = node_id + 'Status';
            if (this[variable] === true){
                if (node_id){
                    this.removeSeries($(parent_node).attr('data-name'), $(parent_node));
                    this[variable] = false;
                }
            }else{
                if (node_id === 'critical'){
                    this.addSeries(TestData.newSeriesData.data[0], $(parent_node));
                }else if (node_id === 'all'){
                    this.addSeries(TestData.navigatorData.data[0], $(parent_node));
                }else if (node_id === 'major'){
                    this.addSeries(TestData.newSeriesData2.data[0], $(parent_node));
                }else if (node_id === 'minor'){
                    this.addSeries(TestData.newSeriesData3.data[0], $(parent_node));
                }else if (node_id === 'warning'){
                    this.addSeries(TestData.newSeriesData4.data[0], $(parent_node));
                }

                this[variable] = true;
            }
        }

    });

    return TimeRangeView;
});