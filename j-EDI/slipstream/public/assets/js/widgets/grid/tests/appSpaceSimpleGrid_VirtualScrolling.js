/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'mockjax'
], function(Backbone, GridWidget, configurationSample, mockjax){
    var GridView = Backbone.View.extend({

        initialize: function () {
            this.actionEvents = {
                createEvent:"AddRow",
                updateEvent:"UpdateRow",
                deleteEvent:"DeleteRow",
                copyEvent:"CopyRow",
                pasteEvent:"PasteRow",
                statusEvent:"UpdateStatusRow",
                moveEvent:"MoveFirewallPolicies",
                getAllRowsEvent:"GetAllRows",
                getSelectedRowsEvent:"GetSelectedRows",
                toggleRowsEvent:"ToggleRows",
                reloadGridEvent:"ReloadGrid",
                reloadGridEvent20:"ReloadGrid20",
                clearAllEvent: "ClearAll",
                resetReloadGrid: "resetReloadGrid"
            };
            this.bindGridEvents();
            this.getAllRowIds();
            this.render();
        },

        render: function () {
            this.gridWidget = new GridWidget({
                container: this.el,
                elements: configurationSample.sdGrid,
                actionEvents:this.actionEvents
            });
            this.gridWidget.build();

            return this;
        },
        bindGridEvents: function () {
            var self = this;
            this.$el
                .bind(this.actionEvents.createEvent, function(e, addGridRow){
                    console.log(addGridRow);
                })
                .bind(this.actionEvents.updateEvent, function(e, updatedGridRow){
                    console.log(updatedGridRow);
                })
                .bind(this.actionEvents.deleteEvent, function(e, deletedGridRows){
                    console.log(deletedGridRows);
                })
                .bind(this.actionEvents.copyEvent, function(e, copiedGridRows){
                    console.log(copiedGridRows);
                })
                .bind(this.actionEvents.pasteEvent, function(e, pastedGridRow){
                    console.log(pastedGridRow);
                })
                .bind(this.actionEvents.statusEvent, function(e, updatedGridRow){
                    console.log(updatedGridRow);
                })
                .bind(this.actionEvents.moveEvent, function(e, movedGridRow){
                    console.log(movedGridRow);
                })
                .bind(this.actionEvents.getAllRowsEvent, function(e, selectedRows){
                    console.log(self.actionEvents.getAllRowsEvent + ": ");
                    console.log(selectedRows);
                    console.log(self.gridWidget.getAllVisibleRows());
                })
                .bind(this.actionEvents.getSelectedRowsEvent, function(e, selectedRows){
                    console.log(self.actionEvents.getSelectedRowsEvent + ": ");
                    console.log(selectedRows);
                    console.log(self.gridWidget.getSelectedRows());
                })
                .bind(this.actionEvents.toggleRowsEvent, function(e, selectedRows){
                    console.log(selectedRows);
                    var toggleRowIds = ["163877", "163879","164537","164538","164539","164540","164541"];
                    console.log(self.actionEvents.toggleRowsEvent + ": " + toggleRowIds);
//                    self.gridWidget.toggleRowSelection(toggleRowIds, 'selected');
//                    self.gridWidget.toggleRowSelection(toggleRowIds);
                    self.gridWidget.toggleRowSelection(self.allRowIds);
                    console.log(self.gridWidget.getSelectedRows());
                })
                .bind(this.actionEvents.reloadGridEvent, function(e){
                    console.log(self.actionEvents.reloadGridEvent);
                    self.gridWidget.reloadGrid();
                })
                .bind(this.actionEvents.reloadGridEvent20, function(e){
                    console.log(self.actionEvents.reloadGridEvent);
                    self.gridWidget.reloadGrid({
                        "numberOfRows": 20
                    });
                })
                .bind(this.actionEvents.clearAllEvent, function(e, previousSelectedRows){
                    console.log(previousSelectedRows);
                    console.log(self.gridWidget.getSelectedRows(true));
                })
                .bind(this.actionEvents.resetReloadGrid, function(e, selectedRows) {
                    console.log(self.actionEvents.resetReloadGrid + ": ");
                    console.log(selectedRows);
                    self.gridWidget.reloadGrid({
                        resetSelection: true
                    });
                    console.log("rows selected after reset selection:")
                    console.log(self.gridWidget.getSelectedRows(true));
                });
        },

        getAllRowIds: function () {
            var self = this;
            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/grid/tests/dataSample/allSDServicesIds.json',
                success: function(data) {
                    self.allRowIds = data;
                },
                error: function() {
                    console.log("Getting all row ids in the grid FAILED.");
                }
            });
        }

    });

    return GridView;
});