/** 
 * A module that implements an interface to the user 
 * toolbar element in the Slipstream UI.
 * 
 * @module 
 * @name Slipstream/SDK/UserToolbarElement
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['sdk/toolbarElement'], function(ToolbarElement) {
    Slipstream.module("SDK", /** @lends UserToolbarElement */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct a UserToolbarElement
         *
         * @constructor
         * @class UserToolbarElement
         * @classdesc Represents a Slipstream UserToolbarElement
         */
        SDK.UserToolbarElement = function() {
            ToolbarElement.call(this);
        }

        SDK.UserToolbarElement.prototype = Object.create(ToolbarElement.prototype);
        SDK.UserToolbarElement.prototype.constructor = SDK.UserToolbarElement;
        
        /**
         * Set the name of the user
         *
         * @param {String} user - The name of the user to be set.
         */
        SDK.UserToolbarElement.prototype.setUserName = function(userName) {}
    });

    return Slipstream.SDK.UserToolbarElement;
});