/**
 * A module that calculates the column width and height of the grid when the grid is rendered or tbrowser
 *
 * @module GridSizeCalculator
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
],  /** @lends GridSizeCalculator */
    function() {

    /**
     * GridSizeCalculator constructor
     *
     * @constructor
     * @class GridSizeCalculator - Calculates column width and height of the grid
     *
     * @param {Object} gridConfiguration - grid configuration
     * @returns {Object} Current GridSizeCalculator's object: this
     */
    var GridSizeCalculator = function(gridConfiguration){

        var containers, containersWidth, isAutoWidth,
            gridContainerHeight = 0,
            self = this;

        this.init = function (gridContainer, originalGridContainer) {
            containers = {
                $gridContainer: gridContainer
            };
        };

        /**
         * Adjust the maximum height of the grid to the available height of container. It is available the grids that have the auto height property and that are not nested grids.
         * The calculation starts by getting the height of the grid container if it is available. In case it is available, then it uses the vertical offset between the grid content and the grid container to know the size og the elements above the grid content. It takes off the grid footer height.
         * If the grid container height is not available, then it uses the viewport to calculate how height the grid container is.
         * @param {boolean} resetContentContainer - set to true when the grid width needs to have the grid table resized
         * @param {boolean} resetGridContainer - set to true when the grid width needs to have the grid container resized
         */
        this.calculateGridHeight = function (resetContentContainer, resetGridContainer) {
            var isAutoHeightGrid = gridConfiguration.height && gridConfiguration.height == 'auto' && typeof(gridConfiguration.subGrid) == 'undefined'? true : false;

            if (isAutoHeightGrid && (typeof(containers.$gridContentContainer) == "undefined" || resetContentContainer)) {

                !containers.$gridHeaderContainer && (containers.$gridHeaderContainer = containers.$gridContainer.find('.ui-jqgrid-hdiv'));
                !containers.$gridContentContainer && (containers.$gridContentContainer = containers.$gridContainer.find('.ui-jqgrid-bdiv'));
                !containers.$gridTableFooter && (containers.$gridTableFooter = containers.$gridContainer.find('.gridTableFooter'));
                !containers.$gridEndContainer && (containers.$gridEndContainer = containers.$gridContainer.find('.grid-widget-end'));

                var gridFooterHeight = containers.$gridTableFooter ? containers.$gridTableFooter.outerHeight(true) : 0;
                var gridContainerMaxHeight = containers.$gridContainer.css("max-height");
                var gridContainerDefaultHeight = ~gridContainerMaxHeight.indexOf("px") ? gridContainerMaxHeight.slice(0,-2) : 0;
                var gridContentHeight = containers.$gridContentContainer.height();

                if (resetGridContainer)
                    gridContainerHeight = 0;

                var getGridContentMaxHeight = function (gridContainerY) {
                    var offsetTopContainer = containers.$gridContainer.offset().top;
                    var offsetTopContent = containers.$gridContentContainer.offset().top;
                    if (offsetTopContent == 0) {
                        offsetTopContent = containers.$gridHeaderContainer.offset().top + containers.$gridHeaderContainer.height();
                    }
                    var gridContentY = offsetTopContent - offsetTopContainer;
                    var gridContentMaxHeight = gridContainerY - gridContentY - gridFooterHeight;
                    return gridContentMaxHeight;
                };

                var maxHeight;
                if (gridContainerDefaultHeight) { //uses the max height if it is defined in the grid container max height
                    var availableGridContentHeight = getGridContentMaxHeight(gridContainerDefaultHeight);
                    maxHeight = availableGridContentHeight < gridContentHeight ? availableGridContentHeight : gridContentHeight;
                } else { //uses the available view port to calculate the height of the grid
                    if (gridContainerHeight == 0) {
                        var viewportY =  $(window).height() + $(window).scrollTop();
                        var gridEndY = containers.$gridEndContainer.offset().top;
                        var offset = gridEndY - viewportY;
                        if (offset <= 0) {
                            gridContainerHeight = containers.$gridContainer.height() + Math.abs(offset);
                            maxHeight = getGridContentMaxHeight(gridContainerHeight);
                        } else {
                            maxHeight = gridContentHeight - offset;
                        }
                    } else if (resetContentContainer) {
                        maxHeight = getGridContentMaxHeight(gridContainerHeight);
                    }
                }

                if (gridContainerDefaultHeight == 0)
                    maxHeight -= 20; //provides an offset bottom-margin for the grid footer

                containers.$gridContentContainer.css({
                    "height": "auto",
                    "max-height": maxHeight
                });
                console.log("auto height set to " + maxHeight);

                if (gridContainerHeight == 0) //sets the grid container height if it is not available from the grid max-height css property
                    gridContainerHeight = containers.$gridContainer.height();
            }

        };

        /**
         * Resizes the grid content height by assigning a maximum height depending if the grid has a token area or not
         * @param {boolean} isFilteredGrid - if it is set to true, it indicates that the grid has a token area shown; otherwise, it will be hidden. The presence of the token area causes that the grid content have a smaller area to render.
         */
        this.resizeGridHeight = function (isFilteredGrid) {
            if (isFilteredGrid) {
                self.calculateGridHeight(true);
            } else {
                self.calculateGridHeight();
            }
        };

        /**
         * Adjusts the width of the grid columns
         * @param {boolean} autoWidth - set to true when the grid width needs to resized according to the available grid with and according to the percentage assigned to it.
         */
        this.adjustColumnWidth = function (autoWidth) {
            containers = _.extend(containers, {
                $gridTable: containers.$gridContainer.find('.gridTable'),
                $headerRow: containers.$gridContainer.find('.ui-jqgrid-labels th'),
                $firstRow: containers.$gridContainer.find('.jqgfirstrow td'), //jqGrid only formats the first row
                $actionFilterContainer: containers.$gridContainer.find('.action-filter-container'),
                $footerContainer: containers.$gridContainer.find('.gridTableFooter')
            });

            _.extend(containers, {
                $lastCellOnHeader: containers.$headerRow.last(),
                $lastCellOnFirstRow: containers.$firstRow.last()
            });

            containersWidth = {
                lastCellOnHeader: containers.$lastCellOnHeader.width(),
                lastCellOnFirstRow: containers.$lastCellOnFirstRow.width(),
                jqGrid: containers.$gridContainer.find(".ui-jqgrid").width()
            };

            isAutoWidth = autoWidth;

             var observer = new MutationObserver(function(mutations) {
                 if (containersWidth.jqGrid === 0) {
                     containersWidth.jqGrid = containers.$gridTable.width();
                 }
                 var gridContWidth = containers.$gridContainer.find(".ui-jqgrid").width();
                 if( gridContWidth !== containersWidth.jqGrid) {
                        if( (isAutoWidth && gridContWidth !== 0)) {
                            containersWidth.jqGrid = gridContWidth;    
                        }                      
                        containers.$gridContainer.trigger('slipstream-resize-grid');
                        observer.disconnect();                                                  
                 }

                 if(!isAutoWidth) {
                    var actionContainerMinWidth = containers.$gridContainer.find('.action-filter-wrapper').width() + 10; //TODO: Calculate width including margin and remove 10px offset
                    var allContainersMaxWidth = containers.$gridTable.width();
                    containers.$gridContainer.find('.action-filter-container').css('min-width', actionContainerMinWidth);
                    allContainersMaxWidth && (containers.$actionFilterContainer.css('max-width', allContainersMaxWidth));
                    allContainersMaxWidth && (containers.$gridContainer.find('.ui-jqgrid-view').css('max-width', allContainersMaxWidth));
                    if (containers.$gridContainer.find('.gridTableFooter').length > 0) {
                        containers.$gridContainer.find('.gridTableFooter').css('min-width', actionContainerMinWidth);
                        allContainersMaxWidth && (containers.$footerContainer.css('max-width', allContainersMaxWidth));
                    }
                 }
             });
                
              observer.observe(containers.$gridContainer[0], {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
              });

            bindResizeGrid();
        };

        /*
         * Adjust the last cell on the header and the first column content to allow the closing line for title and on hover being showed.
         * The adjustment is required because the left and right border takes a total of 2 pixels (1 pixel on each side).
         * The margin are not part of the original calculation of the width of the grid.
         * The column width is fixed.
         * @inner
         */
        var adjustGridOffset = function () {
            containers.$lastCellOnHeader.width(containersWidth.lastCellOnHeader - 2);
            containers.$lastCellOnFirstRow.width(containersWidth.lastCellOnFirstRow - 2);
        };

        /*
         * Adjust the last cell on the header and the first column content to allow the closing line for title and on hover being showed.
         * The adjustment is required because the left and right border takes a total of 2 pixels (1 pixel on each side).
         * The margin are not part of the original calculation of the width of the grid.
         * The column width is a percentage of the total grid width.
         * @inner
         */
        var adjustAutoGridOffset = function () {
            containers.$lastCellOnHeader.width(containers.$headerRow.last().width() - 2);
            containers.$lastCellOnFirstRow.width(containers.$firstRow.last().width() - 2);
        };

        /**
         * Resizes the grid with according to the grid container width and updates the grid filter container to be aligned to the right of the grid.
         * @inner
         */
        var resizeGrid = function () {
            if (isAutoWidth){
                containers.$gridTable.setGridWidth(containersWidth.jqGrid, true); //Resized to the new width as per browser window
                adjustAutoGridOffset();
            } else {
                adjustGridOffset();
                var allContainersMaxWidth = containers.$gridTable.width();
                containers.$actionFilterContainer.css('max-width', allContainersMaxWidth);
                containers.$gridContainer.find('.ui-jqgrid-view').css('max-width', allContainersMaxWidth);
                if (containers.$footerContainer.length > 0) {
                    containers.$footerContainer.css('max-width', allContainersMaxWidth);
                }
            }
        };

        /**
         * Adds event handler the window resize and the slipstream-resize-grid events. The resize event is triggered when the browser is resized, and the slipstream-resize-grid could be triggered when some grid columns are hidden from the "Show Hide Column" submenu.
         * @inner
         */
        var bindResizeGrid = function () {
            $(window).unbind('resize').bind('resize', function(evt) {
                var resizedWidth = containers.$gridContainer.find('.ui-jqgrid').width();
                (resizedWidth) && (containersWidth.jqGrid = resizedWidth);
                resizeGrid();
                self.calculateGridHeight(true, true);
            });
            containers.$gridContainer.bind("slipstream-resize-grid", function (e){
                resizeGrid();
            });
        };

    };

    return GridSizeCalculator;
});