/**
 * A view that uses the donutChartWidget to produce a donut chart displaying device status (up or down) and the current count
 *
 * @module Device Type Donut Chart View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @author Kelcy Newton <knewton@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/donutChart/donutChartWidget'
], function(Backbone, DonutChartWidget){
    var DonutChartView1 = Backbone.View.extend({

      /**
       * Initialize the page with an AJAX call to get data for the chart and render the chart upon success
       * @param none
       */
        initialize: function () {
          var ajaxData;
          var self = this;
          $.ajax({
              //url: '/assets/js/widgets/grid/tests/dataSample/simpleGrid.json',
              url: 'http://192.168.25.2/StatusStatistics.py',
              type: 'GET',
              dataType: "json",
              success: function(data)
              {
                ajaxData = data;
                self.render(ajaxData);
              }
          });
        },

        /**
         * Renders the Device Status Donut Chart in the defined container
         * @param data from ajax call in Initialize
         */
        render: function (ajaxData) {
          //Wait to render till we receive data from the ajax call
          while (ajaxData != null) {
            //create lists for the data to give to with donut chart widget, all up devices, and all down devices
            var deviceStatusData = [];
            var upDevices = [];
            var downDevices = [];

            //parse json ajax data to get Up and Down devices and add to lists for widget configuration
            upDevices.push("Up Devices", parseInt(ajaxData["DevicesUp"]))
            downDevices.push("Down Devices", parseInt(ajaxData["DevicesDown"]))
            deviceStatusData.push(upDevices, downDevices)

            //create the configuration elements for the donut chart by specifying the container and data for the widget
            //data expects the following format:
            //deviceStatusData = [
            //                    ["Up", 2],
            //                    ["Down", 4]
            //                  ]
            var donutChartElement = this.$el;
            var options = {
                donut: {
                    name: "Device Status",
                    data: deviceStatusData,
                    showInLegend: true
                }

                // Uncomment following line to override widget colors array
                //, colors: ['green', 'purple', 'pink', 'orange', 'yellow']
            };

            //create the configuration with the configuration elements
            var conf = {
                container: donutChartElement,
                options: options
            };

            //create and build the widget
            var donutChartWidgetObj = new DonutChartWidget(conf);
            donutChartWidgetObj.build();
            ajaxData = null;

            return this;
        }
      }

    });

    return DonutChartView1;
});
