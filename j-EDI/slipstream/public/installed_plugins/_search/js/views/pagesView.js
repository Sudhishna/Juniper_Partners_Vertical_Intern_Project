/** 
 * A module that implements a view for displaying paging controls.
 *
 * @module Slipstream/PagingView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(["marionette", "text!../../templates/pages.tpl", "text!../../templates/pageItem.tpl"], 
 function(Marionette, pagesTemplate, pageItemTemplate) {

    // A view representing one page in the paging controls view
	var PageItemView = Marionette.ItemView.extend({
		template: pageItemTemplate, 
        tagName: "li",
        initialize: function(options) {
            if (this.model.selected) {
                this.doSelect();
            }

            this.context = options.context;
            this.setPseudoAttributes(this.model);
        },
        events: {
            "click": function(e) {
                e.preventDefault();
                this.model.select();
            }
        },
        doSelect: function() {
            this.$el.addClass("current");
        },
        doDeselect: function() {
            this.$el.removeClass("current");
        },
        setPseudoAttributes: function(model) {
            if (model.get("where") == "before") {
                model.set("pseudoPageNumber", "&laquo; " + this.context.getMessage("global_search_page_previous"));
            }
            else if (model.get("where") == "after") {
                model.set("pseudoPageNumber", this.context.getMessage("global_search_page_next") + " &raquo;");
            }
            this.$el.addClass("arrow");
        }
	});

    // A composite view representing the collection of visible pages in a search result set
    var PagesView = Marionette.CompositeView.extend({
    	template: pagesTemplate,
    	itemView: PageItemView,
    	itemViewContainer: "ul",
        itemViewOptions: function() {
            return {
                context: this.context
            };
        },
    	initialize: function(options) {
    		this.listenTo(this.collection, "reset", this.pagesReset);
            this.context = options.context;
    	},
    	pagesReset: function() {
    		this.render();
    	}
    });

    return PagesView;
});