/**
 * A view that uses the Tab Container Widget to render a tab container from a configuration object
 * The configuration object contains the tabs name, the tabs content and other parameters required to build the widget.
 *
 * @module TabContainer View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/tabContainer/tabContainerWidget',
    'widgets/tabContainer/tests/view/addView',
    'widgets/tabContainer/tests/view/standardTabContainerWidget'
], function(Backbone, TabContainerWidget, FormView, TabView){
    var TabContainerView = Backbone.View.extend({

      initialize: function () {
            this.tabs = [{
                id:"zoneNav",
                name:"Welcome to SaltStack POC. Choose a Task Below.",
                isDefault: true,
                content: new TabView()
            }];
            this.render();
        },
        render: function () {
            var $navigationContainer = this.$el.find('#navigationTab');
            new TabContainerWidget({
                "container": $navigationContainer,
                "tabs": this.tabs,
                "height": "auto",
                "navigation": true
            }).build();
            return this;
        }

    });

    return TabContainerView;
});
