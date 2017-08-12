/** 
 * A module that implements a view for displaying global search
 * results.  The view consists of regions for:
 *
 * 1) The search results list.
 * 2) The result facets
 * 3) The search info eg. query string, number of results, etc.
 * 4) Result pagination controls.
 *
 * @module Slipstream/GlobalSearchResultsView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["marionette", "text!../../templates/globalSearchResults.tpl"], function(Marionette, globalSearchResultsTemplate) {

	var GlobalSearchResultsView = Marionette.ItemView.extend({
		initialize: function(options) {
            this.context = options.context;
		},
		className: "global-search-results",
		template: globalSearchResultsTemplate,
		serializeData: function() {
            var translatedStrings = {};

            translatedStrings.search_results_header = this.context.getMessage("search_results_header");
            return translatedStrings;
		}
	});

    return GlobalSearchResultsView;
});