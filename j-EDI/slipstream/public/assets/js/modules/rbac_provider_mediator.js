/** 
 * A module that implements a mediator for interacting with an RBAC provider
 *
 * @module Slipstream/RBACProviderMediator
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(["sdk/rbacProvider"], function(RBACProvider) {
    Slipstream.module("RBACProviderMediator", /** @namespace Slipstream.RBACProviderMediator */ function(RBACProviderMediator, Slipstream, Backbone, Marionette, $, _) {
        var rbacProvider = new RBACProvider();  // default provider

        function onProviderLoad(providerModule, provider) {
            rbacProvider = providerModule;
        }

        RBACProviderMediator.addInitializer(function() {
             /** 
              * RBAC Provider discovered event
              *
              * @event rbac_provider:discovered
              * @type {Object}
              * @property {Object} provider - The RBAC provider that's been discovered
              */
             Slipstream.vent.on("rbac_provider:discovered", function(provider) {
                 console.log("got rbac_provider:discovered event", JSON.stringify(provider));
                 var options = {context: provider.context, type: RBACProvider, onLoad: onProviderLoad};

                 Slipstream.commands.execute("provider:load", provider, options);
             });

             /** 
              * Initialize the RBAC provider
              *
              * @param {Object} options - An options hash for the initialization process.  The options hash can 
              * contain the following keys:
              *
              * success - A callback to be called if initialization is successful.  
              *
              * fail - A callback to be called if initialization fails. This callback takes a 
              * single argument that is an object containing the error response.
              */
             Slipstream.commands.setHandler("rbac_provider:init", function(options) {
                 console.log("got rbac_provider:init request");
                 rbacProvider.init(options);
             });

             /** 
              * RBAC Provider init access request
              *
              * @event rbac_provider:init
              * @type {Object}
              * @param {Array<String>} capabilities - An array of capability names to be verified
              */
             Slipstream.reqres.setHandler("rbac_provider:verify_access", function(capabilities) {
                 console.log("got rbac_provider:verify_access request for capabilities=", capabilities);
                 return rbacProvider.verifyAccess(capabilities);
             });
         });
    });

    return Slipstream.RBACProviderMediator;
});