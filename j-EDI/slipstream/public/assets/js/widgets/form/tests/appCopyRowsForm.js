/**
 * A view that uses the formWidget to a produce a form from a configuration object
 *
 * @module Application for Copying Elements in a Form View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/form/conf/copyRowsConfigurationSample',
    'widgets/form/formWidget'
], function(Backbone, formConf, FormWidget){
    var FormView = Backbone.View.extend({

        events: {
            "click .copy_row_buttons": "copyRow"
        },

        initialize: function () {
            this.render();
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConf.elements,
                "container": this.el
            });
            this.form.build();
            return this;
        },

        copyRow: function (e){
            var sourceClassRow = this.$el.find('#'+e.target.id).data('button')
            this.form.copyRow(sourceClassRow, true);
            $(this.$el.find('form')).bind(sourceClassRow, function(e,row){
                console.log("Row:" + sourceClassRow + " was deleted");
            })
        }

    });

    return FormView;
});