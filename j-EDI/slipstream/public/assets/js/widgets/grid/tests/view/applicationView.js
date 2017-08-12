/**
 * A view that uses a configuration object to render a form widget on a overlay for the Application view
 *
 * @module ApplicationView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/form/formWidget',
    '../conf/formConfiguration',
    'widgets/listBuilder/listBuilderWidget'
], function(Backbone, FormWidget, formConfiguration, ListBuilderWidget){
    var ApplicationView = Backbone.View.extend({

        events: {
            'click #source_address_save': 'addPolicy',
            'click #source_address_cancel': 'closePolicy'
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConfiguration.Application,
                "container": this.el
            });
            this.form.build();
            this.getData();
            return this;
        },

        getData:function (){
            var self = this;
            this.model.fetch({success: function(collection) {
                var applications = [];
                collection.models.forEach(function(model){
                    applications.push({
                        'label': model.get('name'),
                        'value': model.get('name')
                    });
                });
                self.addListBuilder('application',applications);
                self.listBuilder.setSelectedItems(self._cellViewValues);
                self._cellViewValues = null;
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

        addPolicy: function (e){
            if (this.form.isValidInput(this.$el.find('form'))){
                var data = this.getListBuilderSelectedItems();
                this.options.save(this.options.columnName,data);
                this.closePolicy(e);
            }
        },

        getListBuilderSelectedItems: function(id){
            var listValues = [];
            var data = this.listBuilder.getSelectedItems();
            for (var i=0; i<data.length; i++){
                listValues.push(data[i].value);
            }
            return listValues;
        },

        closePolicy: function (e){
            this.options.close(this.options.columnName,e);
        },

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData;
        }

    });

    return ApplicationView;
});