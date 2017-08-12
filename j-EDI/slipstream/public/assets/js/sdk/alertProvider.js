/** 
 * The AlertProvider module defines the interface between an alertprovider and the
 * Slipstream framework.
 * 
 * @module 
 * @name Slipstream/SDK/AlertProvider
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(['sdk/baseActivity'], function(BaseActivity) {
    Slipstream.module("SDK", /** @lends AlertProvider */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct an AlertProvider
         *
         * @constructor
         * @class AlertProvider
         * @classdesc Represents a Slipstream AlertProvider
         */
        SDK.AlertProvider = function() {
            BaseActivity.call(this);
        }

        SDK.AlertProvider.prototype = Object.create(BaseActivity.prototype);
        SDK.AlertProvider.prototype.constructor = SDK.AlertProvider;

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
        SDK.AlertProvider.prototype.getMostRecent = function(n, options) {
            if (options.success) {
                options.success();
            }
        }

        /** 
         * Get the URL for the page that represents the collection of alerts.
         *
         * @return The URL for the page that represents the collection of alerts.
         */
        SDK.AlertProvider.prototype.getURL = function() {}
    });

    return Slipstream.SDK.AlertProvider;
});