/**
 * A view that uses the formWidget to a produce a form from a configuration file
 * The configuration file contains the title, labels, element types, validation types and buttons of the form
 *
 * @module Application Elements Form View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/tests/conf/formConfiguration',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget'
], function(Backbone, formConf, FormWidget, OverlayWidget){
    var FormView = Backbone.View.extend({

        events: {
            'click #add_policy_save': 'addPolicy',
            'click #add_policy_cancel': 'closePolicy'
        },

        initialize: function () {
            this.overlay = new OverlayWidget({
                view: this,
                xIconEl: true,
                showScrollbar: true,
                type: 'medium'
            });
            this.overlay.build();
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConf.FirewallPolicies,
                "container": this.el,
                "values": {}
            });
            this.form.build();
            return this;
        },

        addPolicy: function (e){
            var data = {};
            if (this.form.isValidInput(this.form.conf.container.find('form'))){
                var values = this.form.getValues();
                for (var i=0; i<values.length; i++){
                    data[values[i].name] = values[i].value;
                }
                this.options.save(data);
                this.closePolicy(e);
            }
        },

        closePolicy: function (e){
            this.overlay.destroy();
            e.preventDefault();
            e.stopPropagation();
        }

    });

    return FormView;
});