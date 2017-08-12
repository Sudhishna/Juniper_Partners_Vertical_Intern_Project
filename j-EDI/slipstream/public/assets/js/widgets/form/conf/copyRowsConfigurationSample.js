/**
 * Configuration sample to show how to copy elements and integrated widgets in a form widget
 *
 * @module Configuration for copying rows
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var copyConfiguration = {};

    copyConfiguration.elements = {
        "title": "Copy Elements and Widgets in a Form Widget",
        "form_id": "copy_rows_form",
        "form_name": "copy_rows_form",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [{
                        "heading": "SIMPLE AND MULTIPLE ELEMENTS",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "custom_pattern",
                                "name": "custom_pattern",
                                "label": "Custom Pattern",
                                "class": "copy_input",
                                "ua-help": "alias_for_ua_event_binding",
                                "placeholder": "1234",
                                "pattern": "^([0-9]){3,4}$",
                                "error": "Enter a number with 3 or 4 digits"
                            },
                            {
                                "element_multiple_error": true,
                                "id": "username",
                                "name": "username",
                                "required": true,
                                "class": "copy_multiple",
                                "pattern-error": [
                                    {
                                        "pattern": "hasnotsymbol",
                                        "error": "At least one symbol is required."
                                    },
                                    {
                                        "pattern": "hasnotspace",
                                        "error": "Must not have spaces."
                                    },
                                    {
                                        "pattern": "validtext",
                                        "error": "This field is required."
                                    }
                                ],
                                "error": true,
                                "help": "Must not include spaces or symbols."
                            },
                            {
                                "element_password": true,
                                "id": "password_pattern",
                                "name": "password_pattern",
                                "required": true,
                                "class": "copy_multiple",
                                "pattern-error": [
                                    {
                                        "pattern": "hasnumbersymbol",
                                        "error": "At least one number and one symbol is required."
                                    },
                                    {
                                        "pattern": "hasmixedcasenumber",
                                        "error": "A combination of mixed case letters and one number is required."
                                    },
                                    {
                                        "pattern": "hasmixedcasesymbol",
                                        "error": "A combination of mixed case letters and one symbol is required."
                                    },
                                    {
                                        "pattern": "hassymbol",
                                        "error": "At least one symbol is required."
                                    },
                                    {
                                        "pattern": "hasnumber",
                                        "error": "At least one number is required."
                                    },   {
                                        "pattern": "hasmixedcase",
                                        "error": "A combination of mixed case letters is required."
                                    },
                                    {
                                        "pattern": "validtext",
                                        "error": "A combination of mixed case letters, numbers, and symbols is required."
                                    },
                                    {
                                        "pattern": "length",
                                        "min_length":"6",
                                        "error": "Must be 6 characters or more."
                                    }
                                ],
                                "error": true,
                                "help":"Must be 6 characters or more. A combination of mixed case letters, numbers, and symbols is required."
                            },
                            {
                                "element_password": true,
                                "id": "confirm_password_pattern",
                                "name": "confirm_password_pattern",
                                "required": true,
                                "class": "copy_multiple",
                                "dependency": "password_pattern",
                                "error": "Passwords must match"
                            },
                            {
                                "element_dropdown": true,
                                "id": "dropdown_field",
                                "name": "dropdown_field",
                                "required": true,
                                "class": "copy_multiple",
                                "error": "Please make a selection"
                            }
                        ]
                    },
            {
            "heading": "INTEGRATED WIDGETS",
            "section_id": "section_widget",
            "elements": [
                {
                    "element_ipCidrWidget": true,
                    "class": "copy_ipcidr",
                    "id": "text_ipCidrWidget1",
                    "label": "IP/CIDR Widget User",
                    "ip_id": "text_ip1",
                    "ip_name": "text_ip1",
                    "ip_placeholder": "IP v4 or v6",
                    "ip_required": "true",
                    "ip_tooltip": "IP v6 example",
                    "ip_error": "Invalid IP address",
                    "ip_value": "11.21.23.114",
                    "cidr_id": "text_cidr",
                    "cidr_name": "text_cidr",
                    "cidr_placeholder": "CIDR",
                    "cidr_error": "Invalid CIDR",
                    "cidr_value": "10",
                    "subnet_label": "Subnet User",
                    "subnet_id": "text_subnet",
                    "subnet_name": "text_subnet",
                    "subnet_placeholder": "Subnet placeholder",
                    "subnet_error": "Please enter a valid subnet mask",
                    "subnet_value": "255.192.0.0"
                },
                {
                    "element_datePickerWidget": true,
                    "class": "copy_datepicker",
                    "id": "text_datepickerWidget",
                    "name": "text_datepickerWidget",
                    "label": "Date Picker Widget",
                    "required": true,
                    "placeholder": "MM/DD/YYYY",
                    "dateFormat": "mm/dd/yyyy",
                    "pattern-error": [
                        {
                            "pattern": "length",
                            "min_length":"10",
                            "max_length":"10",
                            "error": "Incomplete MM/DD/YYYY"
                        },
                        {
                            "pattern": "date",
                            "error": "Must be MM/DD/YYYY"
                        },
                        {
                            "pattern": "validtext",
                            "error": "This is a required field"
                        }
                    ],
                    "error": true
                },
                {
                    "element_timeWidget": true,
                    "class": "copy_time",
                    "id": "text_timeWidget",
                    "name": "text_timeWidget"
                },
                {
                    "element_timeZoneWidget": true,
                    "class": "copy_timezone",
                    "id": "text_timeZoneWidget",
                    "name": "text_timeZoneWidget",
                    "label": "Timezone widget"
                }
            ]
        }
        ],
        "unlabeled":"true",
        "buttonsClass":"copy_row_buttons",
        "buttons": [
            {
                "id": "copy_input",
                "name": "copy_input",
                "type": "button",
                "value": "Copy Simple Input",
                "data": "copy_input"
            },
            {
                "id": "copy_multipleinput",
                "name": "copy_multipleinput",
                "type": "button",
                "value": "Copy Multiple Inputs",
                "data": "copy_multiple"
            },
            {
                "id": "copy_ipcidr",
                "name": "copy_ipcidr",
                "type": "button",
                "value": "Copy IpCidr",
                "data": "copy_ipcidr"
            },
            {
                "id": "copy_datepicker",
                "name": "copy_datepicker",
                "type": "button",
                "value": "Copy DatePicker",
                "data": "copy_datepicker"
            },
            {
                "id": "copy_time",
                "name": "copy_time",
                "type": "button",
                "value": "Copy Time",
                "data": "copy_time"
            },
            {
                "id": "copy_timezone",
                "name": "copy_timezone",
                "type": "button",
                "value": "Copy TimeZone",
                "data": "copy_timezone"
            }
        ]
    };

    return copyConfiguration;

});
