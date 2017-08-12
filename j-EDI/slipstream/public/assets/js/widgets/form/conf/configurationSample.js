/**
 * A sample data that exercises all the elements and validation that
 * the Form Widget supports
 *
 * @module Form Sample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'text!widgets/dropDown/tests/dataSample/applicationShort.json'
], function (applicationShort) {

    var buildNameUrl = function (inputvalue){
        var url = "/api/data-sample/name/";
        url += inputvalue;
        return url;
    };

    var configurationSample = {};

    configurationSample.elements = {
        "title": "Sample Form Widget",
        "form_id": "sample_form",
        "form_name": "sample_form",
        "title-help": {
            "content": "Tooltip for the title of the Form Widget",
            "ua-help-text": "More..",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "heading": "Multiple Validation",
                "heading_text": "The Form Widget supports multiple validation and remote/client validation",
                "section_id": "section_id_1",
                "section_class": "section_class",
//                "progressive_disclosure": "collapsed", //two possible values: expanded or collapsed
                "toggle_section":{
                    "label": "Select to show the form elements of the multiple validation section",
                    "status": "hide" //two possible values: show or hide
//                    "checked": true
                },
                "elements": [
                    {
                        "element_multiple_error": true,
                        "id": "username",
                        "name": "username",
                        "label": "Username",
                        "disableAutocomplete": true,
//                        "onfocus": "true",
//                        "required": true,
//                        "notshowrequired": true,
                        "pattern-error": [
                            {
                                "pattern": "hasnotspace",
                                "error": "Must not include a space."
                            },
                            {
                                "pattern": "validtext",
                                "error": "This field is required."
                            },
                            {
                                "regexId":"regex1",
                                "pattern": "^([a-zA-Z0-9_]){3,10}$",
                                "error": "Must be alphanumeric with 3 to 10 characters."
                            },
                            {
                                "regexId":"regex2",
                                "pattern": "^[_]{1}",
                                "error": "Must begin with underscore"
                            }
                        ],
                        "error": true,
                        "help": "Must only contain alphanumerics &amp; underscores or hyphens and begin with an alphanumeric or an underscore character."
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
                                "pattern": "validtext",
                                "error": "This field is required."
                            },
                            {
                                "pattern": "length",
                                "min_length":"1",
                                "max_length":"64",
                                "error": "Must not exceed 64 characters."
                            },
                            {
                                "pattern": "hasalphanumericdashunderscore",
                                "error": "Only alphanumeric characters, dashes and underscores allowed."
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
                        "element_text": true,
                        "id": "remote_validation",
                        "name": "remote_validation",
                        "label": "Remote URL Validation",
                        "field-help": {
                            "content": "Tooltip for a &lt;field&gt; in the Form Widget",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "remote": {
                            "url": buildNameUrl, //should return url string
                            "type": "GET",
                            //"response": processResponse //should return "true" if isValid
                            "headers": {
                                "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                                "Accept": 'application/vnd.net.juniper.space.job-management.jobs+json;version="3";q=0.03'
                            },
                            "error": "Must not contain the name of a developer"
                        },
                        "error": true, // @TODO - refactor so we don't need this for remote and multiple validation
                        "inlineIcons":[{
                            "class": "test-elementicon1",
                            "id": "add-element-icon"
                        }]
                    },
                    {
                        "element_text": true,
                        "id": "remote_and_client_validation",
                        "name": "remote_and_client_validation",
                        "label": "Remote URL + Client Validation",
                        "field-help": {
                            "content": "Tooltip for a &lt;field&gt; in the Form Widget",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "remote": {
                            "url": buildNameUrl, //should return url string
                            "type": "GET",
                            "headers": {
                                "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                                "Accept": 'application/vnd.net.juniper.space.job-management.jobs+json;version="3";q=0.03'
                            },
                            "error": "Must not contain the name of a developer"
                        },
                        "pattern": "^[a-zA-Z_][a-zA-Z0-9-_]{0,28}$",
                        "error": "Must only contain alphanumerics &amp; underscores or hyphens and begin with an alphanumeric or an underscore character.", // @TODO - refactor so we don't need this for remote and multiple validation
                        "inlineIcons":[{
                            "class": "test-elementicon1",
                            "id": "add-element-icon"
                        }]
                    }
                ]
            },
            {
                "heading": "Text Area Element and Regex Validation",
                "heading_text": "Form elements with text area and regex validation",
                "section_class": "section_class",
                "section_id": "section_id_2",
                "progressive_disclosure": "collapsed", //two possible values: expanded or collapsed
                "elements": [
                    {
                        "element_description": true,
                        "id": "text_description",
                        "label": "Description",
                        "value": "Description <b>HTML rendered</b>"
                    },
                    {
                        "element_description_encode": true,
                        "id": "text_description_encode",
                        "label": "Description Encode",
                        "value": "Description <b>Encode</b>"
                    },
                    {
                        "element_textarea": true,
                        "id": "text_area",
                        "name": "text_area",
                        "label": "Textarea",
                        "pattern": "^([0-9]){3,4}$",
                        "required": true,
                        "rows": 5,
                        "placeholder": "",
                        "error": "Enter a number with 3 or 4 digits",
                        "post_validation": "validTextarea"
                    },
                    {
                        "element_textarea": true,
                        "id": "default_text_area",
                        "name": "default_text_area",
                        "label": "Default textarea",
                        "value": "{{{text}}}"
                    },
                    {
                        "element_text": true,
                        "id": "custom_pattern",
                        "name": "custom_pattern",
                        "label": "Custom Pattern",
                        "class": "class1 class2  element_delete",
                        "field-help": {
                            "content": "The pattern is a 3 o 4 digits",
                            "ua-help-identifier": "alias_for_ua_event_binding"
                        },
                        "placeholder": "1234",
                        "pattern": "^([0-9]){3,4}$",
                        "error": "Enter a number with 3 or 4 digits",
                        "inlineButtons":[{
                            "id": "input_button",
                            "class": "input_button",
                            "name": "input_button",
                            "value": "Test"
//                        },{
//                            "id": "input_button1",
//                            "name": "input_button2",
//                            "value": "Test2",
//                            "isInactive": true
                        }]
                    },
                    {
                        "element_text": true,
                        "id": "custom_pattern_regexObj",
                        "name": "custom_pattern_regexObj",
                        "label": "Custom Regex Object",
                        "class": "class1 class2  element_delete",
                        "placeholder": "https://localhost",
                        "pattern": /^(http(s?):[/][/])(www\.)?(\S)+$/,
                        //"pattern": new RegExp("^(http(s?):[/][/])(www\\.)?(\\S)+$"),
                        "error": "Enter valid url string",
                        "inlineButtons":[{
                            "id": "input_button1",
                            "class": "input_button",
                            "name": "input_button1",
                            "value": "Test"
                        }]
                    }
                ]
            },
            {
                "heading": "Widget Integration",
                "heading_text": "Integration with other form elements like the IpCidr, DatePicker, Date, DateTime and DropDown widgets.<br/> It also allows to show/hide the inline error for a form element",
                "section_id": "section_id_3",
                "section_class": "section_class",
                "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                "elements": [
                    {
                        "element_ipCidrWidget": true,
                        "id": "text_ipCidrWidget1",
                        "label": "IP/CIDR Widget",
                        "ip_id": "text_ip1",
                        "ip_name": "text_ip1",
                        "ip_placeholder": "IP v4 or v6",
                        "ip_required": "true",
                        "ip_field-help": {
                            "content": "IP v6 example",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "ip_error": "Invalid IP address",
                        "cidr_id": "text_cidr",
                        "cidr_name": "text_cidr",
                        "cidr_placeholder": "CIDR",
                        "cidr_error": "Invalid CIDR",
                        "subnet_label": "Subnet",
                        "subnet_id": "text_subnet",
                        "subnet_name": "text_subnet",
                        "subnet_placeholder": "Subnet placeholder",
                         "subnet_field-help": {
                                "content": "subnet example",
                                "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "subnet_error": "Please enter a valid subnet mask",
                        "initValue": "{{ipCidr}}"
                    },
                    {
                        "element_datePickerWidget": true,
                        "id": "text_datepickerWidget",
                        "name": "text_datepickerWidget",
                        "label": "Date Picker Widget",
                        "required": true,
                        "placeholder": "MM/DD/YYYY",
                        "dateFormat": "mm/dd/yyyy",
                        "initValue": "{{datePicker}}",
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
                        "error": true,
                        "notshowvalid": true
                    },
                    {
                        "element_timeWidget": true,
                        "id": "text_timeWidget",
                        "initValue": "{{time}}"
//                        "initValue": {
//                            "time": "08:00:00",
//                            "period": "AM"
//                        }
                    },
                    {
                        "element_dateTimeWidget": true,
                        "id": "text_dateTimeWidget",
                        "label": "Date Time Widget",
                        "required": true,
                        "initValue": "{{dateTime}}",
                        "datePickerWidget": {
                            "id": "text_dateTime_date_Widget",
                            "name": "text_dateTime_date_Widget",
                            "placeholder": "MM/DD/YYYY",
                            "dateFormat": "mm/dd/yyyy",
                            //"disabled": true,
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
                            "error": true,
                            "notshowvalid": true
                        },
                        "timeWidget":{
                            "id": "text_dateTime_time_Widget",
                            "name": "text_dateTime_time_Widget"
                        }
                    },
                    {
                        "element_timeZoneWidget": true,
                        "class": "copy_timezone",
                        "id": "text_timeZoneWidget",
                        "name": "text_timeZoneWidget",
                        "label": "Timezone widget",
                        "initValue": "{{timeZone}}"
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
                        "element_description": true,
                        "id": "gridWidgetInForm",
                        "name": "gridWidgetInForm",
                        "label": "Grid Widget In Form",
                        "error": "Grid validation failed",
                        "required": true,
                        "inlineButtons":[{
                            "id": "show_inline_error",
                            "class": "show_inline_error",
                            "name": "show_inline_error",
                            "value": "Show inline error"
                        },{
                            "id": "hide_inline_error",
                            "class": "hide_inline_error",
                            "name": "hide_inline_error",
                            "value": "Hide inline error"
                        }]
                    }
                ]
            },
            {
                "heading": "Multiple Value Form Elements",
                "heading_text": "Form elements like radio buttons, checkbox, and radio buttons",
                "section_id": "section_id_4",
                "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                "elements": [
                    {
                        "element_dropdown": true,
                        "id": "dropdown_field_1",
                        "name": "dropdown_field_1",
                        "label": "Dropdown 1",
                        "required": true,
//                        "dropdown_disabled": true,
                        "values": [ //to be deprecated, use data instead
                            {
                                "label": "Select an option",
                                "value": ""
                            },
                            {
                                "label": "Option 1",
                                "value": "option1"
                            },
                            {
                                "label": "Option 2",
                                "value": "option2",
                                "disabled": true
                            },
                            {
                                "label": "Option 3",
                                "value": "option3"
                            }
                        ],
                        "help": "Dropdown with default parameter",
                        "error": "Please make a selection"
                    },
                    {
                        "element_dropdown": true,
                        "id": "dropdown_field_2",
                        "name": "dropdown_field_2",
                        "label": "Dropdown 2",
                        "required": true,
                        "data": [
                            {
                                "id": "ftp",
                                "text": "junos-ftp"
                            },
                            {
                                "id": "tftp",
                                "text": "junos-tftp",
                                "disabled": true
                            },
                            {
                                "id": "rtsp",
                                "text": "junos-rtsp"
                            },
                            {
                                "id": "netbios",
                                "text": "junos-netbios-session",
                                "selected": true
                            }
                        ],
                        "help": "Dropdown with data parameter",
                        "error": "Please make a selection"
                    },
                    {
                        "element_dropdown": true,
                        "id": "dropdown_field_3",
                        "name": "dropdown_field_3",
                        "label": "Dropdown Widget",
                        "help": "Dropdown help text",
                        "error": "Please make a selection",
                        "initValue": "{{dropDown}}",
                        "multipleSelection": {
                            maximumSelectionLength: 2,
                            createTags: true
                        },
                        "placeholder": "Select an option",
                        "data": applicationShort
                    },
                    {
                        "element_checkbox": true,
                        "id": "checkbox_field",
                        "label": "Checkbox",
                        "required": true,
                        "initValue": "{{checkBox}}",
//                        "initValue": [
//                            {
//                                "id": "checkbox_enable1",
//                                "checked": false
//                            },
//                            {
//                                "id": "checkbox_disable",
//                                "checked": true
//                            }
//                        ],
                        "values": [
                            {
                                "id": "checkbox_enable1",
                                "name": "checkbox_enable",
                                "label": "Option 1",
                                "value": "enable",
                                "checked": true
                            },
                            {
                                "id": "checkbox_enable2",
                                "name": "checkbox_enable",
                                "label": "Option 2",
                                "value": "disable",
                                "checked": false
                            },
                            {
                                "id": "checkbox_disable",
                                "name": "checkbox_enable",
                                "label": "Option 3",
                                "disabled": true,
                                "value": "disable"
                            }
                        ],
                        "help": "Check box help text",
                        "error": "Please make a selection"
                    },
                    {
                        "element_radio": true,
                        "id": "radio_field",
                        "label": "Radio Buttons",
                        "required": true,
                        "initValue": "{{radioButton}}",
                        "values": [
                            {
                                "id": "radio1",
                                "name": "radio_button",
                                "label": "Option 1",
                                "value": "option1",
                                "disabled": true
                            },
                            {
                                "id": "radio2",
                                "name": "radio_button",
                                "label": "Option 2",
                                "value": "option2"
                            },
                            {
                                "id": "radio3",
                                "name": "radio_button",
                                "label": "Option 3",
                                "value": "option3",
                                "checked": true
                            }
                        ],
                        "help": "Radio button help text",
                        "error": "Please make a selection"
                    }
                ]
            },
            {
                "heading": "Other Form Elements",
                "heading_text": "Form elements like checkbox, radio buttons and different type of inputs",
                "section_id": "section_id_5",
                "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                "elements": [
                    {
                        "element_email": true,
                        "id": "text_email",
                        "name": "text_email",
                        "label": "Text email",
                        "placeholder": "",
//                        "required": true,
                        "disabled": true,
                        "error": "Please enter a valid email",
                        "value": "{{email}}"
                    },
                    {
                        "element_url": true,
                        "id": "text_url",
                        "name": "text_url",
                        "label": "Text url",
                        "placeholder": "http://www.juniper.net",
                        "error": "Please enter a valid URL",
                        "value": "{{url}}"
                    },                    {
                        "element_string": true,
                        "id": "text_string",
                        "class": "text_string_class",
                        "name": "text_string",
                        "label": "Text string",
                        "field-help": {
                            "content": "The string should contain only letters (a-zA-Z)",
                            "ua-help-identifier": "alias_for_ua_event_binding2"
                        },
                        "placeholder": "",
                        "error": "Please enter a valid string that contains only letters (a-zA-Z)",
                        "value": "{{text}}"
                    },
                    {
                        "element_number": true,
                        "id": "text_number",
                        "name": "text_number",
                        "label": "Text number",
                        "min_value":"2",
                        "max_value":"8",
                        "placeholder": "",
                        "error": "Please enter a number between 2 and 8"
                    },
                    {
                        "element_alphanumeric": true,
                        "id": "text_alphanumeric",
                        "name": "text_alphanumeric",
                        "label": "Text alphanumeric",
                        "class": "text_alphanumeric_class",
                        "placeholder": "",
                        "error": "Please enter a string that contains only letters and numbers"
                    },
                    {
                        "element_hexadecimal": true,
                        "id": "text_hexadecimal",
                        "name": "text_hexadecimal",
                        "label": "Text hexadecimal",
                        "placeholder": "",
                        "error": "Please enter a valid hexadecimal number"
                    },
                    {
                        "element_color": true,
                        "id": "text_color",
                        "name": "text_color",
                        "class": "text_color_class",
                        "label": "Text color",
                        "placeholder": "",
                        "error": "Please enter a valid hexadecimal color"
                    },
                    {
                        "element_lowercase": true,
                        "id": "text_lowercase",
                        "name": "text_lowercase",
                        "label": "Text lowercase",
                        "placeholder": "",
                        "error": "Please enter a valid string in lowercase"
                    },
                    {
                        "element_uppercase": true,
                        "id": "text_uppercase",
                        "name": "text_uppercase",
                        "label": "Text uppercase",
                        "placeholder": "",
                        "error": "Please enter a valid string in uppercase"
                    },
                    {
                        "element_integer": true,
                        "id": "text_integer",
                        "name": "text_integer",
                        "label": "Text integer",
                        "placeholder": "",
                        "error": "Please enter a valid integer"
                    },
                    {
                        "element_float": true,
                        "id": "text_float",
                        "name": "text_float",
                        "label": "Text float",
                        "placeholder": "",
                        "error": "Please enter a valid float"
                    },
                    {
                        "element_divisible": true,
                        "divisible_by":"5",
                        "id": "text_divisible",
                        "name": "text_divisible",
                        "label": "Text divisible",
                        "placeholder": "",
                        "error": "Please enter a number that is divisible by 5"
                    },
                    {
                        "element_length": true,
                        "min_length":"2",
                        "max_length":"5",
                        "id": "text_length",
                        "name": "text_length",
                        "label": "Text length",
                        "placeholder": "",
                        "error": "Please enter a string that is greater than or equal to 2 but less than or equal to 5"
                    },
                    {
                        "element_minlength": true,
                        "length":"3",
                        "id": "text_min_length",
                        "name": "text_min_length",
                        "label": "Text min length",
                        "placeholder": "",
                        "error": "Please enter a string that is greater than or equal to 3"
                    },
                    {
                        "element_multiple_error": true,
                        "id": "min_max_length",
                        "name": "min_max_length",
                        "label": "Multiple length error",
                        "pattern-error": [
                            {
                                "pattern": "length",
                                "min_length":"2",
                                "max_length":"8",
                                "error": "Must be 8 characters or less."
                            },
                            {
                                "pattern": "minlength",
                                "length":"2",
                                "error": "Must be 2 characters or more."
                            }
                        ],
                        "error": true,
                        "notshowvalid": true
                    },
                    {
                        "element_date": true,
                        "id": "text_date",
                        "name": "text_date",
                        "label": "Text date",
                        "placeholder": "",
                        "error": "Please enter a valid date"
                    },
                    {
                        "element_afterdate": true,
                        "after_date":"05/28/2014",
                        "id": "text_afterdate",
                        "name": "text_afterdate",
                        "label": "Text afterdate",
                        "placeholder": "",
                        "error": "Please enter a date after May 28, 2014"
                    },
                    {
                        "element_beforedate": true,
                        "before_date":"06/20/2014",
                        "id": "text_beforedate",
                        "name": "text_beforedate",
                        "label": "Text beforedate",
                        "placeholder": "",
                        "error": "Please enter a date before June 20, 2014"
                    },
                    {
                        "element_time": true,
                        "id": "text_time",
                        "name": "text_time",
                        "label": "Text time",
                        "placeholder": "",
                        "error": "Please enter a valid time"
                    },
                    {
                        "element_inarray": true,
                        "id": "text_inarray",
                        "name": "text_inarray",
                        "label": "Text inarray",
                        "placeholder": "",
                        "values": [
                            {"value": "4"},
                            {"value": "5"},
                            {"value": "6"}
                        ],
                        "error": "Please enter one of the allowed values: 4, 5 or 6"
                    },
                    {
                        "element_creditcard": true,
                        "id": "text_creditcard",
                        "name": "text_creditcard",
                        "label": "Text creditcard",
                        "placeholder": "",
                        "error": "Please enter a valid credit card"
                    },
                    {
                        "element_ip": true,
                        "ip_version": "4",
                        "id": "text_ip_v4",
                        "name": "text_ip_v4",
                        "label": "Text IP v4",
                        "placeholder": "",
                        "error": "Please enter a valid IP address version 4"
                    },
                    {
                        "element_ip": true,
                        "ip_version": "6",
                        "id": "text_ip_v6",
                        "name": "text_ip_v6",
                        "label": "Text IP v6",
                        "placeholder": "",
                        "error": "Please enter a valid IP address version 6"
                    },
                    {
                        "element_cidr": true,
                        "id": "text_cidr",
                        "name": "text_cidr",
                        "label": "Text CIDR",
                        "class": "text_cidr_class",
                        "placeholder": "",
                        "error": "Please enter a valid CIDR"
                    },
                    {
                        "element_subnet": true,
                        "id": "text_subnet",
                        "name": "text_subnet",
                        "label": "Text subnet mask",
                        "placeholder": "",
                        "error": "Please enter a valid subnet mask"
                    },
                    {
                        "element_file": true,
                        "id": "text_file",
                        "name": "text_file",
                        "label": "File Upload",
                        "placeholder": "",
                        "class": "text_file_class",
//                        "value": "{{{text}}}",
                        "fileupload_button_label": "Browse",
                        "error": "Please select a valid file"
                    },
                    {
                        "element_fingerprint": true,
                        "id": "text_fingerprint",
                        "name": "text_fingerprint",
                        "label": "Text fingerprint",
                        "placeholder": "",
//                        "value": "{{{text}}}",
                        "error": "Please enter a valid fingerprint"
                    }
                ]
            }
        ],
//        "buttonsAlignedRight":true,
//        "unlabeled":true,
        "buttonsClass":"buttons_row",
        "buttons": [
            {
                "id": "remove_elements",
                "name": "remove_elements",
                "value": "Remove Elements",
                "isInactive": true
            },
            {
                "id": "add_elements",
                "name": "add_elements",
                "value": "Add Elements",
                "isInactive": true
            },

            {
                "id": "add_section",
                "name": "add_section",
                "value": "Add Section",
                "isInactive": true
            },
            {
                "id": "get_values",
                "name": "get_values",
                "value": "Get Values"
            },
            {
                "id": "get_isvalid",
                "name": "get_isvalid",
                "value": "Next",
                "type": "button"
            }
        ],
        "cancel_link": {
            "id": "cancel_form",
            "value": "Cancel"
        },
        "footer": [
            {
                "text":"More examples are available at: "
            },
            {
                "url":"Form with rows that can be copied",
                "href":"/assets/js/widgets/form/tests/testForm.html#copy"
            },
            {
                "url":"Declarative form",
                "href":"/assets/js/widgets/form/tests/testForm.html#declarative"
            },
            {
                "url":"Form without data binding",
                "href":"/assets/js/widgets/form/tests/testForm.html#nobinding"
            }
        ]
    };

    configurationSample.values = {
        "text": "SampleFormWidget",
        "email": "mvilitanga@gmail.com",
        "url": "www.gmail.com",
        "datePicker": "11/20/2010",
        "time": {
            "time": "06:11:00",
            "period": "PM"
        },
        "timeZone": "America/New_York",
        "dateTime": {
            "date": "12/11/2010",
            "time": "03:11:00",
            "period": "PM"
        },
        "ipCidr": {
            "ip": "1.2.3.4",
            "cidr": "12"
        },
        "dropDown": {
            "id": "rtsp",
            "text": "junos-rtsp"
        },
        "checkBox": [
            {
                "id": "checkbox_enable2",
                "checked": true
            },
            {
                "id": "checkbox_disable",
                "checked": true
            }
        ],
        "radioButton": [
            {
                "id": "radio1",
                "checked": false
            },
            {
                "id": "radio2",
                "checked": true
            }
        ]
    };

    return configurationSample;

});