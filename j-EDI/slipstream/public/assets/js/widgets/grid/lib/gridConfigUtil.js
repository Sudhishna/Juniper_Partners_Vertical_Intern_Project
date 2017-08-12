/**
 * A util module that provides helper methods to facilitate the reading and writing of Grid configuration of the Grid Widget
 * The grid calls the onConfigUpdate callback when one of the following action has happened:
 * 1. The width of a column has been expanded or collapsed (event: slipstreamGrid.updateConf:columns is triggered)
 * 2. The order of the columns has been modified (event: slipstreamGrid.updateConf:columns is triggered)
 * 3. A column has been hidden or showed (event: slipstreamGrid.updateConf:columns is triggered)
 * 4. A column has been sort (event: slipstreamGrid.updateConf:sort is triggered)
 * 5. A token that filters the grid has been added or deleted (event: slipstreamGrid.updateConf:search is triggered)
 * The implementation of the onConfigUpdate callback could save the user preferences passed as a parameter of the callback.
 *
 *
 * @module GridConfigUtil
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(['underscore'],  /** @lends GridConfigUtil */
    function(_) {
    /**
     * GridConfigUtil constructor
     *
     * @constructor
     * @class GridConfigUtil
     *
     * @returns {Object} Current GridConfigUtil's object: this
     */
    var GridConfigUtil = function(conf) {
        var gridTable;

        // Help function to produce an key based index of all the object in the array of object passed in.
        var indexBy = function(arrayOfObjects, indexByKey) {
            var index = {};
            for ( var i = 0; arrayOfObjects && i < arrayOfObjects.length; i++ ) {
                var item = arrayOfObjects[i];
                var key = item[indexByKey];
                index[key] = item;
            }
            return index;
        };

        this.init = function (gridTableRef) {
            var clonedConfig = _.extend({}, conf);
            gridTable = gridTableRef;
            gridTable
                .bind("slipstreamGrid.updateConf:columns", function () {
                     if(conf.onConfigUpdate && typeof(conf.onConfigUpdate) === "function") {
                        var indexedColumns = indexBy(conf.elements.columns, 'name'),
                            columns = getColumns(),
                            mergedColumns = [];

                        for (var i = 0; i < columns.length; i++) {
                            var item = columns[i],
                                origColumnConf = indexedColumns[item['name']];

                            if (origColumnConf) {
                                var col = _.extend({}, origColumnConf);

                                if (item.width) {
                                    col.width = item.width;
                                }
                                if (item.hidden === false || item.hidden === true) {
                                    col.hidden = item.hidden;
                                }

                                mergedColumns.push(col);
                            }
                        }
                        clonedConfig.elements.columns = mergedColumns;

                        delete clonedConfig['container'];
                        delete clonedConfig['onConfigUpdate'];
                        conf.onConfigUpdate(clonedConfig);
                    }
                })
                .bind("slipstreamGrid.updateConf:search", function (e, searchObj) {
                    if(conf.onConfigUpdate && typeof(conf.onConfigUpdate) === "function") {
                        clonedConfig.search = searchObj["tokens"];
                        conf.onConfigUpdate(clonedConfig);
                    }
                })
                .bind("slipstreamGrid.updateConf:sort", function (e, sortObj) {
                    if(conf.onConfigUpdate && typeof(conf.onConfigUpdate) === "function") {
                        clonedConfig.elements.sorting = sortObj["config"];
                        conf.onConfigUpdate(clonedConfig);
                    }
                });
        };

        this.destroy = function () {
            gridTable.unbind("slipstreamGrid.updateConf:columns");
            gridTable.unbind("slipstreamGrid.updateConf:search");
            gridTable.unbind("slipstreamGrid.updateConf:sort");
        };

         /**
         * Get all available rows of a grid
         * @returns {Object} All selected rows
         */
        var getColumns = function (){
            if ( gridTable ) {
                var colArray = gridTable.getGridParam('colModel'),
                    //reserved columns are added by the grid library or the grid widget but that are not part of the original grid configuration
                    reservedColumns = ['cb', 'slipstreamgrid_more', 'slipstreamgrid_leftAction', 'slipstreamgrid_select'];
                var trimmedColArray = _.filter(colArray, function(item){
                    // filter out the checkbox col used for row selection and other decl. based cols.
                    return !(~reservedColumns.indexOf(item.name));
                });
                return trimmedColArray;
            }
        };
    };

    return GridConfigUtil;
});