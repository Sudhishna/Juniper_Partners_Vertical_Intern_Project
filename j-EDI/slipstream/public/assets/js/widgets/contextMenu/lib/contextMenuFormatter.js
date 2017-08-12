/**
 * A module reformats the context menu configuration object
 *
 * @module ContextMenuFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([],  /** @lends ContextMenuFormatter */
    function() {

    /**
     * ContextMenuFormatter constructor
     *
     * @constructor
     * @class GridFormatter - Reformats the context menu  configuration object.
     *
     * @param {Object} conf - Context menu  configuration object
     * @returns {Object} Current context menu's object: this
     */
    var ContextMenuFormatter = function(conf){

        /**
         * Builds the GridFormatter
         * @returns {Object} Current "this" of the class
         */

        this.contextMenuConfiguration = _.extend({}, conf); //deep copy

        /*
         * Splits the columns objects into two columns: column and columnSubGrid if subGrid object is available
         * Also, adds custom formatters and
         var contextMenuConfiguration = $.eunformats.
         */
        this.formatConfiguration =  function () {
            var contextMenuConfiguration = $.extend( true, {}, conf),
                confItems = conf.items,
                confItem, confItemItem, item;
            contextMenuConfiguration['items']={};
            for (var i=0; i<confItems.length; i++){
                confItem=confItems[i];
                getItemElements(confItem,contextMenuConfiguration);
                if (confItem.items){
                    confItemItem = confItem.items;
                    contextMenuConfiguration.items[confItem.key].items={};
                    for (var j=0; j<confItemItem.length; j++){
                        getItemElements(confItemItem[j],contextMenuConfiguration.items[confItem.key]);
                    }
                }
            }
            return contextMenuConfiguration;
        };

        var getItemElements = function (confItem, contextMenuConfiguration){
            if (confItem.key){
                contextMenuConfiguration['items'][confItem.key] = {"name": confItem.label}
                if (confItem['icon']) contextMenuConfiguration['items'][confItem.key]['icon']=confItem['icon'];
                if (confItem['callback']) contextMenuConfiguration['items'][confItem.key]['callback']=confItem['callback'];
                if (confItem['disabled']) contextMenuConfiguration['items'][confItem.key]['disabled']=confItem['disabled'];
            }
        }

    };

    return ContextMenuFormatter;
});