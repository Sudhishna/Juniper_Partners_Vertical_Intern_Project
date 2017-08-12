/** 
 * A module that implements an icon element on the Slipstream UI's
 * utility toolbar.
 * 
 * @module 
 * @name Slipstream/SDK/IconToolbarElement
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['sdk/toolbarElement'], function(ToolbarElement) {
    Slipstream.module("SDK", /** @lends iconToolbarElement */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct a IconToolbarElement
         *
         * @constructor
         * @class IconToolbarElement
         * @classdesc Represents a Slipstream IconToolbarElement
         */
        SDK.IconToolbarElement = function() {
            ToolbarElement.call(this);
        }

        SDK.IconToolbarElement.prototype = Object.create(ToolbarElement.prototype);
        SDK.IconToolbarElement.prototype.constructor = SDK.IconToolbarElement;

        /**
         * Set the badge on the toolbar element icon.  The badge can either
         * be a numeric value or an icon.
         *
         * @param {Integer | String} badge : If the value is a String, then 
         * it represents the relative path to the icon image to be used as a
         * badge.  The path is relative to the "/img" directory associated
         * with the plugin defining this toolbar element.  Otherwise, 
         * it is an integer to be used as the icon badge.
         */
        SDK.IconToolbarElement.prototype.setIconBadge = function(badge) {}

        /**
         * Set the icon for the toolbar element.
         *
         * @param {String} iconPath : The relative path to the icon image to use
         * for this element.  The path is relative to the "/img" directory associated
         * with the plugin defining this toolbar element.
         */
        SDK.IconToolbarElement.prototype.setIcon = function(iconPath) {}

    });

    return Slipstream.SDK.IconToolbarElement;
});