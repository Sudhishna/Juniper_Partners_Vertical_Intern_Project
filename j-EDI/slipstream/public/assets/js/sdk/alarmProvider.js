/** 
 * The AlarmProvider module defines the interface between an alarm provider and the
 * Slipstream framework.
 * 
 * @module 
 * @name Slipstream/SDK/AlarmProvider
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(['sdk/baseActivity'], function(BaseActivity) {
    Slipstream.module("SDK", /** @lends AlarmProvider */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct an AlarmProvider
         *
         * @constructor
         * @class AlarmProvider
         * @classdesc Represents a Slipstream AlertProvider
         */
        SDK.AlarmProvider = function() {
            BaseActivity.call(this);
        }

        SDK.AlarmProvider.prototype = Object.create(BaseActivity.prototype);
        SDK.AlarmProvider.prototype.constructor = SDK.AlarmProvider;

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
        SDK.AlarmProvider.prototype.getMostRecent = function(n, options) {
            if (options.success) {
                options.success();
            }
        }

        /** 
         * Get the URL for the page that represents the collection of alarms.
         *
         * @return The URL for the page that represents the collection of alarms.
         */
        SDK.AlarmProvider.prototype.getURL = function() {}
    });

    return Slipstream.SDK.AlarmProvider;
});