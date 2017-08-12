/**
 * A module that formats the context menu 
 *
 * @module SearchOptions
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'widgets/contextMenu/contextMenuWidget'
],  /** @lends SearchOptions */
    function(ContextMenuWidget) {

    /**
     * SearchOptions constructor
     *
     * @constructor
     * @class SearchOptions - Adds the search options of the list builder widget.
     *
     * @param {Object} optionMenu - search option configuration
     * @param {Number} panelNo - 1 or 2
     * @param {String} listBuilderContainerId - List Builder ID
     * @returns {Object} Current SearchOptions's object: this
     */
    var SearchOptions = function(optionMenu, panelNo, listBuilderContainerId){

        /**
         * Builds the SearchOptions
         * @returns {Object} Current "this" of the class
         */

        var self = this;

        /**
         * Enables search capabilities according to the search configuration
         * @param {Function} searchData - callback function used to search the data after a search request
         */
        this.addSearchOptions = function (searchData) {
            addSearchOptions(searchData);
        };

        /**
         * Adds the search context menu
         * @param {Function} searchData - callback function used to search the data after a search request
         * @inner
         */
        var addSearchOptions = function(searchData){
            var configurationSample = {
                    "items": addSearchEvent(searchData),
                    "events": {
                        show: function(opt) {
                            var subMenuData = $(this).data();
                            if(!_.isEmpty(subMenuData) )
                                $.contextMenu.setInputValues(opt, subMenuData);
                        },
                        hide: function(opt) {
                            var subMenuData = $(this).data();
                            $.contextMenu.getInputValues(opt, subMenuData);
                        }
                    }
                };
            
            new ContextMenuWidget({
                "elements": configurationSample,
                "container": listBuilderContainerId + ' .panel' + panelNo + ' .filter-menu-container',
                "trigger": 'left',
                "dynamic": true,
                "position": function(opt, x, y){
                    opt.$menu.position({ my: "right top", at: "right bottom", of: listBuilderContainerId + ' .panel' + panelNo + ' .filter-container', offset: "0 0", collision: 'fit'});
                }
            }).build();
        },

        /**
         * Extend the search event for each item
         * @param {Function} searchData - callback function used to search the data after a search request
         * @inner
         */
        addSearchEvent = function(searchData){
            for (i=0; i<optionMenu.length;i++){
                optionMenu[i].events = {
                    change: function(e){
                        var value = [];
                        if (this.type === 'checkbox'){
                            var checkboxes = $(this).parents('ul').find( 'input:checkbox');

                            for(var i = 0; i < checkboxes.length; i++){
                                if (checkboxes[i].checked){
                                    value.push(checkboxes[i].value);
                                }
                                
                            }
                        }else if (this.type === 'radio'){
                            value.push(this.value);
                        }
                        searchData(value);
                    }
                }
            }
            return optionMenu;
        }

    };

    return SearchOptions;
});