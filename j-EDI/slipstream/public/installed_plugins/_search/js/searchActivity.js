/** 
 * A module that implements an activity for performing a 
 * global search and displaying the search results in the
 * Slipstream content pane.
 *
 * @module Slipstream/GlobalSearchResultsView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["./views/globalSearchResultsView.js", 
        "./views/searchResultsView.js", 
        "./views/facetsView.js",
        "./views/searchInfoView.js", 
        "./views/pagesView.js",
        "./views/pageSizeView.js",
        "./models/pageViewModel.js",
        "backbone.picky"], function(GlobalSearchResultsView, SearchResultsView, FacetsView, SearchInfoView, PagesView, PageSizeView, PageViewModel) {
    function SearchActivity() {
        Slipstream.SDK.Activity.call(this);

        //var pageSize = 10;
        var queryString;
        var search_resolver = new Slipstream.SDK.SearchResolver();
        var search_results = new Backbone.Collection();
        var pageViewModel = new PageViewModel();
        var pages = pageViewModel.get("pageCollection");
        var FacetCollectionClass = Backbone.Collection.extend({
            model: Backbone.Model.extend({
                initialize: function(){
                    var selectable = new Backbone.Picky.Selectable(this);
                    _.extend(this, selectable);
                }
            }),
            initialize: function(){
                var multiSelect = new Backbone.Picky.MultiSelect(this);
                _.extend(this, multiSelect);
            }
        });
        var facets = new FacetCollectionClass();
        var search_info_model = new Backbone.Model();
        var page_size_controls_rendered = false;
        var pagesize_view;

        this.onCreate = function() {
            // re-execute the query when a new page is selected
            pages.on("selected", function(model) {
                if (model) {
                    var facetNames = getSelectedFacetNames(facets);
                    search(queryString, model.get("pageNumber"), pageViewModel.get("pageSize"), facetNames);
                }
            }, this);

            // re-execute the query when the pagesize changes
            pageViewModel.on("change:pageSize", function(model, pageSize) {
                 var facetNames = getSelectedFacetNames(facets);

                 search(queryString, 1, pageSize, facetNames);   
            });

            // re-execute the query when a new facet is selected
            //facets.on("select:all select:none select:some", function() {
            facets.on("selection:changed", function() {
                var facetNames = getSelectedFacetNames(facets);
                
                search(queryString, 1, pageViewModel.get("pageSize"), facetNames);
            });

            /**
             * Create the views associated with regions in the 
             * global search results view.  
             */
            this.setContentView(new GlobalSearchResultsView({
                context: this.context
            })); 

            var results_view = new SearchResultsView({
                context: this.context,
                el: ".search-results",
                collection: search_results
            });  

            var search_info = new SearchInfoView({
                el: ".search-info",
                model: search_info_model,
                context: this.context
            });
            
            var facet_info = new FacetsView({
                el: ".facets",
                collection: facets,
                context: this.context
            });

            var pages_view = new PagesView({
                el: ".paging",
                collection: pages,
                context: this.context
            });

            pagesize_view = new PageSizeView({
                el: ".page-size-controls",
                model: pageViewModel, 
                context: this.context
            });

            function getSelectedFacetNames(facetCollection) {
                var facetModels = _.values(facetCollection.selected), 
                    facetNames = [];

                _.each(facetModels, function(model) {
                    facetNames.push(model.get("objectType"));
                })

                return facetNames.length ? facetNames : null;
            }
        }
        
        this.onStart = function() {
            queryString = this.getIntent().getExtras().query;
            pageViewModel.fetch();
	    }

        /**
         * Execute a text search
         * 
         * @param {String} query - The query string to be used in the search
         * @param {Number} page - The page number at which the search results should begin
         * @param {Number} pageSize - The size of the pages to be returned
         * @param {Object} facetNames - An array of facet names
         */
        function search(query, page, pageSize, facetNames) {
            search_resolver.query(query, _.extend({
                success: function(results) {
                    Slipstream.SDK.Analytics.trackSearch(query, "global search", results.totalResults);
                    /**
                     * Reset the results and facets collections which will trigger results view updates
                     */
                    search_results.reset(results.results);

                    if (!facetNames) { // don't re-render the facets for a faceted query
                        var filteredFacets = _.reject(results.facets, function(facet) {return facet.objectType == "All"});
                        facets = facets.reset(filteredFacets);
                    }

                    search_info_model.set({"totalResults" : results.totalResults, "query" : results.query});
                    pageViewModel.set({"totalResults": results.totalResults, "selectedPageNumber": page});

                    // only render the page size controls on the first query
                    if (!page_size_controls_rendered) {
                        page_size_controls_rendered = true;
                        pagesize_view.render();
                    }
                },
                error: function(error) {
                    // temporary - a proper error view is TBD.
                    console.log("error during query: " + error);
                } 
            },
            {
                page: {index:page, size: pageSize},
                facets: facetNames
            }
          ));  
        }
    }

    SearchActivity.prototype = Object.create(Slipstream.SDK.Activity.prototype);
    SearchActivity.prototype.constructor = SearchActivity;

    return SearchActivity;
});