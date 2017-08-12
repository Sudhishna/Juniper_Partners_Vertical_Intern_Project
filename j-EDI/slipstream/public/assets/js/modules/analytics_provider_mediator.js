/** 
 * A module that implements a mediator for interacting with an analytic provider.
 *
 * @module Slipstream/AnalyticsProviderMediator
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(["sdk/analyticsProvider"], function(AnalyticsProvider) {
    Slipstream.module("AnalyticsProviderMediator", /** @namespace Slipstream.AnalyticsProviderMediator */ function(AnalyticsProviderMediator, Slipstream, Backbone, Marionette, $, _) {
        var analyticsProvider = new AnalyticsProvider();  // default provider

        function onProviderLoad(providerModule, provider) {
            analyticsProvider = providerModule;
        }

        AnalyticsProviderMediator.addInitializer(function() {
             /** 
              * Analytics Provider discovered event
              *
              * @event analytics_provider:discovered
              * @type {Object}
              * @property {Object} provider - The analytics provider that's been discovered
              */
             Slipstream.vent.on("analytics_provider:discovered", function(provider) {
                 console.log("got analytics_provider:discovered event", JSON.stringify(provider));
                 var options = {context: {}, type: AnalyticsProvider, onLoad: onProviderLoad};

                 Slipstream.commands.execute("provider:load", provider, options);
             });

             /** 
              * Analytics Provider set userid event
              *
              * @event analytics_provider:setUserId
              * @type {Object}
              * @property {String} userid - The userid associated with subsequent events
              */
              Slipstream.commands.setHandler("analytics_provider:setUserId", function(userid) {
                  analyticsProvider.setUserId(userid)
              });

             /** 
              * Analytics Provider event tracking event
              *
              * @event analytics_provider:trackEvent
              * @type {Object}
              * @property {String} category - The event category (eg. Firewall)
              * @property {String} action - The event action (eg. "Create Rule")
              * @property {String} name - The event name {optional}
              * @property {String} value - A value associated with the event
              */
             Slipstream.commands.setHandler("analytics_provider:trackEvent", function(category, action, name, value) {
                 analyticsProvider.trackEvent(category, action, name, value);
             });
        
             /** 
              * Analytics Provider link tracking event
              *
              * @event analytics_provider:trackLink
              * @type {Object}
              * @property {String} url - The URL associated with the link
              * @property {String} linkType - The type of the link to be tracked
              */
             Slipstream.commands.setHandler("analytics_provider:trackLink", function(url, linkType) {
                 analyticsProvider.trackLink(url, linkType);
             });

             /** 
              * Analytics Provider content impressions tracking within node event
              *
              * @event analytics_provider:trackContentImpressionsWithinNode
              * @type {Object}
              * @property {String} domNode - The DOM node within which content impressions should be tracked.
              */
             Slipstream.commands.setHandler("analytics_provider:trackContentImpressionsWithinNode", function(domNode) {
                 analyticsProvider.trackContentImpressionsWithinNode(domNode);
             })
 
             /** 
              * Analytics Provider content impression tracking event
              *
              * @event analytics_provider:trackContentImpression
              * @type {Object}
              * @property {String} contentName - The name of the content
              * @property {String} contentPiece - A description of the content
              * @property {String} contentTarget - The target (if any) of a click on the content
              */
             Slipstream.commands.setHandler("analytics_provider:trackContentImpression", function(contentName, contentPiece, contentTarget) {
                 analyticsProvider.trackContentImpression(contentName, contentPiece, contentTarget);
             });

             /** 
              * Analytics Provider explicit node content interaction tracking event
              *
              * @event analytics_provider:trackContentInteractionNode
              * @type {Object}
              * @property {String} domNode - The DOM node for which the content interaction interaction is to be tracked
              * @property {String} contentInteraction - The name of the content interation to be set eg. 'click' or 'submit'.
              */ 
             Slipstream.commands.setHandler("analytics_provider:trackContentInteractionNode", function(domNode, contentInteraction) {
                 analyticsProvider.trackContentInteractionNode(domNode, contentInteraction);
             });

             /** 
              * Analytics Provider explicit content interaction tracking event
              *
              * @event analytics_provider:trackContentInteraction
              * @type {Object}
              * @property {String} contentInteraction - The name of the content interation to be set eg. 'click' or 'submit'.
              * @property {String} contentName - The name of the content for which the interaction is to be tracked
              * @property {String} contentPiece - A description of the content for which the interaction is to be tracked
              * @property {String} contentTarget - The target (if any) of the content interaction
              */ 
             Slipstream.commands.setHandler("analytics_provider:trackContentInteraction", function(contentInteraction, contentName, contentPiece, contentTarget) {
                 analyticsProvider.trackContentInteraction(contentInteraction, contentName, contentPiece, contentTarget);
             });

             /** 
              * Analytics Provider add listener event
              *
              * @event analytics_provider:addListener
              * @type {Object}
              * @property {String} element- The name of the link element for which a click listener should be added
              */ 
             Slipstream.commands.setHandler("analytics_provider:addListener", function(element) {
                 analyticsProvider.addListener(element);
             });

             /** 
              * Analytics Provider track  search
              *
              * @event analytics_provider:trackSearch
              * @type {Object}
              * @property {String} query - The search string to be tracked
              * @property {String} category - The search category
              * @property {String} resultCount - The number of search results for query
              */ 
             Slipstream.commands.setHandler("analytics_provider:trackSearch", function(query, category, resultCount) {
                 analyticsProvider.trackGlobalSearch(query, category, resultCount);
             });
         });
    });

    return Slipstream.AnalyticsProviderMediator;
});