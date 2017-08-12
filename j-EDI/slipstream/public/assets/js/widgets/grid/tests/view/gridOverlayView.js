/**
 * A view that uses a configuration object to render a form widget on a overlay to show the usage of tab on a form
 *
 * @module FormOverlayView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'widgets/overlay/overlayWidget'
], function(Backbone, GridWidget, gridConfiguration, OverlayWidget){
    var FormOverlayView = Backbone.View.extend({

        events: {
            'click #add_policy_save': 'addPolicy',
            'click #add_policy_cancel': 'closePolicy'
        },

        initialize: function (options){
            this.actionEvents = {
                createEvent:"AddRow",
                updateEvent:"UpdateRow",
                deleteEvent:"DeleteFirewallPolicies",
                toggleSelectedRow:"toggleSelectedRow"
            };
            this.bindGridEvents();
            this.overlay = new OverlayWidget({
                view: this,
                type: 'large',
                okButton: true,
                showScrollbar: true
            });
            this.overlay.build();
        },

        render: function () {
            //adjust data to show a simple empty grid with CRUD operations
            var overlayGridConfiguration = _.extend(gridConfiguration.simpleGrid,{
//                    "url": "/assets/js/widgets/grid/tests/dataSample/zonePoliciesEmpty.json",
                    "url": "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOnePage.json",
                    "jsonRoot": "policy",
                    "jsonRecords": function(data) {
                        return data['junos:total'];
                    },
                    "showWidthAsPercentage": false,
                    "createRow": {
                        "showInline": true
                    },
                    "editRow": {
                        "showInline": true
                    },
                    "contextMenu": {
                        "create": "Create",
                        "edit": "Edit Row",
                        "delete": "Delete Row"
                            }
                        }
            );
            delete overlayGridConfiguration.actionButtons;
//            delete overlayGridConfiguration.filter;

            this.grid = new GridWidget({
                container: this.el,
//                elements: overlayGridConfiguration, //used to test an empty table
                elements: gridConfiguration.simpleGrid, //used to test a populated table
                actionEvents:this.actionEvents,
                cellOverlayViews:this.cellOverlayViews
            });
            this.grid.build();
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
                .bind(this.actionEvents.toggleSelectedRow, function(e, selectedRows){
                    console.log(self.actionEvents.toggleSelectedRow + ": ");
                    console.log(selectedRows);
                    self.grid.toggleRowSelection(selectedRows.selectedRowIds);
                })
                .bind("gridOnRowSelection", function(e, selectedRows){
                    console.log(self.grid.getSelectedRows());
                    console.log("gridOnRowSelection: ");
                    console.log(selectedRows);
                });
        },

        addPolicy: function (e){
            this.closePolicy(e);
        },

        closePolicy: function (e){
            this.overlay.destroy();
            e.preventDefault();
            e.stopPropagation();
        }

    });

    return FormOverlayView;
});