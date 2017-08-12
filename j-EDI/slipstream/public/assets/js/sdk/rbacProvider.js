/** 
 * The RBACProvider module defines the interface between an RBAC provider and the
 * Slipstream framework.
 * 
 * @module 
 * @name Slipstream/SDK/RBACProvider
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(['sdk/baseActivity'], function(BaseActivity) {
    Slipstream.module("SDK", /** @lends RBACProvider */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct an RBACProvider
         *
         * @constructor
         * @class RBACProvider
         * @classdesc Represents a Slipstream RBACProvider
         */
        SDK.RBACProvider = function() {
            BaseActivity.call(this);
        }

        SDK.RBACProvider.prototype = Object.create(BaseActivity.prototype);
        SDK.RBACProvider.prototype.constructor = SDK.RBACProvider;

        /** 
         * Initialize the RBAC provider
         *
         * @param {Object} options - An options hash for the initialization process.  The options hash can 
         * contain the following keys:
         *
         * username - The name of the currently authenticated user. (required)
         *
         * success - A callback to be called if initialization is successful. (optional)  
         *
         * fail - A callback to be called if initialization fails. This callback takes a 
         * single argument that is an object containing the error response. (optional)
         */
        SDK.RBACProvider.prototype.init = function(options) {
            options = options || {};

            if (options.success) {
                options.success();
            }
        }

        /**
         * Verify that the currently authenticated user has a set of capabilities
         *
         * @param {Array<String>} - An array of capabilities to be verified.   The array contains strings that represent  
         * the names of capabilities as defined by the underlying network management platform.
         *
         * @returns 'true' if the currently authenticated user has all of the capabilities specified, 'false' otherwise.
         */
        SDK.RBACProvider.prototype.verifyAccess = function(capabilities) {
            // allow access by default
            return true;
        }
    });

    return Slipstream.SDK.RBACProvider;
});