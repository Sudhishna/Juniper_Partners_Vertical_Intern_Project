/**
 * A view that uses the List Builder Widget to produce a list builder from a configuration file
 * The configuration file contains the label and values from which the list should be built.
 *
 * @module List Builder View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/listBuilder/listBuilderWidget',
    'widgets/listBuilder/conf/configurationSample',
    'widgets/form/formWidget',
    'widgets/listBuilder/tests/conf/formConfiguration',
    'widgets/listBuilder/tests/dataSample/testingSample'
], function(Backbone, ListBuilderWidget, listBuilderConf, FormWidget, formConf, testingSampleConf){
    var ListBuilderView = Backbone.View.extend({

        events: {
            'click #get_available': 'getAvailableItems',
            'click #set_available': 'setAvailableItems',
            'click #add_available': 'addAvailableItems',
            'click #remove_available': 'removeAvailableItems',
            'click #get_selected': 'getSelectedItems',
            'click #set_selected': 'setSelectedItems',
            'click #add_selected': 'addSelectedItems',
            'click #remove_selected': 'removeSelectedItems'
        },

        initialize: function () {
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
                protocolsListContainer = this.$el.find('#protocols'),
                addressListContainer = this.$el.find('#addresses'),
                hubListContainer = this.$el.find('#hub'),
                endpointListContainer = this.$el.find('#endpoint');



            // Protocol List Builder
            this.protocolsListBuilder = new ListBuilderWidget({
                "list": listBuilderConf.firstListBuilder,
                "container": protocolsListContainer
            });
            this.protocolsListBuilder.build();
            protocolsListContainer.children().attr('id', 'protocols');
            protocolsListContainer.find('.list-builder-widget').unwrap();
                  
            


            // Address List Builder
            this.addressListBuilder = new ListBuilderWidget({
                "list": listBuilderConf.firstListBuilder,
                "container": addressListContainer
            });

            this.addressListBuilder.build()
            addressListContainer.children().attr('id','addresses');
            addressListContainer.find('.list-builder-widget').unwrap();
                  


            // Hub List Builder
            this.hubListBuilder = new ListBuilderWidget({
                "list": listBuilderConf.firstListBuilder,
                "container": hubListContainer
            });

            this.hubListBuilder.build()
            hubListContainer.children().attr('id','hub');
            hubListContainer.find('.list-builder-widget').unwrap();

            $('#hub .box2 .list-group').on('selectedChangeEvent', function(event, list){
                if (list && list.event && list.event === 'select'){
                    var removedItems = list.data.map(function(item) {
                        return item.value;
                    });
                   
                    self.endpointListBuilder.removeAvailableItems(removedItems);
                }else if(list && list.event && list.event === 'unselect'){
                    self.endpointListBuilder.addAvailableItems(list.data);
                }

            });
                  
            
                    

            // Endpoint List Builder
            this.endpointListBuilder = new ListBuilderWidget({
                "list": listBuilderConf.secondListBuilder,
                "container": endpointListContainer
            });

            this.endpointListBuilder.build()
            endpointListContainer.children().attr('id','endpoint');
            endpointListContainer.find('.list-builder-widget').unwrap();

            $('#endpoint .box2 .list-group').on('selectedChangeEvent', function(event, list){
                if (list && list.event && list.event === 'select'){
                    var removedItems = list.data.map(function(item) {
                        return item.value;
                    });
                    self.hubListBuilder.removeAvailableItems(removedItems);
                }else if(list && list.event && list.event === 'unselect'){
                    self.hubListBuilder.addAvailableItems(list.data);
                }
            });
            
            
            return this;
        },

        getAvailableItems: function () {
            var availableItems = this.addressListBuilder.getAvailableItems();
            console.log(availableItems);
        },

        setAvailableItems: function () {
            this.protocolsListBuilder.setAvailableItems(testingSampleConf.sample5);
        },

        addAvailableItems: function () {
            this.protocolsListBuilder.addAvailableItems(testingSampleConf.sample2);
        },

        removeAvailableItems: function () {
            var removeAvailableItems = this.addressListBuilder.removeAvailableItems(testingSampleConf.sample6);
            console.log(removeAvailableItems);
        },

        getSelectedItems: function () {
            var selectedItems = this.addressListBuilder.getSelectedItems();
            console.log(selectedItems);
        },

        setSelectedItems: function () {
            this.protocolsListBuilder.setSelectedItems(testingSampleConf.sample6);
        },

        addSelectedItems: function () {
            this.protocolsListBuilder.addSelectedItems(testingSampleConf.sample4);
        },

        removeSelectedItems: function () {
            var removeSelectedItems = this.addressListBuilder.removeSelectedItems(testingSampleConf.sample5);
            console.log(removeSelectedItems);
        }

    });

    return ListBuilderView;
});