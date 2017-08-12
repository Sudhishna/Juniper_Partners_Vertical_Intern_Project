/** 
 * A module that implements a view model representing
 * the range of pages in a result set.
 *
 * @module Slipstream/PageViewModel
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(['./resultPageModel.js'], function(ResultPageModel) {
	var PageViewModel = Backbone.Model.extend({
		defaults: {
			totalResults: 0,
			firstPageNumber: undefined,
			lastPageNumber: undefined,
			numberOfVisiblePages: 5,
			pageSize: -1,
			selectedPageNumber: undefined,
			pageCollection: null
		},
		defaultPageSize: 10,
		initialize: function() {
			var PageCollection = Backbone.Collection.extend({
				initialize: function(){
				    var singleSelect = new Backbone.Picky.SingleSelect(this);
				    _.extend(this, singleSelect);
			    }
			});
			this.set("pageCollection", new PageCollection());

			// trigger a rebuild of the collection when the view model changes
			this.listenTo(this, "change", this.rebuildCollection);

			// save the selected page size in user preferences
			this.listenTo(this, "change:pageSize", this.savePageSize);
		},
		fetch: function(options) {
			var pageSize = Slipstream.reqres.request("ui:preferences:get", "ui:global_search:page_size") || this.defaultPageSize;

    		this.set("pageSize", pageSize);
		},
		/**
		 * Save the current page size in the user preferences
		 */
		savePageSize: function(model, pageSize) {
		   Slipstream.vent.trigger("ui:preferences:change", "ui:global_search:page_size", pageSize);
		},
		/**
		 * Rebuild the collection used to represent pages in the visible page range.
		 */
		rebuildCollection: function() {
			var pageModels = [],
		        selectedPage = this.get("selectedPageNumber"),
		        numVisiblePages = this.get("numberOfVisiblePages"),
		        totalResults = this.get("totalResults"),
		        pageSize = this.get("pageSize"),
		        totalPages = Math.floor(totalResults/pageSize) + (totalResults % pageSize ? 1 : 0), 
		        firstPageNumber = this.get("firstPageNumber"),
		        lastPageNumber = this.get("lastPageNumber"),
		        firstPage = firstPageNumber,
		        lastPage = lastPageNumber;

            // Compute the first and last pages of the (possibly) new page range.
        	if (selectedPage == 1) {
        	    firstPage = 1;
        	}
        	else if (selectedPage >=1 && selectedPage < firstPageNumber) {
        		firstPage = firstPageNumber - 1;
        	}
        	else if (selectedPage <= totalPages && selectedPage > lastPageNumber) {
        		firstPage = firstPageNumber + 1;
        	}
        	lastPage = firstPage + Math.min(totalPages - firstPage, numVisiblePages - 1);

        	this.set("firstPageNumber", firstPage);
        	this.set("lastPageNumber", lastPage);
            
            // Generate the new page range
		    for (var pageNumber = firstPage; pageNumber <= lastPage; pageNumber++) {
		    	var model = new ResultPageModel({pageNumber: pageNumber});

		    	if (pageNumber == selectedPage) {
		    		model.select();
		    	}
                pageModels.push(model);
		    }
		    // add pseudo-pages as necessary to represent 'prev' and 'next' pages.
		    if (selectedPage > 1) {
                pageModels.splice(0, 0, new ResultPageModel({pageNumber:selectedPage -1, where: "before"}));
		    }

		    if (lastPage < totalPages) {
		        pageModels.push(new ResultPageModel({pageNumber:selectedPage + 1, where: "after"}));	
		    }

		    // reset the page collection with the new page models
		    this.get("pageCollection").reset(pageModels);
		}
	});

	return PageViewModel;
});