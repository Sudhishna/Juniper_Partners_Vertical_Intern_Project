/** 
 * The AuthenticationResolver module defines the interface between a plugin and an authentication provider.
 * 
 * @module 
 * @name Slipstream/SDK/AuthenticationResolver
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(function() {
    Slipstream.module("SDK", /** @lends AuthenticationResolver */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct an AuthenticationResolver
         *
         * @constructor
         * @class AuthenticationResolver
         * @classdesc Represents a Slipstream AuthenticationResolver
         */
        SDK.AuthenticationResolver = function() {}

        /** 
         * Send an authentication request to the provider
         *
         * @param {String} user - The user to be authenticated.
         * @param {Object} credentials - The credentials to use for authentication.
         * @param {Object} options - An options hash to control execution.  The options hash can 
         * contain the following keys:
         *
         * success - A callback to be called if authentication is successful.  
         *
         * fail - A callback to be called if authentication is unsuccessful. This callback takes a 
         * single argument that is an object containing the error response.
         *
         */
        SDK.AuthenticationResolver.prototype.authenticate = function(user, credentials, options) {
            Slipstream.commands.execute("authentication_provider:authenticate", user, credentials, options);
        }

        /**
         * Unauthenticate the current user.
         *
         * @param {Object} options - An options hash to control execution.  The options hash can 
         * contain the following keys:
         *
         * success - A callback to be called if unauthentication is successful.  
         *
         * fail - A callback to be called if unauthentication is unsuccessful. This callback takes a 
         * single argument that is an object containing the error response.
         */
        SDK.AuthenticationResolver.prototype.unauthenticate = function(options) {
            Slipstream.commands.execute("authentication_provider:unauthenticate", options);
        }

        /**
         * Check if the current user is authenticated.
         *
         * @param {Object} options - a hash of options to be used during the authentication
         * checking process.  Valid options are :
         *
         * fail - A callback function that is called if the user is not authenticated.
         * pass - A callback function that is called if the user is authenticated.
         */
        SDK.AuthenticationResolver.prototype.isUserAuthenticated = function(options) {
            Slipstream.reqres.request("authentication_provider:isUserAuthenticated", options);
        }

        /**
         * Return the name of the currently authenticated user.  If there is no authenticated user, returns undefined.
         */
        SDK.AuthenticationResolver.prototype.getUserName = function() {
            return Slipstream.reqres.request("authentication_provider:getUserName");
        }

        /**
         * Return the unique id of the currently authenticated user.  If there is no authenticated user, returns undefined.
         */
        SDK.AuthenticationResolver.prototype.getUserid = function() {
            return Slipstream.reqres.request("authentication_provider:getUserid");
        }
        
        /**
         * Return the idle timeout of the current authenticated session. Returns undefined if the session is not authenticated.
         */
        SDK.AuthenticationResolver.prototype.getIdleTimeout = function() {
            return Slipstream.reqres.request("authentication_provider:getIdleTimeout");
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
        SDK.AuthenticationResolver.prototype.getAuthenticationMode = function (options) {
          return Slipstream.reqres.request("authentication_provider:getAuthenticationMode", options);
      }
    });

    return Slipstream.SDK.AuthenticationResolver;
});