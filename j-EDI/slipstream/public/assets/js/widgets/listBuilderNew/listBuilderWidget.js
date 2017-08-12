/**
 * A module that builds a double list widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 *
 * @module ListBuilderWidget
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'jqGrid',
    'isInViewport',
    'widgets/spinner/spinnerWidget',
    'widgets/listBuilderNew/lib/searchOptions',
    'widgets/listBuilderNew/lib/tooltipBuilder',
    'lib/template_renderer/template_renderer',
    'text!widgets/listBuilderNew/templates/listContainer.html',
    'text!widgets/listBuilderNew/templates/listTable.html',
    'text!widgets/listBuilderNew/templates/listPanel.html',
    'text!widgets/listBuilderNew/templates/loadingBackground.html',
    'lib/i18n/i18n'
],  /** @lends ListBuilderWidget */
    function(jqGrid, isInViewport, SpinnerWidget, SearchOptions, TooltipBuilder, render_template, listContainer, listTable, listPanel, LoadingBackgroundTemplate, i18n) {

    /**
     * ListBuilderWidget constructor
     *
     * @constructor
     * @class ListBuilderWidget - Builds a list builder widget from a configuration object.
     *
     * @param {Object} conf - It requires two parameters:
     * container: define the container where the widget will be rendered
     * elements: define the parameters required to build the widget.
     * @returns {Object} Current ListBuilderWidget's object: this
     */
    var ListBuilderWidget = function(conf){

        this.conf = {
            container: $(conf.container),
            elements: conf.elements
        };

        var self = this,
            elements,
            tooltipBuilder,
            listBuilderID,
            gridContainer1 = null,
            gridContainer2 = null,
            gridTableAvailable = null,
            gridTableSelected = null,
            searchAvailableTimeout = null,
            searchSelectedTimeout = null,
            searchAvailable,
            searchSelected,
            selectedRows = {},
            jsonId = null,
            isPopulated = 0,
            isSelectAllAvailable = false,
            isSelectAllSelected = false,
            availableIds =[],
            selectedIds =[],
            spinnerAvailable,
            spinnerSelected,
            spinnerAvailableTimeout,
            spinnerSelectedTimeout,
            searchIndicatorTime = 500,
            activityIndicatorTime = 200,
            spinnerShowed = false,
            currentPage = 1,
            hasRequiredParameters = conf&&conf.container&&conf.elements&&conf.elements.columns,
            //Check if both url are defined. If yes, then it is loading remotely
            isLoadRemotely = (conf.elements && conf.elements.selectedElements && typeof conf.elements.selectedElements.url !== "undefined" && conf.elements.availableElements && typeof conf.elements.availableElements.url !== "undefined"),
            
            //Check if both url are not defined. If yes, then it is loading locally
            isLoadLocally = (conf.elements && conf.elements.selectedElements && typeof conf.elements.selectedElements.url === "undefined" && conf.elements.availableElements && typeof conf.elements.availableElements.url === "undefined");

        var errorMessages = {
            'noConf': 'The configuration object required to build the List Builder widget is missing',
            'noContainer': 'The container object required to build the List Builder widget is missing',
            'noElements': 'The elements object required to build the List Builder widget is missing',
            'noColums': 'List Builder widget could not be built because \"column\" is a required parameter in the configuration object of the List Builder widget',
            'noListBuilder': 'The list builder widget has not been built',
            'noSearch': 'Search is not available for this list builder',
            'duplicatedID': 'This ID already exists. ID: ',
            'noElement': 'The element object is not in the list builder.'
        };

        /**
         * Binding Events in the list builder
         * @inner
         */
        var bindActions = function (){
            elements.selectButton.on('click', function() {
                var selectEvent = (isSelectAllAvailable)? "selectAll":"select",
                    selectAllCheckbox = elements.panel1.find('.ui-jqgrid-htable input[type="checkbox"]');
                    
                changeItems(gridTableSelected, gridTableAvailable, selectEvent);
                addSpinners();
                if(selectAllCheckbox.is(':checked')) selectAllCheckbox.prop('checked', false);
                isSelectAllAvailable = false;

            });

            elements.unselectButton.on('click', function() {
                var selectEvent = (isSelectAllSelected)? "unselectAll":"unselect",
                    selectAllCheckbox = elements.panel2.find('.ui-jqgrid-htable input[type="checkbox"]');

                changeItems(gridTableAvailable, gridTableSelected, selectEvent);
                addSpinners();
                if(selectAllCheckbox.is(':checked')) selectAllCheckbox.prop('checked', false);
                isSelectAllSelected = false;
            });

            elements.searchAvailable.on('keydown', function (e) {
                if (e.keyCode === 13 ){ //on Enter (13), prevent form from triggering submitting
                    e.stopPropagation();
                    e.preventDefault();
                } 
            });


            elements.searchAvailable.on('keyup', function (e) {
                var key = e.which,
                    element = e.target;

                clearTimeout(searchAvailableTimeout);
               
                searchAvailableTimeout = setTimeout(function () { 
                    searchElements(element.value, gridTableAvailable, false);
                }, searchIndicatorTime);
            
                updateFilterIcon(elements.searchIconAvailable, element.value);
            });  

            elements.searchSelected.on('keyup', function (e) {
                var element = e.target;
                
                clearTimeout(searchSelectedTimeout);

                searchSelectedTimeout = setTimeout(function () { 
                    searchElements(element.value, gridTableSelected, true);
                }, searchIndicatorTime);
                
                updateFilterIcon(elements.searchIconSelected, element.value);
            });  
            elements.searchIconAvailable.on("click", function (e) {
                var element = e.target;
                if ($(element).hasClass('icon_delete_disable')){
                    updateFilterIcon(elements.searchIconAvailable, '');
                    elements.searchAvailable.val('');
                    searchElements('', gridTableAvailable, false);
                }
            });   
            elements.searchIconSelected.on("click", function (e) {
                var element = e.target;
                if ($(element).hasClass('icon_delete_disable')){
                    updateFilterIcon(elements.searchIconSelected, '');
                    elements.searchSelected.val('');
                    searchElements('', gridTableSelected, true);
                }
            });    

            elements.panel2.on('onChangeSelected', conf.elements.onChangeSelected); 

            elements.listBuilder.on('onDestroyListBuilder', conf.elements.onDestroyListBuilder);  

            elements.listBuilder.on('onBuildListBuilder', conf.elements.onBuildListBuilder);

            elements.panel1.on("onSelectAllCompleted", selectAllCompletedEvent); 
            elements.panel2.on("onSelectAllCompleted", selectAllCompletedEvent);  
        },

        addSpinners = function(){
            if (isLoadRemotely){
                var spinnerAvailableContainer = gridTableAvailable.parents('.ui-jqgrid-view'),
                    spinnerSelectedContainer = gridTableSelected.parents('.ui-jqgrid-view');

                var addSpinner = function(spinnerContainer, isSelectedPanel){
                  
                    if (spinnerContainer.find(".slipstream-indicator-background").length > 0) {
                        spinnerContainer.find(".slipstream-indicator-background").show();
                    }else{
                        spinnerContainer.append(render_template(LoadingBackgroundTemplate));
                    }
                    
                    if (isSelectedPanel){
                        spinnerSelected = new SpinnerWidget({
                            "container": spinnerContainer
                        }).build();
                    }else{
                        spinnerAvailable = new SpinnerWidget({
                            "container": spinnerContainer
                        }).build();
                    }                    
                   
                };
                spinnerShowed = true;
                spinnerSelectedTimeout = setTimeout(function () { 
                    addSpinner(spinnerSelectedContainer, true);
                }, activityIndicatorTime);
                spinnerAvailableTimeout = setTimeout(function () { 
                    addSpinner(spinnerAvailableContainer, false);
                }, activityIndicatorTime);
                
            }
        },

        selectAllCompletedEvent = function(e, data){
            var gridTable = $(this).find('.listTable'),
                currentGrid = gridTable.attr('id'),
                panelNo = currentGrid.slice(-1);
            if (panelNo === '1'){
                availableIds = data['ids'].toString().split(','); 
            }

            if (panelNo === '2'){
                selectedIds = data['ids'].toString().split(',');
            }
        },

        updateFilterIcon = function(element, value) {
            if(value){
                element.removeClass('icon_search').addClass('icon_delete_disable');
            }else{
                element.removeClass('icon_delete_disable').addClass('icon_search');
            }
        },
        
        /**
         * Search items
         * @inner
         */
        searchElements = function(searchValue, gridTable, isSelectedPanel){
            var postData = gridTable.jqGrid('getGridParam','postData'),
                datatype = gridTable.jqGrid('getGridParam','datatype');

            if (datatype === 'local'){
                var colModel = gridTable.jqGrid('getGridParam','colModel'),
                    columns = (self.conf.elements.search && self.conf.elements.search.columns) ? self.conf.elements.search.columns : getNonHiddenColumns(colModel);

                if (typeof columns === 'string'){
                    if (typeof searchValue === 'string' || (_.isArray(searchValue) && searchValue.length === 1)){
                        _.extend(postData, 
                                {filters:'',
                                searchField: columns,
                                searchOper: 'cn',
                                searchString: searchValue});
                    }else if (_.isArray(searchValue)){
                        var rules = createMultipleRules(searchValue, columns),
                            filters = {groupOp: "OR", rules: rules};

                        _.extend(postData, {filters: JSON.stringify(filters)});
                    }
                }else if (_.isArray(columns)){
                    var rules = [];

                    for(var i = 0; i < columns.length; i++){
                        if (typeof searchValue === 'string'){
                            var rule = {
                                    field: columns[i],
                                    op: "cn",
                                    data: searchValue
                                };
                      
                            rules.push(rule);
                        }else if (_.isArray(searchValue)){
                            rules = rules.concat(createMultipleRules(searchValue, columns[i]));
                        }
                    }

                    var filters = {groupOp: "OR", rules: rules};

                    _.extend(postData, {filters: JSON.stringify(filters), search: true});
                }
                gridTable.jqGrid('setGridParam', { postData: postData, search: true });
            }else if (_.isObject(searchValue) && !_.isArray(searchValue) && datatype === 'json'){
                postData = searchValue;
                setSearchParameter(postData, isSelectedPanel);
                gridTable.jqGrid('setGridParam', { postData: postData });
            }else if(self.conf.elements.search && self.conf.elements.search.url && datatype === 'json'){ 
                postData = conf.elements.search.url(postData, searchValue);
                setSearchParameter(postData, isSelectedPanel);
                gridTable.jqGrid('setGridParam', { postData: postData });
            }
                
            gridTable.trigger("reloadGrid",[{page:1}]);
        },

        /**
         * Set _search parameter in order to overwrite the library value
         * @inner
         */
        setSearchParameter = function(postData, isSelectedPanel){
            if (postData['_search']){
                if (isSelectedPanel){
                    searchSelected = $.trim(postData['_search']);
                }else{
                    searchAvailable = $.trim(postData['_search']);
                }
            }else{
                if (isSelectedPanel){
                    searchSelected = null;
                }else{
                    searchAvailable = null;
                }
            }
        },

        /**
         * Create multiple rules to search the list
         * @inner
         */
        createMultipleRules= function(searchValue, columns){
            var rules = [];

            for(var j = 0; j < searchValue.length; j++){
                var rule = {
                        field: columns,
                        op: "cn",
                        data: searchValue[j]
                    };
                rules.push(rule);
            }

            return rules;
        },

        /**
         * Select items from the available column to the selected column.
         * @inner
         */
        createElements = function(listBuilder){
            elements = {
                listBuilder: listBuilder.find('.new-list-builder-widget'),
                panel1: listBuilder.find('.panel1'),
                panel2: listBuilder.find('.panel2'), 
                selectButton: listBuilder.find('.btn-group .select-container'), 
                unselectButton: listBuilder.find('.btn-group .unselect-container')
              };

            _.extend(elements, {
                    searchAvailableContainer: elements.panel1.find('.filter-container'),
                    searchSelectedContainer: elements.panel2.find('.filter-container'),
                    titleAvailableContainer: elements.panel1.find('.title-container'),
                    titleSelectedContainer: elements.panel2.find('.title-container')
            });

            _.extend(elements, {
                    searchAvailable: elements.searchAvailableContainer.find('input'),
                    searchSelected: elements.searchSelectedContainer.find('input'),
                    searchInputContainerAvailable: elements.searchAvailableContainer.find('.filter-input-container'),
                    searchInputContainerSelected: elements.searchSelectedContainer.find('.filter-input-container'),
                    searchIconAvailable: elements.searchAvailableContainer.find('.icon_search'),
                    searchIconSelected: elements.searchSelectedContainer.find('.icon_search'),
                    clearSearchIconAvailable: elements.searchAvailableContainer.find('.icon_delete_disable'),
                    clearSearchIconSelected: elements.searchSelectedContainer.find('.icon_delete_disable'),
                    searchMenuAvailable: elements.searchAvailableContainer.find('.filter-menu-container'),
                    searchMenuSelected: elements.searchSelectedContainer.find('.filter-menu-container'),
                    itemsAvailable: elements.titleAvailableContainer.find('.item-count'),
                    itemsSelected: elements.titleSelectedContainer.find('.item-count'),
                    titleAvailable: elements.titleAvailableContainer.find('.panel-title'),
                    titleSelected: elements.titleSelectedContainer.find('.panel-title')
            });

            _.extend(elements, {
                    searchInputAvailable: elements.searchInputContainerAvailable.find('input'),
                    searchInputSelected: elements.searchInputContainerSelected.find('input')
            });
        },

        /**
         * Select items from the available column to the selected column.
         * @inner
         */
        changeItems = function(gridTable1, gridTable2, event, list){
            var getSelectedObjects = getSelectedRows(gridTable2),
                changedItems = [],
                list = list || getSelectedObjects;

            if (isLoadLocally || conf.elements.loadonce){
                for (var i = 0; i < list.length; i++){
                
                    var dataFromTheRow = gridTable2.jqGrid ('getRowData', list[i][jsonId]);
                    if (!_.isEmpty(dataFromTheRow)){
                    
                        gridTable1.jqGrid('addRowData', list[i][jsonId], list[i], 'last');
                        gridTable2.delRowData(list[i][jsonId]);
                    
                        changedItems.push(list[i]);
                    }else{
                        throw new Error(errorMessages.noElement);
                    }
                }
             }else{
                var currentGrid = gridTable2.attr('id'),
                    panelNo = currentGrid.slice(-1);
                if (panelNo === '1' && availableIds.length > 0){
                    availableIds = [];
                }

                if (panelNo === '2' && selectedIds.length > 0){
                    selectedIds = [];
                }
                changedItems = list;
            } 

            triggerOnChangeSelected({data: changedItems, event: event});
        },

        /**
         * Get a list of selected rows using the jqGrid library
         * @param {Object} gridTable
         * @inner
         */
        getSelectedRows = function(gridTable){
            var rowKey = gridTable.jqGrid('getGridParam','selarrrow'),
                rowObjects = [];
            if(isLoadLocally || conf.elements.loadonce){
                for (var i = 0; i < rowKey.length; i++){
                    rowObjects.push(gridTable.getRowData(rowKey[i]));
                }
            }else{
                var currentGrid = gridTable.attr('id'),
                    panelNo = currentGrid.slice(-1);

                if (panelNo === '1' && availableIds.length > 0){
                    return availableIds;
                }

                if (panelNo === '2' && selectedIds.length > 0){
                    return selectedIds;
                }

                for (var key in selectedRows){
                    if(currentGrid === selectedRows[key]['$table'].attr('id')){
                        rowObjects.push(selectedRows[key]['rowData']);
                    }
                }
            }
            

            return rowObjects;
        },

        /**
         * Sets row selection of the grid using the jqGrid library
         * @param {Object} gridTable
         * @param {boolean} resetSelection - reset the selected rows
         * @inner
         */
        setRowSelection = function (gridTable, resetSelection, isSelectedPanel){
            if (resetSelection){
                selectedRows = {};
            } else {
                var currentGrid = gridTable.attr('id'),
                    selectAll = (isSelectedPanel)? isSelectAllSelected: isSelectAllAvailable,
                    selectAllCheckbox = isSelectedPanel? elements.panel2.find('.ui-jqgrid-htable input[type="checkbox"]'): elements.panel1.find('.ui-jqgrid-htable input[type="checkbox"]');
                                        
                gridTable.jqGrid("resetSelection");
                
                if (availableIds.length > 0 && !isSelectedPanel){
                    if (selectAll && gridTableAvailable){
                        gridTableAvailable.find('input:checkbox').prop('checked', true);
                    }else{
                        for (var i = 0; i<availableIds.length; i++){
                            gridTable.jqGrid('setSelection', availableIds[i], false);
                        }
                    }
                }else if(selectedIds.length > 0 && isSelectedPanel){
                    if (selectAll && gridTableSelected){
                        gridTableSelected.find('input:checkbox').prop('checked', true);
                    }else{
                        for (var i = 0; i<selectedIds.length; i++){
                            gridTable.jqGrid('setSelection', selectedIds[i], false);
                        }
                    }   
                }else{
                    for (var key in selectedRows){
                        if(currentGrid === selectedRows[key]['$table'].attr('id')){
                            gridTable.jqGrid('setSelection', key, false);
                        }
                    }
                }
                selectAll && selectAllCheckbox.prop('checked', true);
            }
        },

        /**
         * Trigger onChangeSelected 
         * @inner
         */
        triggerOnChangeSelected  = function(list) {
            elements.panel2.trigger('onChangeSelected', list);
            console.log(list);
        },

        /**
         * Trigger triggerOnSelectAllSelectedDone 
         * @inner
         */
        triggerOnSelectAllSelectedDone  = function(ids) {
            var spinnerContainer = elements.panel2.find('.ui-jqgrid-view');

            clearTimeout(spinnerSelectedTimeout);
            elements.panel2.trigger('onSelectAllCompleted', ids);
            spinnerSelected && spinnerSelected.destroy();

            if (spinnerContainer.find(".slipstream-indicator-background").length > 0) spinnerContainer.find(".slipstream-indicator-background").hide();
        },

        /**
         * Trigger triggerOnSelectAllAvailableDone 
         * @inner
         */
        triggerOnSelectAllAvailableDone  = function(ids) {
            var spinnerContainer = elements.panel1.find('.ui-jqgrid-view');

            clearTimeout(spinnerAvailableTimeout);
            elements.panel1.trigger('onSelectAllCompleted', ids);
            spinnerAvailable && spinnerAvailable.destroy();

            if (spinnerContainer.find(".slipstream-indicator-background").length > 0) spinnerContainer.find(".slipstream-indicator-background").hide();
        },

        /**
         * Creates a grid using the jqGrid library
         * @param {Object} gridConfiguration - configuration of the grid
         * @param {Object} gridTable
         * @param {boolean} isSelectedPanel - if this is the panel2
         * @inner
         */
        createGrid = function (gridConfiguration, gridTable, isSelectedPanel) {

            var datatype = 'json',
                ajaxOptions = gridConfiguration.ajaxOptions || {},
                spinnerContainer,
                scroll = false;

            //If it is selectedGrid
            if (isSelectedPanel && ((gridConfiguration.selectedElements && typeof gridConfiguration.selectedElements.url === "undefined") || (typeof gridConfiguration.selectedElements === "undefined"))){
                datatype = (gridConfiguration.selectedElements && typeof gridConfiguration.selectedElements.getData === "function") ? gridConfiguration.selectedElements.getData : 'local';
            }

            //If it is available Grid
            if (!isSelectedPanel && (gridConfiguration.availableElements &&  typeof gridConfiguration.availableElements.url === "undefined")){
                datatype = (typeof gridConfiguration.availableElements.getData === "function") ? gridConfiguration.availableElements.getData : 'local';
            }

            if (isLoadRemotely){
                scroll = true;
            }
            var multiSort, sortOrder, gridSortingOptions;
            if (gridConfiguration.sorting){
                if (gridConfiguration.sorting.length==1){
                    multiSort = false;
                    sortOrder = gridConfiguration.sorting[0].order || 'asc';
                    gridSortingOptions = gridConfiguration.sorting[0].column;
                } else if (gridConfiguration.sorting.length>1){
                    multiSort = true;
                    gridSortingOptions = getGridSortingOptions(gridConfiguration.sorting);
                }
            }

            var addSpinner = function(){
                  
                if (spinnerContainer.find(".slipstream-indicator-background").length > 0) {
                    spinnerContainer.find(".slipstream-indicator-background").show();
                }else{
                    spinnerContainer.append(render_template(LoadingBackgroundTemplate));
                }
                if (isSelectedPanel){
                    spinnerSelected = new SpinnerWidget({
                            "container": spinnerContainer
                        }).build();
                }else{
                    spinnerAvailable = new SpinnerWidget({
                            "container": spinnerContainer
                        }).build();
                }
               
            };

            var jqGridConf = {
                height: gridConfiguration.height,
                multiselect: true,
                datatype: datatype,
                colNames: getHeaderLabelAndWidth(gridConfiguration.columns),
                colModel: gridConfiguration.columns,
                multiSort: multiSort,
                sortorder: sortOrder,
                sortname: gridSortingOptions,
                rowNum:gridConfiguration.pageSize,
                viewrecords: true,
                ajaxGridOptions: ajaxOptions,
                forceFit: true,
                loadtext: "",
                scroll: scroll ? 1:0,
                cmTemplate: {title: false},
                ignoreCase: true,
                beforeRequest : function(){
                    if (isLoadRemotely && !spinnerShowed){
                        spinnerContainer = gridTable.parents('.ui-jqgrid-view');
                        if (isSelectedPanel){
                            spinnerSelectedTimeout = setTimeout(function () { 
                                addSpinner();
                            }, activityIndicatorTime);
                        }else{
                            spinnerAvailableTimeout = setTimeout(function () { 
                                addSpinner();
                            }, activityIndicatorTime);
                        }
                    }
                },
                loadComplete: function(data) {
                    setRowSelection(gridTable, false, isSelectedPanel);
                    $(this).trigger('gridLoaded','success');
                    isPopulated ++;
                    if (isPopulated == 2){
                        elements.listBuilder && elements.listBuilder.trigger('onBuildListBuilder', elements.listBuilder); 
                    }    
                    if (isLoadRemotely){
                        if (isSelectedPanel){
                            clearTimeout(spinnerSelectedTimeout);
                            spinnerSelected && spinnerSelected.destroy();
                        }else{
                            clearTimeout(spinnerAvailableTimeout);
                            spinnerAvailable && spinnerAvailable.destroy();
                        }
                        if (spinnerContainer.find(".slipstream-indicator-background").length > 0) spinnerContainer.find(".slipstream-indicator-background").hide();
                        spinnerShowed = false;
                    }
                    tooltipBuilder && tooltipBuilder.addContentTooltips(gridTable);
                },
                loadError: function(xhr,status,error){
                    $(this).trigger('gridLoaded',error);
                    console.log("An error occurred while loading data into the grid. Title: " + error + " - Details:" + xhr.responseText);
                },
                gridComplete: function(){
                    if (!isLoadRemotely){
                        var total = gridTable.getGridParam('records');
                        if (this.id.slice(-1) === "1"){
                            elements.itemsAvailable.text(total + " " +i18n.getMessage('items'));
                        }else if (this.id.slice(-1) === "2"){
                            elements.itemsSelected.text(total + " " +i18n.getMessage('items'));
                        }
                        tooltipBuilder && tooltipBuilder.addContentTooltips(gridTable);
                    }
                },
                beforeProcessing: function (data, status, xhr) {
                    var scroll = false;
                    if (isLoadRemotely) {
                        scroll = true;
                    }
                    if (scroll){
                        var totalRecords = (isSelectedPanel) ? gridConfiguration.selectedElements.totalRecords : gridConfiguration.availableElements.totalRecords,
                            records = totalRecords || 0;
                        data['page']= gridTable.getGridParam('page');

                        var recordsRoot = records.split('.'),
                            rRootLength = recordsRoot.length;
                        if (rRootLength > 0){
                            var total = data;
                            for(var i = 0; i<rRootLength; i++){
                                total = total[recordsRoot[i]];
                            }
                        }

                        data['records']= total;
                        data['total']= gridConfiguration.pageSize? Math.ceil(total/gridConfiguration.pageSize) : 0;

                        if (this.id.slice(-1) === "1"){
                            elements.itemsAvailable.text(total + " " +i18n.getMessage('items'));
                        }else if (this.id.slice(-1) === "2"){
                            elements.itemsSelected.text(total + " " +i18n.getMessage('items'));
                        }
                    }
                    var originalData = data,
                        jsonRoot = (isSelectedPanel)?gridConfiguration.selectedElements.jsonRoot:gridConfiguration.availableElements.jsonRoot;
                    if (jsonRoot && data['records'] ==='1'){
                        if (jsonRoot.indexOf('.')>0){
                            var nestedIndex = jsonRoot.split('.');
                            originalData = data[nestedIndex[0]];
                            data[nestedIndex[0]] = [];
                            var nestedData = data[nestedIndex[0]];
                            for (var j=1; j<nestedIndex.length; j++){
                                originalData = originalData[nestedIndex[j]];
                                if (j==nestedIndex.length-1){
                                    nestedData[nestedIndex[j]] = $.isArray(originalData)? originalData : [originalData];
                                } else {
                                    nestedData[nestedIndex[j]] = [];
                                }
                                nestedData = nestedData[nestedIndex[j]];
                            }
                        } else {
                            originalData = data[jsonRoot];
                        }
                    }

                },
                serializeGridData: function(postData) {
                    console.log(postData);
                    var rowSeq = (postData.page-1)*postData.rows;
                    var pagingParameter = "(start eq " + rowSeq +", limit eq " + postData.rows +")";
                    var postDataObj = {paging: pagingParameter};
                    if (postData.sidx){ //=(domain-id(descending),id(ascending)): support for multisorting
                        var sortingIndex = postData.sidx.trim().split(',');
                        var sortingParameter = "(";
                        for (var i=0; i<sortingIndex.length && sortingIndex[i]; i++){
                            var column = sortingIndex[i].trim().split(' ');
                            var sortingOrder = column[1] == 'desc' || postData.sord == 'desc'? 'descending' : 'ascending';
                            sortingParameter += column[0] +"(" + sortingOrder + "),";
                        }
                        sortingParameter = sortingParameter.slice(0,-1) + ")";
                        postDataObj.sortby = sortingParameter;
                    }
                    if (isSelectedPanel){
                        if (!elements.searchInputSelected || !(elements.searchInputSelected.val().trim())) delete postData['_search'];
                    }else{
                        if (!elements.searchInputAvailable || !(elements.searchInputAvailable.val().trim())) delete postData['_search'];
                    }
                    if (isSelectedPanel){
                        if (searchSelected){
                            $.extend(postData, {_search: searchSelected});
                        }
                    }else{
                        if (searchAvailable){
                            $.extend(postData, {_search: searchAvailable});
                        }
                    }
                    
                    return $.param($.extend(postData,postDataObj));
                },
                onSelectRow: function (id, status) {
                    var $rowTable = $(this);
                    var $row = $rowTable.find('#'+id.replace(/[\/\.]/g, "\\$&"));
                    if (status){
                        selectedRows[id] = {
                            $table: $rowTable,
                            $row: $row,
                            rowData: $rowTable.jqGrid('getRowData', id)
                        };
                    } else {
                        
                        if (availableIds.length > 0 && !isSelectedPanel){
                            var index = availableIds.indexOf(id);
                            if (index > -1) {
                                availableIds.splice(index, 1);
                            }
                        }else if (selectedIds.length > 0 && isSelectedPanel){
                            var index = selectedIds.indexOf(id);
                            if (index > -1) {
                                selectedIds.splice(index, 1);
                            }
                        }else{
                            delete selectedRows[id];
                        }
                        
                    }
                },
                onSelectAll: function(rowIds, status) {
                    if (isLoadRemotely){
                        if (status){
                            if (isSelectedPanel){
                                spinnerSelectedTimeout = setTimeout(function () { 
                                    addSpinner();
                                }, activityIndicatorTime);
                                conf.elements.selectedElements && conf.elements.selectedElements.onSelectAll && conf.elements.selectedElements.onSelectAll(triggerOnSelectAllSelectedDone);
                            }else{
                                spinnerAvailableTimeout = setTimeout(function () { 
                                    addSpinner();
                                }, activityIndicatorTime);
                                conf.elements.availableElements && conf.elements.availableElements.onSelectAll && conf.elements.availableElements.onSelectAll(triggerOnSelectAllAvailableDone);
                            }
                        }else{
                            if (isSelectedPanel){
                                selectedIds = [];
                                clearTimeout(spinnerSelectedTimeout);
                                spinnerSelected && spinnerSelected.destroy();
                            }else{
                                availableIds = [];
                                clearTimeout(spinnerAvailableTimeout);
                                spinnerAvailable && spinnerAvailable.destroy();
                            }
                            if (spinnerContainer.find(".slipstream-indicator-background").length > 0) spinnerContainer.find(".slipstream-indicator-background").hide();
                        }
                        
                    }
                        
                    if (isSelectedPanel){
                        isSelectAllSelected = status;
                    }else{
                        isSelectAllAvailable = status;
                    }
                },
                afterInsertRow: function (rowid, rowdata, rowelem){
                    var $rowTable = $(this);
                    var $row = $rowTable.find("#"+rowid.replace(/[\/\.]/g, "\\$&")),
                        page = $rowTable.jqGrid('getGridParam','page');
                    $row.data("jqgrid.record_data", rowelem);
                    $row.data("jqgrid.record_page", page);
                }
            }
            if (jqGridConf.datatype === 'local' || typeof datatype === "function"){

                jsonId = gridConfiguration.jsonId;

                _.extend(jqGridConf, {
                    localReader: {
                        repeatitems: (gridConfiguration.repeatitems||jsonId)? true : false,
                        id : jsonId
                    }

                });
            } else {
                var url = (isSelectedPanel) ? gridConfiguration.selectedElements.url : gridConfiguration.availableElements.url,
                    postData = (isSelectedPanel) ? gridConfiguration.selectedElements.urlParameters : gridConfiguration.availableElements.urlParameters,
                    jsonRoot = (isSelectedPanel) ? gridConfiguration.selectedElements.jsonRoot : gridConfiguration.availableElements.jsonRoot,
                    totalRecords = (isSelectedPanel) ? gridConfiguration.selectedElements.totalRecords : gridConfiguration.availableElements.totalRecords,
                    loadonce = gridConfiguration.loadonce  || false;
                
                jsonId = gridConfiguration.jsonId; 
                
                _.extend(jqGridConf, {
                    jsonReader: {
                        root: jsonRoot,
                        repeatitems: (gridConfiguration.repeatitems||jsonId)? true : false,
                        id: jsonId,
                        page: gridConfiguration.page,
                        records: totalRecords
                    },
                    url: url,
                    loadonce: loadonce,
                    postData: postData
                });
            }
            gridTable.jqGrid(jqGridConf);
            if (typeof datatype === "function"){
                gridTable.setGridParam({datatype: 'local'}); 
            }
        },

         /**
         * Throw error messages depeding on the parameter that is missing in the configuration object
         * @inner
         */
        throwErrorMessage = function () {
            if (typeof(conf) === 'undefined') throw new Error(errorMessages.noConf);
            else if (typeof(conf.container) === 'undefined') throw new Error(errorMessages.noContainer);
            else if (typeof(conf.elements) === 'undefined') throw new Error(errorMessages.noElements);
            else if (typeof(conf.elements.columns) === 'undefined') throw new Error(errorMessages.noColums);
        },

        /**
         * Format the sorting configuration parameter from an array to one that the jqGrid library uses; for example: "job-status asc, percent-complete desc"
         * @param {Array} sortingOptions - configuration parameter for sorting the grid
         * @inner
         */
        getGridSortingOptions = function (sortingOptions){
            var formattedSortingOptions = '';
            for (var i=0; i<sortingOptions.length; i++){
                var colum = sortingOptions[i].column;
                var order = sortingOptions[i].order? sortingOptions[i].order : 'asc';
                formattedSortingOptions += colum + ' ' + order + ',';
            }
            return formattedSortingOptions.slice(0,-1);
        },

        /**
         * Builds an array with the labels provided in the configuration of the grid.
         * @param {Object} columnsJson - Object with the columns configuration
         * @returns {Array} Array with labels
         * @inner
         */
        getHeaderLabelAndWidth = function (columnsJson) {
            var labelArray = [];
            for (var i=0; i<columnsJson.length; i++){
                labelArray.push(columnsJson[i].label);
            }
            return labelArray;
        },

        /**
         * Builds an array with the column name provided in the configuration of the grid.
         * @param {Object} columnsJson - Object with the columns configuration
         * @returns {Array} Array with column name
         * @inner
         */
        getNonHiddenColumns = function (columnsJson) {
            var nameArray = [];
            for (var i=0; i<columnsJson.length; i++){
                if (!columnsJson[i]['hidden']){
                    nameArray.push(columnsJson[i].name);
                }
            }
            return nameArray;
        };



        //Exposed Methods

        /**
         * Builds the Grid widget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build =  function () {
            if(hasRequiredParameters){
                var gridWidth,
                    gridConfiguration = conf.elements,
                    id = gridConfiguration.id || _.uniqueId("slipstream_list_builder_widget"),
                    listBuilderClass = _.uniqueId("slipstream_list_builder_widget_class"),
                    hasSearchMenu = (gridConfiguration.search && gridConfiguration.search.optionMenu) ? true : false,
                    titleAvailable = (conf.elements.availableElements && conf.elements.availableElements.title) ? conf.elements.availableElements.title : i18n.getMessage('Available'),
                    titleSelected = (conf.elements.selectedElements && conf.elements.selectedElements.title) ? conf.elements.selectedElements.title : i18n.getMessage('Selected');

                listBuilderID = 'slipstream_list_builder_widget_' + id;

                gridContainer1 = this.conf.container.append(render_template(listContainer,{
                            id: listBuilderID,
                            class: listBuilderClass
                        },{panel: listPanel}
                    )).find('.panel1').append(render_template(listTable,{
                    'table_id':id + 1
                }));
                gridContainer2 = this.conf.container.find('.panel2').append(render_template(listTable,{
                    'table_id':id + 2
                }));

                createElements(this.conf.container);

                gridTableAvailable = gridContainer1.find('.listTable');
                gridTableSelected  = gridContainer2.find('.listTable');

                createGrid(gridConfiguration, gridTableAvailable, false);
                createGrid(gridConfiguration, gridTableSelected, true);
                
                elements.titleAvailable.text(titleAvailable);
                elements.titleSelected.text(titleSelected);

                gridWidth = gridTableAvailable.jqGrid('getGridParam','width');

                if (hasSearchMenu){
                    var listBuilderContainerId = '#'+ listBuilderID + '.' + listBuilderClass;
                    var searchOptionsAvailable = new SearchOptions(gridConfiguration.search.optionMenu, 1, listBuilderContainerId);
                    elements.searchInputContainerAvailable.addClass("show-filter-menu");
                    elements.searchMenuAvailable.show();              
                    searchOptionsAvailable.addSearchOptions(_.bind(self.searchAvailableItems, self));
                    
                    if (gridConfiguration.selectedElements && !gridConfiguration.selectedElements.hideSearchOptionMenu){
                        var searchOptionsSelected = new SearchOptions(gridConfiguration.search.optionMenu, 2, listBuilderContainerId);
                        elements.searchInputContainerSelected.addClass("show-filter-menu");
                        elements.searchMenuSelected.show(); 
                        searchOptionsSelected.addSearchOptions(_.bind(self.searchSelectedItems, self)); 
                    }
                    
                }
                tooltipBuilder = new TooltipBuilder(conf);
                bindActions();
                
            } else {
                throwErrorMessage();
            }
            return this;
        };

        /**
         * Get available items which are currently displaying in the panel 1. 
         * Note: If you have virtual scrolling in the panel 1, it will only return the displaying items.
         * @returns {Object} A set of objects for each of the available items
         */
        this.getAvailableItems = function (){
            var allRowsInGrid;
            if (gridTableAvailable){
                allRowsInGrid = gridTableAvailable.jqGrid('getRowData');
            }else{
                throw new Error(errorMessages.noListBuilder)
            }
            return allRowsInGrid;
        };

        /**
         * Remove elements for the available column (panel1)
         * @param [Array] A set of objects for each of the item that will be removed from the available panel
         */
        this.removeAvailableItems = function (list){
            var removeAvailableItems = [];
            if (gridTableAvailable){
                for (var i = 0; i < list.length; i++){
                    var dataFromTheRow = gridTableAvailable.jqGrid ('getRowData', list[i][jsonId]);
                    if (!_.isEmpty(dataFromTheRow)){
                        gridTableAvailable.delRowData(list[i][jsonId]);
                        removeAvailableItems.push(list[i]);
                    }else{
                        throw new Error(errorMessages.noElement);
                    }
                }
            }else{
                throw new Error(errorMessages.noListBuilder)
            }
            return removeAvailableItems;
        };

        /**
         * Add elements for the available column (panel1)
         * @param {Object} A set of objects for each of the items that will be added to the available column
         */
        this.addAvailableItems = function (list){
            if (gridTableAvailable){
                for (var i = 0; i < list.length; i++){
                    var dataFromTheRow = gridTableAvailable.jqGrid ('getRowData', list[i][jsonId]);
                    if (_.isEmpty(dataFromTheRow)){
                        gridTableAvailable.jqGrid('addRowData', list[i][jsonId], list[i], 'last');
                    }else{
                        throw new Error(errorMessages.duplicatedID + list[i][jsonId]);
                    }
                }
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };

        /**
         * Search keyword for the available column (panel1)
         * if local @param {String} or {Array}
         * if remote @param {String} or {Object}
         */
        this.searchAvailableItems = function (keyword){
            if (gridTableAvailable){
                searchElements(keyword, gridTableAvailable, false);
                if(!_.isArray(keyword) && !_.isObject(keyword)) elements.searchAvailable.val(keyword);
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };

        /**
         * Return current search parameters for the available column (panel1)
         * @param {Object} 
         */
        this.getAvailableUrlParameter = function (){
            if (gridTableAvailable){
                var postData = gridTableAvailable.jqGrid('getGridParam','postData');
                return postData;
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };

        /**
         * Set elements for the available column (panel1)
         * @param [Array] A set of objects for each of the items that will be moved to the available column from the selected colunm
         */
        this.unselectItems = function (list){
            if (gridTableAvailable){
                if (isLoadRemotely){
                    triggerOnChangeSelected({data: list, event: 'unselect'});
                }else{
                    changeItems(gridTableAvailable, gridTableSelected, 'unselect', list);
                }
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };

        /**
         * Get selected items which are currently displaying in the panel 2. 
         * Note: If you have virtual scrolling in the panel 2, it will only return the displaying items.
         * @returns {Object} A set of objects for each of the selected items
         */
        this.getSelectedItems = function (){
            var allRowsInGrid;
            if (gridTableSelected){
                allRowsInGrid = gridTableSelected.jqGrid('getRowData');
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
            return allRowsInGrid;
        };

        /**
         * Remove the items that were selected (panel2)
         * @returns [Array] A set of objects for each of the item that will be removed from the selected panel
         */
        this.removeSelectedItems = function (list){
            var removeSelectedItems = [];
            if (gridTableSelected){
                for (var i = 0; i < list.length; i++){
                    var dataFromTheRow = gridTableSelected.jqGrid ('getRowData', list[i][jsonId]);
                    if (!_.isEmpty(dataFromTheRow)){
                        gridTableSelected.delRowData(list[i][jsonId]);
                        removeSelectedItems.push(list[i]);
                    }else{
                        throw new Error(errorMessages.noElement);
                    }
                }
            }else{
                throw new Error(errorMessages.noListBuilder)
            }
                
            return removeSelectedItems;
        };

        /**
         * Add elements for the second column (panel2)
         * @param {Object} A set of objects for each of the items that will be added to the selected column
         */
        this.addSelectedItems = function (list){
            if (gridTableSelected){
                for (var i = 0; i < list.length; i++){
                    var dataFromTheRow = gridTableSelected.jqGrid ('getRowData', list[i][jsonId]);
                    if (_.isEmpty(dataFromTheRow)){
                        gridTableSelected.jqGrid('addRowData', list[i][jsonId], list[i], 'last');
                    }else{
                        throw new Error(errorMessages.duplicatedID + list[i][jsonId]);
                    }
                }
            }else{
                throw new Error(errorMessages.noListBuilder)
            }
        };

        /**
         * Search keyword for the second column (panel2)
         * if local @param {String} or {Array}
         * if remote @param {String} or {Object}
         */
        this.searchSelectedItems = function (keyword){
            if (gridTableSelected){
                searchElements(keyword, gridTableSelected, true);
                if(!_.isArray(keyword) && !_.isObject(keyword)) elements.searchSelected.val(keyword);
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };

        /**
         * Return current search parameters for the available column (panel1)
         * @param {Object} 
         */
        this.getSelectedUrlParameter = function (){
            if (gridTableSelected){
                var postData = gridTableSelected.jqGrid('getGridParam','postData');
                return postData;
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };


        /**
         * Set elements for the second column (panel2)
         * @param [Array] A set of objects for each of the items that will be moved to the selected column from the available column
         */
        this.selectItems = function (list){
            if (gridTableAvailable){
                if (isLoadRemotely){
                    triggerOnChangeSelected({data: list, event: 'select'});
                }else{
                    changeItems(gridTableSelected, gridTableAvailable, 'select', list);
                }                
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };

        /**
         * Destroys all elements created by the GridWidget in the specified container
         * @returns {Object} Current GridWidget object
         */
        this.destroy =  function () {
            if(elements.listBuilder){
                elements.listBuilder.trigger('onDestroyListBuilder', elements.listBuilder);  
                elements.listBuilder.remove();
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
            
            return this;
        };

        /**
         * Reload the list builder by url requests
         */
        this.reload = function (){
            if (gridTableAvailable && gridTableSelected){
                console.log('reload both panels of the list builder widget');

                conf.elements.availableElements.getData && gridTableAvailable.jqGrid('clearGridData');
                conf.elements.selectedElements.getData && gridTableSelected.jqGrid('clearGridData');

                reloadGrid(gridTableAvailable);
                reloadGrid(gridTableSelected);
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        var getCurrentPage = function(gridContainer){
            var page,
                visibleRows = gridContainer.find('.ui-jqgrid-bdiv tr.jqgrow:in-viewport');
            if (visibleRows.length == 0) {
                page = 1;
            } else {
                var $row = $(visibleRows[0]);
                page = $row.data("jqgrid.record_page");
            }
            return page;
        },

        reloadGrid = function(gridTable){
            var pageSize = gridTable.getGridParam('rowNum'),
                scrollPosition = $(gridTable[0].grid.bDiv).scrollTop(),
                rowIndex = 1,
                pageNumberOfRow = Math.ceil(rowIndex / pageSize);

            gridTable[0].grid.prevRowHeight = undefined; // workaround for jqGrid bug
            gridTable.on('jqGridLoadComplete.reload', function(e,data) {
                gridTable.off('jqGridLoadComplete.reload');
                $(gridTable[0].grid.bDiv).scrollTop(scrollPosition);   
            }); 

            gridTable.trigger('reloadGrid', [{page: pageNumberOfRow}]);       
        
            setRowSelection(gridTable, true);
        }
       
    };

    return ListBuilderWidget;
});