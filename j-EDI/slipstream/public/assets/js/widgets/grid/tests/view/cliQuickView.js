/**
 * A view that uses the formWidget to a produce a form from a configuration file
 * Renders the quick view used to display cli results - Tab 3
 *
 * @module Quick View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Kelcy Newton <knewton@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/tests/conf/formConfiguration',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget'
], function(Backbone, formConf, FormWidget, OverlayWidget){
    var FormView = Backbone.View.extend({

        //button click events
        events: {
            'click #quick_view_ok': 'closeQuickView',
            'click #quick_view_cancel': 'closeQuickView'
        },

        /**
         * initializes the overlay used to display CLI results and builds the overlay
         * @param none
         */
        initialize: function () {
            this.overlay = new OverlayWidget({
                view: this,
                xIconEl: true,
                showScrollbar: true,
                type: 'medium'
            });
            this.overlay.build();
        },

        /**
         * adds rowData from cliView.js that is fetched from ajax call to the overlay
         * @param none
         */
        render: function () {
            var cliForm = {
                "title": "CLI Results",
                "form_id": "quick_view_form",
                "form_name": "quick_view_form",
                "on_overlay": true,
                "sections": [
                  // {
                  //   "elements": [] //elements render here
                  // }
                ],
                "buttons": [{
                        "id": "quick_view_ok",
                        "name": "quick_view_ok",
                        "value": "Close"
                    }
                ]
            };
            var rowData = this.options.rowData;
            //edit formConf.QuickView based on number of devices
            //iterate through list of devices and add device name, user CLI command and CLI Output from device
            for (var i=0; i < rowData.length; i++) {
              var device = rowData[i]["device"]
              var deviceElements = device.split("_");
              var hostname = deviceElements[0];

              //if device is not connected, print that for the user
              var connectStatus = ""
              if (rowData[i]["output"] == "Null") {
                connectStatus = " - Device Not Connected"
              }
              //create a new device to be added to the overlay with name, command and output elements
              var newDevice = {
               "heading": hostname + connectStatus,
               "section_id": "device" +  (i+1),
               "section_class": "section_class",
               "progressive_disclosure": "collapsed",

                "elements": [
                  {
                    "element_description": true,
                    "id": "userCommand",
                    "label": "Command",
                    "value": rowData[i]["command"]
                  },
                  {
                    "element_description": true,
                    "id": "device" + i + "Message",
                    "label": "CLI Output",
                    "value": rowData[i]["output"]
                  }
                ]
              }
              //append to the form configuration used to build the overlay
              cliForm.sections.push(newDevice);
             }

            //create the form that sits in the overlay
            this.form = new FormWidget({
                "elements": cliForm,
                "container": this.el,
            });
            this.form.build();
            this.$el.append()
            return this;
        },

        //on user click, close and destroy the overlay
        closeQuickView: function (e){
            e.preventDefault();
            e.stopPropagation();
            this.overlay.destroy();
        }

    });

    return FormView;
});
