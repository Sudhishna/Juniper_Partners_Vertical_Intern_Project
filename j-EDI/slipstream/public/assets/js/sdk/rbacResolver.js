/** 
 * The RBACResolver module defines the interface between a plugin and an RBAC provider.
 * 
 * @module 
 * @name Slipstream/SDK/RBACResolver
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(function() {
    Slipstream.module("SDK", /** @lends RBACResolver */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct an RBACResolver
         *
         * @constructor
         * @class RBACResolver
         * @classdesc Represents a Slipstream RBACResolver
         */
        SDK.RBACResolver = function() {}

        /** 
         * Verify that the currently authenticated user has a set of capabilities
         *
         * @param {Array<String>} capabilities - The capabilities to be verified.  The array contains strings that represent  
         * the names of capabilities as defined by the underlying network management platform.
         *
         * @returns 'true' if the currently authenticated user has all of the capabilities specified, 'false' otherwise.
         */
        SDK.RBACResolver.prototype.verifyAccess = function(capabilities) {
            return Slipstream.reqres.request("rbac_provider:verify_access", capabilities);
        }
    });

    return Slipstream.SDK.RBACResolver;
});