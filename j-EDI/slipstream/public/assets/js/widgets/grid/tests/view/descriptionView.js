/**
 * A view that uses a configuration object to render a form widget with textArea element to show behaviour
 * of a string with line breaks
 *
 * @module DescriptionView
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/grid/tests/conf/formConfiguration'
], function(Backbone, FormWidget, formConfiguration){
    var DescriptionView = Backbone.View.extend({

        events: {
            'click #description_save': 'saveDescription',
            'click #description_cancel': 'closeDescription'
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConfiguration.Description,
                "container": this.el
            });
            this.getData();
            this.form.build();

            return this;
        },


        getData:function (){
            var self = this;
            var formElements = this.form.conf.elements.sections[0];
            formElements.elements.forEach(function(obj,index){
                if(obj.name == "text_area"){
                    obj.value = self._cellViewValues;
                }
            });
            self._cellViewValues = null;
        },

        saveDescription: function (e){
            var data = this.getDescription();
            this.options.save(this.options.columnName,data);
            this.closeDescription(e);
        },

        getDescription: function(){
            var formValues = this.form.getValues();
            var textAreaValue;
            formValues.forEach(function(obj,index){
                if(obj.name == "text_area"){
                    textAreaValue = obj.value;
                }
            });

            return textAreaValue;
        },

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData.join("\n");
        },

        closeDescription: function (e){
            this.options.close(this.options.columnName,e);
        }

    });

    return DescriptionView;
});