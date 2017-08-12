/**
 * A module that formats the column action in the grid. The column is located next to selection and expand/collapse columns.
 *
 * @module ColumnActionFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'widgets/grid/lib/gridTemplates'
],  /** @lends ColumnActionFormatter */
    function(render_template, GridTemplates) {

    /**
     * ColumnActionFormatter constructor
     *
     * @constructor
     * @class ColumnActionFormatter - Formats a column in the tree grid to provide a column action to include a quick lunch of the quick view.
     *
     * @returns {Object} Current ColumnActionFormatter's object: this
     */
    var ColumnActionFormatter = function(){

        /**
         * Builds the ColumnActionFormatter
         * @returns {Object} Current "this" of the class
         */

        var gridConf;
        var templates = new GridTemplates().getTemplates();

        /**
         * Builds the selection column configuration to be used in the column action of the grid.
         * @param {Object} conf - Grid configuration object
         * @inner
         */
        this.getSelectionColumn =  function (conf) {
            gridConf = conf;
            var selectColum = {
                "index": "slipstreamgrid_leftAction",
                "name": "slipstreamgrid_leftAction",
                "label": "",
                "formatter":formatLeftColumnAction,
                "unformat":unformatLeftColumnAction,
                "width": 30,
                "fixed": true,
                "alignment": "left",
                "classes": 'left_action_column',
                "search": false,
                "resizable": false,
                "sortable": false
            };
            return selectColum;
        };

        /*
         * Defines the html element that will be used to include the column action for the quick view button.
         * @param {String} cellvalue - value to be formatted
         * @param {Object} options - : object composed by the rowId and colModel, where rowId is the id of the row and colModel is the object of the properties for this column getted from colModel array of jqGrid
         * @param {Object} rowObject -  row data
         * @inner
         */
        var formatLeftColumnAction = function (cellvalue, options, rowObject) {
            var leftColumnAction = render_template(templates.columnAction);
            return leftColumnAction;
        };

        /*
         * Defines the value that will be returned after a cell is edited.
         * @param {String} cellvalue - value to be unformatted
         * @param {Object} options - : object composed by the rowId and colModel, where rowId is the id of the row and colModel is the object of the properties for this column getted from colModel array of jqGrid
         * @param {Object} cellobject -  cell object
         * @inner
         */
        var unformatLeftColumnAction = function (elem, options, cellobject) {
            return "";
        };

    };

    return ColumnActionFormatter;
});