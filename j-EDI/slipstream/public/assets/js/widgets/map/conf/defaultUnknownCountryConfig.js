/**
 * Default configuration file consumed by the Map widget
 *
 * @module DefaultUnknownCountryConfig
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['lib/i18n/i18n'], function (i18n) {
    var UnknownCountry = {
        'defaultImage': "/assets/images/icon_unknown.svg", 
        'coordinates' : {
            'lat' :   -49.610710,
            'lng' :   -12.832031
        },
        'name'        : i18n.getMessage('map_widget_unknown_country_label'),
        'iso_a2'      : 'qq'
    };
    return UnknownCountry;
});
