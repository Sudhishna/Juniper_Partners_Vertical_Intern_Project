/** 
 * A module that implements a mediator for interacting with an authentication provider
 *
 * @module Slipstream/AuthenticationMediator
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(["sdk/authenticationProvider"], function(AuthenticationProvider) {
    Slipstream.module("AuthenticationProviderMediator", /** @namespace Slipstream.AuthenticationProviderMediator */ 
      function(AuthenticationProviderMediator, Slipstream, Backbone, Marionette, $, _) {
         var authenticationProvider = new AuthenticationProvider();

         function onProviderLoad(providerModule, provider) {
             authenticationProvider = providerModule;
         }

        AuthenticationProviderMediator.addInitializer(function() {
             /** 
              * AuthenticationProvider discovered event
              *
              * @event authentication_provider:discovered
              * @type {Object}
              * @property {Object} provider - The authentication provider that's been discovered
              */
             Slipstream.vent.on("authentication_provider:discovered", function(provider) {
                 console.log("got authentication_provider:discovered event", JSON.stringify(provider));

                 var options = {context: provider.context, type: AuthenticationProvider, onLoad: onProviderLoad};

                 Slipstream.commands.execute("provider:load", provider, options);
             });

             /** 
              * Authentication Provider authentication request
              *
              * @event authentication_provider:authenticate
              * @type {Object}
              * @param {String} user - The name of the user to be authenticated.
              * @param {Object} credentials - The credentials to use to authenticated the user.
              * @param {Object} options - An options hash to control the authentication process (optional).
              */
             Slipstream.commands.setHandler("authentication_provider:authenticate", function(user, credentials, options) {
                 console.log("got authentication_provider:authenticate request for user=", JSON.stringify(user));
                 if (authenticationProvider) {
                     authenticationProvider.authenticate(user, credentials, options);
                 }
             });

             /**
              * Check if the current user is authenticated.
              *
              * @param {Object} options - a hash of options to be used during the authentication
              * checking process.  Valid options are :
              *
              * fail - A callback function that is called if the user is not authenticated.
              * pass - A callback function that is called if the user is authenticated.
              */
             Slipstream.reqres.setHandler("authentication_provider:isUserAuthenticated", function(options) {
                 console.log("got authentication_provider:isUserAuthenticated request");
                 if (authenticationProvider) {
                     authenticationProvider.isUserAuthenticated(options);
                 }
             })

             /**
              * Return the name of the currently authenticated user.  If there is no authenticated user, returns undefined.
              */
             Slipstream.reqres.setHandler("authentication_provider:getUserName", function() {
                 return authenticationProvider ? authenticationProvider.getUserName() : "";
             })

             /**
              * Return the unique id of the currently authenticated user.  If there is no authenticated user, returns undefined.
              */
             Slipstream.reqres.setHandler("authentication_provider:getUserid", function() {
                 return authenticationProvider ? authenticationProvider.getUserid() : "";
             })

             /**
              * Unauthenticate the current user.
              */
             Slipstream.commands.setHandler("authentication_provider:unauthenticate", function(options) {
                 if (authenticationProvider) {
                     authenticationProvider.unauthenticate(options);
                 }
             });
             
             /**
              * Return the idle timeout of the current authenticated session. Returns undefined if the session is not authenticated.
              */
             Slipstream.reqres.setHandler("authentication_provider:getIdleTimeout", function() {
                 if (authenticationProvider) {
                     return authenticationProvider.getIdleTimeout();
                 }
             });
             
	     /**
              * Fetch the authentication mode of the server.
              *
              * @param {Object} options - a hash of options to be used during the get authentication mode
              * process.  Valid options are :
              *
              * fail - A callback function that is called if the get authentication mode is failed
              * pass - A callback function that is called if the get authentication mode is succeed
              */
             Slipstream.reqres.setHandler("authentication_provider:getAuthenticationMode", function(options) {
               if (authenticationProvider) {
                   return authenticationProvider.getAuthenticationMode(options);
               }
           });
         });
    });

    return Slipstream.AuthenticationProviderMediator;
});