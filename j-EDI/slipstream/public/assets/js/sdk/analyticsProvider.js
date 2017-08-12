/** 
 * The AnalyticsnProvider module defines the interface between the Slipstream framework and a provider
 * of UI analytics services.
 * 
 * @module 
 * @name Slipstream/SDK/AnalyticsProvider
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(['sdk/baseActivity'], function(BaseActivity) {
    Slipstream.module("SDK", /** @lends AnalyticsProvider */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct an AnalyticsProvider
         *
         * @constructor
         * @class AnalyticsProvider
         * @classdesc Represents a Slipstream AnalyticsProvider
         */
        SDK.AnalyticsProvider = function() {
            BaseActivity.call(this);
        }

        SDK.AnalyticsProvider.prototype = Object.create(BaseActivity.prototype);
        SDK.AnalyticsProvider.prototype.constructor = SDK.AnalyticsProvider;

        /** 
         * Track an analytics event
         *
         * @param {String} category - The event category (eg. Firewall)
         * @param {String} action - The event action (eg. "Create Rule")
         * @param {String} name - The event name {optional}
         * @param {String} value - A value associated with the event
         */
        SDK.AnalyticsProvider.prototype.trackEvent = function(category, action, name, value) {}
        
        /** 
         * Track a link click event
         *
         * @param {String} url - The URL associated with the link
         * @param {String} linkType - The type of the link to be tracked
         */
        SDK.AnalyticsProvider.prototype.trackLink = function(url, linkType) {}

        /** 
         * Track content impressions within a DOM node.
         *
         * @param {String} domNode - The DOM node within which content impressions should be tracked.
         */
        SDK.AnalyticsProvider.prototype.trackContentImpressionsWithinNode = function(domNode) {}

        /** 
         * Track a content impression
         *
         * @param {String} contentName - The name of the content
         * @param {String} contentPiece - A description of the content
         * @param {String} contentTarget - The target (if any) of a click on the content
         */
        SDK.AnalyticsProvider.prototype.trackContentImpression = function(contentName, contentPiece, contentTarget) {}

        /** 
         * Track a content interaction within a given node
         *
         * @param {String} domNode - The DOM node for which the content interaction to be tracked
         * @param {String} contentInteraction - The name of the content interation to be set eg. 'click' or 'submit'.
         */ 
        SDK.AnalyticsProvider.prototype.trackContentInteractionNode = function(domNode, contentInteraction) {}

        /** 
         * Track interaction with a content section
         *
         * @param {String} contentInteraction - The name of the content interation to be set eg. 'click' or 'submit'.
         * @param {String} contentName - The name of the content for which the interaction is to be tracked
         * @param {String} contentPiece - A description of the content for which the interaction is to be tracked
         * @param {String} contentTarget - The target (if any) of the content interaction
         */ 
        SDK.AnalyticsProvider.prototype.trackContentInteraction = function(contentInteraction, contentName, contentPiece, contentTarget) {}

        /** 
         * Add a click listener for a link
         *
         * @param {String} element- The link element for which a click listener should be added
         */ 
        SDK.AnalyticsProvider.prototype.addListener = function(element) {}

        /** 
         * Track a search execution
         *
         * @param {String} query - The search string to be tracked
         * @param {String} category - The search category
         * @param {String} resultCount - The number of search results for query
         */ 
         SDK.AnalyticsProvider.prototype.trackSearch = function(query, category, resultCount) {}

         /** 
          * Track the id of the current user
          *
          * @param {String} username - The userid associated with subsequent tracking events
          */
          SDK.AnalyticsProvider.prototype.setUserId = function(username) {}
    });

    return Slipstream.SDK.AnalyticsProvider;
});