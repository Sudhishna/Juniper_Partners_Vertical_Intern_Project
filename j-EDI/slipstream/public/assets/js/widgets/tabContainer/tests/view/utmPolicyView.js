/**
 * A view that uses the form Widget to render a form from a configuration object
 * The configuration file contains the title, labels, element types, validation types and buttons of the form
 *
 * @module CreateView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/tabContainer/tests/conf/formConfiguration',
    'widgets/form/formWidget'
], function(Backbone, formConf, FormWidget){
    var UTMPolicy = Backbone.View.extend({
        render: function () {
            this.form = new FormWidget({
                "elements": formConf.utmPolicy,
                "container": this.el,
                "values": {}
            });
            this.form.build();
            return this;
        },

        getViewData: function (){
            var viewData = {};
            if (this.form.isValidInput()){
                var values = this.form.getValues();
                for (var i=0; i<values.length; i++){
                    viewData[values[i].name] = values[i].value;
                }
            }
            return viewData;
        },

        isValidTabInput: function(){
            return this.form.isValidInput();
        }

    });

    return UTMPolicy;
});
