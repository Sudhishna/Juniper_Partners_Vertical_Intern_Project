/**
 * A module that builds the filtering options of the grid widget: filter menu, options menu, token area and column filter
 *
 * @module FilterOptions
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'widgets/contextMenu/contextMenuWidget',
    'widgets/search/searchWidget',
    'lib/i18n/i18n'
],  /** @lends FilterOptions */
    function(ContextMenuWidget, SearchWidget, i18n) {

    /**
     * FilterOptions constructor
     *
     * @constructor
     * @class FilterOptions - Adds the filter options of the grid widget located at the top right of the grid and below the grid title.
     *
     * @param {Object} conf - grid configuration
     * @param {Object} gridContainer - grid container
     * @param {Object} menuFormatter - object of the MenuFormatter function
     * @param {Object} dateFormatter - object of the DateFormatter function
     * @returns {Object} Current FilterOptions's object: this
     */
    var FilterOptions = function(conf, gridContainer, menuFormatter, gridFormatter, dateFormatter){

        /**
         * Builds the FilterOptions
         * @returns {Object} Current "this" of the class
         */

        var filterConfiguration = conf.elements.filter,
            gridSections = {
                $filter: gridContainer.find('.filter-container'),
                $saveSearch: gridContainer.find('.search-save-container'),
                $token: gridContainer.find('.search-container'),
                $table: gridContainer.find('.gridTable')
            },
            showHideLabel = i18n.getMessage('ShowHideColumns'),
            showHideId = _.uniqueId("slipstream_grid_widget_show_hide_container"),
            filterId = _.uniqueId("slipstream_grid_widget_filter_container"),
            saveId = _.uniqueId("slipstream_grid_widget_save_container"),
            self = this,
            startSearch = true,
            searchWidget,
            numTokensToBeAdded,
            reloadGrid;

        /**
         * Adds the search input element and builds the search widget
         * @inner
         */
        var initializeSearch = function () {
            if(filterConfiguration.advancedSearch){
                addAdvancedSearch();
                filterConfiguration.advancedSearch.save && addSaveSearch();
            } else {
                addSearchInput();
                initializeReadOnlySearch();
            }
            addSearchHandler();
        };

        /**
         * Enables filter capabilities according to the filter configuration
         * @param {Function} reloadGridData - callback function used to reload the data after a filter request
         */
        this.enableFilter = function (reloadGridData) {
            if (filterConfiguration.searchUrl || filterConfiguration.searchResult){
                reloadGridData && (reloadGrid = reloadGridData);
                if (gridSections.$token.children().length == 0)
                    initializeSearch();
            }
            filterConfiguration.columnFilter && addColumnFilter();
            filterConfiguration.showFilter && addFiltersMenu();
            filterConfiguration.optionMenu && addOptionMenu();
        };

        /**
         * Adds the search input on the filter area
         * @inner
         */
        var addSearchInput = function () {
            var $gridSearch = gridSections.$filter.find('.grid_filter_input');
            gridSections.$inputSearch = $gridSearch.find('input.filter');
            $gridSearch.show();
            $gridSearch.find('.search-icon').on('click.fndtn.search', function(e){
                self.search($(this).siblings('input').val());
            });
            gridSections.$inputSearch.keypress(function (e) {
                if (e.which == 13){
                    e.preventDefault();
                    e.stopPropagation();
                    self.search($(this).val());
                }
            });
        };

        /**
         * Adds the search area on top of the grid by invoking the search widget with the read only option
         * @inner
         */
        var initializeReadOnlySearch = function () {
            searchWidget = new SearchWidget({
                "container": gridSections.$token,
                "readOnly": true,
                "afterTagAdded": doSearch,
                "afterAllTagRemoved": removeAllSearch,
                "afterTagRemoved": removeSearch
            });
        };

        /**
         * Adds the search area on top of the grid by invoking the search widget. It includes the option to add tokens using the context menu of the search widget.
         * @inner
         */
        var addAdvancedSearch = function () {
            searchWidget = new SearchWidget({
                "container": gridSections.$token,
                "filterMenu": filterConfiguration.advancedSearch.filterMenu,
                "logicMenu": filterConfiguration.advancedSearch.logicMenu,
                "afterTagAdded": triggerSearch,
                "afterAllTagRemoved":removeAllSearch,
                "afterTagRemoved":removeSearch
            });
            searchWidget.build();
        };

        /**
         * Adds the save menu next to the search area on top of the grid by invoking the context menu widget.
         * @inner
         */
        var addSaveSearch = function () {
            gridSections.$saveSearch.addClass('saveSearch');
            var saveMenu = [];
            var saveMenuId = "."+saveId+".save-container";
            gridSections.$saveSearch.find(".save-container").addClass(saveId);

            filterConfiguration.advancedSearch.save.forEach(function(option){
                saveMenu.push({
                    "key": option.key,
                    "label": option.label
                });
            });

            var menuConfiguration = getFilterMenuConfiguration(saveMenu);
            new ContextMenuWidget({
                "elements": menuConfiguration,
                "container": saveMenuId,
                "trigger": 'left',
                "dynamic": true
            }).build();
        };

        /**
         * Adds the toolbar search below the title of the grid
         * @inner
         */
        var addColumnFilter = function () {
            gridSections.$table.jqGrid('filterToolbar', {
                autosearch: false,
                defaultSearch: "cn"
            });
        };

        /*
         * Creates a generic configuration that allows to add show and hide events for checkbox items in a context menu
         * @param {Object} updateItemSelectionCallback - callback that allows users of the widget to persist the current checkbox selection
         * @returns {Object} configuration for the events of a checkbox item from the context menu widget
         */
        var getCheckboxItemMenuEvents = function (updateItemSelectionCallback) {
            var subMenuData;
            return {
                show: function(opt) {
                    subMenuData = $(this).data();
                    if(!_.isEmpty(subMenuData) ) {
                        $.contextMenu.setInputValues(opt, subMenuData); // import states from data store
                    }
                },
                hide: function(opt) {
                    $.contextMenu.getInputValues(opt, subMenuData); // export states to data store
                    if (typeof(updateItemSelectionCallback) === "function"){
                        updateItemSelectionCallback(subMenuData);
                    }
                    gridSections.$table.trigger('slipstreamGrid.updateConf:columns');
                }
            }
        };        

        /**
         * Adds the 'Filters' menu to the filter area of the grid
         * @inner
         */
        var addFiltersMenu = function () {
            var filterMenuId = "." + showHideId + ".grid_show_filters",
                filterMenu = [],
                hasCustomItems = !!filterConfiguration.showFilter.customItems,
                hasQuickFilters = !!filterConfiguration.showFilter.quickFilters,
                $quickFilter = gridSections.$filter.find(".grid_show_filters");

            $quickFilter.addClass(showHideId);

            if (hasCustomItems){
                filterConfiguration.showFilter.customItems.forEach(function(option){
                    filterMenu.push({
                        "key": option.key,
                        "label": option.label
                    });
                });
            }

            if (hasQuickFilters){
                var quickFilterKey = "quickFilter = ";

                if (hasCustomItems){
                    filterMenu.push({
                        "separator": true
                    });
                }
                filterMenu.push({
                    "title": "Quick Filters"
                });
                filterConfiguration.showFilter.quickFilters.forEach(function(option){
                    filterMenu.push({
                        "key": option.key,
                        "value": option.key,
                        "label": option.label,
                        "type": "checkbox",
                        "events": {
                            "change": function(e){
                                if (this.checked){
                                    addSearchTokens(quickFilterKey + this.value);
                                } else {
                                    removeSearchTokens(quickFilterKey + this.value);
                                }
                            }
                        }
                    });
                });
                gridSections.$token.bind('slipstream-token-removed', function (e, token) {
                    var quickFilterData = $quickFilter.data();
                    if (token) {
                        if(~token.indexOf(quickFilterKey)){
                            var tokenValues = token.slice(quickFilterKey.length);
                            var tokenValueArr = tokenValues.split(', ');
                            tokenValueArr.forEach( function (tokenValue) {
                                quickFilterData && (quickFilterData[tokenValue] = false);
                            });
                        }
                    } else {
                        for (var key in quickFilterData) {
                            quickFilterData[key] = false;
                        }
                    }
                });
            }

            if(hasCustomItems || hasQuickFilters){
                gridSections.$filter.find(filterMenuId).show();
                var menuConfiguration = getFilterMenuConfiguration(filterMenu);

                if (hasQuickFilters) {
                    menuConfiguration.events = menuFormatter.getCheckboxItemMenuEvents();
                }

                new ContextMenuWidget({
                    "elements": menuConfiguration,
                    "container": filterMenuId,
                    "trigger": 'left',
                    "dynamic": true
                }).build();
            }
        };

        /**
         * Adds the option icon and enables the option menu using the items defined in the grid configuration and the context menu widget
         * @inner
         */
        var addOptionMenu = function () {
            var optionMenuId = "."+filterId+".grid_filter_options";
            var $optionMenu = gridSections.$filter.find(".grid_filter_options").addClass(filterId);
            var optionMenuItems = [];
            $optionMenu.show();

            if (filterConfiguration.optionMenu.showHideColumnsItem){
                var gridColumnsSubMenu = getGridColumnsSubMenu();
                if (typeof(filterConfiguration.optionMenu.showHideColumnsItem.setColumnSelection) === "function"){
                    gridColumnsSubMenu = setInitialColumnSelection(gridColumnsSubMenu);
                }
                gridColumnsSubMenu = addContextMenuParameters(gridColumnsSubMenu);

                optionMenuItems.push({
                    "key": "showHideColumns",
                    "label": showHideLabel,
                    "items": gridColumnsSubMenu,
                    "className": "grid-widget-show-hide-columns-menu"
                });
            }

            if (filterConfiguration.optionMenu.customItems) {
                optionMenuItems = optionMenuItems.concat(filterConfiguration.optionMenu.customItems);
            }
            var menuConfiguration = menuFormatter.getActionMenuConfiguration(undefined,optionMenuItems);

            if (filterConfiguration.optionMenu.showHideColumnsItem){
                menuConfiguration.events = getCheckboxItemMenuEvents(filterConfiguration.optionMenu.showHideColumnsItem.updateColumnSelection);
            }

            new ContextMenuWidget({
                "elements": menuConfiguration,
                "container": optionMenuId,
                "trigger": 'left',
                "dynamic": true
            }).build();
        };

        /**
         * Sets the initial checkboxes of the show hide menu by setting them to true and then disabling the ones defined in the setColumnSelection function callback.
         * @inner
         */
        var setInitialColumnSelection = function (gridColumnsSubMenu) {
            //format the input of the set selection callback
            var inputOfSetSelectionCallback = {};
            for(var i=0; i<gridColumnsSubMenu.length; i++){
                var column = gridColumnsSubMenu[i];
                inputOfSetSelectionCallback[column.key] = column.selected;
            }
            inputOfSetSelectionCallback = filterConfiguration.optionMenu.showHideColumnsItem.setColumnSelection(inputOfSetSelectionCallback);
            for(var i=0; i<gridColumnsSubMenu.length; i++){
                var column = gridColumnsSubMenu[i];
                column.selected = inputOfSetSelectionCallback[column.value];
                showHideGridColumn(column.value,column.selected);
            }
            return gridColumnsSubMenu;
        };

        /**
         * Populates the show hide columns menu from the column model of the grid.
         * @inner
         */
        var getGridColumnsSubMenu = function () {
            var showHideMenuItems= [],
                reservedColumns = ['slipstreamgrid_more', 'slipstreamgrid_leftAction', 'slipstreamgrid_select'];
            var gridModel = gridSections.$table.getGridParam('colModel');
            for(var i=0; i<gridModel.length; i++){
                var column = gridModel[i];
                if(!column.title && column.label && !~reservedColumns.indexOf(column.name)){
                    showHideMenuItems.push({
                        "key": column.name,
                        "label": column.label,
                        "value": column.name,
                        "selected": column.hidden ? false : true
                    });
                }
            }
            return showHideMenuItems;
        };

        /**
         * Adds the checkbox type parameter required to render the menu as a checkbox list and also adds a change event that allows to persist the current user selection by invoking the showHideGridColumn callback.
         * @inner
         */
        var addContextMenuParameters = function (showHideMenuItems) {
            for (var j=0; j<showHideMenuItems.length; j++){
                var showHideMenuItem = showHideMenuItems[j];
                showHideMenuItem.type = "checkbox",
                showHideMenuItem.events = {
                    change: function(e){
                        showHideGridColumn(this.value, this.checked);
                    }
                };
            }
            return showHideMenuItems;
        };

        /**
         * Shows or hides columns using the jqGrid library.
         * @param {String} columnName - name of the column
         * @param {Boolean} showColumn - true to show a column and false to hide it.
         * @inner
         */
        var showHideGridColumn = function (columnName, showColumn){
            if(showColumn){
                gridSections.$table.jqGrid('showCol', columnName);
            } else {
                gridSections.$table.jqGrid('hideCol', columnName);
            }
            gridContainer.trigger('slipstream-resize-grid'); //jqGrid by default saves the column area when rendering the grid; so that, the grid needs to be resized.
        };

        /**
         * Adds the search token for the input search element
         * @param {String} value - value of the search
         * @param {Boolean} isPreSearch - defines if the search needs to be started immediately (after each token is added): true - default value or false in case a different mechanism will trigger the search (like when the grid is loaded for the first time)
         * @inner
         */
        this.search = function (value, isExternalPreSearch) {
            if (conf.elements.filter && (filterConfiguration.searchUrl || filterConfiguration.searchResult)){
                isExternalPreSearch = _.isBoolean(_.isBoolean(isExternalPreSearch)) ? isExternalPreSearch : false;
                if (isExternalPreSearch)
                    numTokensToBeAdded = _.isArray(value)? value.length : 1;
                startSearch = _.isBoolean(isExternalPreSearch) ? false : true;
                _.isEmpty(this.getSearchWidgetInstance()) && initializeSearch();
                gridSections.$inputSearch.val('');//clear input value since it is showed on the token area
                addSearchTokens(value);
                startSearch = true;
            } else {
                throw new Error(errorMessages.noFilter);
            }
        };


        /**
         * Resets column filtering if available before the grid search is started
         * @inner
         */
        var removeAllSearch = function () {
            gridSections.$token.trigger('slipstream-token-removed');
            triggerSearch();
        };

        /**
         * Resets column filtering if available before the grid search is started
         * @inner
         */
        var removeSearch = function (token) {
            gridSections.$token.trigger('slipstream-token-removed', token);
            triggerSearch();
        };

        /**
         * Trigger the search once the startSearch flag is set to true. It
         * @inner
         */
        var doSearch = function () {
            //checks that the search is triggered only when all tokens are added in the search widget for cases where a external search (this.search from the grid widget) has been used.
            if (numTokensToBeAdded == 1) {
                startSearch = true;
                numTokensToBeAdded = null;
            } else if (numTokensToBeAdded  > 0){
                numTokensToBeAdded --;
            }
            startSearch && triggerSearch();
        };

        /**
         * Reload the grid according to a new url provided as a result of updating the tokens in the search grid area
         * @inner
         */
        var triggerSearch = function () {
            var value = searchWidget.getAllTokens(),
                gridPostData = gridSections.$table.jqGrid('getGridParam').postData,
                gridParam;
//            console.log(value);

            if (typeof(filterConfiguration.advancedSearch) == "undefined" && !value.length) //hide search container
                gridSections.$token.hide();

            if(conf.elements.filter.searchResult && typeof(conf.elements.filter.searchResult)==='function'){
                var gridSearchTokens = getGridSearchTokens(value);
                console.log(gridSearchTokens);
                conf.elements.filter.searchResult(gridSearchTokens, reloadGrid);
            } else {
                delete gridPostData['_search'];
                delete gridPostData['filter'];
                if(typeof(conf.elements.filter.searchUrl)==='function'){
                    var searchUrl = conf.elements.filter.searchUrl(value, conf.elements.url);
                    var postData = searchUrl.substring(searchUrl.indexOf('?')+1);
                    if (postData) postData = _.object(_.compact(_.map(postData.split('&'), function(item) {  if (item) return item.split('='); })));
                    gridParam = {
                        url: searchUrl.substring(0, searchUrl.indexOf('?')),
                        postData: postData,
                        page: 1
                    };
                } else {
                    gridParam =  {
                        url: conf.elements.url,
                        search: value,
                        page: 1
                    };
                }
                if (conf.elements.tree) { //restores the tree grid datatype and expansion level modified when childrend are added to a parent by using the addChildren method of the gridWidget class
                    _.extend(gridParam, {
                        datatype: 'json',
                        treeANode: -1
                    });
                }

                gridSections.$table.jqGrid('setGridParam', gridParam).trigger('reloadGrid');
                gridSections.$table.trigger('slipstreamGrid.updateConf:search', {"tokens": value});

            }
        };

        /**
         * Add handlers to the search token area that are used by the toolbar filtering when a column filter is added or removed
         * @inner
         */
        var addSearchHandler = function () {
            gridSections.$token.bind("slipstream-add-token", function(e, data){//data.inputElement, data.columnName
                if  (data.columnName)
                    addSearchTokens(data.columnName + " = " + data.searchValue, data.columnName);
                else
                    addSearchTokens(data.searchValue);
            });
            gridSections.$token.bind("slipstream-remove-token", function(e, data){//data.inputElement, data.columnName
                removeSearchTokens(data.columnName + " = " + data.searchValue, data.columnName);
            });
            gridSections.$token.bind("slipstream-remove-column-token", function(e, data){//data.inputElement, data.columnName
                removeSearchTokens(undefined, data.columnName);
            });
            gridSections.$token.bind("slipstream-remove-column-token-no-reload", function(e, data){//data.inputElement, data.columnName
                removeSearchTokensNoReload(undefined, data.columnName);
            });            
        };

        /**
         * Add tokens to the search container of the grid
         * @inner
         */
        var addSearchTokens = function (value, key){
            if (gridSections.$token.children().length == 0) //build the token area only when a search is requested
                searchWidget.build();
            if (typeof(filterConfiguration.advancedSearch) == "undefined" && !gridSections.$token.is(":visible")) //show search container
                gridSections.$token.show();
            var allTokens = searchWidget.getAllTokens();
            if (key){
                var tokenRemoved = searchWidget.removeToken(key);
                if (tokenRemoved.length){
                    var newTokenKeyValue = key + " = ";
                    tokenRemoved.forEach(function (token){
                        newTokenKeyValue += token.slice(key.length+3) + ', ';
                    });
                    value = newTokenKeyValue + value.slice(key.length+3)
                }
            }
            searchWidget.addTokens(value);
        };

        /**
         * Remove tokens from the search container of the grid
         * @inner
         */
        var removeSearchTokens = function (value, key){
            if (gridSections.$token.children().length){
                searchWidget.removeToken(value, key);
                triggerSearch();
            }
        };

        var removeSearchTokensNoReload = function (value, key){
            if (gridSections.$token.children().length){
                searchWidget.removeToken(value, key);                
            }
        };

        /**
         * Provides the search widget instance used in the grid widget
         * @returns {Array} All applied tokens to the grid
         */
        this.getSearchWidgetInstance = function (){
            return searchWidget;
        };

        /**
         * Provides all tokens available on the search container of the grid
         * @returns {Array} All applied tokens to the grid
         */
        this.getSearchTokens = function (){
            return searchWidget.getAllTokens();
        };

        /*
         * Formats the tokens provided by the SearchWidget into a grid format (column name/value and operator array)
         */
        var getGridSearchTokens = function (tokens){
            var searchTokens = [],
                searchToken;

            var searchableColumns = gridFormatter.getSearchableColumns();
            var tokenConnectors = [' = ', '!= ', ': ', ' >= ', ' =< '];
            var findConnector = function (token) {
                for (var i = 0; i < tokenConnectors.length; i++) {
                    if (~token.indexOf(tokenConnectors[i])) {
                        return tokenConnectors[i];
                    }
                }
                return null;
            };
            tokens.forEach(function (token) {
                if (searchTokens.length) searchTokens.push('AND');
                var connector = findConnector(token);

                if (connector) { //key, value pair
                    var keyValue = token.split(connector);
                    var key = keyValue[0],
                        values = keyValue[1];

                    var searchType = searchableColumns[key];
                    switch (searchType) {
                        case 'number':
                            if (~token.indexOf(' = ')) {
                                searchToken = [{
                                    "column" : key,
                                    "operator" : "=",
                                    "value" : values
                                }];
                            } else if (~token.indexOf(' >= ')) {
                                searchToken = [{
                                    "column" : key,
                                    "operator" : ">=",
                                    "value" : values
                                }];
                            } else if (~token.indexOf(' =< ')) {
                                searchToken = [{
                                    "column" : key,
                                    "operator" : "=<",
                                    "value" : values
                                }];
                            } else {
                                var numberRange = values.split(' - ');
                                searchToken = [{
                                        "column" : key,
                                        "operator" : ">=",
                                        "value" : numberRange[0]
                                    },
                                    "AND",
                                    {
                                        "column" : key,
                                        "operator" : "=<",
                                        "value" : numberRange[1]
                                    }];
                            }
                            searchTokens.push(searchToken);
                            break;
                        case 'date':
                            if (~token.indexOf(' Before ')) {
                                var dateValues = dateFormatter.formatDateTime(values.split('Before ')[1]);
                                searchToken = [{
                                    "column" : key,
                                    "operator" : "=<",
                                    "value" : dateValues
                                }];
                            } else if (~token.indexOf(' After ')) {
                                var dateValues = dateFormatter.formatDateTime(values.split('After ')[1]);
                                searchToken = [{
                                    "column" : key,
                                    "operator" : ">=",
                                    "value" : dateValues
                                }];
                            } else if (~token.indexOf(' - ')) {
                                var dateRange = values.split(' - ');
                                var rangeFrom = dateFormatter.formatDateTime(dateRange[0]);
                                var rangeTo = dateFormatter.formatDateTime(dateRange[1]);
                                searchToken = [{
                                    "column" : key,
                                    "operator" : ">=",
                                    "value" : rangeFrom
                                    },
                                    "AND",
                                    {
                                        "column" : key,
                                        "operator" : "=<",
                                        "value" : rangeTo
                                    }];
                            } else {
                                var dateValues = dateFormatter.formatDateTime(values);
                                searchToken = [{
                                    "column" : key,
                                    "operator" : "=",
                                    "value" : dateValues
                                }];
                            }
                            searchTokens.push(searchToken);
                            break;
                        default:
                            searchToken = [];
                            values = values.split(', ');
                            var valuesLength = values.length, i;
                            for (i=0; i < valuesLength; i++) {
                                searchToken.push({
                                    "column" : key,
                                    "operator" : "=",
                                    "value" : values[i]
                                });
                                (values.length > 1 && i!= valuesLength-1) && searchToken.push("OR");
                            }
                            searchTokens.push(searchToken);
                            break;
                    }
                } else {
                    searchTokens.push(token);
                }
            });
            return searchTokens;
        };

        var getAdvancedSearchTokens = function () {
            return searchWidget.getAdvancedSearchTokens();
        };

        var getFilterMenuConfiguration = function (items) {
            return {
                "callback": function(key, options) {
                    $(this).trigger('slipstreamGrid.'+key, {
                        "search": getAdvancedSearchTokens()
                    });
                },
                "position": function(opt, x, y){
                    opt.$menu.position({ my: "left top", at: "left bottom", of: this, offset: "0 0"});
                },
                "items": items
            };
        };
    };

    return FilterOptions;
});