/** 
 * A module that implements a mediator for interacting with an alert provider
 *
 * @module Slipstream/AlertProviderMediator
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(["sdk/alertProvider"], function(AlertProvider) {
    Slipstream.module("AlertProviderMediator", /** @namespace Slipstream.AlertProviderMediator */ function(AlertProviderMediator, Slipstream, Backbone, Marionette, $, _) {
        var alertProvider = new AlertProvider();  // default provider

        function onProviderLoad(providerModule, provider) {
            alertProvider = providerModule;
        }

        AlertProviderMediator.addInitializer(function() {
             /** 
              * Alert Provider discovered event
              *
              * @event alert_provider:discovered
              * @type {Object}
              * @property {Object} provider - The alert provider that's been discovered
              */
             Slipstream.vent.on("alert_provider:discovered", function(provider) {
                 console.log("got alert_provider:discovered event", JSON.stringify(provider));
                 var options = {context: {}, type: AlertProvider, onLoad: onProviderLoad};

                 Slipstream.commands.execute("provider:load", provider, options);
             });

             /** 
              * Alert Provider get most recent alerts event
              *
              * @event alert_provider:getMostRecentAlerts
              * @type {Object}
              * @param {Integer} n - The number of alerts being requested.
              * @param {Object} options - An object containing request options.
              */
             Slipstream.reqres.setHandler("alert_provider:getMostRecent", function(n, options) {
                 console.log("got alert_provider:getRecentAlerts request for n=", n);
                 return alertProvider.getMostRecent(n, options);
             });

             /** 
              * Alert Provider get URL event
              *
              * @event alert_provider:getURL
              * @type {String}
              */
             Slipstream.reqres.setHandler("alert_provider:getURL", function() {
                 return alertProvider.getURL();
             });
         });
    });

    return Slipstream.AlertProviderMediator;
});