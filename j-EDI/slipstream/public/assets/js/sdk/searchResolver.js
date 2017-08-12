/** 
 * The SearchResolver module defines the interface between a plugin and a search provider.
 * 
 * @module 
 * @name Slipstream/SDK/SearchResolver
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(function() {
    Slipstream.module("SDK", /** @lends SearchResolver */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct a SearchResolver
         *
         * @constructor
         * @class SearchResolver
         * @classdesc Represents a Slipstream SearchResolver
         */
        SDK.SearchResolver = function() {}

        /** 
         * Send a query to the search provider
         *
         * @param {String} query - The query string to be executed.
         * @param {Object} option - An options hash to control query execution.  The options hash can 
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
         * query.  Defaul is 1.
         *
         *    size - The size of result pages (in number of results) to be returned.  Default is 10. 
         */
        SDK.SearchResolver.prototype.query = function(query, options) {
            Slipstream.commands.execute("search_provider:search", query, options);
        }
    });

    return Slipstream.SDK.SearchResolver;
});