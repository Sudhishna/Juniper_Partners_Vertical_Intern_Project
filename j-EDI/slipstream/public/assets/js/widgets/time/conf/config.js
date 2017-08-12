/**
 * Configuration file used by the Time widget
 *
 * @module Config
 * @author Vidushi Gupta <vidgupta@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['lib/i18n/i18n'], function (i18n) {

    var Config = {};
    
    Config.getElements = function() {
        return {
            "elements": [
                {
                    "element_time": true,
                    "id": "time_text",
                    "name": "time_text",
                    "class": "row_time_input",
                    "label": i18n.getMessage('time_widget_label'),
                    "required": true,
                    "error": i18n.getMessage('time_widget_error_message')
                },
                {
                    "element_period": true,
                    "id": "time_period",
                    "name": "time_period",
                    "class": "row_time_period",
                    "values": [
                        {
                            "label": i18n.getMessage('time_widget_am_option'),
                            "value": "AM"
                        },
                        {
                            "label": i18n.getMessage('time_widget_pm_option'),
                            "value": "PM"
                        },
                        {
                            "label": i18n.getMessage('time_widget_24_hour_option'),
                            "value": "24 hour"
                        }
                    ]
                }
            ]
        };
    }

    return Config;

});
