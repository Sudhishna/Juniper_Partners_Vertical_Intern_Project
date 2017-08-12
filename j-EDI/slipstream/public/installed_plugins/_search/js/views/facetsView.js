/** 
 * A module that implements a view for displaying facet results
 * from a search query.
 *
 * @module Slipstream/FacetsView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["marionette", "text!../../templates/facetItem.tpl", "text!../../templates/facets.tpl"], function(Marionette, facetItemTemplate, facetsTemplate) {

	var FacetItemView = Marionette.ItemView.extend({
		template: facetItemTemplate,
        initialize: function(options) {
            this.listenTo(this.model, "deselected", function() {
                this.$el.find("input[type='checkbox']").attr("checked", false);
            });
        },
        triggers: {
            "click input[type='checkbox']" : {
                event: "toggle:facet",
                preventDefault:false
            }
        }
	});

    var FacetsView = Marionette.CompositeView.extend({
    	template: facetsTemplate,
    	itemView: FacetItemView,
    	itemViewContainer: "form",
        events: {
            "click .clear_all": "clearAll"
        },
    	initialize: function(options) {
    		this.listenTo(this.collection, "reset", this.facetsChange);
            this.context = options.context;
    	},
    	facetsChange: function() {
    		this.render();
    	},
        onItemviewToggleFacet: function(args) {
            args.model.toggleSelected();
            this.collection.trigger("selection:changed");

            var clear_all = this.$el.find(".clear_all");

            if (this.collection.selectedLength) {
                clear_all.show();
            }
            else {
                clear_all.hide();   
            }
        },
        clearAll: function() {
            this.collection.selectNone();
            this.collection.trigger("selection:changed");
        },
        serializeData: function() {
            var translatedStrings = {}
            translatedStrings.filters_header = this.context.getMessage("filters_header");
            translatedStrings.objects_header = this.context.getMessage("objects_header").toUpperCase();
            translatedStrings.clear_all = this.context.getMessage("clear_all");

            return translatedStrings;
        }
    });

    return FacetsView;
});