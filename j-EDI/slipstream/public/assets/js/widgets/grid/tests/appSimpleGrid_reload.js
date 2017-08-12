/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'text!widgets/grid/tests/dataSample/application.json',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/view/applicationView',
    'widgets/overlay/overlayWidget',
    'mockjax'
], function(Backbone, GridWidget, configurationSample, applicationData, ZonePoliciesModel, ApplicationView, OverlayWidget, mockjax){
    applicationData = eval(applicationData);

    var GridView = Backbone.View.extend({
        initialize: function () {
            this.mockApiResponse();
            this.actionEvents = {
                createEvent: {
                    capabilities : ['CreatePolicy'],
                    name: "AddRow"
                },
                deleteEvent:{
                    capabilities : ['DeletePolicy'],
                    name: "DeleteRow"
                },
                reloadGrid:{
                    capabilities : ['CreatePolicy'],
                    name: "ReloadGrid"
                },
                resetReloadGrid: "resetReloadGrid"
            };
            this.bindGridEvents();
            this.render();
        },

        render: function () {
            this.grid = new GridWidget({
                container: this.el,
                elements: configurationSample.reloadGrid,
                actionEvents:this.actionEvents
            });
            this.grid.build();

            return this;
        },

        bindGridEvents: function () {
            var self = this;
            this.$el
                .bind(this.actionEvents.createEvent.name, function(e, addGridRow) {
                    console.log(addGridRow);
                    self.addRow(addGridRow);
                })
                .bind(this.actionEvents.deleteEvent.name, function(e, deletedGridRows) {
                    console.log(deletedGridRows);
                    self.deleteRow(deletedGridRows);
//                    self.grid.reloadGrid();  //handled by configuration
                })
                .bind(this.actionEvents.reloadGrid.name, function(e, selectedRows) {
                    console.log(self.actionEvents.reloadGrid.name + ": ");
                    console.log(selectedRows);
                    self.grid.reloadGrid();
                })
                .bind(this.actionEvents.resetReloadGrid, function(e, selectedRows) {
                    console.log(self.actionEvents.resetReloadGrid + ": ");
                    console.log(selectedRows);
                    self.grid.reloadGrid({
                        resetSelection: true
                    });
                    console.log("rows selected after reset selection:")
                    console.log(self.grid.getSelectedRows(true));
                });
        },

        addRow: function(addGridRow) {
            var self = this;
            var view = new ApplicationView({
                'model': new ZonePoliciesModel.application.collection(),
                'save': _.bind(self.save, self),
                'columnName': 'name',
                'close': _.bind(self.close, self)
            });

            this._overlay = new OverlayWidget({
                view: view,
                type: 'wide'
            });

            this._overlay.build();
        },

        save: function(column_name, data) {
            var target_row = 1;

            for (var i = 0; i < data.length; i++) {
                 var row = {}
                 row[column_name] = data[i];  
                 applicationData.push(row);
                 if (i == 0) {
                    target_row = applicationData.length;
                 }  
            }

            this.grid.reloadGrid({
                rowIndex: target_row,
                highlightRow: true, 
                afterReload: function(rowIndex, row) {
                    console.log("row index = ", rowIndex, ", row=", row);
                }
            });
        },

        close: function(columnName,e) {
            this._overlay.destroy();
            e.preventDefault();
        },

        deleteRow: function(deletedGridRows) {
            var deletedRows = deletedGridRows.deletedRows;
            if (deletedRows.length) {
                for (var i = 0; i < deletedRows.length; i++) {
                    var deletedRowName = deletedRows[i].name;
                    for (var j = 0 ; j < applicationData.length; j++) {
                        if (applicationData[j].name == deletedRowName) {
                            applicationData.splice(j, 1);
                            break;
                        }
                    }
                }
            }   
        },

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function(){
            var data = applicationData;
            $.mockjax({
                url: '/api/get-data',
                dataType: 'json',
                responseText: data,
                responseTime: 10
            });
        }
    });

    return GridView;
});