/**
 * A view that renders sample content in a Backbone View from a configuration file
 * The configuration file contains the key and value pairs which declare a configuration.
 *
 * @module FixedHeightView
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'widgets/overlay/tests/conf/testConfig',
    'widgets/overlay/tests/conf/formGridContainerConf',
    'widgets/overlay/tests/conf/gridInFormConf',
    'widgets/overlay/overlayWidget',
    'widgets/grid/gridWidget',
    'widgets/form/formWidget'
], function (OverlayConf, FormConf, GridConf, OverlayWidget, GridWidget, FormWidget) {
    var AppView = Backbone.View.extend({
        render: function () {
            var self = this;
            var formConfig = new FormConf(),
                formElements = formConfig.getValues();

            this.formWidget = new FormWidget({
                "elements": formElements,
                "container": self.el
            });
            this.formWidget.build();

            var gridContainer = this.$el.find('.fixedHeightGrid').empty();

            this.gridWidget = new GridWidget({
                container: gridContainer,
                elements: new GridConf().getValues()
            });

            this.gridWidget.build();            
            return this;
        }
    });

    return AppView;
});