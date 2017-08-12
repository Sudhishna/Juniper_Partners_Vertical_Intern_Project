/**
 * A configuration object with the parameters required to generate html (cards) from a template
 *
 * @module cardsConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {

    var cardsConfiguration = {};

    cardsConfiguration.card1 = {
        "title": "Critical Alters Inside POPs",
        "field-help": {
            "content": "Tooltip for Critical Alerts 1",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "total": "10",
        "description": [
            {
                "subtitle": "CPE6_Walmart",
                "details": "| San Francisco"
            },{
                "subtitle": "WLMRT-STR1 - WDCPOP",
                "details": "| Denver"
            },{
                "subtitle": "CPE1_Walmart",
                "details": "| San Francisco"
            }]
    };

    cardsConfiguration.card2 = {
        "title": "Critical Alerts Outside POPs",
        "field-help": {
            "content": "Tooltip for Critical Alerts 2",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "total": "60",
        "description": [
            {
                "subtitle": "CPE4_Walmart",
                "details": "| New York"
            },{
                "subtitle": "WLMRT-STR2 - WDCPOP",
                "details": "| Orlando"
            },{
                "subtitle": "CPE3_Walmart",
                "details": "| Los Angeles"
            }]
    };

    cardsConfiguration.card3 = {
        "title": "Top POPs by CPU Allocation",
        "field-help": {
            "content": "Tooltip for Critical Alerts 3",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "description": [
            {
                "subtitle": "POP1",
                "details": "82%"
            },{
                "subtitle": "POP3",
                "details": "48%"
            },{
                "subtitle": "POP6",
                "details": "34%"
            }]
    };

    cardsConfiguration.card4 = {
        "title": "Top Alerts by CPU Allocation",
        "field-help": {
            "content": "Tooltip for Critical Alerts 4",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "description": [
            {
                "subtitle": "Alert1",
                "details": "82%"
            },{
                "subtitle": "Alert2",
                "details": "48%"
            },{
                "subtitle": "Alert3",
                "details": "34%"
            }]
    };

    cardsConfiguration.card5 = {
        "title": "Critical Alters Inside POP1s 5",
        "field-help": {
            "content": "Tooltip for Critical Alerts",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "total": "39",
        "description": [
            {
                "subtitle": "CPE6_Walmart",
                "details": "| San Francisco"
            },{
                "subtitle": "WLMRT-STR1 - WDCPOP",
                "details": "| Denver"
            },{
                "subtitle": "CPE1_Walmart",
                "details": "| San Francisco"
            }]
    };

    cardsConfiguration.card6 = {
        "title": "Critical Alerts Outside POP2s 6",
        "field-help": {
            "content": "Tooltip for Critical Alerts",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "total": "73",
        "description": [
            {
                "subtitle": "CPE4_Walmart",
                "details": "| New York"
            },{
                "subtitle": "WLMRT-STR2 - WDCPOP",
                "details": "| Orlando"
            },{
                "subtitle": "CPE3_Walmart",
                "details": "| Los Angeles"
            }]
    };

return cardsConfiguration;

});
