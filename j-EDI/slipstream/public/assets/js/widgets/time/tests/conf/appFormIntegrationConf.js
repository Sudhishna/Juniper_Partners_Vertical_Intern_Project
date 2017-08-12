/**
 * A sample test that shows Time widget integration with Form widget
 *
 * @author Vidushi Gupta <vidgupta@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var Time_FormIntegrationConfig = {
        "title": "Time Widget: Integration with Form Widget",
        "form_id": "sample_form",
        "form_name": "sample_form",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text": "Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "elements": [
                    {
                        "element_text": true,
                        "id": "text_field",
                        "name": "text_feld",
                        "label": "Text",
                        "placeholder": "required",
                        "required": true,
                        "ua-help": "alias_for_ua_event_binding",
                        "error": "Please enter a value for this field",
                        "help": "Inline help text",
                        "tooltip": "Tooltip for text field",
                        "value": ""
                    },
                    {
                        "element_ipCidrWidget": true,
                        "id": "text_ipCidrWidget1",
                        "label": "IP/CIDR Widget",
                        "ip_id": "text_ip1",
                        "ip_name": "text_ip1",
                        "ip_placeholder": "IP v4 or v6",
                        "ip_required": "true",
                        "ip_tooltip": "IP v6 example",
                        "ip_error": "Invalid IP address",
                        "cidr_id": "text_cidr",
                        "cidr_name": "text_cidr",
                        "cidr_placeholder": "CIDR",
                        "cidr_error": "Invalid CIDR",
                        "subnet_label": "Subnet mask",
                        "subnet_id": "text_subnet",
                        "subnet_name": "text_subnet",
                        "subnet_placeholder": "Subnet placeholder",
                        "subnet_error": "Please enter a valid subnet mask"
                    },
                    {
                        "element_timeWidget": true,
                        "id": "text_timeWidget",
                        "name": "text_timeWidget"
                    },
                    {
                        "element_email": true,
                        "id": "text_email",
                        "name": "text_email",
                        "label": "Text email",
                        "placeholder": "",
                        "required": true,
                        "error": "Please enter a valid email"
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "update",
                "name": "update",
                "value": "Update"
            }
        ]
    };

    return Time_FormIntegrationConfig;

});
