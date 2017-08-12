/**
 * A view that uses the form widget, tabContainer widget and overlay widget to a produce the date search overlay.
 * This view allows to define the date search token.
 *
 * @module Date Search View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/conf/formConfiguration',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    'widgets/tabContainer/tabContainerWidget'
], function(Backbone, formConf, FormWidget, OverlayWidget, TabContainerWidget){
    var FormView = Backbone.View.extend({

        events: {
            'click #add_date_filter': 'addDateToken',
            'click #cancel_date_filter': 'cancelDateFilter'
        },

        initialize: function () {
            this.tabs = [{
                id:"specific",
                name:"Specific Date",
                content: new SpecificDateView(),
                isDefault: true
            },{
                id:"range",
                name:"Range",
                content: new RangeView()
            },{
                id:"before",
                name:"Before",
                content: new BeforeView()
            },{
                id:"after",
                name:"After",
                content: new AfterView()
            }];
            this.overlay = new OverlayWidget({
                view: this,
                type: 'small'
            });
            this.overlay.build();
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConf.dateColumnFilter.Overlay,
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
                "toggle": true
            });
            this.tabContainerWidget.build();
        },

        addDateToken: function (e){
            var activeTabIndex = this.tabContainerWidget.getActiveTabByIndex();
            var activeTabView = this.tabs[activeTabIndex].content;

            //remove existing date token and add new date token
            if (activeTabView.isValidInput()){
                var column = this.options.column,
                    value = activeTabView.getViewData();

                var key = column.index || column.name;
                this.options.removeTokens(column);
                this.options.addTokens(key + ": " + value);
                this.cancelDateFilter(e);
            }
        },

        cancelDateFilter: function (e){
            this.overlay.destroy();
            e.preventDefault();
            e.stopPropagation();
        }

    });

    var SpecificDateView = Backbone.View.extend({
        render: function () {
            this.form = new FormWidget({
                "elements": formConf.dateColumnFilter.SpecificDate,
                "container": this.el
            });
            this.form.build();
            return this;
        },
        getViewData: function (){ // 10/09/2015 4:00:30
            var values = this.form.getValues();
            var viewData = values[0].value + " " + values[1].value + " " + values[2].value;
            return viewData;
        },
        isValidInput: function (){
            return this.form.isValidInput();
        }
    });

    var RangeView = Backbone.View.extend({
        render: function () {
            this.form = new FormWidget({
                "elements": formConf.dateColumnFilter.Range,
                "container": this.el
            });
            this.form.build();
            return this;
        },
        getViewData: function (){ // 10/09/2015 4:00:30 - 10/09/2015 4:00:35
            var values = this.form.getValues();
            var viewDataFrom = values[0].value + " " + values[1].value + " " + values[2].value;
            var viewDataTo = values[3].value + " " + values[4].value + " " + values[5].value;
            return viewDataFrom + " - " + viewDataTo;
        },
        isValidInput: function (){
            return this.form.isValidInput();
        }
    });

    var BeforeView = Backbone.View.extend({ //Before 10/09/2015 4:00:30
        render: function () {
            this.form = new FormWidget({
                "elements": formConf.dateColumnFilter.Before,
                "container": this.el
            });
            this.form.build();
            return this;
        },
        getViewData: function (){
            var values = this.form.getValues();
            var viewData = "Before " + values[0].value + " " + values[1].value + " " + values[2].value;
            return viewData;
        },
        isValidInput: function (){
            return this.form.isValidInput();
        }
    });

    var AfterView = Backbone.View.extend({ //After 10/09/2015 4:00:30
        render: function () {
            this.form = new FormWidget({
                "elements": formConf.dateColumnFilter.After,
                "container": this.el
            });
            this.form.build();
            return this;
        },
        getViewData: function (){
            var values = this.form.getValues();
            var viewData = "After " + values[0].value + " " + values[1].value + " " + values[2].value;
            return viewData;
        },
        isValidInput: function (){
            return this.form.isValidInput();
        }
    });

    return FormView;
});