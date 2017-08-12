/**
 * A sample data that exercises all the elements and validation that
 * the Form Widget supports
 *
 * @module Form Sample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['widgets/form/formValidator'], function (FormValidator) {

    var ipCidrFormConfigSample = {},
        validator = new FormValidator();

    ipCidrFormConfigSample.elements = {
        "title": "Integration of the Form Widget and IP CIDR",
        "form_id": "ip_cidr_test_form",
        "form_name": "ip_cidr_test_form",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "elements": [
                    {
                        "element_ipCidrWidget": true
                    },
                    {
                        "element_ipCidrWidget": true,
                        "class": "copy_row",
                        "id": "text_ipCidrWidget_nolabel",
                        "ip_value": "{{ip_value}}",
                        "cidr_value": "{{cidr_value}}",
                        "subnet_value": "{{subnet_value}}"
                    },
                    {
                        "element_ipCidrWidget": true,
                        "label": "IP Label",
                        "subnet_label": "Subnet Label",
                        "id": "text_ipCidrWidget_withlabel",
                        "class": "get_values"
                    },
                    {
                        "element_ipCidrWidget": true,
                        "id": "text_ipCidrWidget",
                        "label": "IP Label only"
                    },
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
                        "ip_value": "{{ip_value}}",
                        "cidr_id": "text_cidr",
                        "cidr_name": "text_cidr",
                        "cidr_placeholder": "CIDR",
                        "cidr_error": "Invalid CIDR",
                        "cidr_value": "{{cidr_value}}",
                        "subnet_label": "Subnet mask",
                        "subnet_id": "text_subnet",
                        "subnet_name": "text_subnet",
                        "subnet_placeholder": "Subnet placeholder",
                         "subnet_field-help": { 
                            "content": "Subnet example",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "subnet_error": "Please enter a valid subnet mask",
                        "subnet_value": "{{subnet_value}}"
                    },
                    {
                        "element_ipCidrWidget": true,
                        "label": "IPv4 Only",
                        "ip_version": "4"
                    },
                    {
                        "element_ipCidrWidget": true,
                        "label": "IPv6 Only",
                        "ip_version": "6"
                    },
                    {
                        "element_ipCidrWidget": true,
                        "label": "For custom validation",
                        "customValidationCallback": function(eleIp, eleCidr, eleSubnet, showErrorMessage) {
                            var result = true,
                                cidrVal = eleCidr.value,
                                isIpv4 = validator.isValidValue('ipv4', eleIp);
                            if(isIpv4 && parseInt(cidrVal) > 5){
                                result = false;
                            }else if(!isIpv4 && parseInt(cidrVal) > 10){
                                result = false;
                            }
                            if(! result){
                                showErrorMessage("Ipv4's cidr cannot exceed 5, Ipv6's cidr cannot exceed 10");
                            }
                        }
                    }
                ]
            }
        ],
        "buttonsClass":"copy_row_buttons",
        "buttons": [
            {
                "id": "update",
                "name": "update",
                "value": "Update"
            },
            {
                "id": "copy_row_button",
                "name": "copy_row_button",
                "type": "button",
                "value": "Copy 2nd IP Row",
                "data": "copy_row"
            },
            {
                "id": "get_values_button",
                "name": "get_values_button",
                "type": "button",
                "value": "Get 3rd IP Values",
                "data": "get_values"
            }
        ]
    };

    ipCidrFormConfigSample.values = {
        "ip_value": "1.2.3.4",
        "cidr_value": "4",
        "subnet_value": "240.0.0.0"
    };

    return ipCidrFormConfigSample;

});
