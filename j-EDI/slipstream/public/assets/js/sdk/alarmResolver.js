/** 
 * The AlarmResolver module defines the interface between a plugin and an alarm provider.
 * 
 * @module 
 * @name Slipstream/SDK/AlarmResolver
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(function() {
    Slipstream.module("SDK", /** @lends AlarmResolver */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct an AlarmResolver
         *
         * @constructor
         * @class AlarmResolver
         * @classdesc Represents a Slipstream AlarmResolver
         */
        SDK.AlarmResolver = function() {}

        /** 
         * Get the most recent alarms
         *
         * @param {Integer} n - The number of recent alarms to be returned.
         * @param {Object} option - An options hash to control execution.  The options hash can 
         * contain the following keys:
         *
         * success - A callback to be called if execution of the operation is successful.  This callback takes
         * a single argument that is an object containing the most recent alarms. 
         *
         * fail - A callback to be called if execution is unsuccessful. This callback takes a 
         * single argument that is an object containing the error response.
         *
         */
        SDK.AlarmResolver.prototype.getMostRecent = function(n, options) {
            Slipstream.reqres.request("alarm_provider:getMostRecent", n, options);
        }

        /** 
         * Get the URL for the page that represents the collection of alarms.
         *
         * @return The URL for the page that represents the collection of alarms.
         */
        SDK.AlarmResolver.prototype.getURL = function() {
            return Slipstream.reqres.request("alarm_provider:getURL");
        }
    });

    return Slipstream.SDK.AlarmResolver;
});