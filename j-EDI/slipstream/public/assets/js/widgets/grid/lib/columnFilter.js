/**
 * A module that formats a column for the selection of a row in the tree grid. The column is located in the same location as the on in the simple grid. User interaction is consistent with the grid selection model.
 *
 * @module ColumnFilter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'widgets/grid/lib/gridTemplates',
    'widgets/contextMenu/contextMenuWidget',
    'widgets/grid/view/dateSearchView',
    'widgets/grid/view/numberSearchView'
],  /** @lends ColumnFilter */
    function(render_template, GridTemplates, ContextMenuWidget, DateSearchView, NumberSearchView) {

    /**
     * ColumnFilter constructor
     *
     * @constructor
     * @class ColumnFilter - Formats a column in the tree grid to provide row column selection.
     *
     * @returns {Object} Current ColumnFilter's object: this
     */
    var ColumnFilter = function(){

        /**
         * Builds the ColumnFilter
         * @returns {Object} Current "this" of the class
         */

        var $gridContainer, $searchContainer,
            headerLabelId = _.uniqueId("slipstream_grid_widget_header_label_container");

        /*
         * Defines the html element that will be used to select a row.
         * @param {Object} $container -  jQuery Object that represents the grid container
         * @inner
         */
        this.setGridContainer =  function ($container) {
            $gridContainer = $container;
            $searchContainer = $container.find('.search-container');
        };

        var triggerAddTokensEvent = function (value, column){
            var addToken = { "searchValue": value };
            column && (addToken.columnName = column.index || column.name);
            $searchContainer.trigger("slipstream-add-token", addToken);
        };

        var triggerRemoveTokensEvent = function (column, value){
            $searchContainer.trigger("slipstream-remove-token",{
                "columnName": column.index || column.name,
                "searchValue": value
            });
        };

        var triggerRemoveColumnTokenNoReloadEvent = function (column){
            $searchContainer.trigger("slipstream-remove-column-token-no-reload",{
                "columnName": column.index || column.name
            });
        };

        /**
         * Builds the selection column configuration to be used in the tree grid.
         * @param {Object} column - column that requires input search
         * @inner
         */
        this.getInputSearch =  function (column) {
            return {
                dataEvents: [{
                    type: 'keypress',
                    fn: function(e) {
                        if (e.keyCode === 13 ){ //on Enter (13), the token is added
                            triggerAddTokensEvent(e.target.value, column);
                            this.value = ""; //clear value since it is already added in the token area
                            e.stopPropagation();
                            e.preventDefault();
                        }
                    }
                }]
            }
        };

        /**
         * Builds the selection column configuration to be used in the tree grid.
         * @param {Object} column - column that requires input search
         * @param {Object} conf - Grid configuration object
         * @inner
         */
        this.getDropdownSearch =  function (column, searchCell) {

            var columnName = column.index || column.name,
                tokenKey = columnName + ' = ',
                dropDownData;
            $searchContainer.bind('slipstream-token-removed', function (e, token) {
                if (token) {
                    if(~token.lastIndexOf(tokenKey)){
                        var tokenValues = token.slice(tokenKey.length);
                        var tokenValueArr = tokenValues.split(', ');
                        tokenValueArr.forEach( function (tokenValue) {
                            dropDownData && (dropDownData[tokenValue] = false); //fix for advanced filter
                        });
                    }
                } else {
                    for (var key in dropDownData){
                        dropDownData[key] = false;
                    }
                }
            });

            var dropDownItems = [];
                searchCell['values'].forEach(function(option){
                dropDownItems.push({
                    "key": option.label,
                    "value": option.value,
                    "label": option.label,
                    "type": "checkbox",
                    "events": {
                        "change": function(e){
                            var label= option.label;
                            if (this.checked){
                                triggerAddTokensEvent(label, column);
                            } else {
                                triggerRemoveTokensEvent(column, label);
                            }
                        }
                    }
                });
            });

            var dropDownEvents = {
                show: function(opt) {
                    dropDownData = $(this).data();
                    if(!_.isEmpty(dropDownData) )
                        $.contextMenu.setInputValues(opt, dropDownData); // import states from data store
                },
                hide: function(opt) {
                    $.contextMenu.getInputValues(opt, dropDownData); // export states to data store
                }
            };

            //provides a unique id that could be identified by the context menu widget
            var getDropDownId = function (dropDownId) {
                dropDownId = "#" + dropDownId.replace(/\./g,'\\.');
                var dropDownMenuId = "." + headerLabelId + " ~ .ui-search-toolbar " + dropDownId;
                $gridContainer.find('.ui-jqgrid-labels').addClass(headerLabelId);
                return dropDownMenuId;
            };

            return {
                dataInit: function (element) {
                    element.readOnly = true;
                    element.className = "hasDropdown";

                    var dropdownSearch = new ContextMenuWidget({
                        "elements": {
                            "items": dropDownItems,
                            "events": dropDownEvents,
                            "position": function(opt, x, y){
                                opt.$menu.position({ my: "left top", at: "left bottom", of: this, offset: "0 0"});
                            }
                        },
                        "container": getDropDownId(element.id),
                        "trigger": 'left',
                        "dynamic": true,
                        "autoHide": true
                    });
                    dropdownSearch.build();
                }
            }
        };

        /**
         * Builds the selection column configuration to be used in the tree grid.
         * @param {Object} conf - Grid configuration object
         * @inner
         */
        this.getDateSearch =  function (column) {
            return {
                dataInit: function (element) {
                    element.className = "hasDate detailView";
                },
                dataEvents: [{
                    type: 'click',
                    fn: function() {
                        new  DateSearchView({
                            'column': column,
                            'addTokens': triggerAddTokensEvent,
                            'removeTokens': triggerRemoveColumnTokenNoReloadEvent
                        });
                    }
                }]
            }
        };

        /**
         * Builds the selection column configuration to be used in the tree grid.
         * @param {Object} conf - Grid configuration object
         * @inner
         */
        this.getNumberSearch =  function (column) {
            return {
                dataInit: function (element) {
                    element.className = "hasNumber detailView";
                },
                dataEvents: [{
                    type: 'click',
                    fn: function() {
                        new  NumberSearchView({
                            'column': column,
                            'addTokens': triggerAddTokensEvent,
                            'removeTokens': triggerRemoveColumnTokenNoReloadEvent
                        });
                    }
                }]
            }
        };

    };

    return ColumnFilter;
});