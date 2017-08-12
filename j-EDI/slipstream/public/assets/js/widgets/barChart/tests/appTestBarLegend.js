/**
 * A view that uses the barChartWidget to produce a sample bar chart
 * This example shows a bar chart displaying legend at the bottom
 * Legend is a box that displays name and color for items appearing on the chart
 *
 * @module Application Test Bar Chart Legend View
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
                title: 'Bar: Displaying Legend (multi-color with tooltips)',
                width: 500,
                height: 300,
                xAxisTitle: 'Top Sources',
                yAxisTitle: 'Number of Attacks',
                maxLabelSize: 10,
                categories: ['North Korea ISP', 'China Mobile Group','Syria Telecom Group', 'Iraq Broadband', 'Columbia', 'Taipei Broadband','Romania Broadband','Link Egypt', 'Korea Internet Data Center', 'Unknown'],
                tooltip: ['North Korea', 'China', 'Syria', 'Iraq', 'Columbia', 'Taipei Broadband','Romania','Egypt', 'North Korea', 'Unknown'],
                legend: [{ name: 'Critical', color: '#EC1C24'},
                         { name: 'Major', color: '#F58b39'},
                         { name: 'Minor', color: '#ECEC20'},
                         { name: 'Warning', color: '#800080'},
                         { name: 'Info', color: '#0000FF'}],
                data: [{ y: 90, color: '#EC1C24'},
                       { y: 80, color: '#F58B39'},
                       { y: 75, color: '#ECEC20'},
                       { y: 73, color: '#800080'},
                       { y: 72, color: '#EC1C24'},
                       { y: 63, color: '#0000FF'},
                       { y: 39, color: '#ECEC20'},
                       { y: 32, color: '#800080'},
                       { y: 20, color: '#0000FF'},
                       { y: 10, color: '#EC1C24'}]
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