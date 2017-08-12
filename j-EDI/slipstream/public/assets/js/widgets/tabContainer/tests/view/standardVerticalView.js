/**
 * A view that uses a configuration object to render a tab container with toggle buttons
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
    'widgets/tabContainer/tests/view/applicationView',
    'widgets/tabContainer/tests/view/destinationAddressView',
    'widgets/tabContainer/tests/view/sourceAddressView',
    'widgets/tabContainer/tests/view/formOverlayView',
    '../models/zonePoliciesModel'
], function(Backbone, TabContainerWidget, CreateView, ApplicationView, DestinationAddressView, SourceAddressView, FormOverlayView, ZonePoliciesModel){
    var TabContainerView = Backbone.View.extend({

        initialize: function () {
            this.tabs = [{
                            id:"createV",
                            name:"Create",
                            content: new CreateView()
                        },{
                            id:"applicationV",
                            name:"Application",
                            content: new ApplicationView({
                                model: new ZonePoliciesModel.application.collection()
                            })
                        },{
                            id:"destinationV",
                            name:"Destination",
                            isDefault: true,
                            content: new DestinationAddressView({
                                model: new ZonePoliciesModel.address.collection()
                            })
                        },{
                            id:"sourceAddressV",
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
                                            "orientation": "vertical",
                                            "height": "540px",
                                            "submit":{
                                                "id": "tabContainer-widget_save",
                                                "name": "save",
                                                "value": "Submit"
                                            }
                                        });
            this.tabContainerWidget.build();
            return this;
        }

    });

    return TabContainerView;
});