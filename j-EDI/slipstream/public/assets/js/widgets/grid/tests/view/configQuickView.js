/**
 * A view that uses the formWidget to a produce a form from a configuration file
 * Renders the quick view overlay used to show the configuration results - Tab 4
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

        //Button click events
        events: {
            'click #quick_view_ok': 'closeQuickView',
            'click #quick_view_cancel': 'closeQuickView'
        },

        /**
         * initializes the overlay used to display Configuration results and builds the overlay
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
         * adds rowData from configView.js that is fetched from ajax call to the overlay
         * @param none
         */
        render: function () {
          var confForm = {
              "title": "Configuration Results",
              "form_id": "quick_view_form",
              "form_name": "quick_view_form",
              "on_overlay": true,
              "sections": [],
              "buttons": [{
                      "id": "quick_view_ok",
                      "name": "quick_view_ok",
                      "value": "Close"
                  }
              ]
            };
            //get rowData from viewCreation (tabContainer/view/configView.js)
            var rowData = this.options.rowData;

            //iterate through list of devices and add the results to overlay
            for (var i=0; i < rowData.length; i++) {
              //data comes from the api in the form "model_ip_ip_ip_ip"
              //extract just the model for the hostname
              var device = rowData[i]["device"]
              var deviceElements = device.split("_");
              var hostname = deviceElements[0];

              //ternary operators to determine whether text should be red or green if the result failed or passed
              var confColor = (rowData[i]["config_result"] == "Successfully loaded and committed!") ? "green" : "red"
              var snapColor = (rowData[i]["snapcheck_result"] == "Passed") ? "green" : "red"
              var prePostColor = (rowData[i]["pre_post_result"] == "Passed") ? "green" : "red"

              //ternary operators to determine if color text should be displayed or if grey text should be displayed for null results when the device is not connected
              var configResultDisplay = (rowData[i]["config_result"] == "Null") ? rowData[i]["config_result"] : "<b><font color=" + confColor + ">" + rowData[i]["config_result"] + "</font></b>"
              var snapcheckResultDisplay = (rowData[i]["snapcheck_result"] == "Null") ? rowData[i]["snapcheck_result"] :"<b><font color=" + snapColor + ">" + rowData[i]["snapcheck_result"] + "</font></b>"
              var prePostResultDisplay = (rowData[i]["pre_post_result"] == "Null") ? rowData[i]["pre_post_result"] : "<b><font color=" + prePostColor + ">" + rowData[i]["pre_post_result"] + "</font></b>"

              //Appended to the Device hostname if device returns pass or fail -- gives user a first look at results without having to expand the menu
              var deviceCondition = "PASS"
              if (rowData[i]["config_result"] != "Successfully loaded and committed!" || rowData[i]["snapcheck_result"] != "Passed" || rowData[i]["pre_post_result"] != "Passed") {
                deviceCondition = "FAIL"
              }
              //
              //Appended to the device hostname if device is not connected
              if (rowData[i]["config_result"] == "Null" && rowData[i]["snapcheck_result"] == "Null" && rowData[i]["pre_post_result"] == "Null") {
                deviceCondition = "Device Not Connected"
              }

              //format to create a new device with device name, configuration result, snapcheck result, and pre and post test results if applicable
              var newDevice = {
               "heading": hostname + " - " + deviceCondition,
               "section_id": "section_id",
               "section_class": "section_class",
               "progressive_disclosure": "collapsed",

                "elements": [
                  {
                      "element_description": true,
                      "id": "break",
                      "label": "Configuration Result",
                      "value": configResultDisplay
                  },
                  {
                      "element_description": true,
                      "id": "break",
                      "label": "Snapcheck Result",
                      "value":snapcheckResultDisplay
                  },
                  {
                      "element_description": true,
                      "id": "break",
                      "label": "Pre and Post Check Result",
                      "value": prePostResultDisplay
                  },
                  {
                      "element_description": true,
                      "id": "break",
                      "label": "",
                      "value": rowData[i]["pre_post_details"]
                    }
                ]
              }
              //add the device to the form and repeat with next device
              confForm.sections.push(newDevice)
            }

            //create the form that sits in the overlay
            this.form = new FormWidget({
                "elements": confForm,
                //"elements": formConf.ConfigView,
                "container": this.el,
            });
            this.form.build();
            this.$el.append()
            return this;
        },

        /**
         * upon user click, destroy the overlay
         * @param e, an error
         */
        closeQuickView: function (e){
            e.preventDefault();
            e.stopPropagation();
            this.overlay.destroy();
        }

    });

    return FormView;
});
