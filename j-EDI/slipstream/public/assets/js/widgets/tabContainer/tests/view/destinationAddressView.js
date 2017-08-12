/**
 * A view that uses the Form Widget to render a form from a configuration object for the Destination Address view
 *
 * @module DestinationAddressView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/form/formWidget',
    '../conf/formConfiguration',
    'widgets/listBuilder/listBuilderWidget'
], function(Backbone, FormWidget, formConfiguration, ListBuilderWidget){
    var DestinationAddressView = Backbone.View.extend({

        events: {
            'click #source_address_save': 'addPolicy',
            'click #source_address_cancel': 'closePolicy'
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConfiguration.DestinationAddress,
                "container": this.el
            });
            this.form.build();
            this.getModelData();
            return this;
        },

        getModelData:function (){
            var self = this;
            this.model.fetch({success: function(collection) {
                var addresses = [];
                collection.models.forEach(function(model){
                    var model_address = model.toJSON().address;
                    for (var i=0; i<model_address.length; i++){
                        addresses.push({
                            'label': model_address[i].name,
                            'value': model_address[i].name
                        });
                    }
                    var model_addressSet = model.toJSON()['address-set'];
                    for (var i=0; i<model_addressSet.length; i++){
                        addresses.push({
                            'label': model_addressSet[i].name,
                            'value': model_addressSet[i].name
                        });
                    }
                });
                self.addListBuilder('destination_address',addresses);
            }});
        },

        addListBuilder: function (id,list){
            var listContainer = this.$el.find('#'+id)
            this.listBuilder = new ListBuilderWidget({
                "list": {"availableElements":list},
                "container": listContainer
            });
            this.listBuilder.build();
            listContainer.children().attr('id',id);
            listContainer.find('.list-builder-widget').unwrap()
        },

        getViewData: function (){
            var viewData = {};
            if (this.form && this.form.isValidInput()){
                var values = this.form.getValues();
                for (var i=0; i<values.length; i++){
                    viewData[values[i].name] = values[i].value;
                }
                viewData['destination_address'] = this.getListBuilderSelectedItems('destination_address');
            }
            return viewData;
        },

        getListBuilderSelectedItems: function(){
            var listValues = [];
            var data = this.listBuilder.getSelectedItems();
            for (var i=0; i<data.length; i++){
                listValues.push(data[i].value);
            }
            return listValues;
        },

        isValidTabInput: function(){
            return this.form.isValidInput();
        }

    });

    return DestinationAddressView;
});