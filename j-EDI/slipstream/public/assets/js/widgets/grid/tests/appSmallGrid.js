/**
 * A view that uses a configuration object to render a grid widget
 * builds the list of current devices in the saltstack - Tab 1
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Kelcy Newton <knewton@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'widgets/grid/tests/view/createPolicyView',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'mockjax',
    'widgets/confirmationDialog/tests/confirmationBox',
    "widgets/spinner/tests/appOverlaySpinner"
], function(Backbone, GridWidget, configurationSample, ZonePoliciesAddView, ZonePoliciesModel, firewallPoliciesData, mockjax, ConfirmationBox, SpinnerView){
    var seenIPs = [];
    var seenDevices = [];
    var GridView = Backbone.View.extend({


        events: {
            "click .refresh": "refresh"
        },

        //
        // initialize: function () {
        //     this.render();
        // },

        /**
         * renders the GridWidget that diplays the device listing
         * @param none
         */
        render: function () {
            this.grid = new GridWidget({
                container: this.el,
                elements: configurationSample.smallGrid
            });
            this.grid.build();
            this.$el.append('<input type="button" class="slipstream-primary-button  refresh" value="Refresh">');
            this.$el.append('Click "Refresh" to fetch all device details');
            //load devices on render
            this.loadInitialDevices();
            return this;
        },

        /**
         * performs the ajax call to fetch initial basic device information (name + status)
         * @param none
         */
        loadInitialDevices: function(){
          var self = this;
          var device, ip, version, status, sno, rowData;
          $.ajax({
              url: 'http://192.168.25.2/DeviceListing.py',
              type: 'GET',
              dataType: "json",
              success: function(data)
              {
                  //iterate through data from ajax call and get device name and status for display
                  var minionData = data["devices"];
                  for (var i=0; i<minionData.length; i++){
                    device = minionData[i].device;
                    ip = minionData[i].ip;
                    version = minionData[i].version;
                    sno = minionData[i].sno;
                    if (minionData[i].status == true){
                      status = "Up";
                    } else {
                      status = "Down";
                    }
                    //get the hostname only for GUI display
                    var deviceElements = device.split("_");
                    var hostname = deviceElements[0];
                    rowData = {"device":hostname,"ip":ip, "version":version, "sno": sno, "status":status}

                    //only update with new devices we haven't seen before
                    if (!self.contains(seenDevices,hostname)) {
                      self.addDatatoGrid(rowData);
                      seenDevices.push(hostname)
                    }
                  }

              },
                  error: function (jqXHR, exception) {
                          overlayWidgetObj.destroy();
                          var msg = '';
                          if (jqXHR.status === 0) {
                              msg = 'Not connect.\n Verify Network.';
                          } else if (jqXHR.status == 404) {
                              msg = 'Requested page not found. [404]';
                          } else if (jqXHR.status == 500) {
                              msg = 'Internal Server Error [500].';
                          } else if (exception === 'parsererror') {
                              msg = 'Requested JSON parse failed.';
                          } else if (exception === 'timeout') {
                              msg = 'Time out error.';
                          } else if (exception === 'abort') {
                              msg = 'Ajax request aborted.';
                          } else {
                              msg = 'Uncaught Error.\n' + jqXHR.responseText;
                          }
                          new ConfirmationBox({
                            'rowData': {"title": "Configuration Error", "question": msg}
                          }).render();
                      },
          });
        },

        /**
         * refreshes the device listing with more specific details such as IP, Serial Number and Device version
         * @param none
         */
        refresh: function(){
          //lock display while loading
          new SpinnerView().openOverlay();
          seenDevices = [];
          var self = this;
          var device, ip, version, status, sno, rowData;
          $.ajax({
              url: 'http://192.168.25.2/GetDeviceDetails.py',
              type: 'GET',
              dataType: "json",
              success: function(data)
              {
                  //destroy the spinner view on success
                  overlayWidgetObj.destroy();
                  self.reloadGrid();

                  //iterate through data from ajax call and get device name and status for display
                  var minionData = data["devices"];
                  for (var i=0; i<minionData.length; i++){
                    device = minionData[i].device;
                    ip = minionData[i].ip;
                    version = minionData[i].version;
                    sno = minionData[i].sno;
                    if (minionData[i].status == "True"){
                      status = "Up";
                    } else {
                      status = "Down";
                    }
                    var deviceElements = device.split("_");
                    var hostname = deviceElements[0];
                    //build data for form configuration
                    rowData = {"device":hostname,"ip":ip, "version":version, "sno": sno, "status":status}

                    //Update with IP, Version, Serial Number and Status without  repeating devices
                    if (!self.contains(seenDevices,hostname)) {
                      self.addDatatoGrid(rowData);
                      seenDevices.push(hostname)

                    }
                 }
              },
                  error: function (jqXHR, exception) {
                          overlayWidgetObj.destroy();
                          var msg = '';
                          if (jqXHR.status === 0) {
                              msg = 'Not connect.\n Verify Network.';
                          } else if (jqXHR.status == 404) {
                              msg = 'Requested page not found. [404]';
                          } else if (jqXHR.status == 500) {
                              msg = 'Internal Server Error [500].';
                          } else if (exception === 'parsererror') {
                              msg = 'Requested JSON parse failed.';
                          } else if (exception === 'timeout') {
                              msg = 'Time out error.';
                          } else if (exception === 'abort') {
                              msg = 'Ajax request aborted.';
                          } else {
                              msg = 'Uncaught Error.\n' + jqXHR.responseText;
                          }
                          new ConfirmationBox({
                            'rowData': {"title": "Error Fetching Devices", "question": msg}
                          }).render();
                      },
          });
      },

      /**
       * Adds new data to the grid
       * @param data to be added to the grid
       */
      addDatatoGrid: function(rowData){
        this.grid.reloadGrid();
        this.grid.addRow(rowData);
      },

      /**
       * reloads the grid
       * @param none
       */
      reloadGrid: function() {
        this.grid.reloadGridData();
      },

      /**
       * performs the ajax call to fetch initial basic device information (name + status)
       * @param the array to search, the value to find
       */
      contains: function(arr, findValue) {
        var i = arr.length;
        while (i--) { if (arr[i] === findValue) return true; }
        return false;
      }

    });

    return GridView;
});
