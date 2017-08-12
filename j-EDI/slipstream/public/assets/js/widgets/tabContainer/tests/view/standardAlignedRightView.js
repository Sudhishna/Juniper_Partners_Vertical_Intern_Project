/**
 * A view that uses a configuration object to render a tab container with right alignment.
 * The configuration object contains the tabs name, the tabs content and other parameters required to build the widget.
 *
 * @module RightTabContainerView
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
    var RightTabContainerView = Backbone.View.extend({

        initialize: function () {
            this.tabs = [{
                            id:"createR",
                            name:"Create",
                            content: new CreateView()
                        },{
                            id:"applicationR",
                            name:"Application",
                            content: new ApplicationView({
                                model: new ZonePoliciesModel.application.collection()
                            })
                        },{
                            id:"destinationR",
                            name:"Destination",
                            isDefault: true,
                            content: new DestinationAddressView({
                                model: new ZonePoliciesModel.address.collection()
                            })
                        },{
                            id:"sourceAddressR",
                            name:"Source Address",
                            content: new SourceAddressView({
                                model: new ZonePoliciesModel.address.collection()
                            })
                        }];
        },

        render: function () {
            this.tabContainerWidget = new TabContainerWidget({
                                            "container": this.el,
                                            "tabs": this.tabs,
                                            "rightAlignment": true
                                        });
            this.tabContainerWidget.build();
            return this;
        }

    });

    return RightTabContainerView;
});