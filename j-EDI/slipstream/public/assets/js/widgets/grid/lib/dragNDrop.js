/**
 * A module that add drag and drop feature to the simple grid cell or row.
 *
 * @module DragNDrop
 * @author Eva Wang <iwang@juniper.net>
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'widgets/grid/lib/gridTemplates',
    'widgets/grid/lib/dialogFormatter',
    'widgets/confirmationDialog/confirmationDialogWidget',
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n'
],  /** @lends DragNDrop */
    function(GridTemplates, DialogFormatter, ConfirmationDialogWidget, render_template, i18n) {

    /**
     * DragNDrop constructor
     *
     * @constructor
     * @class DragNDrop - Add drag and drop feature to the grid
     *
     * @param {Object} conf - User configuration object
     * @returns {Object} Current DragNDrop's object: this
     */
    var DragNDrop = function(conf){
        var lastSavedID,
            templates = new GridTemplates().getTemplates(),
            confirmationDialogs = conf.elements&&conf.elements.confirmationDialog?new DialogFormatter(conf.elements.confirmationDialog).getConfirmationDialogs():new DialogFormatter().getConfirmationDialogs();

        /**
         * Bind Drag and Drop event
         * @inner
         */
        var droppableDropEvent = function(event, ui, dropElement){
            var droppableGridTable = dropElement.parents('table'),
                dropGridTablePara = droppableGridTable.jqGrid('getGridParam'),
                $dropElement = dropElement,
                $dragElement = $(ui.draggable),
                draggableGridTable = $dragElement.parents('table'),
                dragGridTablePara = draggableGridTable.jqGrid('getGridParam'),
                selectedRows = draggableGridTable.jqGrid('getGridParam','selarrrow'),
                $droppableRow = $dropElement.parents('tr'),
                droppableRowId = $droppableRow.attr('id'),
                droppableRow,
                isMulitpleDrag = (dragGridTablePara.dragNDrop && dragGridTablePara.dragNDrop.source === 'row' && selectedRows && selectedRows.length >= 1),
                isValid;

            if (dropGridTablePara && dropGridTablePara.dragNDrop && dropGridTablePara.dragNDrop.connectWith){
                var $otherGridTable = $("#" + dropGridTablePara.dragNDrop.connectWith);
                $otherGridTable.parents(".ui-jqgrid-view").find("td:not(.cell_droppable):not(.ui-search-input):not(.ui-search-clear)").find(".cell_mask").remove();
                $otherGridTable.parents(".ui-jqgrid-view").find("th").find(".cell_mask").remove();
            }
            droppableGridTable.parents(".ui-jqgrid-view").find(".cell_mask").remove();
            draggableGridTable.parents(".ui-jqgrid-view").find(".cell_mask").remove();
            
            droppableRow = $droppableRow.data('jqgrid.record_data');

            if(!$dropElement.hasClass('cell_droppable') || !droppableRow){
                $dragElement.draggable('option', 'revert', true);
                return
            }
            
            if (isMulitpleDrag){
                var helperColumnData = searchHelperData(dragGridTablePara),
                    draggableRow
                    draggableRows = [],
                    draggableRowsData = [];

                for (var i = 0; i < selectedRows.length; i++){
                    draggableRow = draggableGridTable.find('#' +selectedRows[i]).data('jqgrid.record_data');
                    draggableRows.push(draggableRow);
                    var draggableRowData = draggableGridTable.jqGrid('getRowData', selectedRows[i]);
                    draggableRowsData.push(draggableRowData[helperColumnData]);
                }
                
                isValid = dropGridTablePara.dragNDrop && dropGridTablePara.dragNDrop.afterDrop && dropGridTablePara.dragNDrop.afterDrop(selectedRows, $dropElement, draggableRows, droppableRow);
                selectedRows = draggableRowsData;
            }else{
                var tdNestedElement = $dragElement.find('.originalCellValue:first'),
                    draggableRow = $dragElement.parents('tr').data('jqgrid.record_data');

                //if just drag one item 
                if (dragGridTablePara.dragNDrop && dragGridTablePara.dragNDrop.source === 'row'){

                    var helperColumn = searchHelperData(dragGridTablePara),
                        draggableData = draggableRow[helperColumn];
                    selectedRows = draggableData.split('\n');
                }else{
                    selectedRows = (tdNestedElement.length > 0) ? $dragElement.find('.originalCellValue:first').text().split('\n') : $dragElement.text().split('\n');
                }
            
                isValid = dropGridTablePara.dragNDrop && dropGridTablePara.dragNDrop.afterDrop && dropGridTablePara.dragNDrop.afterDrop(selectedRows, $dropElement, draggableRow, droppableRow);
            }

            //after the callback is executed, the validation is returned
            if (_.isObject(isValid) && isValid.isValid){
                var dropTableID = droppableGridTable.attr('id'),
                    dropCellDataKey = $dropElement.attr('aria-describedby').replace(dropTableID + "_", '');
                
                $dragElement.draggable('option', 'revert', false);
                
                droppableRow = droppableGridTable.jqGrid('getRowData', droppableRowId);

                $.merge(droppableRow[dropCellDataKey],selectedRows);
                
                
                droppableGridTable.jqGrid('setRowData', droppableRowId, droppableRow);
                lastSavedID = droppableRowId;
                draggableGridTable.jqGrid('resetSelection');
                droppableGridTable.jqGrid('resetSelection');
                selectedRows = null;
            
                droppableGridTable.jqGrid('setSelection', droppableRowId, true);

                if (!dropGridTablePara.editRow){
                    droppableGridTable.trigger('slipstreamGrid.saveRow');
                }
            }else if(_.isObject(isValid) && !isValid.isValid){
                var cancel = function() {
                    self.confirmationDialog.destroy();
                };

                $dragElement.draggable('option', 'revert', true);

                if (isValid.errorMessage){
                    _.extend(confirmationDialogs['error'], {
                        yesButtonCallback: cancel,
                        question: isValid.errorMessage
                    });
                }else{
                    _.extend(confirmationDialogs['error'], {
                        yesButtonCallback: cancel
                    });
                }
                
                self.confirmationDialog = new ConfirmationDialogWidget(confirmationDialogs['error']);
                self.confirmationDialog.build();
            }
        };

        /**
         * Update draggable element class
         * @param {Boolean} isDenied
         * @inner
         */
        var updateDraggableElementClass = function(isDenied){
            var $dragElement = $('#draggableElement');
            if ($dragElement.length > 0){
                if (isDenied){
                    $dragElement.find('.icon_container').removeClass('icon_access').addClass('icon_deny');
                }else{
                    $dragElement.find('.icon_container').removeClass('icon_deny').addClass('icon_access');
                }
            }
        };

        /**
         * Update sortable event
         * @inner
         */
        var updateSortableEvent = function(e, ui, $gridTable, reformatRow){
            var $row = $gridTable.find('#'+ui.item[0].id);
            var prevRowId = $row.prev().attr('id');
            var prevRow = prevRowId ?  $gridTable.jqGrid('getRowData', prevRowId) : {};
            var movedRow = {
                'movedRow': reformatRow($gridTable.jqGrid('getRowData',ui.item[0].id)),
                'previousRow': reformatRow(prevRow)
            };
            if(conf.actionEvents && conf.actionEvents.moveEvent)
                $gridTable.trigger(conf.actionEvents.moveEvent, movedRow);
        };

        /**
         * Search Helper Data that should come from which column
         * @inner
         */
        var searchHelperData = function(data){
            for (var i=0; i<data.colModel.length; i++){
                var column = data.colModel[i];
                if (column.dragNDrop && column.dragNDrop.isDraggableHelperData){
                    return column.name
                }
            }
            return 'id';
        };

        /**
         * Bind Drag and Drop event for cells
         * @param {Object} gridTable
         * @param {String} gridTable ID
         * @inner
         */
        this.bindDnDCellsEvent = function ($gridTable, reformatRow) {
            var $draggableCells = $gridTable.find("td.cell_draggable"),
                $droppableCells = $gridTable.parents(".grid-widget").find("td"),
                $notDroppableCells = [],
                $notDroppableHeader = [],
                selectedRows;
            
            $draggableCells.draggable({
                appendTo: 'body',
                //Define the customized draggable helper
                helper: function (event) {
                    var $this = $(this),
                        draggableElement,
                        content,
                        draggableGridTable = $this.parents('table'),
                        draggableTableID = draggableGridTable.attr('id');

                    if (conf.elements.dragNDrop && conf.elements.dragNDrop.source ==='row'){
                            
                        selectedRows = $gridTable.jqGrid('getGridParam','selarrrow');

                        if (selectedRows.length > 1){
                            content = selectedRows.length + " " +i18n.getMessage('items');
                        }else{
                            var draggableGridTable = $this.parents('table'),
                                dragGridTablePara = draggableGridTable.jqGrid('getGridParam'),
                                draggableRowId = $this.parents('tr').attr('id'),
                                draggableRow = $gridTable.jqGrid('getRowData', draggableRowId),
                                helperColumnData = searchHelperData(dragGridTablePara);

                            content = draggableRow[helperColumnData];
                            if (_.isArray(content)){
                                var attr = draggableTableID + "_" + helperColumnData;
                                content = $this.parents('tr').find("[aria-describedby= "+ attr+"]").find('.cellContent:first').text();
                            }
                        }
                        
                    }else{
                        var tdNestedElement = $this.find('.cellContent:first');
                        content = (tdNestedElement.length > 0) ? $this.find('.cellContent:first').text() : $this.text();
                    }
                    draggableElement = render_template(templates.gridDraggableElement, {content: content});
                    
                    return $(draggableElement);
                },
                //When user starts dragging the element
                start: function(event, ui) {
                    var $draggableElement = $(this),
                        $helper = $(ui.helper),
                        $dragTable = $draggableElement.parents('table'),
                        dragGridTablePara = $dragTable.jqGrid('getGridParam');

                    $notDroppableCells = [];
                    $notDroppableHeader = [];

                    if (dragGridTablePara.dragNDrop && dragGridTablePara.dragNDrop.connectWith){
                        var $otherGridTable = $("#" + dragGridTablePara.dragNDrop.connectWith);
                        $notDroppableCells.push($otherGridTable.parents(".ui-jqgrid-view").find("td:not(.cell_droppable):not(.ui-search-input):not(.ui-search-clear)"));
                        $notDroppableHeader.push($otherGridTable.parents(".ui-jqgrid-view").find("th"));
                    }
                    $notDroppableCells.push($dragTable.parents(".ui-jqgrid-view").find("td:not(.cell_droppable):not(.ui-search-input):not(.ui-search-clear)"));
                    $notDroppableHeader.push($dragTable.parents(".ui-jqgrid-view").find("th"));
                    

                    //helper position
                    $helper.css("margin-left", event.clientX - $(event.target).offset().left);
                    $helper.css("margin-top", event.clientY - $(event.target).offset().top);

                    //if this grid is draggableRow is true and it has multi-selected rows
                    if (conf.elements.dragNDrop && conf.elements.dragNDrop.source === 'row' && selectedRows && selectedRows.length >= 1){
                        for (var i = 0; i < selectedRows.length; i++){
                            $gridTable.find('#' + selectedRows[i]).find('td').addClass("draggable-source");
                        }
                    //if this grid is draggableRow is true 
                    }else if (conf.elements.dragNDrop && conf.elements.dragNDrop.source === 'row'){
                        $draggableElement.siblings().addBack().addClass("draggable-source");
                    //else they are cell interaction 
                    }else{
                        $draggableElement.addClass("draggable-source");
                    }

                    //add cell_mask to non-droppable cells and all table th
                    for (var i = 0; i< $notDroppableCells.length; i++){
                        $notDroppableCells[i].append(render_template(templates.gridNotDroppableMask));
                        $notDroppableHeader[i].append(render_template(templates.gridNotDroppableMask));
                    }
                    

                    //set helper icon 
                    if ($draggableElement.hasClass('cell_droppable')){
                        updateDraggableElementClass(false);
                    }else{
                        updateDraggableElementClass(true);
                    }

                    $dragTable.find(".draggable-source").mouseenter(function(e){
                        var $dropElement = $(this);
                        if ($dropElement.hasClass('cell_droppable')){
                            updateDraggableElementClass(false);
                        }else{
                            updateDraggableElementClass(true);
                        }
                    });
                },
                //When user stops dragging the element
                stop: function(event, ui) {
                    var $gridTable = $(this).parents("table"),
                        dragGridTablePara = $gridTable.jqGrid('getGridParam');
                    $gridTable.find(".draggable-source").unbind("mouseenter");
                    $gridTable.find('td').removeClass("draggable-source");  

                    if (dragGridTablePara.dragNDrop && dragGridTablePara.dragNDrop.connectWith){
                        var $otherGridTable = $("#" + dragGridTablePara.dragNDrop.connectWith);
                        $otherGridTable.parents(".ui-jqgrid-view").find("td:not(.cell_droppable):not(.ui-search-input):not(.ui-search-clear)").find(".cell_mask").remove();
                        $otherGridTable.parents(".ui-jqgrid-view").find("th").find(".cell_mask").remove();
                    }
                    $gridTable.parents(".ui-jqgrid-view").find(".cell_mask").remove();
                },
                // scroll: false,
                cursor: "move",
                zIndex: 999
            });

            $droppableCells.droppable({
                accept: '.cell_draggable',
                hoverClass: "droppable-hover",
                drop: function(event, ui) { droppableDropEvent (event, ui, $(this), $gridTable);},
                tolerance: 'pointer',
                over: function (event, ui) { 
                    //set the helper icon to reflect the droppable status 
                    var currentlyHoveredElement = $(this),
                        currentBdiv = currentlyHoveredElement.parents('.ui-jqgrid-bdiv:first'),
                        currentBdivHeight = currentBdiv.height();

                    if (this.offsetTop < currentBdivHeight && currentlyHoveredElement.hasClass('cell_droppable')){
                        updateDraggableElementClass(false);
                    }else{
                        updateDraggableElementClass(true);
                    }
                } 
            });
            
            //Enable the sortable rows for the cell drag and drop interaction
            if (conf.elements.dragNDrop && conf.elements.dragNDrop.isSortable){
                $gridTable.jqGrid('sortableRows', {
                    handle: ".row_draggable",
                    update : function(event, ui) { updateSortableEvent (event, ui, $gridTable, reformatRow);}
                });
            }
        };

        /**
         * Adds support for drag and drop of a row
         * @param {Object} $table - jQuery object with the table that will have drag and drop capabilities
         */
        this.bindDnDRowsEvent = function ($gridTable, reformatRow){
            $gridTable.jqGrid('sortableRows', {
                update : function(event, ui) { updateSortableEvent (event, ui, $gridTable, reformatRow);}
            });
            $gridTable.jqGrid('gridDnD');
        };

    };

    return DragNDrop;
});