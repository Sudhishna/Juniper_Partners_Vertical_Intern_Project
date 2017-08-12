define(["marionette", 
        "widgets/tabContainer/tabContainerWidget",
        "./notificationItemView.js",
        "text!../../templates/notificationContainer.tpl",
        "../models/alarmCollection.js", 
        "../models/alertCollection.js"], 
    function(Marionette, TabContainerWidget, notificationItemView, notificationContainerTemplate, AlarmCollection, AlertCollection) {
        var alarmView = Marionette.CollectionView.extend({
            className: "slipstream_notification_center",
            events: {
                "click": function(e) {
                    var target = $(e.target);
                    if (!target.is( "a.view_all, div[class^='notification']" )) {
                        // only propagate click events for notification or 'view all' links.
                        e.stopPropagation();
                    }
                }
            },
            render: function() {
                this.isClosed = false;

                var alarmCollection = new AlarmCollection([], {
                    resolver: Slipstream.SDK.AlarmResolver
                });

                var alertCollection = new AlertCollection([], {
                   resolver: Slipstream.SDK.AlertResolver
                });

                this.alarmView = 
                    new (Marionette.CompositeView.extend({
                         template: notificationContainerTemplate,
                         events: {
                            "click a" : doNotificationClick
                         },
                         collection: alarmCollection,
                         itemView: notificationItemView,
                         itemViewContainer: ".notifications",
                         serializeData: function() {
                            return {
                                title_msg: Slipstream.reqres.request("nls:retrieve", {msg: "notification_center_alarms_header_title"}),
                                view_all_msg: Slipstream.reqres.request("nls:retrieve", {msg: "notification_center_view_all_alarms"}),
                                collection_url: this.collection.collectionURL
                            }
                         }
                    }))();

                this.alertView = 
                    new (Marionette.CompositeView.extend({
                         template: notificationContainerTemplate,
                         events: {
                            "click a" : doNotificationClick
                         },
                         collection: alertCollection,
                         itemView: notificationItemView,
                         itemViewContainer: ".notifications",
                         serializeData: function() {
                            return {
                                title_msg: Slipstream.reqres.request("nls:retrieve", {msg: "notification_center_alerts_header_title"}),
                                view_all_msg: Slipstream.reqres.request("nls:retrieve", {msg: "notification_center_view_all_alerts"}),
                                collection_url: this.collection.collectionURL
                            }
                         }
                    }))();

                var tabs = [
                    {
                         name: Slipstream.reqres.request("nls:retrieve", {msg: "notification_center_alarms"}),
                         content: this.alarmView,
                         id: "__ss_alarms_tab",
                         isDefault: true
                    },
                    {
                         name: Slipstream.reqres.request("nls:retrieve", {msg: "notification_center_alerts"}),
                         content: this.alertView,
                         id: "__ss_alerts_tab"
                    }
                ];

                alarmCollection.fetch({reset:true});
                alertCollection.fetch({reset:true});

                this.tabContainer = new TabContainerWidget({
                    container: this.el, 
                    tabs: tabs
                });  

                this.tabContainer.build();

                function doNotificationClick(e) {
                    e.preventDefault();

                    var doAction = function(){
                        var href = $(e.target).closest("a").attr("href");
                        Slipstream.commands.execute("route:navigate", href, {trigger:true});
                    };
                    Slipstream.commands.execute('navigation:request',{success: doAction, fail:function(){}});
                }
            },
            onBeforeClose: function() {
                this.alarmView.close();
                this.alertView.close();

                if (this.tabContainer) {
                    this.tabContainer.destroy();
                }
            }
        });

        return alarmView;
});