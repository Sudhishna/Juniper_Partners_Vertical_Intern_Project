/** 
 * The AlertResolver module defines the interface between a plugin and an alert provider.
 * 
 * @module 
 * @name Slipstream/SDK/AlertResolver
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(function() {
    Slipstream.module("SDK", /** @lends AlertResolver */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct an AlertResolver
         *
         * @constructor
         * @class AlertResolver
         * @classdesc Represents a Slipstream AlertResolver
         */
        SDK.AlertResolver = function() {}

        /** 
         * Get the most recent alerts
         *
         * @param {Integer} n - The number of recent alerts to be returned.
         * @param {Object} option - An options hash to control execution.  The options hash can 
         * contain the following keys:
         *
         * success - A callback to be called if execution of the operation is successful.  This callback takes
         * a single argument that is an object containing the most recent alerts.. 
         *
         * fail - A callback to be called if execution is unsuccessful. This callback takes a 
         * single argument that is an object containing the error response.
         *
         */
        SDK.AlertResolver.prototype.getMostRecent = function(n, options) {
            Slipstream.reqres.request("alert_provider:getMostRecent", n, options);
        }

        /** 
         * Get the URL for the page that represents the collection of alerts.
         *
         * @return The URL for the page that represents the collection of alerts.
         */
        SDK.AlertResolver.prototype.getURL = function() {
            return Slipstream.reqres.request("alert_provider:getURL");
        }
    });

    return Slipstream.SDK.AlertResolver;
});