/** 
 * A module that implements a mediator for interacting with an alarm provider
 *
 * @module Slipstream/AlarmProviderMediator
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(['sdk/alarmProvider'], function(AlarmProvider) {
    Slipstream.module("AlarmProviderMediator", /** @namespace Slipstream.AlarmProviderMediator */ function(AlarmProviderMediator, Slipstream, Backbone, Marionette, $, _) {
        var alarmProvider = new AlarmProvider();  // default provider

        function onProviderLoad(providerModule, provider) {
            alarmProvider = providerModule;
        }

        AlarmProviderMediator.addInitializer(function() {
             /** 
              * Alarm Provider discovered event
              *
              * @event alarm_provider:discovered
              * @type {Object}
              * @property {Object} provider - The alarm provider that's been discovered
              */
             Slipstream.vent.on("alarm_provider:discovered", function(provider) {
                 console.log("got alarm_provider:discovered event", JSON.stringify(provider));
                 var options = {context: provider.context, type: AlarmProvider, onLoad: onProviderLoad};

                 Slipstream.commands.execute("provider:load", provider, options);
             });

             /** 
              * Alarm Provider most recent alarms event
              *
              * @event alarm_provider:getMostRecentAlarms
              * @type {Object}
              * @param {Integer} n - number of alarms to return.
              * @param {Object} options - An object containing request options.
              */
             Slipstream.reqres.setHandler("alarm_provider:getMostRecent", function(n, options) {
                 console.log("got alarm_provider:getRecentAlarms request for n=", n);
                 return alarmProvider.getMostRecent(n, options);
             });

             /** 
              * Alarm Provider get URL event
              *
              * @event alarm_provider:getURL
              * @type {String}
              */
             Slipstream.reqres.setHandler("alarm_provider:getURL", function() {
                 return alarmProvider.getURL();
             });
         });
    });

    return Slipstream.AlarmProviderMediator;
});