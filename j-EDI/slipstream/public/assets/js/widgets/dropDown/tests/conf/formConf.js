/**
 * A form configuration object with the parameters required to build a Form for different views of the Grid widget
 *
 * @module formConfiguration
 * @author Arvind Kannan <arvindkannan@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {



var formConf = {
	"title": "Add Dropdown Value",
	"form_id": "dropdown_edit_form",
	"form_name": "dropdown_edit_form",
	"title-help": {
		"content": "Add value and click ok",
		"ua-help-identifier": "alias_for_title_ua_event_binding"
	},
	"err_div_id": "errorDiv",
	"err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
	"err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
	"err_div_link_text": "Configuring Basic Settings",
	"err_timeout": "1000",
	"valid_timeout": "5000",
	"on_overlay": true,
	"sections": [{
		"elements": [{
			"element_text": true,
			"id": "text",
			"name": "text",
			"label": "Text",
			"placeholder": "New Value",
			"required": true,
			"error": "Please enter a value for this field",
			"value": "New Value"
		}, {
			"element_text": true,
			"id": "id",
			"name": "id",
			"label": "ID",
			"placeholder": "123456",
			"required": true,
			"error": "Please enter a value for this field",
			"value": "123456"

		}]
	}],
	"buttons": [{
		"id": "add_value_save",
		"name": "save",
		"value": "OK"
	}],
	"cancel_link": {
		"id": "add_value_cancel",
		"value": "Cancel"
	}
};

return formConf;

});