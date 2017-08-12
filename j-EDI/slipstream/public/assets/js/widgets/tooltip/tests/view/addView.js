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
    'widgets/tooltip/tests/conf/formConfiguration',
    'widgets/form/formWidget'
], function(Backbone, formConf, FormWidget){
    var FormView = Backbone.View.extend({

        events: {
            'click #add_policy_save': 'addPolicy',
            'click #add_policy_cancel': 'closePolicy'
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
            if (this.form.isValidInput(this.form.conf.container.find('form'))){
                console.log("The form was validated")
                this.closePolicy(e);
            }
        },

        closePolicy: function (e){
            e.preventDefault();
            e.stopPropagation();
        }

    });

    return FormView;
});