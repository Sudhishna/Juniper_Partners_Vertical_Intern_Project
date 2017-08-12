/**
 * A view that uses a configuration object to render a form widget on a overlay for the Zone Policies add view
 *
 * @module ZonePoliciesAddView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/overlay/overlayWidget',
    'widgets/form/formWidget',
    '../conf/formConfiguration',
    'widgets/listBuilder/listBuilderWidget'
], function(Backbone, OverlayWidget, FormWidget, formConfiguration, ListBuilderWidget){
    var ZonePoliciesAddView = Backbone.View.extend({

        events: {
            'click #add_policy_save': 'addPolicy',
            'click #add_policy_cancel': 'closePolicy'
        },

        initialize: function (options){
            this.zoneCollection = options.zone;
            this.addressCollection = options.address;
            this.applicationCollection = options.application;
            this.overlay = new OverlayWidget({
                view: this,
                type: 'large'
            });
            this.overlay.build();
        },

        render: function () {
            var formValues =  JSON.parse(JSON.stringify(this.model));
            formValues.operation = (!_.isEmpty(formValues)) ? 'Edit' : 'Create';
            this.form = new FormWidget({
                "elements": formConfiguration.ZonePolicies,
                "container": this.el,
                'values': formValues
            });
            this.form.build();
            this.getData(formValues);
            return this;
        },

        getData:function (formValues){
            var self = this;
            var isUpdate = _.size(formValues)>1 ? true : false;
            isUpdate && this.setDropDownSelection(formValues,'action');

            this.zoneCollection.fetch({success: function(collection) {
                var zones = [{
                    "label": "Select an option",
                    "value": ""
                }];
                collection.models.forEach(function(model){
                    zones.push({
                        'label': model.get('name'),
                        'value': model.get('name')
                    });
                });
                self.form.insertDropdownContentFromJson('from-zone-name',zones, true);
                self.form.insertDropdownContentFromJson('to-zone-name',zones, true);
                isUpdate && self.setDropDownSelection(formValues,'from-zone-name');
                isUpdate && self.setDropDownSelection(formValues,'to-zone-name');
            }});
            this.addressCollection.fetch({success: function(collection) {
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
                self.addListBuilder('source-address',addresses, formValues);
                self.addListBuilder('destination-address',addresses, formValues);
            }});
            this.applicationCollection.fetch({success: function(collection) {
                var applications = [];
                collection.models.forEach(function(model){
                    applications.push({
                        'label': model.get('name'),
                        'value': model.get('name')
                    });
                });
                self.addListBuilder('application',applications, formValues);
            }});
        },

        addListBuilder: function (id,list,formValues){
            var listContainer = this.$el.find('#'+id)
            var listBuilder = new ListBuilderWidget({
                "list": {"availableElements":list},
                "container": listContainer
            });
            listBuilder.build();
            _.size(formValues)>1 && listBuilder.setSelectedItems(formValues[id]);
            listContainer.children().attr('id',id);
            listContainer.find('.list-builder-widget').unwrap()
        },

        addPolicy: function (e){
            var data = {};
            if (this.form.isValidInput()){
                var values = this.form.getValues();
                for (var i=0; i<values.length; i++){
                    data[values[i].name] = values[i].value;
                }
                data['source-address'] = this.getDoubleListValues('source-address');
                data['destination-address'] = this.getDoubleListValues('destination-address');
                data['application'] = this.getDoubleListValues('application');
                this.options.save(data);
                this.closePolicy(e);
            }
        },

        getDoubleListValues: function(id){
            var listValues = [];
            this.$el.find('#duallistbox-selected-list_'+id+' input').each(function(){
                listValues.push(this.value)
            });
            return listValues;
        },

        closePolicy: function (e){
            this.overlay.destroy();
            e.preventDefault();
            e.stopPropagation();
        },

        setDropDownSelection: function (formValues, elementName){
            var elementValue = formValues[elementName];
            this.$el.find('select[name="'+elementName+'"] option').each(function(index,option){
                if (elementValue===$(option).attr('value'))
                    $(option).attr('selected',true);
                else
                    $(option).attr('selected',false);
            });
        }

    });

    return ZonePoliciesAddView;
});