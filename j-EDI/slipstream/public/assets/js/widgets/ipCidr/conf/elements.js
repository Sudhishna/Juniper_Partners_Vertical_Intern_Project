/**
 * Configuration file used by the IP CIDR widget to:
 * 1. widgetConfiguration.elements: get the default values of the widget elements
 * 2. widgetConfiguration.cidrSubnetConversion: get the conversion from a cidr to a subnet value
 *
 * @module widgetConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['lib/i18n/i18n'], function (i18n) {

    var widgetConfiguration = {};

    widgetConfiguration.elements = {
        "elements": [
            {
                "element_ip": true,
                "id": "text_ip",
                "name": "text_ip",
                "class": "row_ip",
                "ip_version": "",
                "label": i18n.getMessage('ipcidr_widget_ip_lab'),
                "placeholder": i18n.getMessage('ipcidr_widget_ip_placeholder'),
                "required": true,
                "field-help": {
                    "content":  i18n.getMessage('ipcidr_widget_ip_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "error": i18n.getMessage('ipcidr_widget_ip_error'),
                "value":"",
                "post_validation": "enableCidrSubnet"
            },
            {
                "element_cidr": true,
                "id": "text_cidr",
                "name": "text_cidr",
                "class": "row_cidr",
                "label": "/",
                "placeholder": i18n.getMessage('ipcidr_widget_cidr_placeholder'),
                "disabled": true,
                "error": i18n.getMessage('ipcidr_widget_cidr_error'),
                "value":"",
                "post_validation": "updateSubnet"
            },
            {
                "element_subnet": true,
                "id": "text_subnet",
                "name": "text_subnet",
                "class": "row_subnet",
                "label": i18n.getMessage('ipcidr_widget_subnet_label'),
                "disabled": true,
                "placeholder": "",
                "disabled": true,
                "field-help": {
                    "content":  "subnet",
                    "ua-help-identifier": "alias_for_ua_event_binding" 
                },
                "error": i18n.getMessage('ipcidr_widget_subnet_error'),
                "post_validation": "updateCidr",
                "value":"",
                "values": []
            }
        ]
    };

    widgetConfiguration.cidrSubnetConversion = {
        "1": "128.0.0.0",
        "2": "192.0.0.0",
        "3": "224.0.0.0",
        "4": "240.0.0.0",
        "5": "248.0.0.0",
        "6": "252.0.0.0",
        "7": "254.0.0.0",
        "8": "255.0.0.0",
        "9": "255.128.0.0",
        "10": "255.192.0.0",
        "11": "255.224.0.0",
        "12": "255.240.0.0",
        "13": "255.248.0.0",
        "14": "255.252.0.0",
        "15": "255.254.0.0",
        "16": "255.255.0.0",
        "17": "255.255.128.0",
        "18": "255.255.192.0",
        "19": "255.255.224.0",
        "20": "255.255.240.0",
        "21": "255.255.248.0",
        "22": "255.255.252.0",
        "23": "255.255.254.0",
        "24": "255.255.255.0",
        "25": "255.255.255.128",
        "26": "255.255.255.192",
        "27": "255.255.255.224",
        "28": "255.255.255.240",
        "29": "255.255.255.248",
        "30": "255.255.255.252",
        "31": "255.255.255.254",
        "32": "255.255.255.255"
    };

    return widgetConfiguration;

});
