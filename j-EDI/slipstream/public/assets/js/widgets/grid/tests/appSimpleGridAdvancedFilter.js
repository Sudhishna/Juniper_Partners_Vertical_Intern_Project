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
    'widgets/grid/conf/configurationSampleAdvancedFilter',
    'widgets/grid/tests/view/createPolicyView',
    'widgets/grid/tests/view/gridOverlayView',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'widgets/grid/tests/view/quickView',
    'mockjax'
], function(Backbone, GridWidget, configurationSample, ZonePoliciesAddView, GridOverlayView, ZonePoliciesModel, firewallPoliciesData, QuickView, mockjax){
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
                printGrid:"printGrid",
                exportSubMenu3:"exportSubMenu3",
                reloadGrid:"ReloadGrid",
                reloadGridNewRowNumber:"reloadGridNewRowNumber",
                subMenu1:"SubMenu1",
                subMenu2:"SubMenu2",
                createMenu1:"createMenu1",
                testPublishGrid:"testPublishGrid",
                selectedEvent:"selectedEvent",
                loadFilters:"loadFilters",
                saveFilter:"saveFilter"
            };
            this.bindGridEvents();
            this.render();
        },

        render: function () {
            this.gridWidget = new GridWidget({
                container: this.el,
                elements: configurationSample.simpleGridAdvancedFilter,
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
                    self.addRow(addGridRow);
                })
                .bind(this.actionEvents.updateEvent, function(e, updatedGridRow){
                    console.log(updatedGridRow);
                    // self.updateRow(updatedGridRow);
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
                    self.gridWidget.reloadGrid();
                })
                .bind(this.actionEvents.disableHitEvent, function(e, selectedRows){
                    console.log(self.actionEvents.disableHitEvent + ": ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.reloadGrid, function(e, selectedRows){
                    console.log(self.actionEvents.reloadGrid + ": ");
                    console.log(selectedRows);
                    self.gridWidget.reloadGrid();
                })
                .bind(this.actionEvents.reloadGridNewRowNumber, function(e, selectedRows){
                    console.log(self.actionEvents.reloadGridNewRowNumber + ": ");
                    console.log(selectedRows);
                    self.gridWidget.reloadGrid({
                        "numberOfRows": 10
                    });
                })
                .bind(this.actionEvents.subMenu1, function(e, selectedRows){
                    console.log(self.actionEvents.subMenu1 + ": ");
                    console.log(selectedRows);
                    new GridOverlayView();
                })
                .bind(this.actionEvents.subMenu2, function(e, selectedRows){
                    console.log(self.actionEvents.subMenu2 + ": ");
                    console.log(selectedRows);
                    self.gridWidget.addRow(firewallPoliciesData.oneRow);
                })
                .bind(this.actionEvents.createMenu1, function(e, selectedRows){
                    console.log(self.actionEvents.createMenu1 + ": ");
                    console.log(selectedRows);
                    new GridOverlayView();
                })
                .bind(this.actionEvents.testPublishGrid, function(e, selectedRows){
                    console.log(self.actionEvents.testPublishGrid + " Reload grid: ");
                    console.log(self.gridWidget.getSelectedRows());
                    self.gridWidget.reloadGrid();
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.exportSubMenu3, function(e, selectedRows){
                    console.log(self.actionEvents.exportSubMenu3 + " Reload grid: ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.printGrid, function(e, selectedRows){
                    console.log(self.actionEvents.printGrid + " Reload grid: ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.selectedEvent, function(e, selectedRows){
//                    console.log(self.actionEvents.selectedEvent + " : ");
//                    console.log(selectedRows);
                })
                .bind(this.actionEvents.loadFilters, function(e, selectedRows){
                    console.log(self.actionEvents.loadFilters + " : ");
                    self.gridWidget.getSearchWidgetInstance().addTokens(['123.43.5.3','OR','ManagedStatus = InSync, OutSync','AND','name = SRX, MX']);
                })
                .bind(this.actionEvents.saveFilter, function(e, selectedRows){
                    console.log(self.actionEvents.saveFilter + " : ");
                    console.log(self.gridWidget.getSearchWidgetInstance().getAllTokens());
                })
                .bind("gridRowOnEditMode", function(e, selectedRows){
                    console.log("gridRowOnEditMode: ");
                    console.log(selectedRows);
                })
                .bind("gridOnRowSelection", function(e, selectedRows){
                    console.log(self.gridWidget.getSelectedRows());
                    console.log("gridOnRowSelection: ");
                    console.log(selectedRows);
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
            var minimumGridConfiguration = _.extend(configurationSample.smallGrid,{
                "title": "Grid for: " + linkValue
            });
            this.$el.empty();
            new GridWidget({
                container: this.el,
                elements: minimumGridConfiguration
            }).build();
        },

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function(){
            var data = firewallPoliciesData;
            $.mockjax({
                url: '/api/get-data',
                dataType: 'json',
                type: 'POST',
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