/**
 * A view that uses the donutChartWidget to produce a donut chart displaying device types and the current count
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
    var ajaxData;
    var DonutChartView2 = Backbone.View.extend({

      /**
       * Initialize the page with an AJAX call to get data for the chart and render the chart upon success
       * @param none
       */
      initialize: function () {
        var ajaxData;
        var self = this;
        $.ajax({
            url: 'http://192.168.25.2/TypeStatistics.py',
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
       * Renders the Device Type Donut Chart in the defined container
       * @param data from ajax call in Initialize
       */
        render: function (ajaxData) {
          //Wait to render till we receive data from the ajax call
          while (ajaxData != null) {
            var deviceTypeData = [];
            //returns json keys of deviceTypes
            var deviceTypes = Object.keys(ajaxData);

            //iterate through all device types and push to a device list with the format ["deviceType", "# of that device"]
            for (var i=0; i<deviceTypes.length; i++) {
              var newDevice = [];
              newDevice.push(deviceTypes[i], parseInt(ajaxData[deviceTypes[i]]));
              deviceTypeData.push(newDevice);
            }

            //create the configuration elements for the donut chart by specifying the container and data for the widget
            //data expects the following format:
            // data = [
            //           ["EX", 2],
            //           ["vSRX", 4],
            //           ["MX", 5]
           //         ]
            var donutChartElement = this.$el;
            var options = {
                donut: {
                    name: "Devices Count",
                    data: deviceTypeData,
                    showInLegend: true
                }

                // Uncomment following line to override widget colors array
                //, colors: ['green', 'purple', 'pink', 'orange', 'yellow']
            };

            //create the configuration with the configuration elements
            var conf = {
                container: donutChartElement,
                options: options
            }

            //create and build the widget
            var donutChartWidgetObj = new DonutChartWidget(conf);
            donutChartWidgetObj.build();
            ajaxData = null;
            
            return this;
        }
      }

    });

    return DonutChartView2;
});
