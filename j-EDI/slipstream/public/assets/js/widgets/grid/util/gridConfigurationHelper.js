/**
 * A module contains the helper methods for the grid configuration
 *
 * @module GridConfigurationHelper
 * @author Vidushi Gupta<vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([], /** @lends GridConfigurationHelper */
function () {

    /**
     * GridConfigurationHelper constructor
     *
     * @constructor
     * @class GridConfigurationHelper - Builds a Grid widget from a configuration object.
     * @param {Object} conf - grid configuration object
     * @returns {Object} Current GridConfigurationHelper's object: this
     */
    var GridConfigurationHelper = function (conf) {

        var searchCellValueHash = {};
        /**
         * creates a hash of all the column based on column index as key & column details as value object
         * @returns {Object} Object with hash of column index with column details values
         */
        this.buildColumnConfigurationHash = function () {
            // create the hash for the columns
            var columnDetails = {};
            $.each(conf.elements.columns, function (index, column) {
                columnDetails[column.index] = column;
            });
            return columnDetails;
        };

        /**
         * creates a hash for the values configuration of searchCell from specific column config
         * @param {Object} searchCell - searchCell configuration for specific column
         * @returns {Object} Object with hash of label & value
         */
        this.buildColumnSearchCellHash = function (key, searchCell) {
            // create the hash for the columns
            if (_.isEmpty(searchCellValueHash) || typeof(searchCellValueHash[key]) == "undefined") {
                if (searchCell.type == "dropdown" && _.isArray(searchCell.values)) {
                        var labelValueHash = {};
                        $.each(searchCell.values, function (index, valueObject) {
                            labelValueHash[valueObject.label] = valueObject.value;
                        });
                        searchCellValueHash[key] = labelValueHash;
                }
            }

            return searchCellValueHash;
        };
    };

    return GridConfigurationHelper;
});