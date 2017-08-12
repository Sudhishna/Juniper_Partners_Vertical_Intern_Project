/**
 * A sample configuration for creating sections and elements using the form widget
 *
 * @module Form Sample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var dynamicConfigurationSample = {};

    dynamicConfigurationSample.section1 =
            {
                "heading": "Appended Section",
                "heading_text": "Subtitle for appended section",
                "section_id": "appended_section_id_1",
                "elements": [
                    {
                        "element_description": true,
                        "id": "text_description",
                        "label": "Appended Description",
                        "value": "Description 1"
                    },
                    {
                        "element_textarea": true,
                        "id": "text_area_1",
                        "name": "text_area_1",
                        "label": "Textarea",
                        "pattern": "^([0-9]){3,4}$",
                        "placeholder": "",
                        "error": "Enter a number with 3 or 4 digits",
                        "post_validation": "validTextarea"
                    },
                    {
                        "element_multiple_error": true,
                        "id": "username_1",
                        "name": "username_1",
                        "label": "Username",
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
                    }
                ]
            };

    dynamicConfigurationSample.section2 =
        {
            "heading": "Appended Section 2",
            "section_id": "appended_section_id_2",
            "elements": [
                {
                    "element_email": true,
                    "id": "text_email_1",
                    "name": "text_email_1",
                    "label": "Text email",
                    "placeholder": "",
                    "disabled": true,
                    "error": "Please enter a valid email"
                },
                {
                    "element_url": true,
                    "id": "text_url_1",
                    "name": "text_url_1",
                    "label": "Text url",
                    "placeholder": "http://www.juniper.net",
                    "error": "Please enter a valid URL"
                }
            ]
        };

    dynamicConfigurationSample.section3 =
        {
            "heading": "Appended Section 3",
            "section_id": "appended_section_id_3",
            "elements": [
                {
                    "element_checkbox": true,
                    "id": "checkbox_field_2",
                    "label": "Checkbox 2",
                    "values": [
                        {
                            "id": "checkbox_enable_2",
                            "name": "enable_disable_2",
                            "label": "Option 12",
                            "value": "enable",
                            "checked": true
                        },
                        {
                            "id": "checkbox_disable_2",
                            "name": "enable_disable_2",
                            "label": "Option 22",
                            "disabled": true,
                            "value": "disable"
                        }
                    ],
                    "error": "Please make a selection"
                },
                {
                    "element_radio": true,
                    "id": "radio_field_2",
                    "label": "Radio Buttons 2",
                    "values": [
                        {
                            "id": "radio1_2",
                            "name": "radio_button_2",
                            "label": "Option 12",
                            "value": "option12"
                        },
                        {
                            "id": "radio2_2",
                            "name": "radio_button_22",
                            "label": "Option 22",
                            "disabled": true,
                            "value": "option22"
                        }
                    ],
                    "help": "Radio Buttons help text",
                    "error": "Please make a selection"
                }
            ]
        };

    dynamicConfigurationSample.elements1 =
        [
            {
            "element_alphanumeric": true,
            "id": "text_alphanumeric_1",
            "name": "text_alphanumeric_1",
            "label": "Text alphanumeric Dyn1",
            "required": true,
            "placeholder": "",
            "error": "Please enter a string that contains only letters and numbers"
            },
            {
                "element_hexadecimal": true,
                "id": "text_hexadecimal_1",
                "name": "text_hexadecimal_1",
                "label": "Text hexadecimal Dyn1",
                "placeholder": "",
                "error": "Please enter a valid hexadecimal number"
            }
        ];

    dynamicConfigurationSample.elements2 =
        [
            {
                "element_alphanumeric": true,
                "id": "text_alphanumeric_2",
                "name": "text_alphanumeric_2",
                "label": "Text alphanumeric Dyn2",
                "field-help": {
                    "content": "Tooltip for Text alphanumeric Dyn2",
                    "ua-help-identifier": "alias_for_title_ua_event_binding2"
                },
                "placeholder": "",
                "error": "Please enter a string that contains only letters and numbers"
            },
            {
                "element_hexadecimal": true,
                "id": "text_hexadecimal_2",
                "name": "text_hexadecimal_2",
                "label": "Text hexadecimal Dyn2",
                "placeholder": "",
                "error": "Please enter a valid hexadecimal number"
            }
        ];

    return dynamicConfigurationSample;

});
