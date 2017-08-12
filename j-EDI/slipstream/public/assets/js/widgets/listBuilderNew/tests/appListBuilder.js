/**
 * A view that uses the List Builder Widget to produce a list builder from a configuration file
 * The configuration file contains the label and values from which the list should be built.
 *
 * @module List Builder View
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/listBuilderNew/listBuilderWidget',
    'widgets/listBuilderNew/conf/configurationSample',
    'widgets/form/formWidget',
    'widgets/listBuilderNew/tests/conf/formConfiguration',
    'widgets/listBuilderNew/tests/dataSample/testingSample',
    'mockjax'
], function(Backbone, ListBuilderWidget, listBuilderConf, FormWidget, formConf, testingSample, mockjax){
    var ListBuilderView = Backbone.View.extend({

        events: {
            'click #get_available': 'getAvailableItems',
            'click #set_available': 'unselectItems',
            'click #add_available': 'addAvailableItems',
            'click #remove_available': 'removeAvailableItems',
            'click #get_selected': 'getSelectedItems',
            'click #set_selected': 'selectItems',
            'click #add_selected': 'addSelectedItems',
            'click #remove_selected': 'removeSelectedItems',
            'click #search_available': 'searchAvailableItems',
            'click #search_selected': 'searchSelectedItems'
        },

        initialize: function () {
            this.mockApiResponse();
            this.mockApiResponse2();
            new FormWidget({
                "elements": formConf,
                "container": this.el,
                "values": {}
            }).build();
            
            this.render();
        },

        render: function () {
            //finds the container where the list builder will be added
            var self = this,
                protocols = this.$el.find('#protocols'),
                address = this.$el.find('#addresses'),
                service = this.$el.find('#services');


            var onChangeSelected = function (e, data){
                    console.log(data);
                    self.protocolsListBuilder.reload();
                },
                firstListBuilderConf = listBuilderConf.firstListBuilder;
                
            _.extend(firstListBuilderConf, {
                onChangeSelected: onChangeSelected
            });

            // Protocol List Builder
            var protocolsContainer = protocols.parent();
            this.protocolsListBuilder = new ListBuilderWidget({
                container: protocolsContainer,
                elements: firstListBuilderConf,
                rowTooltip: this.rowTooltip
            });
            this.protocolsListBuilder.build();
            protocols.remove();

            // Addresses List Builder
            var addressesContainer = address.parent();
            this.addressesListBuilder = new ListBuilderWidget({
                container: addressesContainer,
                elements: listBuilderConf.secondListBuilder,
                rowTooltip: this.rowTooltip
            });
            this.addressesListBuilder.build();
            address.remove();
            

            // Services List Builder
            var serviceContainer = service.parent();
            this.servicesListBuilder = new ListBuilderWidget({
                container: serviceContainer,
                elements: listBuilderConf.thirdListBuilder,
                rowTooltip: this.rowTooltip
            });
            this.servicesListBuilder.build();
            service.remove();

            return this;
        },

        getAvailableItems: function () {
            var availableItems = this.protocolsListBuilder.getAvailableItems();
            console.log(availableItems);
        },

        unselectItems: function () {
            this.addressesListBuilder.unselectItems(testingSample.sample3);
        },

        addAvailableItems: function () {
            this.addressesListBuilder.addAvailableItems(testingSample.sample1);
        },

        removeAvailableItems: function () {
            var removeAvailableItems = this.protocolsListBuilder.removeAvailableItems(testingSample.sample3);
            console.log(removeAvailableItems);
        },

        searchAvailableItems : function () {
            var currentPara = this.protocolsListBuilder.getAvailableUrlParameter();
            _.extend(currentPara, {filter: 'this is a test1', _search: 'gmail'});

            this.protocolsListBuilder.searchAvailableItems(currentPara);

        },
        getSelectedItems: function () {
            var selectedItems = this.protocolsListBuilder.getSelectedItems();
            console.log(selectedItems);
        },

        searchSelectedItems: function () {
            var currentPara = this.protocolsListBuilder.getSelectedUrlParameter();
            _.extend(currentPara, {filter: 'this is a test2'});
            
            this.protocolsListBuilder.searchSelectedItems(currentPara);

        },

        selectItems: function () {
            this.addressesListBuilder.selectItems(testingSample.sample3);
        },

        addSelectedItems: function () {
            this.addressesListBuilder.addSelectedItems(testingSample.sample2);
        },

        removeSelectedItems: function () {
            var removeSelectedItems = this.protocolsListBuilder.removeSelectedItems(testingSample.sample4);
            console.log(removeSelectedItems);
        },
        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function(){
            var data = testingSample;
            $.mockjax({
                url: '/api/get-data',
                dataType: 'json',
                response: function(settings) {
                    if (typeof settings.data == 'string'){
                        var urlHash = {},
                            seg = settings.data.split('&');
                        for (var i=0;i<seg.length;i++) {
                            if (!seg[i]) { continue; }
                            var s = seg[i].split('=');
                            urlHash[s[0]] = s[1];
                        }

                        switch(urlHash.searchAll){
                            case "true":
                                this.responseText = data.addresses3;
                                break;
                            default:
                                this.responseText = data.addresses;
                        }

                        switch(urlHash.page){
                            case "2":
                                this.responseText = data.addressesPage2;
                                break;
                            case "3":
                                this.responseText = data.addressesPage3;
                                break;
                            case "4":
                                this.responseText = data.addressesPage4;
                                break;
                            case "5":
                                this.responseText = data.addressesPage5;
                                break;
                            case "6":
                                this.responseText = data.addressesPage6;
                                break;    
                            default:
                                this.responseText = data.addresses;
                        }

                    }
                    else {
                        this.responseText = data.addresses;
                    }
                },
                responseTime: 10
            });
        },

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse2: function(){
            var data = testingSample;
            $.mockjax({
                url: '/api/get-data2',
                dataType: 'json',
                response: function(settings) {
                    if (typeof settings.data == 'string'){
                        var urlHash = {},
                            seg = settings.data.split('&');
                        for (var i=0;i<seg.length;i++) {
                            if (!seg[i]) { continue; }
                            var s = seg[i].split('=');
                            urlHash[s[0]] = s[1];
                        }
                        switch(urlHash.searchAll){
                            case "true":
                                this.responseText = data.addresses4;
                                break;
                            default:
                                this.responseText = data.addresses2;
                        }
                    }
                    else {
                        this.responseText = data.addresses2;
                    }
                },
                responseTime: 10
            });
        },

        rowTooltip: function (rowData, renderTooltip){
            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/listBuilderNew/tests/dataSample/tooltipsSample.json',
                success: function(response) {
                    console.log(rowData);
                    var data = response.address,
                        moreData=[];
                    moreData.push({
                        title: "Address Group"
                    });
                    data.forEach(function(item){
                        moreData.push({
                            label: "Address: " + item['name']
                        });
                    });
                    moreData.push({
                        link: "(10 more)",
                        id: "address-tooltip-more-link"
                    });
                    renderTooltip(moreData);
                    
                }
            });
        }

    });

    return ListBuilderView;
});