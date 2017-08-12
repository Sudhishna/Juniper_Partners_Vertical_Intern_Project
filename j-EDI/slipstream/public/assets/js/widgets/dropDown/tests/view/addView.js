/**
 * A view that uses the Overlay and Form Widgets to render a form overlay to enable user to submit new values for Dropdown Widgets
 * The configuration object contains the method from the parent which gets called back on saving values in the overlay. 
 * Another parameter containing event target that resulted in opening the overlay is passed which is used in the parent to distinguish the source of the event and the dropdown to which the data needs to be added
 * @module DropDown View
 * @author Arvind Kannan <arvindkannan@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/dropDown/tests/model/remoteData',
    'widgets/overlay/overlayWidget',
    'widgets/form/formWidget',
    'widgets/dropDown/tests/conf/formConf'      
    
], function(Backbone, RemoteData, OverlayWidget, FormWidget, formConfiguration) {

    var DropDownAddView = Backbone.View.extend({

    	events: {
            'click #add_value_save': 'addValOK',
            'click #add_value_cancel': 'addValClose'
        },

        initialize: function (){
        	// initialize the overlay widget
            this.overlay = new OverlayWidget({
                view: this,
                type: 'small'
            });
            this.overlay.build();
        },

        render: function () {
        	// form widget configurations
			var configurationObject = formConfiguration;

            this.form = new FormWidget({
                "elements": configurationObject,
                "container": this.el
            });


            this.form.build();          


            return this;
        } ,


        // Method for OK button
        addValOK: function(e) {
        	var formData = this.form.getValues();
        	var formattedData = {};
        	for (var i in formData) {
        		formattedData[formData[i].name] = formData[i].value;
        	}
        	this.options.save({"dropdownData": formattedData});
          	this.addValClose(e);
        },

        // Method for Cancel link
        addValClose: function(e) {
        	this.overlay.destroy();
            e.preventDefault();
            e.stopPropagation();
        }

    });

	return DropDownAddView;

});





