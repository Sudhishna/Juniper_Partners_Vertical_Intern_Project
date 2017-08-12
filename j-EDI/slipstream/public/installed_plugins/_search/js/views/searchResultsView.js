/** 
 * A module that implements a view for displaying a set of 
 * global search results.
 *
 * @module Slipstream/GlobalSearchResultsView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["marionette", "text!../../templates/resultItem.tpl"], function(Marionette, resultItemTemplate) {

	var SearchItemView = Marionette.ItemView.extend({
        initialize: function(options) {
            this.context = options.context;
        },
        serializeData: function() {
            var serializedModel =  _.extend(this.model.toJSON(), {
                more_link_text: this.context.getMessage("description_more"),
                less_link_text: this.context.getMessage("description_less")
            });

            return serializedModel;
        },
		template: resultItemTemplate
	});

    var SearchResultsView = Marionette.CollectionView.extend({
    	initialize: function(options) {
            this.context = options.context;
    		this.listenTo(this.collection, "reset", this.collectionChanged);
    	},
        itemViewOptions: function(model, index) {
            return {
                context: this.context
            };
        },
        events: {
            "click a.jx-global-search-link" : "doResultClickThrough",
            "click a.more-description": "doMoreDescription",
            "click a.less-description": "doLessDescription"
        },
    	collectionChanged: function() {
    		this.render();
    	},
        doResultClickThrough: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var href = $(e.target).attr("href");
            Slipstream.commands.execute("route:navigate", href, {trigger:true});
        },
        doMoreDescription: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var moreLink = $(e.target);
            moreLink.hide();
            var lessLink = moreLink.siblings("a.less-description").first();
            var longDescription = moreLink.siblings("div.long-description").first();
            longDescription.show();
            lessLink.show();
        },
        doLessDescription: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var lessLink = $(e.target);
            lessLink.hide();
            var moreLink = lessLink.siblings("a.more-description").first();
            var longDescription = lessLink.siblings("div.long-description").first();
            longDescription.hide();
            moreLink.show();
        },
     	itemView: SearchItemView
    });

    return SearchResultsView;
});