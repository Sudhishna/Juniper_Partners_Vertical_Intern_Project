/** 
 * The AuthenticationProvider module defines the interface between the Slipstream framework and a provider
 * of authentication services.
 * 
 * @module 
 * @name Slipstream/SDK/AuthenticationProvider
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(['sdk/baseActivity'], function(BaseActivity) {
    Slipstream.module("SDK", /** @lends SearchProvider */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct an AuthenticationProvider
         *
         * @constructor
         * @class AuthenticationProvider
         * @classdesc Represents a Slipstream AuthenticationProvider
         */
        SDK.AuthenticationProvider = function() {
            BaseActivity.call(this);
        }

        SDK.AuthenticationProvider.prototype = Object.create(BaseActivity.prototype);
        SDK.AuthenticationProvider.prototype.constructor = SDK.AuthenticationProvider;

        /**
         * Check if the current user is authenticated.
         *
         * @param {Object} options - a hash of options to be used during the authentication
         * checking process.  Valid options are :
         *
         * fail - A callback function that is called if the user is not authenticated.
         * pass - A callback function that is called if the user is authenticated.
         */
        SDK.AuthenticationProvider.prototype.isUserAuthenticated = function(options) {
            options = options || {};
            
            if (options.success) {
                options.success();
            }
        }

        /** 
         * Authenticate a user.
         *
         * @param {String} user - The user name of the user to be authenticated.
         * @param {Object} credentials:  The credentials to use for authenticating the user.
         *
         * @param {Object} options - An options hash to control execution of the authentication process.  The options hash can 
         * contain the following keys:
         *
         * success - A callback to be called if authentication is successful. 
         *
         * fail - A callback to be called if authentication is unsuccessful. This callback takes a 
         * single argument that is an object containing the error response.
         *
         */
        SDK.AuthenticationProvider.prototype.authenticate = function(user, credentials, options) {
            options = options || {};

            if (options.success) {
                options.success();
            }
        }

        /** 
         * Unauthenticate a user.
         */
        SDK.AuthenticationProvider.prototype.unauthenticate = function(options) {
            options = options || {};

            if (options.success) {
                options.success();
            }
        }

        /**
         * Return the name of the currently authenticated user.  If there is no authenticated user, returns undefined.
         */
        SDK.AuthenticationProvider.prototype.getUserName = function() {
            return undefined;
        }

         /**
         * Return the unique id of the currently authenticated user.  If there is no authenticated user, returns undefined.
         */
        SDK.AuthenticationProvider.prototype.getUserid = function() {
            return undefined;
        }
        
        /**
         * Return the idle timeout of the current authenticated session. Returns undefined if the session is not authenticated.
         */
        SDK.AuthenticationProvider.prototype.getIdleTimeout = function() {
            return undefined;
        }
        
        /**
         * Fetch the authentication mode of the server.
         *
         * @param {Object} options - a hash of options to be used during the get authentication mode
         * process.  Valid options are :
         *
         * fail - A callback function that is called if the get authentication mode is failed
         * pass - A callback function that is called if the get authentication mode is succeed
         */
        SDK.AuthenticationProvider.prototype.getAuthenticationMode = function (options) {
            options = options || {};

            if (options.success) {
                options.success();
            }
        }
        
    });

    return Slipstream.SDK.AuthenticationProvider;
});