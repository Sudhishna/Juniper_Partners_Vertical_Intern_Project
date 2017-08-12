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
    'widgets/grid/tests/view/createPolicyView',
    'widgets/grid/tests/view/gridOverlayView',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'widgets/grid/tests/view/quickView',
    'mockjax'
], function(Backbone, GridWidget, gridConfiguration, ZonePoliciesAddView, GridOverlayView, ZonePoliciesModel, firewallPoliciesData, QuickView, mockjax){
    var GridView = Backbone.View.extend({

        events: {
            "click .cellLink": "openLink"
        },

        initialize: function () {
            this.mockApiResponse();
            this.actionEvents = {
                createEvent:"AddRow",
                updateEvent:"UpdateRow",
                deleteEvent:"DeleteRow",
                copyEvent:"CopyRow",
                pasteEvent:"PasteRow",
                statusEvent:"UpdateStatusRow",
                moveEvent:"MoveFirewallPolicies",
                quickViewEvent:"QuickViewRow",
                resetHitEvent:"ResetHitCount",
                disableHitEvent:"DisableHitCount",
                reloadGrid:"ReloadGrid",
                subMenu1:"SubMenu1",
                createMenu1:"createMenu1",
                testPublishGrid:"testPublishGrid",
                selectedEvent:"selectedEvent"
            };
            this.bindGridEvents();
            this.render();
        },

        render: function () {
            var isRowEditable = function (rowId, rawData, rowData){
                console.log(rawData);
                console.log(rowData);
                var rows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '190002-INS_to_Sircon_drop_em1'];
                if (~rows.indexOf(rowId))
                    return false;
                return true;
            };
            var onBeforeEdit = function (rowId, rawData, rowData){
                console.log(rawData);
                console.log(rowData);
                var rows = ['191002-LOT_-_VPN_Tunnell_-_Lottery_VPN_Tunnel_-_8_2_2007_-_KTS'];
                if (~rows.indexOf(rowId))
                    return false;
                return true;
            };
            var overlayGridConfiguration = _.extend(gridConfiguration.simpleGrid,{
                    "createRow": {
                        "showInline": true
                    },
                    "editRow": {
                        "showInline": true,
                        "isRowEditable": isRowEditable,
                        "onBeforeEdit": onBeforeEdit
                    },
                    "rowMaxElement": {
                        "collapse": 2,
                        "expand": 4,
                        "edit": 3 //applies only for inline editing
                    }
                }
            );
            gridConfiguration.simpleGrid.contextMenuStatusCallback = function (selectedRows, updateStatusSuccess, updateStatusError) {
//                if (~selectedRows.selectedRowIds.indexOf('183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent') || ~selectedRows.selectedRowIds.indexOf('190002-INS_to_Sircon_drop_em1')){
                if (~selectedRows.selectedRowIds.indexOf('183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent')){
                    updateStatusSuccess();
                } else {
                    updateStatusSuccess({
                        "edit": selectedRows.numberOfSelectedRows == 1 && selectedRows.isRowEnabled ? true : false,
                        "copy": selectedRows.numberOfSelectedRows > 2 ? true : false
                    });
                }
            };

            gridConfiguration.simpleGrid.showWidthAsPercentage = false;

            delete overlayGridConfiguration.actionButtons;
            delete overlayGridConfiguration.filter;
            this.assignColumnWidth(gridConfiguration.simpleGrid);

            this.grid = new GridWidget({
                container: this.el,
                elements: gridConfiguration.simpleGrid,
                actionEvents:this.actionEvents
            });
            this.grid.build();
            return this;
        },

        bindGridEvents: function () {
            var self = this;
            this.$el
                .bind(this.actionEvents.createEvent, function(e, addGridRow){
                    console.log(addGridRow);
//                    self.addRow(addGridRow);
                })
                .bind(this.actionEvents.updateEvent, function(e, updatedGridRow){
                    console.log(updatedGridRow);
//                    self.updateRow(updatedGridRow);
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
                .bind(this.actionEvents.quickViewEvent, function(e, quickViewRow){
                    console.log(self.actionEvents.quickViewEvent + ":");
                    console.log(quickViewRow);
                    new QuickView({
                        'rowData': quickViewRow.selectedRows[0]
                    }).render();
                })
                .bind(this.actionEvents.resetHitEvent, function(e, selectedRows){
                    console.log(self.actionEvents.resetHitEvent + ": ");
                    console.log(selectedRows);
                    self.grid.reloadGrid();
                })
                .bind(this.actionEvents.disableHitEvent, function(e, selectedRows){
                    console.log(self.actionEvents.disableHitEvent + ": ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.reloadGrid, function(e, selectedRows){
                    console.log(self.actionEvents.reloadGrid + ": ");
                    console.log(selectedRows);
                    self.grid.reloadGrid();
                })
                .bind(this.actionEvents.subMenu1, function(e, selectedRows){
                    console.log(self.actionEvents.subMenu1 + ": ");
                    console.log(selectedRows);
                    new GridOverlayView();
                })
                .bind(this.actionEvents.createMenu1, function(e, selectedRows){
                    console.log(self.actionEvents.createMenu1 + ": ");
                    console.log(selectedRows);
                    new GridOverlayView();
                })
              /*  .bind("gridRowBeforeEditMode", function(e, selectedRows){  //deprecated
                  console.log("gridRowOnEditMode: ");
                  console.log(selectedRows);
                  if(selectedRows.currentRowData.name === "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante"){
                    selectedRows.result = false;
                  }
                }) */
                .bind(this.actionEvents.testPublishGrid, function(e, selectedRows){
                    console.log(self.actionEvents.testPublishGrid + " Reload grid: ");
                    console.log(self.grid.getSelectedRows());
                    self.grid.reloadGrid();
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.selectedEvent, function(e, selectedRows){
                    console.log(self.actionEvents.selectedEvent + " : ");
                    console.log(selectedRows);
                })
                .bind("gridRowOnEditMode", function(e, selectedRows){
                    console.log("gridRowOnEditMode: ");
                    console.log(selectedRows);
                })
                .bind("gridOnRowSelection", function(e, selectedRows){
                    console.log(self.grid.getSelectedRows());
                    console.log("gridOnRowSelection: ");
                    console.log(selectedRows);
                }).bind('postValidation', function(e, isValid){
                    console.log("post validation when doing inline edit");
                });
        },

        addRow: function(addGridRow) {
            var self = this;
            var view = new ZonePoliciesAddView({
                'model': new ZonePoliciesModel.zone.model(),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'save': _.bind(self.save, self)
            });
        },

        updateRow: function(updateGridRow) {
            var self = this;
            var view = new ZonePoliciesAddView({
                'model': new ZonePoliciesModel.zone.model(updateGridRow.originalRow),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'save': _.bind(self.update, self)
            });
            self.originalRow = updateGridRow.originalRow;
        },

        save:  function(data) {
            this.grid.addRow(data);
//            this.grid.reloadGrid();
            console.log("Row added. Number of rows now: " + this.grid.getNumberOfRows());
        },

        update:  function(updatedRow) {
            this.grid.editRow(this.originalRow, updatedRow);
            console.log("Row updated");
        },

        /* method that handles the cell click for the Name column. it empties existing container and builds a new grid using existing data in the cell
         * when the grid is used in the framework context, a new intent could be created to replace existing grid with the new grid:
         * new Slipstream.SDK.Intent(action, data)
         * where data could contain the data collected in the data-cell property of the cell defined in the formatter function of the column
         */
        openLink: function(e){
            var linkValue = $(e.target).attr('data-cell');
            var minimumGridConfiguration = _.extend(gridConfiguration.smallGrid,{
                "title": "Grid for: " + linkValue
            });
            this.$el.empty();
            new GridWidget({
                container: this.el,
                elements: minimumGridConfiguration
            }).build();
        },

        assignColumnWidth: function (gridConfiguration){
            var columnWidth = {
                "name": 300,
                "from-zone-name": 100,
                "source-address": 200,
                "to-zone-name": 100,
                "destination-address": 200,
                "date":100,
                "application": 100,
                "application-services": 200,
                "action": 80
            };
            gridConfiguration.columns.forEach(function (column){
                column.width = columnWidth[column.name];
            });
        },

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function(){
            var data = firewallPoliciesData;
            $.mockjax({
                url: '/api/get-data',
                dataType: 'json',
                response: function(settings) {
                    console.log('parameters in the mockjack request: ' + settings.data);
                    if (typeof settings.data == 'string'){
                        var urlHash = {},
                            seg = settings.data.split('&');
                        for (var i=0;i<seg.length;i++) {
                            if (!seg[i]) { continue; }
                            var s = seg[i].split('=');
                            urlHash[s[0]] = s[1];
                        }
                        switch(urlHash['_search']){
                            case "PSP":
                                this.responseText = firewallPoliciesData.firewallPoliciesFiltered;
                                break;
                            default:
                                this.responseText = firewallPoliciesData.firewallPoliciesAll;
                        }
                    }
                    else {
                        this.responseText = firewallPoliciesData.firewallPoliciesAll;
                    }
                },
                responseTime: 10
            });
            $.mockjax({
                url: /^\/api\/data-sample\/client\/([a-zA-Z0-9\-\_]+)$/,
                urlParams: ["client"],
                response: function(settings) {
                    var client = settings.urlParams.client,
                        clients = ["test","test2","test3"];
                    this.responseText = "true";
                    if ($.inArray(client, clients) !== -1) {
                        this.responseText = "false";
                    }
                },
                responseTime: 100
            });
        }
    });

    return GridView;
});