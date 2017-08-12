/**
 * A view that uses a declararative form and the IP CIDR widget to render a form with the default IP CIDR widget fields
 *
 * @module IpCidrView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/ipCidr/ipCidrWidget',
    'text!widgets/ipCidr/tests/declarativeForm.html',
    'widgets/form/formValidator'
], function(Backbone, IpCidrWidget, declarativeForm, FormValidator){
    var IpCidrView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            var form = this.$el.append(declarativeForm);
            new IpCidrWidget({
                "container": '#ipCidr'
            }).build();
            new FormValidator().validateForm(form);
            form.foundation('tooltip');
            return this;
        }
    });

    return IpCidrView;
});