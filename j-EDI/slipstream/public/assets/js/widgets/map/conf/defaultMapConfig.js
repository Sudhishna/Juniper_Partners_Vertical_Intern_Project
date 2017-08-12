/**
 * Default configuration file consumed by the Map widget
 *
 * @module DefaultMapConfig
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['lib/i18n/i18n'], function (i18n) {
    var DefaultMapConfig = {
            'zoomControl'           : true,
            'touchZoom'             : false,
            'scrollWheelZoom'       : false,
            'doubleClickZoom'       : true,
            'zoomLevel'             : 1.95,
            'maxZoom'               : 5,
            'minZoom'               : 2.0,
            'mapCenter'             : [29.278420174798246, -5.309598025402226],
            'isDraggable'           : true,
            'defaultCountriesColor' : '#808080',
            'defaultCountryStyle'   : {
                weight: 1,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            },
            'highlightCountryStyle' : {
                weight: 2,
                color: 'white',
                dashArray: '',
                fillOpacity: 0.7
            },
            'dataPropertyKey'       : 'threatEventCount'
    };
    return DefaultMapConfig;
});
