/**
 * A module that formats and adds the more menu, the context menu and the action menus
 *
 * @module MenuFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'widgets/contextMenu/contextMenuWidget'
],  /** @lends MenuFormatter */
    function(ContextMenuWidget) {

    /**
     * MenuFormatter constructor
     *
     * @constructor
     * @class GridFormatter - Formats the action menus, more menus and context menu configuration objects and builds them.
     *
     * @param {Object} conf - Context menu configuration defined in the Grid configuration object
     * @returns {Object} Current MenuFormatter's object: this
     */
    var MenuFormatter = function(gridConf){

        /**
         * Builds the MenuFormatter
         * @returns {Object} Current "this" of the class
         */

        var conf = gridConf.contextMenu,
            customActionMenu = gridConf.actionButtons,
            defaultActions = ["create", "edit", "delete"],
            gridColumnModelConfiguration = {},
            rbacHash, contextMenuObj, moreMenuObj,
            eventHash = {"edit": "updateEvent", 
                        "createBefore": "createEvent", 
                        "createAfter": "createEvent",
                        "quickView": "quickViewEvent",
                        "pasteBefore": "pasteEvent",
                        "pasteAfter": "pasteEvent",
                        "copy": "copyEvent",
                        "delete": "deleteEvent",
                        "enable": "enableEvent",
                        "disable": "disableEvent"};

        /**
         * Adds the disable handler to the context menu items. It is required to enable or disable an item in a context menu.
         * {Object} itemsConf - items in a conxtext menu
         * {Object} customStatus - enable or disable status for a group of the elements in a context menu
         * {Object} itemStatusCallback - enable or disable status for each of the elements in a context menu
         * {Object} getSelectedRows - callback that provides the number of selected rows and the row data
         * @inner
         */
        var addItemStatusCallback = function(itemsConf, customStatus, itemStatusCallback, getSelectedRows){
            var items = [], customContextMenuMap = [];

            customStatus = customStatus || {};

            for (var i =0; i<itemsConf.length; i++){
                if (rbacHash[itemsConf[i]['key']] === false) continue;
                //add each item in the map so that we can use it later for calling isDisable
                if(itemsConf[i].items){
                    var subItems = itemsConf[i].items,
                        len = itemsConf[i].items.length,
                        count = 0;
                    for(var j=0;j<subItems.length;){
                        if (rbacHash[subItems[j]['key']] === false) {
                            count += 1;
                            itemsConf[i].items.splice(j, 1);
                            continue;
                        }else{
                            addDisableHandler(subItems[j], customContextMenuMap, customStatus, itemStatusCallback, getSelectedRows);
                            j++;
                        }
                    }

                    //If all of submenu items are hidden, then remove the parent item from the context menu
                    if (count === len) continue;
                }
                _.extend(customStatus, disableParentItem(itemsConf[i], customStatus, getSelectedRows, itemStatusCallback));
                addDisableHandler(itemsConf[i], customContextMenuMap, customStatus, itemStatusCallback, getSelectedRows);
                items.push(itemsConf[i]);
            }
            return items;
        };

        /**
         * Disable the parent item when its all children are disabled
         * {Object} parentItemConf - items in a conxtext menu
         * {Object} customStatus - enable or disable status for a group of the elements in a context menu
         * {Object} getSelectedRows - callback that provides the number of selected rows and the row data
         * {Object} itemStatusCallback - enable or disable status for each of the elements in a context menu
         * @inner
         */
        var disableParentItem = function(parentItemConf, customStatus, getSelectedRows, itemStatusCallback){
            var count = 0,
                key = parentItemConf['key'],
                obj = {};

            if (parentItemConf.items){
                $.each( parentItemConf.items, function( index, item ) {
                    if (checkItemStatus(item, customStatus, getSelectedRows, itemStatusCallback) === true) {
                        count++;
                    }
                });
                if (count == parentItemConf.items.length)
                    obj[key] = false; 
            }
            
            return obj; 
        }

        /**
         * Extends the context menu configuration to include the disabled callback for each item in the menu
         * @inner
         */
        var addDisableHandler = function(menuItem, customContextMenuMap, customStatus, itemStatusCallback, getSelectedRows){
            customContextMenuMap[menuItem.key] = menuItem;
            _.extend(menuItem, {
               "disabled": function(key, opt) {
                   if (key) {
                        if (rbacHash[key] === false){
                            return true;
                        }

                        return checkItemStatus(customContextMenuMap[key], customStatus, getSelectedRows, itemStatusCallback);
                   }
               }
            });
        };

        var checkItemStatus = function(item, customStatus, getSelectedRows, itemStatusCallback){
            var status = false,
                key = item['key'],
                rowSelections = getSelectedRows() || $(this).data('rowSelections');

            if (!_.isEmpty(customStatus) && typeof(customStatus[key])!="undefined"){
               status = !(customStatus[key]);
            } else if (typeof(itemStatusCallback)==='function') {
               status = itemStatusCallback(key, status, rowSelections.selectedRows);
//             status = setItemStatus.apply(context, [key, status, rowSelections.selectedRows]); todo: context of the function needs to be defined
            }

            //check if the current item has isDisabled method defined
            if (item.isDisabled && typeof(item.isDisabled)==='function') {
               //item has specific isDisabled. lets call it
               status = item.isDisabled(key, rowSelections.selectedRows);
//             status = item.isDisabled.apply(context, [key, rowSelections.selectedRows]); todo: context of the function needs to be defined
            }
            return status;
        };

        /**
         * Gets the items to be added in the more menu and context menu. Includes callback to set the disabled status according to row selections in the grid
         * @returns {Object} items to be used in the more and the context menu configuration object
         * @inner
         */
        var getMenuElements = function (getSelectedRows, customStatus, columnMenuConfiguration) {
            var items = [],
                item = {},
                contextConfiguration = columnMenuConfiguration || conf,
                numberOfSelectedRows = 0,
                status = true,
                setItemStatus = gridConf.contextMenuItemStatus;

            var isItemDisabled = function (menuKey, defaultStatus){
                if (!_.isEmpty(customStatus) && typeof(customStatus[menuKey])!="undefined")
                    return !(customStatus[menuKey]);
                else
                    return !defaultStatus;
            };

            for (var key in contextConfiguration){
                if(!/custom/.test(key)){
                    var actionEvent = eventHash[key];
                    
                    if (rbacHash[actionEvent] !== false){
                        item = {
                            "label": contextConfiguration[key],
                            "key": key,
                            "disabled": function(key, opt) {
                                var rowSelections = getSelectedRows() || $(this).data('rowSelections');
                                if(rowSelections) numberOfSelectedRows = rowSelections.numberOfSelectedRows;
                                switch(key){
                                    case 'edit':
                                    case 'createBefore':
                                    case 'createAfter':
                                    case 'quickView':
                                        status = isItemDisabled(key, numberOfSelectedRows == 1);
                                        break;
                                    case 'pasteBefore':
                                    case 'pasteAfter':
                                        status = isItemDisabled(key, rowSelections && numberOfSelectedRows == 1 && rowSelections.isRowCopied);
                                        break;
                                    case 'copy': //TODO: update to support multiple row selection
                                        status = isItemDisabled(key, rowSelections && numberOfSelectedRows == 1);
                                        break;
                                    case 'delete':
                                        status = isItemDisabled(key, numberOfSelectedRows > 0);
                                        break;
                                    case 'enable':
                                    case 'disable':
                                        status = isItemDisabled(key, rowSelections && numberOfSelectedRows > 0 && rowSelections.isRowEnabled);
                                        break;
                                    case 'pasteCell':
                                        status = true;
                                        break;
                                    default:
                                        status = false;
                                        break;
                                }
                                if (typeof(setItemStatus)==='function' && rowSelections){
                                    status = setItemStatus(key, status, rowSelections.selectedRows);
                                }
                                return status;
                            }
                        };
                        items.push(item);
                    }
                } else {
                    var customItems = contextConfiguration['custom'];
                    items = items.concat(addItemStatusCallback(customItems, customStatus, setItemStatus, getSelectedRows));
                }
            }
            return items;
        };

        /**
         * Gets the status of all the items in a menu by using a defer promise which allows to sync the response of callback when it is available
         * @inner
         */
        var getMenuStatus = function (contextMenuContainer, $moreContainer, getSelectedRows, isContextMenu, columnIndex, contextMenuPos) {
            var selectedRows = getSelectedRows ();
            var contextMenuCallback = gridConf.contextMenuStatusCallback;
            // context menu event geenrated from mouse event bubbles up and gets lost while waiting for promise to resolve. Work around by storing the event position in a variable.            
            var getMenuElementStatus = function() {
                var deferred = $.Deferred();
                if (typeof(contextMenuCallback)==='function' && selectedRows){
                    contextMenuCallback(selectedRows,
                        function (menuStatus) {
                            deferred.resolve(menuStatus);
                        },
                        function (errorMessage) {
                            deferred.reject(errorMessage);
                        }
                    );
                } else {
                    deferred.resolve({});
                }
                return deferred.promise();
            };

            var promise = getMenuElementStatus();
            $.when(promise)
                .done(function(customStatus) {
                    if (typeof(customStatus)!= 'undefined') {
                        if (isContextMenu) {
                            // Build context menu with contextMenuPos in order to keep track of X & Y positions of mousedown event
                            buildContextMenu(contextMenuContainer, getSelectedRows, columnIndex, customStatus, contextMenuPos);
                        }
                        else
                            buildMoreMenu (contextMenuContainer, $moreContainer, getSelectedRows, customStatus)
                    }
                })
                .fail(function(errorMessage) {
                    console.log(errorMessage);
                });
        };

        /**
         * Builds the context menu of the grid widget
         * @inner
         */
        var buildContextMenu = function(contextMenuContainer, getSelectedRows, columnIndex, customStatus, contextMenuPos) {
            var menuElements = getMenuElements(getSelectedRows, customStatus);

            if(gridColumnModelConfiguration[columnIndex]){
                var cellContextMenuConfiguration = gridColumnModelConfiguration[columnIndex];
                var cellContextMenuItems = getMenuElements(getSelectedRows, customStatus, cellContextMenuConfiguration);
                menuElements.push({"separator": true});
                menuElements = menuElements.concat(cellContextMenuItems);
            }

            $(contextMenuContainer).bind("contextmenu", function(e){
                $(contextMenuContainer).unbind("contextmenu");
                e.slipstreamContextMenu = true;
            });

            contextMenuObj = new ContextMenuWidget({
                "elements": {
                    "callback": function(key, options) {
                        $(this).trigger('slipstreamGrid.'+key, this);
                    },
                    "items": menuElements
                },
                "container": contextMenuContainer,
                "trigger": "right",
                "dynamic": true
            });

            if (contextMenuPos) {
                contextMenuObj.build().open({x: contextMenuPos.x, y: contextMenuPos.y});
            }
            else {
                contextMenuObj.build();
            }
            
        };

        /*
         * Adds the context menu to a row(s) container
         * @inner
         */
        this.addRowContextMenu = function (contextMenuContainer, getSelectedRows, columnIndex, contextMenuPos) {
                if (contextMenuObj) contextMenuObj.destroy();
                if (gridConf.contextMenuStatusCallback){
                    getMenuStatus(contextMenuContainer, null, getSelectedRows, true, columnIndex, contextMenuPos);
                } else {
                    buildContextMenu(contextMenuContainer, getSelectedRows, columnIndex);
                }
        };

        /*
         * Sets the RBAC has table
         * @param {Object} rbacHashTable - RBAC hash table
         */
        this.setRbacHash = function (rbacHashTable){
            rbacHash = rbacHashTable;
        };

        /*
         * Add the more menu to the grid widget
         * @returns {Object} configuration for the context menu of a row
         */
        this.addMoreMenu = function (moreMenuId, $moreContainer, getSelectedRows) {
            var isMoreMenuEmpty = function () {
                var contextMenuConfiguration = _.extend({}, conf);
                defaultActions.forEach(function(action) {
                    delete contextMenuConfiguration[action];
                });
                return _.isEmpty(contextMenuConfiguration);
            };
            if (isMoreMenuEmpty()){
                $moreContainer.hide();
            } else {
                $moreContainer.unbind('click').bind('click', function (e){
                    if (moreMenuObj) moreMenuObj.destroy();
                    e.stopPropagation();
                    if (gridConf.contextMenuStatusCallback){
                        getMenuStatus(moreMenuId, $moreContainer, getSelectedRows);
                    } else {
                        buildMoreMenu(moreMenuId, $moreContainer, getSelectedRows);
                    }
                });
            }
        };

        /*
         * Builds the context menu widget for the more button
         * @inner
         */
        var buildMoreMenu =  function (moreMenuId, $moreContainer, getSelectedRows, customStatus) {
            var moreMenuElements = [], i;
            var menuElements = getMenuElements(getSelectedRows, customStatus);

            for (i=0; i< menuElements.length; i++){
                var item = menuElements[i];
                if (defaultActions.indexOf(item.key) == -1) {
                    moreMenuElements.push(item);
                }
            }

            moreMenuObj = new ContextMenuWidget({
                "elements": getElementsContextMenuConfiguration(moreMenuElements),
                "container": moreMenuId,
                "trigger": 'left',
                "dynamic": true
            });
            moreMenuObj.build().open();
        };

        /*
         * Provides the basic element configuration required to build a context menu. The context menu is showed exactly below the container. For example, it could be showed below the More button.
         * @inner
         */
        var getElementsContextMenuConfiguration = function (items) {
            return {
                "callback": function(key, options) {
                    $(this).trigger('slipstreamGrid.'+key, $(this).data('rowSelections'));
                },
                "position": function(opt, x, y){
                    opt.$menu.position({ my: "left top", at: "left bottom", of: this, offset: "0 0"});
                },
                "items": items,
                "events": {
                    show: function(opt) {
                        if (this.hasClass('disabled'))
                            return false;
                        else
                            return true;
                    }
                }
            };
        };

        /*
         * Gets the action menu configuration object to be used in building the context menu widget for the action menu
         * @returns {Object} configuration for the action menu
         */
        this.getActionMenuConfiguration = function (getSelectedRows, items, addActionMenuStatusCallback){
            if (addActionMenuStatusCallback){
                items = addItemStatusCallback(items, addActionMenuStatusCallback,getSelectedRows);
            }
            return getElementsContextMenuConfiguration(items);
        };

        /*
         * Adds the action menu to the action area if there are items to show
         */
        this.addActionMenu = function (menuId, menuContainer, menuElements){
            if (menuElements.length>0){
                new ContextMenuWidget({
                    "elements": getElementsContextMenuConfiguration(menuElements),
                    "container": menuId,
                    "trigger": 'left',
                    "dynamic": true
                }).build();
            } else {
                menuContainer.hide();
            }
        };

        /*
         * Provides the action menu configuration in a format that can be consumed by the context menu widget
         * @returns {Object} configuration for the action menu
         */
        this.getActionMenus = function(){
            var actionMenus = {}, actionMenuKey;
            var defaultButtons = customActionMenu.defaultButtons;
            var customButtons = customActionMenu.customButtons;
            if (defaultButtons) {
                for (var key in defaultButtons){
                    var defaultButton = defaultButtons[key];
                    if (defaultButton.items) {
                        actionMenuKey = defaultButton['key'];
                        actionMenus[actionMenuKey] = {
                            'items': defaultButton.items,
                            'statusCallback': defaultButton.itemStatusCallback
                        }
                    }
                }
            }
            if (customButtons) {
                for (var i=0; i<customButtons.length; i++){
                    var customButton = customButtons[i];
                    if (customButton['items']){
                        actionMenuKey = customButton['key'];
                        actionMenus[actionMenuKey] = {
                            'items': customButton.items,
                            'statusCallback': customButton.itemStatusCallback
                        }
                    }
                }
            }
            return actionMenus;
        };

        /*
         * Provides the action button configuration
         * @returns {Object} configuration for action buttons
         */
        this.getActionButtons = function(){
            var actionButtons = [];
            var customButtons = customActionMenu.customButtons;
            if (customButtons){
                for (var i=0; i<customButtons.length; i++){
                    var customButton = customButtons[i];
                    !customButton['items'] && actionButtons.push(customButton['key']);
                }
                return actionButtons;
            }
        };

        /*
         * Creates a generic configuration that allows to add show and hide events for checkbox items in a context menu
         * @param {Object} updateItemSelectionCallback - callback that allows users of the widget to persist the current checkbox selection
         * @returns {Object} configuration for the events of a checkbox item from the context menu widget
         */
        this.getCheckboxItemMenuEvents = function (updateItemSelectionCallback) {
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
                }
            }
        };

        /**
         * Gets the grid column configuration as how it is defined in the grid library column model and the grid configuration
         * @inner
         */
        this.setColumnContextMenuConfiguration = function (gridModel) {
            var reservedColumns = ['slipstreamgrid_more', 'slipstreamgrid_leftAction', 'slipstreamgrid_select'];
            var findColumnConfiguration = function (column) {
                var columnsConf = gridConf.columns;
                for(var i=0; i<columnsConf.length; i++){
                    var columnConf = columnsConf[i];
                    if (columnConf.name == column.name)
                        return columnConf;
                }
            };
            for (var j=0; j<gridModel.length; j++){
                var columnModel = gridModel[j];
                if(!columnModel.title && !columnModel.hidden && !~reservedColumns.indexOf(columnModel.name)){
                    var columnConfiguration = findColumnConfiguration(columnModel);
                    if (columnConfiguration && columnConfiguration.contextMenu)
                        gridColumnModelConfiguration[j] = columnConfiguration.contextMenu;
                }
            }
        };

    };

    return MenuFormatter;
});