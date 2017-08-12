/** 
 * A module that implements a view representing a utility toolbar element
 *
 * @module 
 * @name Slipstream/UtilityToolbarElementView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["jquery.tooltipster",
        "text!./templates/item.tpl",
        "text!./templates/badge.tpl",
        "text!./templates/badgeText.tpl",
        "modules/view_adapter",
        "./util"
    ],  
    function(tooltipster, itemTpl, badgeTpl, badgeTextTpl, ViewAdapter, Util) {
        Slipstream.module("UtilityToolbarApp.List.View", function(View, Slipstream, Backbone, Marionette, $, _) {
            var TooltipRegion = Marionette.Region.extend({
                el: $("<div>")
            });

            View.UtilityToolbarElementView = Marionette.ItemView.extend({
                template: itemTpl,
                tagName: "li",
                className: "utility_toolbar_element",

                initialize: function(options) {
                    this.onselect_activity = options.onselect_activity;
                    this.model.on("change", this.render);

                    var hover = this.model.get("hover");

                    if (hover && hover.view) {
                        this.initHoverView();
                    }
                },

                events: {
                    "click": "launchOnSelectActivity"
                },

                /**
                 * Initialize the hover view.  The view is pre-loaded
                 * so that there is no latency caused by loading the view
                 * module on first hover.
                 */
                initHoverView: function() {
                    var hoverView = this.model.get("hover").view;

                    if (hoverView) { 
                        var self = this;

                        // load the hover view and bind it to the tooltip
                        require([hoverView], function(HoverView) {
                            self.model.get("hover").view = HoverView;
                            self.bindHoverView();
                        }, 
                        function(err) {
                            console.log("Failed to load hover view module", hoverView, err);
                        });
                    }
                },

                /**
                 * Bind the hover view to the tooltip
                 */
                bindHoverView: function() {
                    var self = this,
                        tooltipRegion = new TooltipRegion();   

                    this.$el.tooltipster({
                        position: "bottom-right",           // place tooltips below the toolbar element
                        theme: 'tooltipster-shadow toolbar-tooltip',   
                        contentAsHTML: true,          // Allow HTML in the view
                        interactive: true,            // Allow the tooltip content to be interacted with
                        delay: 250,                   // 250ms delay before tooltip is displayed
                        trigger: "click",
                        contentCloning: false,
                        /**
                         * Provide a 'before' callback for the tooltip that will
                         * render the hover view and insert the content in the tooltip.
                         */
                        functionBefore: function(origin, continueTooltip) {
                            var View = self.model.get("hover").view;
                            var viewAdapter = new ViewAdapter({view: new View()});

                            tooltipRegion.show(viewAdapter);

                            if (viewAdapter.rendered) {
                                origin.tooltipster("content", tooltipRegion.el);
                                continueTooltip();
                            }
                            else {
                                tooltipRegion.reset();
                            }
                        },
                        functionAfter: function(origin) {
                            tooltipRegion.reset();
                        },
                        functionReady: function(origin, tooltip) {
                            $(tooltip).on('click', function(){
                                $(origin).tooltipster('hide');
                            });
                        }
                    });
                },

                render: function() {
                    var html = Marionette.Renderer.render(this.getTemplate(), {
                        icon_url: this.model.get("icon")
                    });

                    this.$el.html(html);

                    // Set the element's icon badge
                    this.renderIconBadge();
                },

                /**
                 * Render an icon badge for the toolbar element (if one exists). 
                 */
                renderIconBadge: function() {
                    var badge = this.model.get("iconBadge");
                    if (badge) {
                        var toolbarBadge = $(badgeTpl);

                        if (typeof badge == "number") {
                            var badgeText = Marionette.Renderer.render(badgeTextTpl, {
                                badge_number: badge
                            });
                         
                            toolbarBadge.addClass("toolbar_numeric_badge");
                            toolbarBadge.append(badgeText);
                        }
                        else if (typeof badge == "string") {
                            var icon_path = this.model.get("root_icon_path") + "/" + badge;
                            toolbarBadge.css("background", "url('" + icon_path + "') no-repeat");    
                        }
                        this.$el.append(toolbarBadge);
                    }    
                },

                /**
                 * Start the activity associated with selection of the toolbar element.
                 * @inner
                 */
                launchOnSelectActivity: function() {
                    var activity = this.model.get("onselect_activity"),
                        self = this;

                    if (activity) {
                        require([this.model.get("protoModule")], function(ProtoModule) {
                            var intent = Util.createToolbarIntent(activity, self.model, ProtoModule);
                            Slipstream.vent.trigger("activity:start", intent);
                        });
                    }
                }
            });
        });

        return Slipstream.UtilityToolbarApp.List.View.UtilityToolbarElementView;
});