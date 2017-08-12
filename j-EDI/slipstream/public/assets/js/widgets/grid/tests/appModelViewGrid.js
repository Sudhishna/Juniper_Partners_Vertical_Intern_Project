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
    'widgets/grid/tests/view/sourceAddressView',
    'widgets/grid/tests/view/descriptionView',
    'widgets/grid/tests/view/createPolicyView',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'mockjax'
], function(Backbone, GridWidget, configurationSample, SourceAddressView, DescriptionView, ZonePoliciesAddView, ZonePoliciesModel, firewallPoliciesData, mockjax){
    var GridView = Backbone.View.extend({

        events: {
            "click .cellLink": "openLink"
        },

        initialize: function () {
//            this.mockApiResponse();
            this.policyCollection = new ZonePoliciesModel.policy.collection();
            this.sortedPolicyCollection = new ZonePoliciesModel.sortedPolicy.collection();
            this.filteredPolicyCollection = new ZonePoliciesModel.filteredPolicy.collection();
            this.addressCollection = new ZonePoliciesModel.address.collection();

            this.actionEvents = {
                createEvent:"AddRow",
                updateEvent:"UpdateRow",
                deleteEvent:"DeleteRow",
                copyEvent:"CopyRow",
                pasteEvent:"PasteRow",
                statusEvent:"UpdateStatusRow",
                moveEvent:"MoveFirewallPolicies",
                reloadData:"ReloadData",
                updateActionStatusOff:"updateActionStatusOff",
                updateActionStatusOn:"updateActionStatusOn",
                addEditProgrammatically:"EditProgrammatically",
                removeEditProgrammatically:"RemoveEditProgrammatically",
                toggleRowSelection: "ToggleRowSelection"
            };
            this.bindGridEvents();
            this.cellOverlayViews = this.createViews();
            this.render();
        },

        render: function () {
            var self = this;
            _.extend(configurationSample.modelViewGrid.filter, {
                searchResult: function (tokens, renderGridData) {
                    self.filteredPolicyCollection.fetch({
                        success: function(collection) {
                            var policies = collection.models[0].get("policy");
                            renderGridData(policies);
                        },
                        failure: function(){
                            console.log("The grid data couldn't be loaded.");
                        }
                    });
                }
            });

            _.extend(configurationSample.modelViewGrid, {
                customSortCallback: function(columnIndex, columnName, sortOrder){
                    console.log('Sorting grid in ' + sortOrder + ' order on ' + columnName);
                    var policies;
                    if(sortOrder === 'asc') {
                        self.sortedPolicyCollection.fetch({
                            success: function(collection) {
                                policies = collection.models[0].get("policy");
                                self.addSortedGridData(policies);
                            },
                            failure: function(){
                                console.log("The grid data couldn't be loaded.");
                            }
                        });
                    }
                    else {
                        self.policyCollection.fetch({
                            success: function(collection) {
                                var policies = collection.models[0].get("policy");
                                self.addSortedGridData(policies);
                            },
                            failure: function(){
                                console.log("The grid data couldn't be loaded.");
                            }
                        });
                    }
                }
            });

            var self = this;
            configurationSample.modelViewGrid.footer.getTotalRows = function() {
                if(self.policyCollection.models.length > 0) {
                    var model = self.policyCollection.models[0];
                    return model.get('policy').length;
                }
                return 0;
            };
            this.gridWidget = new GridWidget({
                container: this.el,
                elements: configurationSample.modelViewGrid,
                actionEvents:this.actionEvents,
                cellOverlayViews:this.cellOverlayViews
            });
            this.gridWidget.build();
            this.gridWidget.updateActionStatus({
                "create": false
            });
            this.addGridData();
            return this;
        },

        createViews : function () { //should implement setCellValues
            var self = this;
            var sourceAddressView = new SourceAddressView({
                'model': self.addressCollection,
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'source-address'
            });
            var destinationAddressView = new SourceAddressView({
                'model': self.addressCollection,
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'destination-address'
            });
            var descriptionView = new DescriptionView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'description'
            });
            var cellViews = {
                'source-address' : sourceAddressView,
                'destination-address' : destinationAddressView,
                'description' : descriptionView
            };
            return cellViews;
        },

        addGridData: function () {
            var self = this;
            this.policyCollection.fetch({
                success: function(collection) {
                    var policies = collection.models[0].get("policy");
                    self.gridWidget.addPageRows(policies, {numberOfPage: 1, totalPages: 1, totalRecords: policies.length});
                },
                failure: function(){
                    console.log("The grid data couldn't be loaded.");
                }
            });
        },

        addSortedGridData: function (data) {
            var self = this;
            self.gridWidget.reloadGridData(data,'',true);
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
                .bind(this.actionEvents.addEditProgrammatically, function(e, selectedRow){
                    var rows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent'];
                    self.gridWidget.addEditModeOnRow(rows[0]);
                })
                .bind(this.actionEvents.removeEditProgrammatically, function(e, selectedRow){
                    console.log(selectedRow);
//                    var rows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent'];
                    var removeEditOutput =self.gridWidget.removeEditModeOnRow(); //no id is required
                    console.log(removeEditOutput);
                })
                .bind(this.actionEvents.updateActionStatusOff, function(e, selectedRows){
                    self.gridWidget.updateActionStatus({
                        "create": false,
                        "testCloseGrid": true
                    });
                })
                .bind(this.actionEvents.updateActionStatusOn, function(e, selectedRows){
                    self.gridWidget.updateActionStatus({
                        "create": true,
                        "testCloseGrid": false
                    });
                })
                .bind(this.actionEvents.reloadData, function(e, selectedRows){
                    console.log(self.actionEvents.reloadData + ": ");
                    console.log(selectedRows);
                    self.gridWidget.reloadGridData(self.policyCollection.models[0].get("policy"), {numberOfPage: 1});
                })
                .bind(this.actionEvents.toggleRowSelection, function(e, selectedRows){
                    var rows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent','184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante'];
                    console.log(self.actionEvents.toggleRowSelection + "for: " + rows);
                    console.log(self.gridWidget.getSelectedRows());
                    self.gridWidget.toggleRowSelection(rows);
                    console.log(self.gridWidget.getSelectedRows());
                })
                .bind("gridRowOnEditMode", function(e, editModeRow){
                    console.log(editModeRow);
                })
                .bind("gridOnPageRequest", function(e, pageRequest){
                    console.log(pageRequest);
                    self.addGridData();
                    return false;
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
            this.gridWidget.addRow(data);
//            this.gridWidget.reloadGrid();
            console.log("Row added. Number of rows now: " + this.gridWidget.getNumberOfRows());
        },

        update:  function(updatedRow) {
            this.gridWidget.editRow(this.originalRow, updatedRow);
            console.log("Row updated");
        },

        save:  function(columnName, data) {
            this.$el.trigger('updateCellOverlayView',{
                'columnName':columnName,
                'cellData':data
            });
        },

        close:  function(columnName,e) {
            this.$el.trigger('closeCellOverlayView', columnName);
            e.preventDefault();
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
        }

    });

    return GridView;
});