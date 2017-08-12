/**
 * A view that uses a configuration object to render a form widget on a overlay to show the usage of tab on a form
 *
 * @module TabsAlignedRightView
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
    var TabsAlignedRightView = Backbone.View.extend({

        events: {
            'click #add_policy_save': 'addPolicy',
            'click #add_policy_cancel': 'closePolicy'
        },

        initialize: function (options){
            this.tabs = [{
                id:"create",
                name:"Create",
                content: new CreateView(),
                isDefault: true
            },{
                id:"application",
                name:"Application",
                content: new ApplicationView({
                    model: new ZonePoliciesModel.application.collection()
                })
            },
            {
                id:"sourceAddress",
                name:"Source Address",
                content: new SourceAddressView({
                    model: new ZonePoliciesModel.address.collection()
                })
            }];
            this.overlay = new OverlayWidget({
                view: this,
                type: 'medium'
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
                "tabs": this.tabs,
                //Add rightAlignment parameter to set the tabs on right by default.
                "rightAlignment": true,
            });
            this.tabContainerWidget.build();
        },

        addPolicy: function (e){
            var tabsData = this.tabContainerWidget.getValidInput(); 
            if(tabsData)
                this.closePolicy(e);
        },

        closePolicy: function (e){
            this.overlay.destroy();
            e.preventDefault();
            e.stopPropagation();
        },

        isValidTabInput: function(){
            return this.form.isValidInput();
        }

    });

    return TabsAlignedRightView;
});