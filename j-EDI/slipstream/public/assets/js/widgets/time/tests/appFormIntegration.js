/**
 * A view that uses the Form Widget to build a form based on a configuration file.
 * It automatically adds Time widget elements to the form.
 *
 * @module TimeFormWidgetView
 * @author Vidushi Gupta <vidgupta@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/time/tests/conf/appFormIntegrationConf',
    'widgets/form/formWidget'
], function (Backbone, formConf, FormWidget) {
    var TimeFormWidgetView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            var form = new FormWidget({
                "elements": formConf,
                "container": this.el
            });
            form.build();
            return this;
        }
    });

    return TimeFormWidgetView;
});