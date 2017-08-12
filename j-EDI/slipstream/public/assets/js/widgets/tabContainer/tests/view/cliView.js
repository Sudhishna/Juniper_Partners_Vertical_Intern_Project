/**
 * A view that uses the Form Widget to render a form from a configuration object for the Application view
 * Builds the view that allows a user to run CLI Commands
 *
 * @module CliView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Kelcy Newton <knewton@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/form/formWidget',
    '../conf/formConfiguration',
    'widgets/listBuilder/listBuilderWidget',
    'widgets/grid/tests/view/cliQuickView',
    'widgets/confirmationDialog/tests/confirmationBox',
    'widgets/spinner/tests/appOverlaySpinner'
], function(Backbone, FormWidget, formConfiguration, ListBuilderWidget, QuickView, ConfirmationBox, SpinnerView){
    var currentAvailableDevices = []
    var CliView = Backbone.View.extend({

      //button click events
        events: {
            'click #run_command': 'runCliCommand'
        },

        /**
         * creates the builds the form for the CLI view. Obtained from /tests/conf/formConfiguration.js
         * @param none
         * @return the form widget
         */
        render: function () {
            this.form = new FormWidget({
                "elements": formConfiguration.constructCLICommand,
                "container": this.el
            });
            this.form.build();
            //get data from /tests/models/devicesModel.js (API call here)
            this.getModelData();
            return this;
        },

        /**
         * iterates through devicesModel application collection and adds to the list builder widget to
         * display a list of devices to select from
         * @param none
         * @return none
         */
        getModelData:function (){
            var self = this;
            this.model.fetch({success: function(collection) {
                var applications = [];
                collection.models.forEach(function(model){
                    //look for json object with key "devices"
                    var minions = model.get("devices")
                    for (var i=0; i<minions.length; i++){
                      //get the hostname of the device only
                      var deviceElements = minions[i]["device"].split("_");
                      var hostname = deviceElements[0];
                      //keeping track of available devices to prevent dupilicate devices from being listed
                      currentAvailableDevices.push(hostname)
                      //add device to application data to send to listbuilder
                      applications.push({
                          'label': hostname,
                          'value': minions[i]["device"]
                      });
                    }
                });
                self.addListBuilder('application', applications, currentAvailableDevices,false);

            }});
        },

        /**
         * adds the listbuidler widget to the view. if refresh is false, it's rendering for the first time and it's added as normal
         * if refresh is false, its rendering after adding new devices and we must ensure no duplicates are being added
         * @param id of the element to render in (string), Data to render in listbuilder (list),
         * list of all current devices (list),whether or not this is a 'refresh' call (boolean)
         * @return none
         */
        addListBuilder: function (id,modelData, currentDevices, refresh){
          var self = this;
          console.log("addListBuilder: refresh = " + refresh)
          //if it's a refresh call, get rid of duplicates before adding new devices to listbuilder
          if (refresh == true) {
             var newDevices = [];

             for (var i = 0; i < modelData.length; i++) {
               var deviceElements = modelData[i]["label"].split("_");
               var hostname = deviceElements[0];
               //if our list of currentDevices doesn't contain the device, add it to the list of new devices
               if (!self.contains(currentDevices, hostname)) {
                 newDevices.push({
                     'label': hostname, //returns name of minion
                     'value': modelData[i]["value"]
                 });
                 currentDevices.push(hostname)
                 console.log("FOUND NEW DEVICE")
               }
             }
             //add new devices to the listbuilder widget
             this.listBuilder.addAvailableItems(newDevices);

             //first time rendering, just add the modelData as is
          } else {
            //create the listbuilder widget by finding the id and giving modelData
            var listContainer = this.$el.find('#'+id)
            this.listBuilder = new ListBuilderWidget({
                "list": {"availableElements":modelData},
                "container": listContainer
            });
            this.listBuilder.build();
            listContainer.children().attr('id',id);
            listContainer.find('.list-builder-widget').unwrap()
          }

        },

        /**
         * called on run of cli command to check for new devices and add them to the listbuilder
         * @param  none
         * @return none
         */
        refreshModelData:function (){
            console.log("refreshing data...")
            var self = this;
            this.model.fetch({success: function(collection) {
                //list of data to fill listbuilderWidget. Must be in form [ "label": xxxx, "value": xxxx], where label is displayed in list builder
                var applications = [];
                //iterate through deviceModel application collection (/tests/view/models/devicesModel.js)
                collection.models.forEach(function(model){
                    //only look for JSON with "devices" key
                    var minions = model.get("devices")
                    for (var i=0; i<minions.length; i++){
                      var deviceElements = minions[i]["device"].split("_");
                      var hostname = deviceElements[0];
                      //add it to applications list to give to listbuilder
                      applications.push({
                          'label': hostname, //returns name of minion
                          'value': minions[i]["device"]
                      });
                    }
                });
                var currentDevices = currentAvailableDevices;
                //send list builder with id, data, current devices, and refresh = true
                self.addListBuilder('application', applications, currentDevices, true);
            }});
        },

        // getViewData: function (){
        //     var viewData = {};
        //     if (this.form && this.form.isValidInput()){
        //         var values = this.form.getValues();
        //         for (var i=0; i<values.length; i++){
        //             viewData[values[i].name] = values[i].value;
        //         }
        //         viewData['application'] = this.getListBuilderSelectedItems('application');
        //     }
        //     return viewData;
        // },

        /**
         * gets the devices the user selected from the listbuilder widget
         * @param id of the listbuilder in the form
         * @return list of selected devices
         */
        getListBuilderSelectedItems: function(id){
            var listValues = [];
            var data = this.listBuilder.getSelectedItems();
            for (var i=0; i<data.length; i++){
                listValues.push(data[i].value);
            }
            return listValues;
        },

        /**
         * boolean returns whether or not the input to the form is valid
         * @param none
         * @return form data
         */
        isValidTabInput: function(){
            return this.form.isValidInput();
        },

        /**
         * called when user clicks "run cli command" sends call to python api to
         * run cli command on the selected devices and return results
         * @param none
         * @return none
         */
        runCliCommand: function(){
          var self = this;
          //check for new devices in background
          this.refreshModelData();
          //gather user information from the form
          var selectedDevices = this.getListBuilderSelectedItems('application')
          var userCommands = this.getUserCommand();
          var cli_text_area = userCommands["cli_text_area"];

          //if (selectedDevices == "[]" || )
          // if (!this.isSameDevice(selectedDevices)){
          //   alert("PLEASE SELECT DEVICES OF ONE TYPE ONLY!!")
          // }

          //create postData to send to server - comprised of selectedDevices and userCommand
          var postData = {};
          var devicesList = ""
          for (var i=0; i<selectedDevices.length; i++) {
            if (i == 0) {
              devicesList = devicesList + selectedDevices[i]
            } else {
              devicesList = devicesList + "," + selectedDevices[i]
            }
          }
          postData["devices"] = devicesList;
          postData["command"] = cli_text_area;

          //make sure the user selects devices and enters a CLI command
          if (selectedDevices.length == 0 || cli_text_area == undefined) {
              new ConfirmationBox({
                'rowData': {"title": "Error", "question": "Please enter a CLI command and select one or more devices."}
              }).render();
          }

          //run CLI Command
          if (selectedDevices.length != 0 && cli_text_area != undefined) {
            console.log(postData)
            var loadingSpinner = new SpinnerView().openOverlay();

            $.ajax({
                url: 'http://192.168.25.2/ExecuteCli.py',
                type: 'POST',
                dataType: "json",
                data: postData,
                success: function(data)
                {
                    //on success, destroy the widget and render an overlay of the results from the devices ("CliOutput" is the json root)
                    overlayWidgetObj.destroy();
                    var rowData = data["CliOutput"];
                    //grab the response and display in quickview overlay
                    new QuickView({
                      'rowData': rowData
                    }).render();

                    //reset the form for the next cli command run
                    document.getElementById("cli_form").reset();
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
                          'rowData': {"title": "CLI Error", "question": msg}
                        }).render();

                        //reset the form for the next CLI Command run
                        document.getElementById("cli_form").reset();
                    },
            });
          }
       },

        /**
         * boolean - checks that devices are same type before configuring
         * @param array of devive types
         * @return true if devices are all the same, false if not
         */
        isSameDevice: function (deviceArray){
          for (var i=0; i<deviceArray.length; i++){
            var result = deviceArray[i] != deviceArray[0] ? true : false
          }
          return result;
        },

        /**
         * Grabs the user command from the form for postData
         * @param none
         * @return CLI Command
         */
        getUserCommand: function (){
          var cliData = [];
          if (this.form.isValidInput()){
              var values = this.form.getValues();
              for (var i=0; i<values.length; i++){
                  cliData[values[i].name] = values[i].value;
              }
          }
          return cliData
        },

        /**
         * boolean - checks whether or not an array contains an object
         * @param array to interate through, value looking for
         * @return true if array contains the specified value, else false
         */
        contains: function(arr, findValue) {
          var i = arr.length;
          while (i--) { if (arr[i] === findValue) return true; }
          return false;
        }

    });

    return CliView;
});
