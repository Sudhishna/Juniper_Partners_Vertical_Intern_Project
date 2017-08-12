/** 
 * A module that implements a view for displaying information
 * relating to a set of global search results, such as the query
 * string and number of results in the result set.
 *
 * @module Slipstream/GlobalSearchResultsView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["text!../../templates/searchInfo.tpl", "text!../../templates/searchInfoQuery.tpl"], 
    function(searchInfoTemplate, searchInfoQueryTemplate) {
        var SearchInfoView = Marionette.ItemView.extend({
        	initialize: function(options) {
                this.listenTo(this.model, "change", this.resultsChanged);
                this.context = options.context;
        	},
        	resultsChanged: function() {
                this.render();
        	},
        	template: searchInfoTemplate,
            serializeData: function() {
                var query  = Marionette.Renderer.render(searchInfoQueryTemplate, {
                    query: _.escape(this.model.get("query"))
                });
                 
                var search_info = this.context.getMessage("search_info", [this.model.get("totalResults"), query]);
                return {
                    search_info: search_info
                };
            }
        });

    return SearchInfoView;
});