/**
 * A form configuration object with the parameters required to build a Form for Firewall Policies
 *
 * @module formConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['underscore'], function (_) {

    var formConfiguration = {};

    formConfiguration.ZonePolicies = {
        "title": "{{operation}} Policy",
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
                        "element_text": true,
                        "id": "policy_name2",
                        "name": "name",
                        "label": "Policy Name 2",
                        "placeholder": "required",
                        "ua-help": "alias_for_ua_event_binding",
                        "error": "Please enter a value for this field",
                        "required": true,
                        "tooltip": "Tooltip for text field"
                    },
                    {
                        "element_text": true,
                        "id": "policy_name3",
                        "name": "name",
                        "label": "Policy Name 3",
                        "placeholder": "required",
                        "ua-help": "alias_for_ua_event_binding",
                        "error": "Please enter a value for this field",
                        "required": true,
                        "tooltip": "Tooltip for text field"
                    },
                    {
                        "element_text": true,
                        "id": "policy_name4",
                        "name": "name",
                        "label": "Policy Name 4",
                        "placeholder": "required",
                        "ua-help": "alias_for_ua_event_binding",
                        "error": "Please enter a value for this field",
                        "required": true,
                        "tooltip": "Tooltip for text field"
                    },
                    {
                        "element_text": true,
                        "id": "policy_name5",
                        "name": "name",
                        "label": "Policy Name 5",
                        "placeholder": "required",
                        "ua-help": "alias_for_ua_event_binding",
                        "error": "Please enter a value for this field",
                        "required": true,
                        "tooltip": "Tooltip for text field"
                    },
                    {
                        "element_text": true,
                        "id": "policy_name6",
                        "name": "name",
                        "label": "Policy Name 6",
                        "placeholder": "required",
                        "ua-help": "alias_for_ua_event_binding",
                        "error": "Please enter a value for this field",
                        "required": true,
                        "tooltip": "Tooltip for text field"
                    },
                    {
                        "element_text": true,
                        "id": "policy_name7",
                        "name": "name",
                        "label": "Policy Name 7",
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
                    },
                    {
                        "element_dropdown": true,
                        "id": "from-zone-name",
                        "name": "from-zone-name",
                        "label": "From Zone",
                        "class": "dropdown-collection",
                        "values": [
                            {
                                "label": "Loading ...",
                                "disabled": "true",
                                "value": ""
                            }
                        ],
                        "error": "Please make a selection"
                    },
                    {
                        "element_dropdown": true,
                        "id": "to-zone-name",
                        "name": "to-zone-name",
                        "label": "To Zone",
                        "class": "dropdown-collection",
                        "values": [
                            {
                                "label": "Loading ...",
                                "value": ""
                            }
                        ],
                        "error": "Please make a selection"
                    },
                    {
                        "element_dropdown": true,
                        "id": "action2",
                        "name": "action2",
                        "label": "Policy Action 2",
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
                    },
                    {
                        "element_dropdown": true,
                        "id": "action4",
                        "name": "action4",
                        "label": "Policy Action 4",
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
                    },
                    {
                        "element_dropdown": true,
                        "id": "action3",
                        "name": "action3",
                        "label": "Policy Action 3",
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
                    },                    
                    {
                        "element_text": true,
                        "id": "source-address",
                        "class": "list-builder",
                        "name": "source-address",
                        "label": "Source Address",
                        "placeholder": "Loading ..."
                    },
                    {
                        "element_text": true,
                        "id": "destination-address",
                        "class": "list-builder",
                        "name": "destination-address",
                        "label": "Destination Address",
                        "placeholder": "Loading ..."
                    },
                    {
                        "element_text": true,
                        "id": "application",
                        "class": "list-builder",
                        "name": "application",
                        "label": "Application",
                        "placeholder": "Loading ..."
                    },
                    {
                        "element_description": true,
                        "class": "auto-width",
                        "value": "Once you have created a policy, you can add rules to it."
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
    formConfiguration.ZonePoliciesMin = {};
     _.extend(formConfiguration.ZonePoliciesMin, formConfiguration.ZonePolicies);
    formConfiguration.ZonePoliciesMin['sections'] = [
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
                    }
                ]
            }
            ];
return formConfiguration;

});
