/** 
 * The Analytics module defines the interface for tracking user analytics in the user interface.
 * 
 * @module 
 * @name Slipstream/SDK/Analytics
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(function() {
	Slipstream.module("SDK", /** @lends Analytics */ function(SDK, Slipstream, Backbone, Marionette, $, _) {

		/**
         * Base Analytics object
         */
        SDK.Analytics = {}

        /** 
         * Track an analytics event
         *
         * @param {String} category - The event category (eg. Firewall)
         * @param {String} action - The event action (eg. "Create Rule")
         * @param {String} name - The event name {optional}
         * @param {String} value - A value associated with the event {optional}
         */
		SDK.Analytics.trackEvent = function(category, action, name, value) {
		    Slipstream.commands.execute("analytics_provider:trackEvent", category, action, name, value);	
		}
	    
	    /** 
         * Track a link click event
         *
         * @param {String} url - The URL associated with the link
         * @param {String} linkType - The type of the link to be tracked
         */
		SDK.Analytics.trackLink = function(url, linkType) {
			Slipstream.commands.execute("analytics_provider:trackLink", url, linkType);
		}

        /** 
         * Track content impressions within a DOM node.
         *
         * @param {String} domNode - The DOM node within which content impressions should be tracked.
         */
		SDK.Analytics.trackContentImpressionsWithinNode = function(domNode) {
			Slipstream.commands.execute("analytics_provider:trackContentImpressionsWithinNode", domNode);
		}

        /** 
         * Track a content impression
         *
         * @param {String} contentName - The name of the content
         * @param {String} contentPiece - A description of the content
         * @param {String} contentTarget - The target (if any) of a click on the content
         */
		SDK.Analytics.trackContentImpression = function(contentName, contentPiece, contentTarget) {
			Slipstream.commands.execute("analytics_provider:trackContentImpression", contentName, contentPiece, contentTarget);
		}
 
        /** 
         * Track a content interaction within a given node
         *
         * @param {String} domNode - The DOM node for which the content interaction to be tracked
         * @param {String} contentInteraction - The name of the content interation to be set eg. 'click' or 'submit'.
         */ 
		SDK.Analytics.trackContentInteractionNode = function(domNode, contentInteraction) {
			 Slipstream.commands.execute("analytics_provider:trackContentInteractionNode", domNode, contentInteraction);
		}

        /** 
         * Track interaction with a content section
         *
         * @param {String} contentInteraction - The name of the content interation to be set eg. 'click' or 'submit'.
         * @param {String} contentName - The name of the content for which the interaction is to be tracked
         * @param {String} contentPiece - A description of the content for which the interaction is to be tracked
         * @param {String} contentTarget - The target (if any) of the content interaction
         */ 
		SDK.Analytics.trackContentInteraction = function(contentInteraction, contentName, contentPiece, contentTarget) {
			Slipstream.commands.execute("analytics_provider:trackContentInteraction", contentInteraction, contentName, contentPiece, contentTarget);
		}

        /** 
         * Add a click listener for a link
         *
         * @param {String} element- The link element for which a click listener should be added
         */ 
		SDK.Analytics.addListener = function(element) {
			Slipstream.commands.execute("analytics_provider:addListener", element);
		}

		/** 
         * Track a search execution
         *
         * @param {String} query - The search string to be tracked
         * @param {String} category - The search category
         * @param {String} resultCount - The number of search results for query
         */ 
         SDK.Analytics.trackSearch = function(query, category, resultCount) { 
             Slipstream.commands.execute("analytics_provider:trackSearch", query, category, resultCount);	
         }

         /** 
          * Track the id of the current user
          *
          * @param {String} userid - The userid associated with subsequent tracking events
          */
         SDK.Analytics.setUserId = function(userid) {
         	 Slipstream.commands.execute("analytics_provider:setUserId", userid);
         }
	});

	return Slipstream.SDK.Analytics;
});