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
                reloadGridEvent:"ReloadGrid"
            };
            this.bindGridEvents();
            this.render();
        },

        render: function () {
            this.gridWidget = new GridWidget({
                container: this.el,
                elements: configurationSample.groupGrid,
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
                    self.gridWidget.getSelectedRows();
                })
                .bind(this.actionEvents.reloadGridEvent, function(e){
                    console.log(self.actionEvents.reloadGridEvent);
                    self.gridWidget.reloadGrid();
                });
        }

    });

    return GridView;
});