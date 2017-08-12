/** 
 * A module that implements an element on the Slipstream UI's
 * utility toolbar.
 * 
 * @module 
 * @name Slipstream/SDK/ToolbarElement
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(function() {
    Slipstream.module("SDK", /** @lends toolbarElement */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct a ToolbarElement
         *
         * @constructor
         * @class ToolbarElement
         * @classdesc Represents a Slipstream ToolbarElement
         */
        SDK.ToolbarElement = function() {}
        
        /**
         * Set the enabled state of this element.
         *
         * @param {Boolean} state: true | false.
         */
        SDK.ToolbarElement.prototype.setEnabled = function(state) {}
    });

    return Slipstream.SDK.ToolbarElement;
});