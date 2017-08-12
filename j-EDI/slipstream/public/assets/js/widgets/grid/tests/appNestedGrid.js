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
    'widgets/grid/tests/view/destinationAddressView',
    'widgets/grid/tests/view/applicationView',
    'widgets/grid/tests/view/createPolicyView',
    './models/zonePoliciesModel',
    'widgets/form/formWidget',
    './conf/formConfiguration',
    'mockjax'
], function(Backbone, GridWidget, gridConfiguration, SourceAddressView, DestinationAddressView, ApplicationView, CreatePolicyView, ZonePoliciesModel, FormWidget, formConfiguration, mockjax){
    var GridView = Backbone.View.extend({

        events: {
            'click #filter_grid': 'filterGrid'
        },

        initialize: function () {
            this.mockApiResponse();
            this.zoneCollection = new ZonePoliciesModel.zone.collection();
            this.addressCollection = new ZonePoliciesModel.address.collection();
            this.applicationCollection = new ZonePoliciesModel.application.collection();
            this.actionEvents = {
                createEvent:"AddFirewallPolicies",
                updateEvent:"UpdateFirewallPolicies",
                discardEvent:"DiscardFirewallPolicies",
                deleteEvent:"DeleteFirewallPolicies",
                copyEvent:"CopyFirewallPolicies",
                pasteEvent:"PasteFirewallPolicies",
                statusEvent:"UpdateStatusFirewallPolicies",
                moveEvent:"MoveFirewallPolicies",
                resetHitEvent:"ResetHitCount",
                disableHitEvent:"DisableHitCount"
            };
            this.bindGridEvents();
            this.cellOverlayViews = this.createViews();
            this.render();
            this.url = gridConfiguration.nestedGrid['url'];

        },

        render: function () {
            this.gridWidget = new GridWidget({
                container: this.el,
                elements: gridConfiguration.nestedGrid,
                actionEvents:this.actionEvents,
                cellOverlayViews:this.cellOverlayViews
            });
            this.gridWidget.build();
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
            var destinationAddressView = new DestinationAddressView({
                'model': self.addressCollection,
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'destination-address'
            });
            var applicationView = new ApplicationView({
                'model': self.applicationCollection,
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'application'
            });
            var serviceView = new ApplicationView({
                'model': self.applicationCollection,
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'application-services'
            });
            var cellViews = {
                'source-address' : sourceAddressView,
                'destination-address' : destinationAddressView,
                'application' : applicationView,
                'application-services' : serviceView
            }
            return cellViews;
        },

        bindGridEvents: function () {
            var self = this;
            this.$el
                .bind(this.actionEvents.createEvent, function(e, addGridRow){
//                    self.addRow(addGridRow);
                    console.log(addGridRow);
                })
                .bind(this.actionEvents.updateEvent, function(e, updatedGridRow){
//                    self.update(updateGridRow);
                    console.log(updatedGridRow);
                })
                .bind(this.actionEvents.discardEvent, function(e, discardedGridRow){
                    console.log(discardedGridRow);
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
                .bind(this.actionEvents.resetHitEvent, function(e, selectedRows){
                    console.log(self.actionEvents.resetHitEvent + ": ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.disableHitEvent, function(e, selectedRows){
                    console.log(self.actionEvents.disableHitEvent + ": ");
                    console.log(selectedRows);
                })
                .bind("gridRowOnEditMode", function(e, selectedRows){
                    console.log("gridRowOnEditMode: ");
                    console.log(selectedRows);
                });
        },

        addFilter: function () {
            var filterContainer = this.gridWidget.getFilterContainer();
            this.form = new FormWidget({
                "elements": formConfiguration.Filter,
                "container": filterContainer
            });
            this.form.build();
            this.getZones();
        },

        addRow: function (addGridRow) {
            var self = this;
            var view = new CreatePolicyView({
                'save': _.bind(self.save, self)
            });
            this.updateGrid = addGridRow;
        },

        getZones:function (){
            var self = this;
            this.zoneCollection.fetch({success: function(collection) {
                var zones = [{
                    "label": "Any",
                    "value": "any"
                }];
                collection.models.forEach(function(model){
                    zones.push({
                        'label': model.get('name'),
                        'value': model.get('name')
                    });
                });
                self.form.insertDropdownContentFromJson('from_zone_filter',zones, true);
                self.form.insertDropdownContentFromJson('to_zone_filter',zones, true);
            }});
        },

        filterGrid: function(){
            var filters = this.form.getValues(),
                selectedFilters={};
            for (var i=0; i<filters.length; i++){
                var filter = filters[i];
                selectedFilters[filter['name']]=filter['value'];
            }
//            var url = "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOnePage.json";

            var url = this.url,
                fromZone = selectedFilters['from_zone_filter'],
                toZone = selectedFilters['to_zone_filter'],
                isOneZone =  true;
            if(fromZone=='any'||toZone=='any'){ //needs to be updated when one:any API is available
                isOneZone =  false;
            } else {
                url += url.slice(-1)!="/"? "/" : "";
                url += selectedFilters['from_zone_filter']+ "," + selectedFilters['to_zone_filter'];
            }
            this.gridWidget.filterGrid(url,isOneZone);
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

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function(){
            $.mockjax({
                url: /^\/api\/security-policy\/global\/policy\/([a-zA-Z0-9\-\_]+)$/,
                urlParams: ["policy"],
                response: function(settings) {
                    var policy = settings.urlParams.policy,
                        policies = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante', '185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____', '189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante', '190002-INS_to_Sircon_drop_em', '191002-LOT_-_VPN_Tunnell_-_Lottery_VPN_Tunnel_-_8_2_2007_-_KTS','195002-SEC_-_NEMO_Project__-_Waiver___1156_-_Pa__SEC_VPN_connec','196001-VPN_Cleanup_rule__IPSec_','201003-Blue_Coat_drop_rule_-_CRQ_4620_04-11-2012_Sante'];
                    if ($.inArray(policy, policies) != -1) {
                        this.responseText = {
                            'name': policy,
                            'source-address': ['any'],
                            'destination-address': ['any'],
                            'application': ['any'],
                            'action': 'reject'
                        };
                        this.status = 200;
                    } else {
                        this.responseText = {
                            type: 'Error',
                            code: 404,
                            message: 'The requested policy does not exist',
                            details: [ ],
                            links: [ ]
                        };
                        this.status = 404;
                    }
                },
                responseTime: 100
            });
        }

    });

    return GridView;
});