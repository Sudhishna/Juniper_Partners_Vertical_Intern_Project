/**
 * A module that builds the tooltip used in the grid widget
 *
 * @module TooltipBuilder
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'widgets/grid/lib/gridTemplates',
    'widgets/grid/lib/moreTooltipFilter',    
    'widgets/tooltip/tooltipWidget',
    'widgets/grid/conf/tooltipConfiguration'
],  /** @lends TooltipBuilder */
    function(render_template, GridTemplates, MoreTooltipFilter, TooltipWidget, tooltipConfiguration) {

    /**
     * TooltipBuilder constructor
     *
     * @constructor
     * @class TooltipBuilder - Builds the tooltips used in the grid widget
     *
     * @returns {Object} Current TooltipBuilder's object: this
     */
    var TooltipBuilder = function(gridContainer, conf){

        /**
         * Builds the TooltipBuilder
         * @returns {Object} Current instance
         */

        var templates = new GridTemplates().getTemplates(),
            gridConfModel = conf.elements.columns,
            gridTable = gridContainer.find('.gridTable');

        /**
         * Adds tooltips to the action area and titles of the Grid widget
         */
        this.addHeaderTooltips = function (){
            var getTooltipView = function (help){
                var tooltipView  = render_template(templates.helpTooltip,{
                    'help-content':help['content'],
                    'ua-help-text':help['ua-help-text'],
                    'ua-help-identifier':help['ua-help-identifier']
                });
                return $(tooltipView);
            };

            //infotip for the action area
            new TooltipWidget({
                "container": gridContainer.find('.action-filter-container')
            }).build();

            //infotip for the title
            if (conf.elements['title-help']){
                new TooltipWidget({
                    "elements": tooltipConfiguration.filter,
                    "container": gridContainer.find('.grid-title-help'),
                    "view": getTooltipView(conf.elements['title-help'])
                }).build();
            }

            //infotip for the right filter area
            if (conf.elements['filter-help']){
                new TooltipWidget({
                    "elements": tooltipConfiguration.filter,
                    "container": gridContainer.find('.filter-container'),
                    "view": getTooltipView(conf.elements['filter-help'])
                }).build();
            }

            //infotip for the header of the grid
            var gridColModel = gridTable.jqGrid("getGridParam", "colModel"), //grid model
                gridHeaders = gridTable[0].grid.headers, //grid header
                column, index;
            for (var i=0; i<gridConfModel.length; i++){ //original grid configuration
                column = gridConfModel[i];
                index = column.index; //index property for a column of the grid configuration
                var headerIndex;
                if (index){
                    for (var j=0; j<gridColModel.length; j++){
                        var colName = gridColModel[j];
                        if(colName['index'] === index){ //identify the column number
                            headerIndex = j;
                            break;
                        }
                    }
                    var gridHeader = gridHeaders[headerIndex]; //get the header properties by id
                    if (column['header-help']){
                        var headerContainer = gridHeader.el;
                        new TooltipWidget({
                            "elements": tooltipConfiguration.header,
                            "container": gridContainer.find(headerContainer),
                            "view": getTooltipView(column['header-help'])
                        }).build();
                    } else {
                        gridHeader.el.title = "";
                    }
                }
            }
        };

        /**
         * Adds tooltips to the rows of the Grid widget
         * @param {Object} $rowTable - table with elements that will be have tooltips added
         * @param {Object} originalRowData - original grid data as it was received from the API response
         */
        this.addContentTooltips = function ($rowTable, originalRowData){
            //standard tooltip
            new TooltipWidget({
                "elements": tooltipConfiguration.allCells,
                "container": $rowTable
            }).build();

            //more pill tooltip
            moreTooltip($rowTable, originalRowData);


            //adds tooltip for data-tooltip
            if (conf.cellTooltip) {
                cellTooltip($rowTable);
            }

        };

        /**
         * Adds tooltips to the row of the Grid widget
         * @param {Object} $rowTable - table with elements that will be have tooltips added
         * @param {Object} originalRowData - original grid data as it was received from the API response
         * @param {String} rowId - id of the row that requires a tooltip
         */
        this.addRowTooltips = function ($rowTable, originalRowData, tooltipRowId){
            var $tooltipRow = $rowTable.find('#' + tooltipRowId);

            //standard tooltip
            new TooltipWidget({
                "elements": tooltipConfiguration.allCells,
                "container": $tooltipRow
            }).build();

            //more pill tooltip
            moreTooltip($rowTable, originalRowData, $tooltipRow);

            //adds tooltip for data-tooltip
            if (conf.cellTooltip) {
                cellTooltip($rowTable, $tooltipRow);
            }
        };

        /**
         * Adds a tooltip to the grid's manual refresh control
         * @param {String} tooltipText - the text of the tooltip to be added.
         * @param {Object} refreshControl - The object representing the refresh control.
         */
        this.addRefreshTooltip = function(tooltipText, refreshControl) {
             new TooltipWidget({
                    "elements": {
                        "interactive": false,
                        "position": "right"
                    },
                    "container": refreshControl,
                    "view": tooltipText
             }).build();
        }

        var moreTooltip = function ($rowTable, originalRowData, $tooltipRow) {
            var columnConfiguration = conf.elements.columns, //grid model
                columnConfigurationHash = {};
            columnConfiguration.forEach(function(column){
                columnConfigurationHash[column.name] = column;
            });
            var moreTemplate = templates.moreTooltip;
            var $moreContent = $(render_template(moreTemplate));
            var $filterInput,
                $filterIcon;

            var tooltipFilterTimeout = 500;

            tooltipConfiguration.moreCellContent.functionBefore = function ($moreContainer, resume) {
                var moreData = $moreContainer.data();
                var rowId = moreData.rowid,
                    columnName = moreData.column;
                var $row = $rowTable.find("#"+rowId);
                var rowData = $rowTable.jqGrid('getRowData',rowId);
                var rawData = conf.elements.tree ? originalRowData[rowId] : $row.data('jqgrid.record_data');
                var tooltipFilter = new MoreTooltipFilter();
                var setTooltipData = function (data, dataConf){
                    var moreData=[];
                    data.forEach(function(item){
                        moreData.push({
                            key: dataConf ? item[dataConf.key] : item,
                            label: dataConf ? item[dataConf.label] : item
                        });
                    });
                    var searchFilter;
                    var showTooltip = function(tooltipData) {
                        $moreContent = $(render_template(moreTemplate,{items: tooltipData}));
                        $filterInput = $moreContent.find(".filter");
                        $filterIcon = $moreContent.find(".filter-icon");
                        if(searchFilter) {
                            $filterIcon.addClass("filter-clear");
                        }
                        else {
                            $filterIcon.addClass("search-icon");
                        }

                        $moreContent.off('click.fndtn.moreItem').on('click.fndtn.moreItem', '.more-item', function (e) {
                            var $item = $(this);
                            var item = {
                                key: $item.data().id,
                                label: $item.text()
                            }
                            if(dataConf && dataConf.clickHandler)
                                dataConf.clickHandler(item);
                            else
                                console.log(item + " selected");
                        });
                        resume();
                        $moreContainer.tooltipster('content', $moreContent);
                        bindFilters();
                    };


                    var bindFilters = function() {
                        $moreContent.find(".filter-clear").on('click', function(e){
                            searchFilter = ""                         ;
                            $filterInput.val("");
                            showTooltip(moreData);
                        });

                        $filterInput.on('keydown', function(e){
                            setTimeout(function(){
                                searchFilter = $filterInput.val();
                                var filteredTooltip = tooltipFilter.filter({data: moreData, filterString: searchFilter}); //TODO: Add remote filter callback in config
                                showTooltip(filteredTooltip);
                            }, tooltipFilterTimeout);
                        }).focus().val(searchFilter);
                    };

                    showTooltip(moreData);
                };

                //if not callback, then the default data in the cell is rendered
                if(columnConfigurationHash[columnName].collapseContent.moreTooltip) {
                    columnConfigurationHash[columnName].collapseContent.moreTooltip(rowData, rawData, setTooltipData)
                } else {
                    setTooltipData(rowData[columnName]);
                }
            };

            var $tooltipContainer = $tooltipRow || $rowTable;
            new TooltipWidget({
                "elements": tooltipConfiguration.moreCellContent,
                "container": $tooltipContainer.find('.moreTooltip'),
                "view": $moreContent
            }).build();
        };

        var cellTooltip = function ($rowTable, $tooltipRow) {
            var tableId = $rowTable.attr("id");
            var $tooltipContainer = $tooltipRow || $rowTable;

            tooltipConfiguration.dataTooltipContent.functionBefore = function ($tooltipContainer, resume){
                var $td = $tooltipContainer.closest('td');
                if ($td.length) {
                    var $row = $td.closest('tr');
                    var rowId = $row.attr('id');
                    var columnName = $td.attr("aria-describedby").substring(tableId.length+1);
                    var cellData = {
                        "columnName": columnName,
                        "rowId": rowId,
                        "cellId": $tooltipContainer.data('tooltip'),
                        "$cell": $td,
                        "rowData": $rowTable.jqGrid('getRowData', rowId),
                        "rawData": $row.data('jqgrid.record_data')
                    };
                    var renderTooltip = function (view, position){
                        resume();
                        $tooltipContainer.tooltipster('content', $('<span>').append(view));
                    };
                    conf.cellTooltip(cellData, renderTooltip);
                }
            };

            new TooltipWidget({
                "elements": tooltipConfiguration.dataTooltipContent,
                "container": $tooltipContainer.find('[data-tooltip]'),
                "view": "Loading..."
            }).build();
        };

    };

    return TooltipBuilder;
});