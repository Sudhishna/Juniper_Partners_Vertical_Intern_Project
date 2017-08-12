/**
 * A view that uses the Form Widget to build a form based on a configuration file.
 * It automatically adds IP CIDR widget elements to the form.
 *
 * @module IpCidrFormWidgetView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/ipCidr/conf/ipCidrFormConfigurationSample',
    'widgets/form/formWidget'
], function(Backbone, formConf, FormWidget){
    var IpCidrFormWidgetView = Backbone.View.extend({

        events: {
            "click #copy_row_button": "copyRow",
            "click #get_values_button": "getValues"
        },

        initialize: function () {
            this.render();
            this.setValues();
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConf.elements,
                "values": formConf.values,
                "container": this.el
            });
            this.form.build();
            return this;
        },

        copyRow: function (e){
            var sourceClassRow = this.$el.find('#'+e.target.id).data('button');
            this.form.copyRow(sourceClassRow, true);
        },

        getValues: function (e){
            var sourceClassRow = this.$el.find('#'+e.target.id).data('button');
            var widgetIdentifier = this.$el.find('.'+sourceClassRow).data('widgetidentifier');
            var widgetInstance = this.form.getInstantiatedWidgets()[widgetIdentifier].instance;
            var values = widgetInstance.getValues();
            console.log(values);
            console.log("IP/CIDR string: " + widgetInstance.getIpCidrValue());
        },

        setValues: function (){
            var widgetIdentifier = 'ipCidr_'+'text_ipCidrWidget_withlabel';
            var widgetInstance = this.form.getInstantiatedWidgets()[widgetIdentifier].instance;
            widgetInstance.setValues('2.3.4.5','5');
        }

    });




    return IpCidrFormWidgetView;
});