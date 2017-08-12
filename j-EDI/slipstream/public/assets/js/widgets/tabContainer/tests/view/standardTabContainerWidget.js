/**
 * A view that uses the Tab Container Widget to render a tab container from a configuration object
 * The configuration object contains the tabs name, the tabs content and other parameters required to build the widget.
 * this is rendered on intial refresh and contains all views
 *
 * @module TabContainer View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Kelcy Newton <knewton@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/tabContainer/tabContainerWidget',
    'widgets/grid/tests/appSmallGrid',
    'widgets/tabContainer/tests/view/addDeviceView',
    'widgets/tabContainer/tests/view/cliView',
    'widgets/tabContainer/tests/view/configView',
    'widgets/tabContainer/tests/view/applicationView',
    './../models/devicesModel',
    'widgets/tabContainer/tests/view/statsView'
], function(Backbone, TabContainerWidget, CurrentDevicesView, AddDeviceView, CliView, ConfigView, ApplicationView, DevicesModel, StatsView){
    var TestTabContainerView = Backbone.View.extend({

        events: {
            // 'click #tabContainer-widget_save': 'getTabsData',
            // 'click .addTab': 'addTab',
            // 'click .removeTab': 'removeTab',
        },

        /**
         * Create the tab view configuration and dictate the view within each tab,
         * @param none
         * @return none
         */
        initialize: function () {
            this.tabs = [
                      {
                            id:"devices",
                            name:"My Devices",
                            isDefault: true, //the default tab that appears
                            content: new CurrentDevicesView()
                        },{
                            id:"addDevice",
                            name:"Add a Device",
                            content: new AddDeviceView()
                        },{
                            id:"cli",
                            name:"Run a CLI Command",
                            content: new CliView({
                              model: new DevicesModel.application.collection() //pulling data through the devicesModel
                            })
                        },{
                            id:"configure",
                            name:"Configure a Device",
                            content: new ConfigView({
                              model: new DevicesModel.application.collection() //pulling data through the devicesModel
                            })
                        },{
                            id:"stats",
                            name:"Device Statistics",
                            content: new StatsView.view1()
                        }];
            this.actionEvents = {
                tabClickEvent: "tabSelect"
            };
            this.render();
        },

        /**
         * refresh the donut charts with new information (if any)
         * @param none
         * @return the tabContainerWidget
         */
        render: function () {
            //find where to put the tab in the main html file
            $tabContainer = this.$el.find('#navigationTab');
            //create the tabContainerWidget with specified configuration from initialize
            this.tabContainerWidget = new TabContainerWidget({
                "container": $tabContainer,
                "tabs": this.tabs,
              //  "height": "600px",
                "height": "auto",
                // "orientation": "vertical",
                actionEvents: this.actionEvents,
                // "submit":{
                //     "id": "tabContainer-widget_save",
                //     "name": "save",
                //     "value": "Submit"
                // }
            });
            this.tabContainerWidget.build();
            this.bindTabEvents();
            return this;
        },

        bindTabEvents: function () {
            this.$el
                .bind(this.actionEvents.tabClickEvent, function(e, obj){
                    console.log(obj);
                    console.log("Tab Clicked")

                });
        },

        // addTabButtons: function () {
        //     var $submitContainer = this.$el.find("#tabContainer-widget_save");
        //     $submitContainer.after('<a class="removeTab">Remove Tab</a>');
        //     $submitContainer.after('<a class="addTab">Add New Tab</a>');
        // },

        /**
         * get data from tabs
         * @param none
         * @return none
         */
        getTabsData: function() {
            var tabsData = this.tabContainerWidget.getValidInput();
        },

        /**
         * add a new tab to the tabContainerWidget
         * @param none
         * @return none
         */
        addTab: function(){
            var tab = {
                id:"address",
                name:"Address",
                content: new AddressView()
            };
            this.tabContainerWidget.addTab(tab);
            this.tabContainerWidget.setActiveTab("address");
            console.log(this.tabContainerWidget.getActiveTab());
        },

        /**
         * remove a tab from the tabContainerWidget
         * @param id of the tab (string)
         * @return none
         */
        removeTab: function(id){
            this.tabContainerWidget.removeTab('address');
        }

    });

    return TestTabContainerView;
});
