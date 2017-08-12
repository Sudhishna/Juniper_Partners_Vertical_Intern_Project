/** 
 * A module that implements a mediator for dashboard widgets
 *
 * @module Slipstream/DashboardMediator
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(['widgets/dashboard/dashboard'], function(Dashboard) {
    Slipstream.module("DashboardMediator", /** @namespace Slipstream.DashboardMediator */ function(DashboardMediator, Slipstream, Backbone, Marionette, $, _) {

        var separator = '/';
        var img_path_prefix = 'img';

        var dashboard = new Dashboard();

        var BBView = Backbone.View.extend({
            initialize: function(options) {
                _.extend(this, options);
            },
            render: function() {
                this.$el.html(this.template);
                return this;
            }
        });
        /**
         * Load dashboard widget
         *
         * @memberof Slipstream.DashboardMediator
         * @param {Object} - The widget to be loaded
         */
        var load_dashboard_widget = function(widget) {
            console.log("loading dashboard widget", JSON.stringify(widget));
            require([widget.module, widget.customEditView, widget.filterConf], function(module, customEditView, filterConf) {
                
                Slipstream.commands.execute("nls:loadBundle", widget.context);
                var filters = filterConf ? new filterConf().getValues() : undefined;
                var dashboardWidget = {
                    title: widget.title,
                    size: widget.size,
                    details: widget.details,
                    image: new BBView({
                        template: '<div><img src="' + widget.context.ctx_root + separator + img_path_prefix + separator +  widget.thumbnail + '"></div>'
                    }),
                    view: module,
                    customEditView: customEditView,
                    context: widget.context,
                    customInitData: widget.customInitData,
                    filters: filters
                };

                dashboard.addDashboardWidget(dashboardWidget);
                
            },
            function(err) {
                console.log("Can't load dashboard widget", widget.module);
                console.log("Failed module: ", err.requireModules ? err.requireModules[0] : "Unknown");
                console.log("Stack trace:", err.stack);
            });
        };



        DashboardMediator.addInitializer(function() {
            /** 
             * Dashboard Widget Discovered event
             *
             * @event dashboard_widget:discovered
             * @type {Object}
             * @property {Object} widget - The dashboard widget that's been discovered
             */
            Slipstream.vent.on("dashboard_widget:discovered", function(widget) {
                console.log("got dashboard_widget:discovered event", JSON.stringify(widget));
                load_dashboard_widget(widget);
            });

            Slipstream.reqres.setHandler("dashboard:get", function() {
                console.log('got dashboard:get event');
                return dashboard;
            });
        });
    });

    return Slipstream.DashboardMediator;
});
