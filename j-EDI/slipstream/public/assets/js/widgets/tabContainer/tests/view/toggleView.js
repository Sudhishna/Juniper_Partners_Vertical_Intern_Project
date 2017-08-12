/**
 * A view that uses a configuration object to render a tab container with toggle buttons.
 * The configuration object contains the tabs name, the tabs content and other parameters required to build the widget.
 *
 * @module RightAlignView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/tabContainer/tabContainerWidget',
    'widgets/tabContainer/tests/view/addView',
    'widgets/tabContainer/tests/view/applicationView',
    'widgets/tabContainer/tests/view/destinationAddressView',
    'widgets/tabContainer/tests/view/sourceAddressView',
    '../models/zonePoliciesModel'
], function(Backbone, TabContainerWidget, CreateView, ApplicationView, DestinationAddressView, SourceAddressView, ZonePoliciesModel){
    var ToggleView = Backbone.View.extend({

        initialize: function (){
            this.tabs = [{
                id:"create",
                name:"Create",
                content: new CreateView()
            },{
                id:"application",
                name:"Application",
                content: new ApplicationView({
                    model: new ZonePoliciesModel.application.collection()
                })
            },{
                id:"destination",
                name:"Destination",
                isDefault: true,
                content: new DestinationAddressView({
                    model: new ZonePoliciesModel.address.collection()
                })
            },{
                id:"sourceAddress",
                name:"Source Address",
                content: new SourceAddressView({
                    model: new ZonePoliciesModel.address.collection()
                }),
                isDefault: true
            }];
        },

        render: function () {
            this.tabContainerWidget = new TabContainerWidget({
                "container": this.el,
                "tabs": this.tabs,
                "toggle": true
            });
            this.tabContainerWidget.build();
            return this;
        }

    });

    return ToggleView;
});