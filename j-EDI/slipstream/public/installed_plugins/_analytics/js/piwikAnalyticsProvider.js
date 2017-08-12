/** 
 * The PiwikAnalyticsProvider module defines an analytics provider adapter to the Piwik
 * analytics tracker.
 * 
 * @module 
 * @name Slipstream/SDK/PiwikAnalyticsProvider
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(["./piwik.js"], function(Piwik) {
	var tracker;

    function PiwikAnalyticsProvider() {
    	Slipstream.SDK.AnalyticsProvider.call(this);
    	var u="/_analytics/";

    	tracker = Piwik.getAsyncTracker();

        tracker.setTrackerUrl(u+'piwik.php');
        tracker.setSiteId(1);
        tracker.trackPageView();
        tracker.enableLinkTracking();
        tracker.trackAllContentImpressions();
    }

    PiwikAnalyticsProvider.prototype = Object.create(Slipstream.SDK.AnalyticsProvider.prototype);
    PiwikAnalyticsProvider.prototype.constructor = PiwikAnalyticsProvider;

	PiwikAnalyticsProvider.prototype.trackEvent = function(category, action, name, value) {
    	tracker.trackEvent(category, action, name, value);
    }
    	
	PiwikAnalyticsProvider.prototype.trackLink = function(url, linkType) {
		if (!linkType) {
			linkType = "link";
		}

		tracker.trackLink(url, linkType);
	}

	PiwikAnalyticsProvider.prototype.setUserId = function(userid) {
        tracker.setUserId(userid);
	}

	PiwikAnalyticsProvider.prototype.trackContentImpressionsWithinNode = function(domNode) {
		tracker.trackContentImpressionsWithinNode(domNode);
	}

	PiwikAnalyticsProvider.prototype.trackContentImpression = function(contentName, contentPiece, contentTarget) {
		tracker.trackContentImpression(contentName, contentPiece, contentTarget);
	}

	PiwikAnalyticsProvider.prototype.trackContentInteractionNode = function(domNode, contentInteraction) {
		tracker.trackContentInteractionNode(domNode, contentInteraction);
	}

	PiwikAnalyticsProvider.prototype.trackContentInteraction = function(contentInteraction, contentName, contentPiece, contentTarget) {
		tracker.trackContentInteraction(contentInteraction, contentName, contentPiece, contentTarget);
	}

	PiwikAnalyticsProvider.prototype.trackSearch = function(query, category, resultCount) {
		tracker.trackSiteSearch(query, category, resultCount);
	}

	PiwikAnalyticsProvider.prototype.addListener = function(element) {
		tracker.addListener(element);
	}

	return PiwikAnalyticsProvider;
})