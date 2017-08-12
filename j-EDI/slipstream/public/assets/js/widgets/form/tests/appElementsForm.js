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
    'widgets/form/conf/configurationSample',
    'widgets/form/formWidget'
], function(Backbone, formConf, FormWidget){
    var FormView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            var form = new FormWidget({
                "elements": formConf.elements,
                "container": this.el
            });
            form.build();
            return this;
        }
    });

    return FormView;
});