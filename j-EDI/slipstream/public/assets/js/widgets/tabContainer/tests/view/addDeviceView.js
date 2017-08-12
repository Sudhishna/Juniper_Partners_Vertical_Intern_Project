/**
 * A view that uses the form Widget to render a form from a configuration object
 * Builds the view for a user to add a device to the J-EDI
 *
 * @module CreateView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Kelcy Newton <knewton@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/tabContainer/tests/conf/formConfiguration',
    'widgets/form/formWidget',
    'widgets/confirmationDialog/tests/confirmationBox',
    "widgets/spinner/tests/appOverlaySpinner"
], function(Backbone, formConf, FormWidget, ConfirmationBox, SpinnerView){
    var AddDeviceView = Backbone.View.extend({

      events: {
          'click #add_device': 'addDevice',
          'click .refresh': 'refresh'
      },

      /**
       * creates the builds the form for the addDevice view. Obtained from /tests/vonf/formConfiguration.js
       * @param none
       * @return the form widget
       */
        render: function () {
            this.form = new FormWidget({
                "elements": formConf.addDevice,
                "container": this.el,
                "values": {},
                actionEvents: this.actionEvents,

            });
            this.form.build();
            this.$el.append('<input type="button" class="slipstream-primary-button  refresh" value="Upload CSV File">');
            return this;
        },

        /**
         * iterates through user values from the form and places them in a JSON object
         * @param none
         * @return form data
         */
        getViewData: function (){
            var viewData = {};
            if (this.form.isValidInput()){
                var values = this.form.getValues();
                for (var i=0; i<values.length; i++){
                    viewData[values[i].name] = values[i].value;
                }
            }
            return viewData;
        },

        /**
         * send new device details and add device to j-EDI
         * @param none
         * @return none
         */
        addDevice: function (){
          var deviceData = this.getViewData();
          var newDevIP = deviceData["deviceIP"];
          var newDevModel = deviceData["deviceModel"];
          var newDevUsername = deviceData["deviceUser"];
          var newDevPassword = deviceData["devicePW"];
          var newDeviceData = {"model": newDevModel, "ip": newDevIP, "username": newDevUsername, "password": newDevPassword}

          //make sure all data is collected, otherwise don't let user proceed
          if (newDevIP == undefined || newDevModel == undefined || newDevUsername == undefined || newDevPassword == "") {
              new ConfirmationBox({
                'rowData': {"title": "Error Adding Device", "question": "Please enter a valid IP, model name, username and password."}
              }).render();
          } else {
              //open spinner to lock view till successful data retrieval
              var loadingSpinner = new SpinnerView().openOverlay();
              //clear the form for the next entry
              document.getElementById("add_device_form").reset();

              $.ajax({
                  url: 'http://192.168.25.2/AddNewDevice.py',
                  type: 'POST',
                  data: newDeviceData,
                  dataType:"json",
                  success: function(data) {
                      overlayWidgetObj.destroy();
                      //display either success or failure here
                      if (data["message"] == "Success"){
                        var device = data["device"];
                        var deviceElements = device.split("_");
                        var hostname = deviceElements[0];
                        new ConfirmationBox({
                          'rowData': {"title": "Device Added", "question": "Successfully added " + hostname}
                        }).render();
                      } else {
                        new ConfirmationBox({
                          'rowData': {"title": "Device not Added", "question": "Failed to add " + hostname + ". Try again."}
                        }).render();
                      }
                    },
                  });
            }
        },

        /**
         * boolean returns whether or not the input to the form is valid
         * @param none
         * @return form data
         */
        isValidTabInput: function (){
            return this.form.isValidInput();
        }

    });

    return AddDeviceView;
})
