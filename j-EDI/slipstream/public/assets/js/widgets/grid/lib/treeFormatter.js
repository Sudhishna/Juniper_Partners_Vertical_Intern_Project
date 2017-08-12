/**
 * A module that formats a column for the selection of a row in the tree grid. The column is located in the same location as the on in the simple grid. User interaction is consistent with the grid selection model.
 *
 * @module TreeFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'widgets/grid/lib/gridTemplates'
],  /** @lends TreeFormatter */
    function(render_template, GridTemplates) {

    /**
     * TreeFormatter constructor
     *
     * @constructor
     * @class TreeFormatter - Formats a column in the tree grid to provide row column selection.
     *
     * @returns {Object} Current TreeFormatter's object: this
     */
    var TreeFormatter = function(){

        /**
         * Builds the TreeFormatter
         * @returns {Object} Current "this" of the class
         */

        var gridConf;
        var templates = new GridTemplates().getTemplates();
        /**
         * Builds the selection column configuration to be used in the tree grid.
         * @param {Object} conf - Grid configuration object
         * @inner
         */
        this.getSelectionColumn =  function (conf) {
            gridConf = conf;
            var selectAll = render_template(templates.treeAllCheckbox);
            var selectColum = {
                "index": "slipstreamgrid_select",
                "name": "slipstreamgrid_select",
                "label": selectAll,
                "formatter":formatTreeCheckbox,
                "unformat":unformatTreeCheckbox,
                "width": "25",
                "classes": 'tree_custom_checkbox',
                "search": false,
                "sortable": false,
                "resizable": false,
                "fixed": true
            };
            return selectColum;
        };

        /*
         * Defines the html element that will be used to select a row.
         * @param {String} cellvalue - value to be formatted
         * @param {Object} options - : object composed by the rowId and colModel, where rowId is the id of the row and colModel is the object of the properties for this column getted from colModel array of jqGrid
         * @param {Object} rowObject -  row data
         * @inner
         */
        var formatTreeCheckbox = function (cellvalue, options, rowObject) {
            var isLeaf = rowObject[gridConf.tree.leaf||'leaf'];
            var checkboxTemplate = gridConf.tree.parentSelect || isLeaf ? templates.treeCheckbox : templates.treeNoCheckbox;
            var checkbox = render_template(checkboxTemplate);
            return checkbox;
        };

        /*
         * Defines the value that will be returned after a cell is edited.
         * @param {String} cellvalue - value to be unformatted
         * @param {Object} options - : object composed by the rowId and colModel, where rowId is the id of the row and colModel is the object of the properties for this column getted from colModel array of jqGrid
         * @param {Object} cellobject -  cell object
         * @inner
         */
        var unformatTreeCheckbox = function (elem, options, cellobject) {
            return $(cellobject).find('input').is(':checked');
        };

    };

    return TreeFormatter;
});