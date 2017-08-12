/**
 * A sample data that exercises all the elements and validation that
 * the Form Widget supports
 *
 * @module Form Sample
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'widgets/grid/tests/dataSample/firewallPoliciesTreeData'
    ], function (dataSample) {

    var configurationSample = {};

    configurationSample.elements = {
        //"title": "Quickstart Summary",
        "form_id": "summary_list_form",
        "form_name": "summary_list_form",
        "sections": [
            {
                "heading_id": "heading_text",
                "heading_text": "Custom Summary Title",
                "elements": [
                {
                    "element_multiple_error": true,
                    "id": "username",
                    "name": "username",
                    "label": "Username",
                    "onfocus": "true",
                    "pattern-error": [
                        {
                            "pattern": "hassymbol",
                            "error": "Must include a symbol."
                        },
                        {
                            "pattern": "hasnotspace",
                            "error": "Must not include a space."
                        },
                        {
                            "pattern": "validtext",
                            "error": "This field is required."
                        }
                    ],
                    "error": true,
                    "help": "Must only contain alphanumerics, underscores or hyphens and begin with an alphanumeric or an underscore character."
                },
                {
                    "element_password": true,
                    "id": "password_pattern",
                    "name": "password_pattern",
                    "label": "Password Pattern",
                    "placeholder": "Sp0g-Sp0g",
                    "required": true,
                    "notshowrequired": true,
                    "pattern-error": [
                        {
                            "pattern": "length",
                            "min_length":"6",
                            "max_length":"8",
                            "error": "Must be more than 6 characters but less than 8 characters."
                        },
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
                        },
                        {
                            "pattern": "hasmixedcase",
                            "error": "A combination of mixed case letters is required."
                        },
                        {
                            "pattern": "validtext",
                            "error": "A combination of mixed case letters, numbers, and symbols is required."
                        }
                    ],
                    "error": true,
                    "help": "Must be 6 characters or more. A combination of mixed case letters, numbers, and symbols is required."
                },
                {
                    "element_password": true,
                    "id": "confirm_password_pattern",
                    "name": "confirm_password_pattern",
                    "label": "Confirm Password",
                    "placeholder": "Sp0g-Sp0g",
                    "required": true,
                    "notshowrequired": true,
                    "dependency": "password_pattern",
                    "error": "Passwords must match"
                },
                {
                    "element_multiple_error": true,
                    "id": "hostname",
                    "name": "hostname",
                    "label": "Hostname",
                    "required": true,
                    "pattern-error": [
                        {
                            "pattern": "length",
                            "min_length":"1",
                            "max_length":"64",
                            "error": "Must not exceed 64 characters."
                        },
                        {
                            "pattern": "hasalphanumericdashunderscore",
                            "error": "Only alphanumeric characters, dashes and underscores allowed."
                        },
                        {
                            "pattern": "validtext",
                            "error": "This field is required."
                        }
                    ],
                    "error": true,
                    "notshowvalid": true,
                    "help":"Any combination of alphabetic characters, numbers, dashes, and underscores. No other special characters are allowed. 64 characters max.",
                    "inlineLinks":[{
                        "id": "show_overlay",
                        "class": "show_overlay",
                        "value": "More"
                    }]
                },
                {
                    "element_ip": true,
                    "id": "text_ip_v4Orv6",
                    "name": "text_ip_v4Orv6",
                    "label": "Text ip v4 or v6",
                    "placeholder": "IP v4 or v6",
                    "error": "Please enter a valid IP either version 4 or version 6",
                    "help": "Help for valid IP either version 4 or version 6"
                },
                {
                    "element_checkbox": true,
                    "id": "checkbox_field",
                    "label": "Checkbox",
                    "required": true,
                    "values": [
                        {
                            "id": "checkbox_enable",
                            "name": "enable_disable",
                            "label": "Option 1",
                            "value": "enable",
                            "checked": true
                        },
                        {
                            "id": "checkbox_disable",
                            "name": "enable_disable",
                            "label": "Option 2",
                            "disabled": true,
                            "value": "disable"
                        }
                    ],
                    "error": "Please make a selection"
                }
            ]
            }
        ]
    };
    configurationSample.smallGrid = {
        "url": "/assets/js/widgets/grid/tests/dataSample/simpleGrid.json",
        "jsonRoot": "policy",
        "singleselect": "true",
        "showWidthAsPercentage": false,
        "columns": [{
                "name": "name",
                "label": "Name"
            },{
                "name": "note",
                "label": "Note"
            },{
                "name": "amount",
                "label": "Amount"
            }]
    };

    return configurationSample;

});
