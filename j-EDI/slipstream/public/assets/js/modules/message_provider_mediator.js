/** 
 * A module that implements a mediator for interacting with data providers
 *
 * @module Slipstream/MessageProviderMediator
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(function() {
    Slipstream.module("MessageProviderMediator", /** @namespace Slipstream.ProviderMediator */ function(MessageProviderMediator, Slipstream, Backbone, Marionette, $, _) {
        var providers = {};
        var subscriptions = {};
        var subscriptionsMapCallbackList = {};
        var event_aggregator;

        /**
         * Generate an event name from a uri and topic
         *
         * @param {String} uri - The uri of the provider
         * @param {String} topic - The name of the topic
         */
        var generate_event_name = function(uri, topic) {
          return event_name = "@" + uri + ":" + topic;
        }

        function getProviderContext(provider) {
            var evt_proxy = {
                publish: function(evt, data) {
                    var evt_name = generate_event_name(provider.uri, evt);
                    event_aggregator.trigger(evt_name, data);
                },
                publishAndWaitForResult : function(evt, data) {
                    var evt_name = generate_event_name(provider.uri, evt);
                    if (subscriptionsMapCallbackList[evt_name]) {
                      var listenersList = Object.keys(subscriptionsMapCallbackList[evt_name]);
                      var nListeners = listenersList.length;
                      for (var ii = 0; ii < nListeners; ii++) {
                        var cb = subscriptionsMapCallbackList[evt_name][listenersList[ii]];
                        var callbackResult = cb(data);
                        if (callbackResult) {
                          return callbackResult;
                        }
                      }
                    }
                    return false;
                },
                /**
                 * Remove a subscription
                 * @memberof Slipstream.ProviderMediator
                 *
                 * @param {Object} subscription - The handle to the subscription to be unsubscribed
                 */
                getSubscriptionsForEvent : function(evt) {
                    var evt_name = generate_event_name(provider.uri, evt);
                    if (subscriptionsMapCallbackList[evt_name]) {
                      var listenersList = Object.keys(subscriptionsMapCallbackList[evt_name]);
                      return listenersList;
                    }
                }
            };

            return {
                getPublisher: function() {
                    return evt_proxy;
                }
            };
        }

        /**
          * Register a provider
          *
          * @memberof Slipstream.ProviderRegistry
          * @param {Object} provider - A provider to be registered
          */
        function registerProvider(provider) {
             console.log("registering provider for uri =", provider.uri);
             providers[provider.uri.toString()] = provider;
        }

        /**
         * Subscribe to a provider's topic
         * @memberof Slipstream.ProviderMediator
         *
         * @param {String} uri - The uri that uniquely identifies the provider
         * @param {String} topic - The topic to which the caller would like to subscribe
         * @param {Function} callback - The function to be called when the provider sends a message in the given topic.
         * @returns A handle to the created subscription.
         */
        function subscribe(uri, topic, callback) {
            if (!providers[uri]) {
                throw new Error("No message provider defined for uri =" + uri);
            }
            var event_name = generate_event_name(uri, topic);
            var subscription_handle;

            event_aggregator.on(event_name, callback);
            subscription_handle = _.uniqueId("provider_subscription_handle_@");
            subscriptions[subscription_handle] = {event_name: event_name, callback: callback};

            if (!subscriptionsMapCallbackList[event_name]) {
                  subscriptionsMapCallbackList[event_name] = {};
            }
            subscriptionsMapCallbackList[event_name][subscription_handle] = callback;

            return subscription_handle;
        }

        /**
         * Remove a subscription
         * @memberof Slipstream.ProviderMediator
         *
         * @param {Object} subscription - The handle to the subscription to be unsubscribed
         */
        function unsubscribe(subscription) {
            var sub = subscriptions[subscription];
            if (sub) {
                event_aggregator.off(sub.event_name, sub.callback);
                delete subscriptionsMapCallbackList[sub.event_name][subscription];
            }
        }

        /**
         * Get a provider's topics
         * @memberof Slipstream.ProviderMediator
         *
         * @param {String} uri - The uri that uniquely identifies the provider
         * @return The set of topics provided by the message provider, or null if there is
         * no provider with the given uri.
         */
        function topics(uri) {
            var topics = null,
                provider = providers[uri];

            if (provider) {
                topics = provider.topics;
            }
            return topics;
        }

       MessageProviderMediator.addInitializer(function() {
           event_aggregator = new Backbone.Wreqr.EventAggregator(); 
           /** 
            * Message Provider discovered event
            *
            * @event message_provider:discovered
            * @type {Object}
            * @property {Object} provider - The provider that's been discovered
            */
           Slipstream.vent.on("message_provider:discovered", function(provider) {
               console.log("got message_provider:discovered event", JSON.stringify(provider));
               registerProvider(provider);

               var context = getProviderContext(provider),
                   options = {context: context, type: Slipstream.SDK.MessageProvider};

               Slipstream.commands.execute("provider:load", provider, options);
           });

           /** 
            * Message Provider subscribe request
            *
            * @event message_provider:subscribe
            * @type {Object}
            * @property {String} provider - The uri identifying the provider
            * @param {String} topic - The topic to which the caller would like to subscribe
            * @param {Function} callback - The function to be called when the provider sends a message in the given topic.
            */
           Slipstream.reqres.setHandler("message_provider:subscribe", function(uri, topic, callback) {
               console.log("got message_provider:subscribe request for uri =", JSON.stringify(uri));
               return subscribe(uri, topic, callback);
           });

           /** 
            * Message Provider unsubscribe request
            *
            * @event message_provider:unsubscribe
            * @type {Object}
            * @param {Object} subscription - The handle to the subscription to be unsubscribed
            */
           Slipstream.reqres.setHandler("message_provider:unsubscribe", function(subscription) {
               var sub = subscriptions[subscription],
                   event_name = sub && sub.event_name;
               console.log("got message_provider:unsubscribe request for handle =", subscription, event_name);
               return unsubscribe(subscription);
           });

           /** 
            * Message Provider topics request
            *
            * @event message_provider:topics
            * @type {Object}
            * @param {String} uri - The uri identifying the provider
            */
           Slipstream.reqres.setHandler("message_provider:topics", function(uri) {
               console.log("got message_provider:topics request", uri);
               return topics(uri);
           });
       });
    });
    
    return Slipstream.MessageProviderMediator;
});
