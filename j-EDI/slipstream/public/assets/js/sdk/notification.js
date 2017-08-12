/** 
 * A module that implements a Slipstream notification message.
 * 
 * @module 
 * @name Slipstream/SDK/Notification
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(function() {
    Slipstream.module("SDK", /** @lends Notification */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct a Notification
         *
         * @constructor
         * @class Notification
         * @classdesc Represents a Slipstream Notification
         */
        SDK.Notification = function() {
            this.text = "";
            this.type = "info";
        }
        
        /**
         * Set the text to be rendered in the notification.
         *
         * @param {String} text - The text to be included in the notification.
         * This can either be a simple text string or an HTML fragment.
         *
         * @return This instance of the notification.  Useful for method chaining.
         */
        SDK.Notification.prototype.setText = function(text) {
            this.text = text;
            return this;
        };

        /**
         * Set the type of the notification.
         *
         * @param {String} type - The desired type of the notification.  Allowed
         * values are:
         *
         * "info", "warning", "error", "success".
         *
         * @return This instance of the notification.  Useful for method chaining.
         */
        SDK.Notification.prototype.setType = function(type) {
            this.type = type;
            return this;
        };

        /**
         * Send the notification
         *
         * Calling this method will cause the notification to be
         * rendered to the Slipstream notification area.
         *
         * @return This instance of the notification.
         */
        SDK.Notification.prototype.notify = function() {
            Slipstream.vent.trigger("notification:notify", this);
            return this;
        };
    });

    return Slipstream.SDK.Notification;
});