/**
 * A configuration object for the tooltips used in the list builder widget
 *
 * @module tooltipConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['underscore'], function (_) {

    var tooltipConfiguration = {};

    tooltipConfiguration.left = {
        "minWidth": 100,
        "maxHeight": 100,
        "position": 'left',
        "interactive": true,
        "contentAsHTML": true
    };

    tooltipConfiguration.right = _.extend({}, tooltipConfiguration.left);
    tooltipConfiguration.right = _.extend(tooltipConfiguration.right, {
        "position": 'right'
    });

    return tooltipConfiguration;

});
