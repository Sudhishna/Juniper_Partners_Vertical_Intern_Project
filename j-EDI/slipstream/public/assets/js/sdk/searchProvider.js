/** 
 * The SearchProvider module defines the interface between a search provider and the
 * Slipstream framework.
 * 
 * @module 
 * @name Slipstream/SDK/SearchProvider
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(['sdk/baseActivity'], function(BaseActivity) {
    Slipstream.module("SDK", /** @lends SearchProvider */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct a SearchProvider
         *
         * @constructor
         * @class SearchProvider
         * @classdesc Represents a Slipstream SearchProvider
         */
        SDK.SearchProvider = function() {
            BaseActivity.call(this);
        }

        SDK.SearchProvider.prototype = Object.create(BaseActivity.prototype);
        SDK.SearchProvider.prototype.constructor = SDK.SearchProvider;

        /** 
         * Send a query to the search provider
         *
         * @param {String} query - The query string to be executed.
         * @param {Object} options - An options hash to control query execution.  The options hash can 
         * contain the following keys:
         *
         * success - A callback to be called if execution of the query is successful.  This callback takes
         * a single argument that is an object containing the query results. 
         *
         * fail - A callback to be called if execution of the query is unsuccessful. This callback takes a 
         * single argument that is an object containing the error response.
         *
         * page - An object with the following attributes:
         *
         *    index: An integer value >= 1 representing the index into the set of results pages to be returned for the
         * query.  Default is 1.
         *
         *    size - The size of result pages (in number of results) to be returned.  Default is 10. 
         * 
         * facets - An array of facet names for the facets which will be used to filter the query results.
         */
        SDK.SearchProvider.prototype.query = function(query, options) {
            if (options.success) {
                options.success();
            }
        }
    });

    return Slipstream.SDK.SearchProvider;
});