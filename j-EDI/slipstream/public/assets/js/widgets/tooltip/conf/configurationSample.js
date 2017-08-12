/**
 * A sample configuration object that shows the parameters required to build a Tooltip widget
 *
 * @module configurationSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var configurationSample = {};

    /**************************************************
     * Configuration for a String content
     **************************************************/
    configurationSample.stringContent = {
        "position": 'right',
        "style": 'topNavigation'
    };

    /**************************************************
     * Configuration for a HTML content (template)
     **************************************************/
    configurationSample.templateContent = {
        "maxWidth": 300,
        "position": 'right',
        "interactive": true
    };

    /**************************************************
     * Configuration for a HTML element (form view)
     **************************************************/
    configurationSample.formContent = {
        "minWidth": 500,
        "position": 'right',
        "interactive": true
    };

    return configurationSample;

});
