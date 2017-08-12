/**
 * A view that uses the Search Widget to generate a Search field from a configuration object
 * The configuration contains the key and label pairs from which the auto complete menu in the Search widget should be built.
 *
 * @module Search View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/search/searchWidget',
    'widgets/search/conf/configurationSample'
], function(Backbone, SearchWidget,configurationSample){
    var SearchView = Backbone.View.extend({

        events: {
            'click .addRoTokens': 'addReadOnlyTokens',
            'click .removeRoToken': 'removeReadOnlyToken',
            'click .submitRoSearch': 'submitReadOnlySearch',
            'click .addAdvanceTokens': 'addAdvanceTokens',
            'click .clearTokens': 'clearTokens',
            'click .submitSearch': 'submitSearch'
        },

        initialize: function () {
            this.render();
        },

        render: function () {
            var readOnlySearchContainer = this.$el.find('.readOnlySearchContainer')[0];
            var searchContainer = this.$el.find('.searchContainer')[0];

            this.readOnlySearch = new SearchWidget({
                "container": readOnlySearchContainer,
                "readOnly": true,
                "afterTagRemoved": this.afterTagRemoved
            });
            this.readOnlySearch.build();
            this.readOnlySearch.addTokens(['DeviceFamily = SRX']);

            this.search = new SearchWidget({
                "filterMenu": configurationSample.filterMenu,
                "logicMenu": configurationSample.logicMenu,
                "container": searchContainer
            });
            this.search.build();

            return this;
        },

        afterTagRemoved: function (e, tag) {
            console.log(tag);
        },

        addReadOnlyTokens: function () {
            this.readOnlySearch.addTokens(['123.43.5.3','ManagedStatus = InSync','ConnectionStatus = Down, Up']);
        },

        removeReadOnlyToken: function () {
            this.readOnlySearch.removeToken('ManagedStatus');
        },

        submitReadOnlySearch: function () {
            console.log(this.readOnlySearch.getAllTokens());
        },

        addTokens: function () {
            this.search.addTokens(['123.43.5.3','ManagedStatus = InSync, OutSync']);
        },

        addAdvanceTokens: function () {
            this.search.addTokens(['ManagedStatus = InSync, OutSync','AND','Name = test1, test2, test3','AND','OSVersion = 12.2, 12.3, 13.1, 12.4','OR','test']);
        },

        clearTokens: function () {
            this.search.removeAllTokens();
        },

        submitSearch: function () {
            console.log(this.search.getAllTokens());
        }

    });

    return SearchView;
});