/**
 * A view that uses a configuration object to render a grid widget for the tree view with over 1K rows in DOM
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSampleTree',
    'widgets/grid/tests/dataSample/firewallPoliciesTreeData',
    'mockjax'
], function(Backbone, GridWidget, configurationSample, firewallPoliciesData, mockjax){
    var GridView = Backbone.View.extend({

       initialize: function () {
//            this.mockApiResponse();
            this.actionEvents = {
                updateEvent:"UpdateRow",
                deleteEvent:"DeleteRow",
                createEvent:"AddFirewallPolicies",
                selectRowEvent:"selectRowEvent",
                getAllRowsEvent:"GetAllRows",
                getSelectedRowsEvent:"GetSelectedRows",
                quickViewEvent:"QuickViewRow",
                clearAllEvent: "ClearAll"
            };
            this.bindGridEvents();
            this.render();
        },

        render: function () {
            this.gridWidget = new GridWidget({
                container: this.el,
                elements: configurationSample.treeGridManyRows,
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
                .bind("gridOnRowSelection", function(e, selectedRows){
//                    console.log("gridOnRowSelection: ");
//                    console.log(selectedRows);
                })
                .bind(this.actionEvents.getAllRowsEvent, function(e, selectedRows){
                    console.log(self.actionEvents.getAllRowsEvent + ": ");
                    console.log(selectedRows);
                    console.log(self.gridWidget.getAllVisibleRows());
                })
                .bind(this.actionEvents.clearAllEvent, function(e, previousSelectedRows){
                    console.log(previousSelectedRows);
                    console.log(self.gridWidget.getSelectedRows(true));
                })
                .bind(this.actionEvents.selectRowEvent, function(e, selectedRows){
                    console.log(selectedRows);
                    self.gridWidget.toggleRowSelection("25");
//                    self.gridWidget.toggleRowSelection("25", "selected");
//                    self.gridWidget.toggleRowSelection("25", "unselected");
                    console.log(self.gridWidget.getSelectedRows());
                })
                .bind(this.actionEvents.getSelectedRowsEvent, function(e, selectedRows){
                    console.log(self.actionEvents.getSelectedRowsEvent + ": ");
                    console.log(selectedRows);
                    console.log(self.gridWidget.getSelectedRows());
                })
                .bind(this.actionEvents.reloadGridEvent, function(e){
                    console.log(self.actionEvents.reloadGridEvent);
                    self.gridWidget.reloadGrid();
                });
        },

        /* mocks REST API response for tree data for the parent and first children */
        mockApiResponse: function(){
            var data = firewallPoliciesData;
            $.mockjax({
                url: '/api/get-tree',
                response: function(settings) {
                    var urlHash = {},
                        seg = settings.data.split('&');
                    for (var i=0;i<seg.length;i++) {
                        if (!seg[i]) { continue; }
                        var s = seg[i].split('=');
                        urlHash[s[0]] = s[1];
                    }
                    if(urlHash.page == 2){
                        this.responseText = firewallPoliciesData.firewallPoliciesPage2;
                    }else if(urlHash.page == 3){
                        this.responseText = firewallPoliciesData.firewallPoliciesPage3;
                    }else {
                        switch(urlHash.nodeid){
                            case "11":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel11;
                                break;
                            case "15":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel15;
                                break;
                            case "25":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel25;
                                break;
                            case "4":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel4;
                                break;
                            case "55":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel55;
                                break;
                            default:
                                this.responseText = firewallPoliciesData.firewallPoliciesAll;
                        }
                    }
                    
                },
                responseTime: 10
            });
        }
    });

    return GridView;
});