/**
 * A form configuration object on the overlay widget
 *
 * @module formConfiguration
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var formConfiguration = {};

    formConfiguration.ZonePolicies = {
        "title": "Zone Policy",
        "form_id": "create_zone_policy",
        "form_name": "create_zone_policy",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "on_overlay": true,
        "sections": [
            {
                "elements": [
                    {
                        "element_text": true,
                        "id": "policy_name",
                        "name": "name",
                        "label": "Policy Name",
                        "placeholder": "required",
                        "ua-help": "alias_for_ua_event_binding",
                        "error": "Please enter a value for this field",
                        "required": true,
                        "tooltip": "Tooltip for text field"
                    },
                    {
                        "element_dropdown": true,
                        "id": "action",
                        "name": "action",
                        "label": "Policy Action",
                        "required": true,
                        "values": [
                            {
                                "label": "Select an option",
                                "value": ""
                            },
                            {
                                "label": "Permit",
                                "value": "permit"
                            },
                            {
                                "label": "Deny",
                                "value": "deny"
                            },
                            {
                                "label": "Reject",
                                "value": "reject"
                            }
                        ],
                        "error": "Please make a selection"
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "add_policy_save",
                "name": "save",
                "value": "OK"
            }
        ],
        "cancel_link": {
            "id": "add_policy_cancel",
            "value": "Cancel"
        }
    };

return formConfiguration;

});
