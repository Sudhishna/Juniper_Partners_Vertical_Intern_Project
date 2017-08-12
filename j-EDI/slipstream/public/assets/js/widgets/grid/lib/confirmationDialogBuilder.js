/**
 * A module that builds a confirmation dialog after a user selects an action like delete a row
 *
 * @module ConfirmationDialogBuilder
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'widgets/confirmationDialog/confirmationDialogWidget',
    'widgets/grid/lib/dialogFormatter'
],  /** @lends ConfirmationDialogBuilder */
    function(ConfirmationDialogWidget, DialogFormatter) {

    /**
     * ConfirmationDialogBuilder constructor
     *
     * @constructor
     * @class ConfirmationDialogBuilder - Builds a confirmation dialog
     *
     * @returns {Object} Current ConfirmationDialogBuilder's object: this
     */
    var ConfirmationDialogBuilder = function(conf){ //grid: conf.elements

        /**
         * Builds the ConfirmationDialogBuilder
         * @returns {Object} Current "this" of the class
         */

        var confirmationDialogs = function () {
            var confirmationDialog = new DialogFormatter().getConfirmationDialogs();
            if (conf.confirmationDialog)
                confirmationDialog = new DialogFormatter(conf.confirmationDialog).getConfirmationDialogs();
            return confirmationDialog;
        }();

        /**
         * Opens a Confirmation Dialog to confirm the deletion of rows
         * @param {Object} selectedRows - Object with properties like the number of selected rows, the row data, etc
         * @param {Function} deleteRows - Callback that will be executed when the user confirms row deletion
         * @param {Function} reloadGrid - Callback that will be invoked if the grid requires auto refresh of the grid
         */
        this.deleteRow = function (selectedRows, deleteRows, reloadGrid){
            var confirmationDialog;

            var closeDialog = function() {
                confirmationDialog.destroy();
            };
            var confirmDeletion = function() {
                if (conf.deleteRow  && typeof(conf.deleteRow.onDelete) == 'function'){
                    onDelete(conf.deleteRow.onDelete, selectedRows, deleteRows, reloadGrid);
                }  else if (conf.deleteRow && conf.deleteRow.autoRefresh) {
                    deleteRows();
                    reloadGrid();
                } else {
                    deleteRows();
                }
                closeDialog();
            };

            //gets the configuration of the confirmation dialog from the base grid configuration dialog
            var confirmationDialogConfiguration = _.extend({
                "yesButtonCallback": confirmDeletion,
                "noButtonCallback": closeDialog
            }, confirmationDialogs['delete']);

            //overwrites default delete message if it is defined in the grid configuration otherwise, it uses the default grid confirmation (updates it when it's more than one row)
            if (conf.deleteRow && conf.deleteRow.message) {
                confirmationDialogConfiguration.question = conf.deleteRow.message (selectedRows);
            } else if (selectedRows.numberOfSelectedRows > 1) {
                confirmationDialogConfiguration.question = "Delete the " + selectedRows.numberOfSelectedRows  + " selected items?";
            }

            confirmationDialog = new ConfirmationDialogWidget(confirmationDialogConfiguration);
            confirmationDialog.build();
        };

        /**
         * Delete rows by using a defer promise which allows to sync the response of a callback with the deletion of the rows on the grid
         * @param {Function} callback that allows users of the grid to perform some operations like calling the REST API that will delete the rows in the backend
         * @param {Object} selectedRows - Object with properties like the number of selected rows, the row data, etc
         * @param {Function} deleteRows - Callback that will be executed when the user confirms row deletion
         * @param {Function} reloadGrid - Callback that will be invoked if the grid requires auto refresh of the grid
         * @inner
         */
        var onDelete = function(deleteRowsCallback, selectedRows, deleteRows, reloadGrid) {
            var getAllRowIdsPromise = function () {
                var deferred = $.Deferred();
                deleteRowsCallback(
                    selectedRows,
                    function () {
                        deferred.resolve();
                    },
                    function (errorMessage) {
                        deferred.reject(errorMessage);
                    }
                );
                return deferred.promise();
            };
            var promise = getAllRowIdsPromise();
            $.when(promise)
                .done(function () {
                    deleteRows();
                    if (conf.deleteRow.autoRefresh) {
                        reloadGrid();
                    }
                })
                .fail(function (errorMessage) {
                    console.log(errorMessage);
                });
        };

    };

    return ConfirmationDialogBuilder;
});