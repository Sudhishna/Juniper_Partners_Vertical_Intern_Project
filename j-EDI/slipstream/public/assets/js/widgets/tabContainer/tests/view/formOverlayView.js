/**
 * A view that uses a configuration object to render a form widget on a overlay to show the usage of tab on a form
 *
 * @module FormOverlayView
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
    '../models/zonePoliciesModel',
    'widgets/overlay/overlayWidget',
    'widgets/form/formWidget',
    '../conf/formConfiguration'
], function(Backbone, TabContainerWidget, CreateView, ApplicationView, DestinationAddressView, SourceAddressView,ZonePoliciesModel, OverlayWidget, FormWidget, formConfiguration){
    var FormOverlayView = Backbone.View.extend({

        events: {
            'click #add_policy_save': 'addPolicy',
            'click #add_policy_cancel': 'closePolicy'
        },

        initialize: function (options){
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
            this.overlay = new OverlayWidget({
                view: this,
                type: 'large'
            });
            this.overlay.build();
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConfiguration.TabOnOverlay,
                "container": this.el
            });
            this.form.build();
            this.addTabs();
            return this;
        },

        addTabs: function (){
            var tabContainer = this.$el.find('.tabs-on-overlay').empty();
            this.tabContainerWidget = new TabContainerWidget({
                "container": tabContainer,
                "tabs": this.tabs
            });
            this.tabContainerWidget.build();
        },

        addPolicy: function (e){
            this.closePolicy(e);
        },

        closePolicy: function (e){
            this.overlay.destroy();
            e.preventDefault();
            e.stopPropagation();
        }

    });

    return FormOverlayView;
});