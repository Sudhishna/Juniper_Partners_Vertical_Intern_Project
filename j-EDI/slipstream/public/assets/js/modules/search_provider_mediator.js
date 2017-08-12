/** 
 * A module that implements a mediator for interacting with a search provider
 *
 * @module Slipstream/SearchProviderMediator
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(function() {
    Slipstream.module("SearchProviderMediator", /** @namespace Slipstream.SearchProviderMediator */ function(SearchProviderMediator, Slipstream, Backbone, Marionette, $, _) {
        var searchProvider;

        function doQuery(query, options) {
            if (searchProvider) {
                searchProvider.query(query, options);
            }
            else {
               console.log("A search cannot be performed, no search provider has been registered");
            }  
        }

        function onProviderLoad(providerModule, provider) {
            searchProvider = providerModule;
        }

        SearchProviderMediator.addInitializer(function() {
             /** 
              * Search Provider discovered event
              *
              * @event search_provider:discovered
              * @type {Object}
              * @property {Object} provider - The search provider that's been discovered
              */
             Slipstream.vent.on("search_provider:discovered", function(provider) {
                 console.log("got search_provider:discovered event", JSON.stringify(provider));
                 var options = {context: provider.context, type: Slipstream.SDK.SearchProvider, onLoad: onProviderLoad};

                 Slipstream.commands.execute("provider:load", provider, options);
             });

             /** 
              * Search Provider query request
              *
              * @event search_provider:query
              * @type {Object}
              * @param {String} query - The query string to be executed.
              * @param {Object} options - An options hash to control query execution (optional).
              */
             Slipstream.commands.setHandler("search_provider:search", function(query, options) {
                 console.log("got search_provider:query request for query=", JSON.stringify(query));
                 doQuery(query, options);
             });
         });
    });

    return Slipstream.SearchProviderMediator;
});