/** 
 * The MessageResolver module defines the interface between a plugin and a message provider.
 * 
 * @module 
 * @name Slipstream/SDK/MessageResolver
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(function() {
    Slipstream.module("SDK", /** @lends MessageResolver */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct a MessageResolver
         *
         * @constructor
         * @class MessageResolver
         * @classdesc Represents a Slipstream MessageResolver
         */
        SDK.MessageResolver = function() {}

        /**
         * Subscribe to a provider's topic
         *
         * @param {String} uri - The uri that uniquely identifies the provider
         * @param {String} topic - The topic to which the caller would like to subscribe
         * @param {Function} callback - The function to be called when the provider sends a message in the given topic.
         * @returns A handle to the created subscription.
         */
        SDK.MessageResolver.prototype.subscribe = function(uri, topic, callback) {
            return Slipstream.reqres.request("message_provider:subscribe", uri, topic, callback);
        }

        /**
         * Remove a subscription
         *
         * @param {Object} subscription - The handle to the subscription to be unsubscribed
         */
        SDK.MessageResolver.prototype.unsubscribe = function(subscription) {
            return Slipstream.reqres.request("message_provider:unsubscribe", subscription);    
        }

        /**
         * Return the list of topics defined by this MessageProvider
         *
         * @param {String} uri = The uri that uniquely identifies the provider.
         * @returns The list of topics defined by this provider.  The list has the
         * following format:
         *
         *  [
         *     \{ 
         *        “event” : "device:commit",
         *        “description” : "The device:commit event is published any time a new configuration has been successfully committed."
         *     \},
         *     \{
         *        “event” : "device:alert",
         *        “description”: "The device:alert event is published any time there is a new alert on the device."
         *     \}
         *  ] 
         *
         * This method should be overridden by objects implementing a MessageProvider
         */
        SDK.MessageResolver.prototype.topics = function(uri) {
            return Slipstream.reqres.request("message_provider:topics", uri);  
        }
    });

    return Slipstream.SDK.MessageResolver;
});