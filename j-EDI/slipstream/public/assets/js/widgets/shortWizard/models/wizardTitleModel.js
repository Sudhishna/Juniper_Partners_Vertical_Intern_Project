/**
 * A model representing the wizard title.  The model has
 * the following attributes: 
 *
 * {String} title - The user-visible title of the step.
 * 
 * @module TrainStep
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone'
], function(Backbone) {

	var WizardTitleModel = Backbone.Model.extend({
        defaults: {
            title: "Untitled",
            'titleHelp': {
	            "content": "Shortwizard",
	            "ua-help-identifier": "identifier"
       		 }
        }
    });

    return WizardTitleModel;
});