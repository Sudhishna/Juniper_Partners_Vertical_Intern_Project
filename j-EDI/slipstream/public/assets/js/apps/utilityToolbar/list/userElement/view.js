/** 
 * A module that implements a view representing the user utility
 * toolbar element.
 *
 * @module 
 * @name Slipstream/UserUtilityToolbarElementView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["text!./templates/item.tpl",
        "../elementView", 
        "widgets/contextMenu/contextMenuWidget"
    ], 
    function(itemTpl, ElementView, ContextMenu) {
        Slipstream.module("UtilityToolbarApp.List.View", function(View, Slipstream, Backbone, Marionette, $, _) {
            View.UserUtilityToolbarElementView = ElementView.extend({

                initialize: function(options) {
                    ElementView.prototype.initialize.call(this, options);
                    this.model.set("icon", "/assets/images/human_one.svg");
                    this.attachContextMenu("a.userid");
                },

                render: function() {
                    ElementView.prototype.render.call(this);
                    var html = Marionette.Renderer.render(itemTpl, {
                        userName: this.model.get("userName")
                    });
                    this.$el.append(html);
                },

                /**
                 * Attach a context menu to this toolbar element.
                 *
                 * @param {String} selector - The selector defining the DOM element within
                 * this view to which this context menu should be attached.
                 */
                attachContextMenu: function(selector) {
                    var self = this;

                    function buildItems() {
                        var actions = self.model.get("actions"),
                            items = [], 
                            item_id = 1;

                        actions.forEach(function(action) {
                            var item = {
                                key: "item_" + item_id++,
                                label: action.label
                            };

                            item.callback = function(key, opt) {
                                var intent;

                                if (action.module) {
                                    intent = {
                                        context: action.context,
                                        module: action.module
                                    };
                                }
                                else if (action.filter) {
                                    var filter = action.filter;

                                    if (filter.data && filter.data.scheme) {
                                        var uri = new Slipstream.SDK.URI();
                                        uri.protocol(filter.data.scheme);
                                        filter.data.uri = uri;
                                    }
                                    intent = new Slipstream.SDK.Intent(action.filter.action, action.filter.data)
                                }
                                Slipstream.vent.trigger("activity:start", intent);
                            };

                            items.push(item);
                        });

                        return items;
                    }

                    var contextMenu = new ContextMenu({
                        container: selector,
                        position: function(opt, x, y) {
                            opt.$menu.position({
                                my: 'center top',
                                at: 'center bottom',
                                of: opt.$trigger
                            });
                        },
                        trigger: "left",
                        context: this.$el,
                        elements: {
                            items: buildItems()
                        }
                    });
                    
                    contextMenu.build();
                }
            });
        });

        return Slipstream.UtilityToolbarApp.List.View.UserUtilityToolbarElementView;
});
