/** 
 * A module that implements a view-based element in the Slipstream UI's
 * utility toolbar.
 * 
 * @module 
 * @name Slipstream/SDK/ViewToolbarElement
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['sdk/toolbarElement'], function(ToolbarElement) {
    Slipstream.module("SDK", /** @lends viewToolbarElement */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct a ViewToolbarElement
         *
         * @constructor
         * @class ViewToolbarElement
         * @classdesc Represents a Slipstream ViewToolbarElement
         */
        SDK.ViewToolbarElement = function() {
            ToolbarElement.call(this);
        }

        SDK.ViewToolbarElement.prototype = Object.create(ToolbarElement.prototype);
        SDK.ViewToolbarElement.prototype.constructor = SDK.ViewToolbarElement;

        /**
         * Set the view for the toolbar element.
         *
         * @param {Object} view : The view to be rendered for the toolbar elements
         */
        SDK.ViewToolbarElement.prototype.setView = function(view) {}
    });

    return Slipstream.SDK.ViewToolbarElement;
});