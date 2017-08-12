/**
 * A module reformats the grid configuration object for adding columns by using the jqGrid configuration format
 *
 * @module GridFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'text!widgets/grid/templates/moreCell.html',
    'widgets/grid/lib/columnFilter',
    'widgets/grid/lib/columnActionFormatter'
],  /** @lends GridFormatter */
    function(render_template, cellTemplate, ColumnFilter, ColumnActionFormatter) {

    /**
     * GridFormatter constructor
     *
     * @constructor
     * @class GridFormatter - Reformats the grid configuration object.
     *
     * @param {Object} conf - Grid configuration object
     * @returns {Object} Current GridFormatter's object: this
     */
    var GridFormatter = function(){

        /**
         * Builds the GridFormatter
         * @returns {Object} Current "this" of the class
         */

        var lookupLabelContentTable = {},
            searchableColumns = {},
            columnFilter = new ColumnFilter(),
            rowHeight = 18, //sets default row height
            rowMaxElementConf;

        this.formatFilterConfiguration =  function (conf,url) {
            conf = $.extend(true, {}, conf); //deep copy
            conf.url = url;
            if (conf.subGrid){
                conf.jsonRoot = conf.subGrid.jsonRoot;
                conf.scroll = conf.subGrid.scroll;
                conf.height = conf.subGrid.height;
                conf.numberOfRows = conf.subGrid.numberOfRows;
                conf.showRowNumbers = conf.subGrid.showRowNumbers;
                delete conf.subGrid;
                var columns = conf.columns,
                    column;
                for (var i=0; i<columns.length ; i++){
                    column = columns[i];
                    if (column.groupBy){
                        column.hidden = true;
                        break;
                    }
                }
            }
            return conf;
        };

        /*
         * Sets the collapse row configuration to be used to set the max numbers of elements that can be seen in a cell when the row is expanded or collapsed
         */
        var setCollapseRowConfiguration = function (conf) {
            rowMaxElementConf = {
                "collapse": (conf.rowMaxElement && conf.rowMaxElement.collapse) ? conf.rowMaxElement.collapse : 1,
                "expand": (conf.rowMaxElement && conf.rowMaxElement.expand) ? conf.rowMaxElement.expand : 5,
                "edit": (conf.rowMaxElement && conf.rowMaxElement.edit) ? conf.rowMaxElement.edit : 5
            }
        };

        /*
         * Adjust the height of a cell according to the number of rows that be shows as a max according to the grid configuration
         */
        this.adjustCellHeight = function ($gridTable) {
            $($gridTable).find('.cellCollapseWrapper').css({
                "max-height": rowHeight*rowMaxElementConf.collapse
            });
            $($gridTable).find('.cellExpandWrapper').css({
                "max-height": rowHeight*rowMaxElementConf.expand
            });
        };

        var getNumberOfRows = function (gridConfiguration) { //toDo: it's not setting the size to 50
            var numberOfRows = gridConfiguration.numberOfRows;
            if (gridConfiguration.height == 'auto' && numberOfRows) {
                if (parseInt(numberOfRows) < 50) {
                    return 50;
                }
            }
            return numberOfRows;
        };

        /*
         * Splits the columns objects into two columns: column and columnSubGrid if subGrid object is available
         * Also, adds custom formatters and unformats.
         */
        this.formatConfiguration =  function (conf, treeFormatter, $gridContainer) {
            var gridConfiguration = _.extend({}, conf),//deep copy
                $searchContainer = $gridContainer.find('.search-container');
            columnFilter.setGridContainer($gridContainer);
            gridConfiguration.numberOfRows = getNumberOfRows(gridConfiguration);

            setCollapseRowConfiguration(conf);

            var originalColumns = gridConfiguration.columns;
            var columns = [],
                subGridColumns=[],
                moreColum = {
                    "index": "slipstreamgrid_more",
                    "name": "slipstreamgrid_more",
                    "label": "",
                    "formatter":showMoreIcon,
                    "unformat":hideIcon,
                    "width":"30",
                    "search":false,
                    "sortable":false,
                    "resizable": false,
                    "fixed": true,
                    "classes": "slipstreamgrid_more row_draggable"
                },
                emptyColum={
                    "name": "slipstreamgrid_empty",
                    "label": "",
                    "width":"30",
                    "search":false,
                    "sortable":false,
                    "resizable": false,
                    "fixed": true,
                    "classes": "row_draggable"
                },
                isCollapseRequired=false,
                column, subGridColumn, formatter,unformat;

            for (var i=0; i<originalColumns.length; i++){
                formatter=null,unformat=null;
                column = getColumn(originalColumns[i], $searchContainer);

                if(originalColumns[i]['collapseContent']){
                    isCollapseRequired = true;
                    if (originalColumns[i]['collapseContent'].keyValueCell){
                        formatter = collapseObjectContent;
                        unformat = restoreObjectContent;
                        lookupLabelContentTable[originalColumns[i]['name']] = originalColumns[i]['collapseContent']['lookupKeyLabelTable'];
                    } else {
                        formatter = collapseArrayContent;
                        unformat = restoreArrayContent;
                    }
                } else if(originalColumns[i]['showInactive']){
                    if(gridConfiguration.subGrid)
                        gridConfiguration.subGrid.disableColumn = originalColumns[i]['name'];
                    else
                        gridConfiguration.disableColumn = originalColumns[i]['name'];
                }

                if(originalColumns[i]['editCell']  && /input/.test(originalColumns[i]['editCell']['type'])){
                    unformat = originalColumns[i]['unformat'] ? originalColumns[i]['unformat'] : restoreInput;
                }

                if(!gridConfiguration.subGrid){
                    assignFormatterAndUnformat(originalColumns[i], column, formatter, unformat);
                    column['name']=originalColumns[i]['name'];
                    columns.push(column);
                } else {
                    var showHeader = !originalColumns[i]['hideHeader'];
                    if(originalColumns[i]['groupBy']){
                        gridConfiguration['groupBy'] = originalColumns[i]['name'];
                        assignFormatterAndUnformat(originalColumns[i], column, formatter, unformat);
                        column['name']=originalColumns[i]['name'];
                    } else {
                        subGridColumn = getColumn(originalColumns[i], $searchContainer);
                        column['name']="";
                        assignFormatterAndUnformat(originalColumns[i], subGridColumn, formatter, unformat);
                        subGridColumn['name']=originalColumns[i]['name'];
                    }
                    if (column&&showHeader) columns.push(column);
                    if (subGridColumn) subGridColumns.push(subGridColumn);
                }
                if((column.dragNDrop && column.dragNDrop.isDraggable) || (gridConfiguration.dragNDrop && gridConfiguration.dragNDrop.source==='row')){
                    column.classes = (typeof column.classes === "undefined")? 'cell_draggable' : 'cell_draggable '+ column.classes;
                }
                if(column.dragNDrop && column.dragNDrop.isDroppable){
                    column.classes = (typeof column.classes === "undefined")? 'cell_droppable' : 'cell_droppable '+ column.classes;
                }
            }

            if (gridConfiguration.contextMenu && gridConfiguration.contextMenu.quickView) {
                columns.unshift(new ColumnActionFormatter().getSelectionColumn(conf));
            }

            if (gridConfiguration.tree && (gridConfiguration.multiselect || gridConfiguration.singleselect)) {
                columns.unshift(treeFormatter.getSelectionColumn(conf));
            }

            if(isCollapseRequired){
                if(gridConfiguration.subGrid)
                    subGridColumns.unshift(moreColum);
                else
                    columns.unshift(moreColum)
            }else{
                if(gridConfiguration.subGrid)
                    subGridColumns.unshift(emptyColum);
            }

            gridConfiguration.columns = columns;
            if(gridConfiguration.subGrid) gridConfiguration.subGrid.columns =subGridColumns;

            return gridConfiguration;
        };

        /*
         * Get the properties of a column from its original column and reformat its according to jqGrid library requirements
         */
        var getColumn = function (originalColumn, $searchContainer){
            var column =  _.extend({},originalColumn);
            if(originalColumn['editCell']){
                delete column.editCell;
                var editCell = originalColumn['editCell'];
                var editType = editCell['type'];
                switch(editType){
                    case 'custom':
                        if(typeof(editCell['element']) == "function" && typeof(editCell['value']) == "function"){
                            column['editable'] = true;
                            column['edittype'] = "custom";
                            column['editoptions'] = {
                                custom_element: editCell['element'],
                                custom_value: editCell['value']
                            };
                        }
                        break;
                    case 'dropdown':
                        column['editable'] = true;
                        column['edittype'] = "select";
                        var editoptionsValue = "";
                        for (var i=0; i<editCell['values'].length; i++){
                            editoptionsValue += editCell['values'][i].value + ":" + editCell['values'][i].label + ";";
                        }
                        column['editoptions'] = {
                            "value": editoptionsValue.slice(0,-1)
                        };
                        break;
                    default:
                        column['editable'] = true;
                        column['value'] = editCell['value'];
                        break;
                }
            } else if(originalColumn['collapseContent']){
                var isKeyValueCell = originalColumn['collapseContent'].keyValueCell ? true : false;
                column['editable'] = true;
                column['edittype'] = 'custom';
                column['editoptions'] = {
                    custom_element: isKeyValueCell ? cellObjectTextarea : cellTextarea,
                    custom_value: isKeyValueCell ? cellObjectTextValue : cellTextValue
                };
            }
            if (_.isObject(originalColumn['searchCell'])) {
                delete column.searchCell;
                var searchCell = originalColumn['searchCell'];

                var searchType = searchCell['type'];
                switch(searchType){
                    case 'dropdown':
                        column['searchoptions'] = columnFilter.getDropdownSearch(column, searchCell);
                        break;
                    case 'date':
                        column['searchoptions'] = columnFilter.getDateSearch(column);
                        break;
                    case 'number':
                        column['searchoptions'] = columnFilter.getNumberSearch(column);
                        break;
                    default:
                        searchType && delete searchType['type'];
                        column['searchoptions'] = searchCell['searchoptions'];
                        break;
                }
                column['searchoptions'].clearSearch = false;
                addSeachableColumn(searchableColumns, originalColumn);
            } else if ($searchContainer &&  originalColumn['searchCell'] === true){ //simple filtering is enabled
                column['searchoptions'] = columnFilter.getInputSearch(column);
                column['searchoptions'].clearSearch = false;
                addSeachableColumn(searchableColumns, originalColumn);
            } else {
                column['search'] = false;
            }
            return column;
        };

        var addSeachableColumn = function (searchableColumns, originalColumn) {
            var key = originalColumn['index'] || originalColumn['name'];
            searchableColumns[key] = originalColumn['searchCell']['type'] || 'input';
        };

        /*
         * Defines the html element that will be used to edit a cell.
         */
        var cellTextarea = function (cellvalue, options) {
            var $textarea = $("<textarea readonly>");
            var value = cellvalue,
                breaks = rowMaxElementConf.edit;
            if (cellvalue instanceof Array){
                value = cellvalue[0];
                var cellvalueLength = cellvalue.length;
                if ((cellvalueLength-1) < breaks) breaks = cellvalueLength -1;
                for (var i=1; i < cellvalueLength; i++){
                    if (cellvalue[i]!="")
                        value += "\n" +cellvalue[i];
                }
            } else {
                breaks = 1;
            }
            $textarea.attr('rows',breaks).val(value).addClass('cellOverlayView');
            return $textarea[0];
        };

        /*
         * Defines the value that will be returned after a cell is edited.
         */
        var cellTextValue = function (elem, operation, value) {
            if(operation === 'get') {
                return $(elem).val().trim().split('\n');
            } else if(operation === 'set') {
                $('textarea',elem).val(value);
            }
        };

        /*
         * Defines the html element that will be used to edit a cell.
         */
        var cellObjectTextarea = function (cellvalue, options) {
            var $textarea = $("<textarea readonly>");
            var label,
                value = '',
                breaks = rowMaxElementConf.edit;
                if (cellvalue instanceof Object){
                    var keyLabelTable = lookupLabelContentTable[options.name],
                        cellvalueSize = _.size(cellvalue);
                    if (cellvalueSize < breaks) breaks = cellvalueSize;
                    for (var key in cellvalue){
                        cellvalueSize--;
                        label = keyLabelTable && keyLabelTable[key]? keyLabelTable[key] : key;
                        value += label + ": " + cellvalue[key];
                        if (cellvalueSize)
                            value += "\n";
                    }
                } else {
                    value = cellvalue;
                    breaks = 1;
                }
            $textarea.attr('rows',breaks).val(value).addClass('cellOverlayView');

            return $textarea[0];
        };

        /*
         * Defines the value that will be returned after a cell is edited.
         */
        var cellObjectTextValue = function (elem, operation, value) {
            var cellObject = {},
                keyValue;
            if(operation === 'get') {
                var valueObj = $(elem).val().trim().split('\n');
                for (var i=0; i<valueObj.length; i++){
                    keyValue = valueObj[i].split(": ");
                    cellObject[keyValue[0]] = keyValue [1];
                }
                return cellObject;
            } else if(operation === 'set') {
                $('textarea',elem).val(value);
            }
        };

        /* Assigns the formatter and unformat functions to a end variable depending on the formatter or unformat of
         * the source.
         */
        var assignFormatterAndUnformat = function (source, end, formatter, unformat){
            end['formatter']=formatter ? formatter : source['formatter'];
            end['unformat']=unformat ? unformat : source['unformat'];
        };

        /*
         * Custom function to update the content of a cell, so that its content can be collapsed on one line
         * and showing instead the number of entries not seen plus the word "more..."
        */
        var collapseArrayContent = function (cellvalue, options, rowObject){
            var collapseContent = options.colModel.collapseContent,
                collapseNumberOfItems = rowMaxElementConf.collapse,
                expandNumberOfItems = rowMaxElementConf.expand,
                cellLess = '';
            if (typeof collapseContent.formatData == "function"){
                cellvalue = collapseContent.formatData(cellvalue, options, rowObject);
            }

            if (collapseContent.name && cellvalue instanceof Object){
                if (cellvalue instanceof Array){
                    if (cellvalue.length==1) cellvalue = cellvalue[0][collapseContent.name] || cellvalue;
                } else {
                    cellvalue = [ cellvalue[collapseContent.name] || cellvalue ];
                }
            }

            //reformat cellvalue from strings to key/value pair if required
            var formatCellItem = function (cell) {
                if (typeof(cell) == 'string'){
                    cell = { "label": cell };
                }
                return cell;
            };

            if (typeof(cellvalue) == 'string') {
                if(collapseContent.singleValue){
                    cellvalue = cellvalue.trim().split("\n");
                }else{
                    cellvalue = [ formatCellItem (cellvalue[collapseContent.name] || cellvalue) ];
                }
            }

            if (cellvalue instanceof Array) {
                var formattedCells = [],
                lessFormattedCells = [],
                moreFormattedCells = [],
                originalCells = '',
                restOfElementsLess, restOfElementsMore;

                cellvalue = cellvalue.filter(function(value){ return value != '' });
                for (var i=0; i<cellvalue.length; i++) {
                    var cell = cellvalue[i];
                    var formattedCell = formatCellItem (cell[collapseContent.name] || cell);
                    formattedCells.push(formattedCell);
                    (i < collapseNumberOfItems) && lessFormattedCells.push(formattedCell);
                    (i < expandNumberOfItems) && moreFormattedCells.push(formattedCell);
                    originalCells += formattedCell.label + "\n";
                }
                originalCells.slice(0,-2);

                if(formattedCells.length > collapseNumberOfItems){
                    restOfElementsLess = {
                        more: "+",
                        number: formattedCells.length - collapseNumberOfItems,
                        rowId: options.rowId,
                        columnName: options.colModel.name
                    };
                }
                if(formattedCells.length > expandNumberOfItems){
                    restOfElementsMore = {
                        more: "+",
                        number: formattedCells.length - expandNumberOfItems,
                        rowId: options.rowId,
                        columnName: options.colModel.name
                    };
                }

                cellLess = render_template(cellTemplate,{
                    lessContent:lessFormattedCells,
                    moreNumber: restOfElementsLess,
                    moreContent: formattedCells,
//                    moreContent: moreFormattedCells,
//                    moreNumberExpand: restOfElementsMore,
                    singleValue : collapseContent.singleValue,
                    cellValue: originalCells
                });
            }

            if (typeof collapseContent.formatCell == "function"){
                var $cellLess = collapseContent.formatCell($(cellLess), cellvalue, options, rowObject);
                if (typeof($cellLess)=='object'){
                    var cellLessString = '';
                    $cellLess.each(function(index, item){
                        cellLessString += item.outerHTML;
                    });
                    cellLess = cellLessString;
                } else {
                    cellLess = $cellLess;
                }
            }
            return cellLess;
        };

        /*
         * Custom function to restore the value of the cell before it was formatted by collapseContent function
         */
        var restoreArrayContent = function (cellvalue, options, rowObject){
            var collapseContent = options.colModel.collapseContent;
            var originalContent = $(rowObject).find('.originalCellValue').text().split('\n');
            if(originalContent.length==1) originalContent.push("");
            if (typeof collapseContent.unformatCell == "function"){
                originalContent = collapseContent.unformatCell(originalContent, cellvalue, options, rowObject);
            }
            return originalContent;
        };

        /*
         * Custom function to restore the value of the cell before additional formatting was introduced to validate the input
         */
        var restoreInput = function (cellvalue, options, rowObject){
            var originalInput = $(rowObject).find('input') ? $(rowObject).find('input').val() : cellvalue;
            return originalInput;
        };

        /*
         * Custom function to update the content of a cell, so that its content can be collapsed on one line
         * and split by "|". The cellvalue is expected to be an object.
        */
        var collapseObjectContent = function (cellvalue, options, rowObject){
            var collapseContent = options.colModel.collapseContent;
            if (typeof collapseContent.formatData == "function"){
                cellvalue = collapseContent.formatData(cellvalue, options, rowObject);
            }
            var cellSplit = '';
            if (cellvalue instanceof Object){
                var cellValueLess = '',
                    cellValueAll = [],
                    cellOriginalValue = '',
                    keyLabelTable = lookupLabelContentTable[options.colModel.name];
                for (var key in cellvalue){
                    var label = keyLabelTable && keyLabelTable[key]? keyLabelTable[key] : key;
                    var value = cellvalue[key];
                    cellValueLess +=  label + " | ";
                    cellValueAll.push({
                        "label": label,
                        "objectKey": value.key,
                        "value": value.label || value
                    });
                    cellOriginalValue += key + "-&&&-" + cellvalue[key] + "\n";
                }
                cellSplit = render_template(cellTemplate,{
                    lessContent:{
                        "label": cellValueLess.trim().slice(0,-1),
                        "objectContent": true
                    },
                    moreContent:cellValueAll,
                    cellValue: cellOriginalValue
                });
            }
            if (typeof collapseContent.formatObjectCell == "function"){
                var $cellSplit = collapseContent.formatObjectCell($(cellSplit), cellvalue, options, rowObject);
                if (typeof($cellSplit)=='object'){
                    var cellSplitString = '';
                    $cellSplit.each(function(index, item){
                        cellSplitString += item.outerHTML;
                    });
                    cellSplit = cellSplitString;
                } else {
                    cellSplit = $cellSplit;
                }
            }
            return cellSplit;
        };

        /*
         * Custom function to restore the value of the cell before it was formatted by collapseContent function
         */
        var restoreObjectContent = function (cellvalue, options, rowObject){
            var collapseContent = options.colModel.collapseContent;
            var contents = {};
            var originalContent = $(rowObject).find('.originalCellValue').text().split('\n');
            if(originalContent.length==1){
                contents.push("");
            } else {
                for (var i=0; i<originalContent.length; i++){
                    var content = originalContent[i];
                    var contentArray = content.split('-&&&-');
                    if (contentArray[0]) contents[contentArray[0]]=contentArray[1];
                }
            }
            if (typeof collapseContent.unformatObjectCell == "function"){
                contents = collapseContent.unformatObjectCell(contents, cellvalue, options, rowObject);
            }
            return contents;
        };

        /* Custom function to update the content of a cell, so that its content can be collapsed on one line
         * and showing instead the number of entries not seen plus the word "more..."
         */
        var showMoreIcon = function (cellvalue, options, rowObject){
            var rowIcon = render_template(cellTemplate,{
                lessIcon:"lessIcon",
                moreIcon:"moreIcon"
            });
            return rowIcon;
        };

        /*
         * Custom function to remove any markup introduced by showMoreIcon function
         */
        var hideIcon = function (cellvalue, options, rowObject){
            return "";
        };

        /**
         * Provides all columns that are searchable in the grid
         * @returns {Array} All searchable columns
         */
        this.getSearchableColumns = function () {
            return searchableColumns;
        };

        /**
         * Reformat the action buttons
         * @returns {Array} All action buttons
         */
        this.formatCustomActionButtons = function (actionButtons) {
            if (actionButtons && actionButtons.customButtons){
                $.each(actionButtons.customButtons, function( index, value ) {
                    if (value['icon_type']){
                        if (_.isString(value['icon'])){
                            var obj = {
                                default: value['icon'],
                                hover: value['icon'],
                                disabled: value['icon']
                            };
                            value['icon'] = obj;
                        }
                    }
                });
            }
            
            return actionButtons;
        };

    };

    return GridFormatter;
});