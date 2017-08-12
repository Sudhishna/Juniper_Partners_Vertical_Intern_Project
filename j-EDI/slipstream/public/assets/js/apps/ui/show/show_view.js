/** 
 * A module that implements a view representing the framework's UI
 *
 * @module 
 * @name Slipstream/UI/Show
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["text!./templates/full_chrome.tpl",
        "text!./templates/content_only.tpl", 
        "text!./templates/default_content.tpl",
        "text!./templates/fatal_error.tpl",
        "text!./templates/busy_template.tpl",
        "text!./templates/global_search.tpl",
        "text!build-info.json",
        "conf/global_config",
        "jquery.tooltipster",
        "lib/i18n/i18n", 
        "sdk/URI", 
        "widgets/spinner/spinnerWidget", 
        'sidr'], 
    function(chromeTemplate, contentOnlyTemplate, defaultTemplate, errorTemplate, busyTemplate, globalSearchTemplate, build_info, global_config, TooltipWidget, i18n, URI, SpinnerWidget, sidr) {
        Slipstream.module("UI.Show", function(Show, Slipstream, Backbone, Marionette, $, _) {
            var uiSelector = "#slipstream_ui";
            var leftNavMinWidth = 220; // pixels

            // global config NLS context
            var global_conf_nls_context = {
                ctx_root: "/assets/js/conf",
                ctx_name: "__global_conf__"
            };

            var global_search = false;

            Slipstream.vent.on("search_provider:discovered", function(provider) {
                 global_search = true;
            });

            Slipstream.commands.execute("nls:loadBundle", global_conf_nls_context);

            if (global_config && global_config.product_name) {
                document.title = 
                    Slipstream.reqres.request("nls:retrieve", {
                        msg: global_config.product_name,
                        namespace: global_conf_nls_context.ctx_name
                    });
            }

            Slipstream.commands.setHandler("ui:setSecondaryNavigationVisibility", function(makeVisible, hasChildren) {
                if (makeVisible) {
                    var rejectVisible = $(".menu-control").hasClass("disabled");

                    if (rejectVisible) {
                        return;
                    }
                }

                var secondaryNavRegion =  $('#secondary-nav-region-wrapper');

                if (secondaryNavRegion.length) {
                     $.sidr(makeVisible ? "open" : "close", 'secondary-nav-region-wrapper');
                }
            })

            Slipstream.commands.setHandler("nav:secondary:activate", function(hasSecondary) {
                if (hasSecondary) {
                     $(".menu-control").removeClass("disabled");
                }
                else {
                    $(".menu-control").addClass("disabled"); 
                }
            })

            /**
             * Construct a FullView of the UI
             *
             * @constructor
             * @class FullView
             * @classdesc A view representing the full framework UI
             */
            Show.FullView = Marionette.ItemView.extend({
                el: uiSelector,
                initialize: function() {
                    this.build_number = undefined;
                    try {
                        this.build_number = $.parseJSON(build_info).build_number;
                    }
                    catch (err) {
                        console.log("Failed to parse build info file:", err);
                    }
                },

                events: {
                    "click .search-button": "doSearch"
                },
                template: chromeTemplate,

                doSearch:function(e) {
                    e.preventDefault();
                    var self = this;
                    var doAction = function() {
                        var query_string = self.global_search_field.val();
                        var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_SEARCH, {uri:new URI("search://")});
                        intent.putExtras({'query': query_string});
                        Slipstream.vent.trigger("activity:start", intent);
                    };
                    Slipstream.commands.execute('navigation:request',{success: doAction, fail:function(){}});
                },

                /**
                 * Render the UI
                 *
                 * @inner
                 */
                render: function() {
                    var logo_link = "#", logo_tooltip_text, logo_src, logo_width, logo_height;
                    var  global_help_id = null;
                    if (global_config && global_config.logo) {
                        logo_link = global_config.logo.link;

                        if (global_config.logo.tooltip) {
                            logo_tooltip_text = Slipstream.reqres.request("nls:retrieve", {
                                msg: global_config.logo.tooltip,
                                namespace: global_conf_nls_context.ctx_name
                            });
                        }

                        if (global_config.logo.img) {
                            if (global_config.logo.img.src) {
                                logo_src = global_config.logo.img.src;
                            }
                            
                            if (global_config.logo.img.height) {
                                logo_height = global_config.logo.img.height;
                            }
                            if (global_config.logo.img.width) {
                                logo_width = global_config.logo.img.width;
                            }
                        } 
                    }

                    if (global_config && global_config.global_help_id) {
                        global_help_id = global_config.global_help_id;
                    }
                    
                    var html = Marionette.Renderer.render(this.getTemplate(), {
                        search: i18n.getMessage("chrome_header_search"),
                        advanced: i18n.getMessage("chrome_header_advanced"),
                        globalSearch: global_search,
                        global_search_placeholder: i18n.getMessage("global_search_placeholder"),
                        logo_link: logo_link,
                        logo_src: logo_src,
                        logo_width: logo_width,
                        logo_height: logo_height,
                        global_help_id: global_help_id
                    },{
                        globalSearchContainer: globalSearchTemplate
                    });

                    this.$el.html(html);

                    if (logo_tooltip_text) {
                        this.$el.find(".logo-section a:first-of-type img").tooltipster({
                            position: "bottom-left",
                            minWidth: 150,           
                            theme: 'tooltipster-shadow',   
                            content: logo_tooltip_text,
                            delay: 250                  
                        });    
                    }

                    // render build number info (temporary)
                    //this.$el.find(".top_help").tooltipster({
                    //    position: "bottom-left",
                    //    minWidth: 150,           
                    //    theme: 'tooltipster-shadow',   
                    //    content: "build: " + this.build_number,
                    //    delay: 250                  
                    //});

                    var self = this;

                    this.global_search_field = $(this.$el).find(".search-section input[type='search']");

                    var secondary_nav_wrapper = $('#secondary-nav-region-wrapper');
                    var left_nav_width = Slipstream.reqres.request("ui:preferences:get", "ui:nav:left:width");

                    secondary_nav_wrapper.css('width', (left_nav_width || leftNavMinWidth) + "px");

                    secondary_nav_wrapper.resizable({
                        handles: "e",
                        minWidth: leftNavMinWidth,
                        ghost: true,
                        stop: function(evt, ui) {
                            var wrapper = $('#leftnav-maincontent-wrapper');
                            var left_nav_width = ui.element.outerWidth();

                            wrapper.css('left', left_nav_width + 'px');   
                            wrapper.css('width', 'calc(100% - ' + left_nav_width + 'px)'); 

                            // Broadcast an event indicating that the left nav width has changed
                            Slipstream.vent.trigger("ui:preferences:change", "ui:nav:left:width", left_nav_width);
                        }
                    });

                    /**
                     * Register a click handler on the menu slider before the sidr handler
                     * so that click events on the sidr can be prevented when the menu control
                     * is disabled.
                     */
                    $(".menu-control-anchor").on("click", function(e) {
                        if ($(".menu-control").hasClass("disabled")) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                        }
                    });

                    var self = this;

                    // Set up slider for left navigation
                    $(".menu-control-anchor").sidr({
                        name: 'secondary-nav-region-wrapper',
                        body: '#leftnav-maincontent-wrapper',
                        onOpen: function() {
                            var sidrWidth = self.$el.find(".sidr").outerWidth();
                            $('#leftnav-maincontent-wrapper').css('width', 'calc(100% - ' + sidrWidth  + 'px)');
                            self.$el.find(".menu-control").addClass("open");
                        },
                        onClose: function() {
                            $('#leftnav-maincontent-wrapper').css('width', ''); 
                             self.$el.find(".menu-control").removeClass("open");   
                        }
                    });
                }
            });

            /**
             * Construct a view of the UI containing only the content region.
             *
             * @constructor
             * @class ContentOnlyView
             * @classdesc A view representing only the UI's content region
             */
            Show.ContentOnlyView = Marionette.ItemView.extend({
            	el: uiSelector,
            	template: contentOnlyTemplate
            });

            /**
             * Construct a default view of the UI
             *
             * @constructor
             * @class DefaultView
             * @classdesc A default view of the UI containing only
             * a simple 'welcome' message in the content region.
             */
            Show.DefaultView = Marionette.ItemView.extend({
                template: defaultTemplate,
 
                /**
                 * Render the default view of the UI
                 * @inner
                 */
                render: function() {
                    var html = Marionette.Renderer.render(this.getTemplate(), {
                        title: i18n.getMessage("welcome_page_title"),
                        subtitle: i18n.getMessage("welcome_page_subtitle")
                    });
                    this.$el.html(html);
                }
            });

            /**
             * Construct an error view
             *
             * @constructor
             * @class ErrorView
             * @classdesc An error view to be shown for fatal errors.
             */
            Show.ErrorView = Marionette.ItemView.extend({
                template: errorTemplate,
 
                serializeData: function() {
                    return {
                        heading: i18n.getMessage("oops"),
                        error_msg: i18n.getMessage("cant_display_page"),
                    };
                }
            });

            /**
             * Construct a 404 view
             *
             * @constructor
             * @class View404
             * @classdesc An error view to be shown for 404 errors.
             */
            Show.Error404View = Marionette.ItemView.extend({
                initialize: function(options) {
                    this.url_path = options.url_path;
                },
                template: errorTemplate,
 
                serializeData: function() {
                    return {
                        heading: i18n.getMessage("page_not_found_heading"),
                        error_msg: i18n.getMessage({
                            msg: "page_not_found",
                            sub_values: [this.url_path]
                        })
                    };
                }
            });

            /**
             * Construct a privileges error view
             *
             * @constructor
             * @class PrivilegesView
             * @classdesc An error view to be shown for privileges errors.
             */
            Show.PrivilegesErrorView = Marionette.ItemView.extend({
                template: errorTemplate,
 
                serializeData: function() {
                    return {
                        heading: i18n.getMessage("insufficient_privileges_heading"),
                        error_msg: i18n.getMessage("insufficient_activity_privileges")
                    };
                }
            });

            /**
             * Construct a busy view
             *
             * @constructor
             * @class BusyView
             * @classdesc A busy view to be shown in the main content area
             */
            Show.BusyView = Marionette.ItemView.extend({
                template: busyTemplate,
                initialize: function() {
                    this.spinner = undefined;
                    this.$background_el = undefined;
                },
                render: function() {
                    var right_pane = $("#slipstream_ui .right-pane");
                    var $pane_el = right_pane.length ? right_pane : $("#slipstream_ui");
                    var html = Marionette.Renderer.render(this.getTemplate());
                    this.$background_el = $(html);
                    $pane_el.append(this.$background_el);
                    
                    // add the busy indicator
                    this.spinner = new SpinnerWidget({
                        container: $pane_el,
                        statusText: " ",
                    }).build();
                },
                remove: function() {
                    if (this.spinner) {
                        this.spinner.destroy();
                    }

                    if (this.$background_el) {
                        this.$background_el.remove();
                    }
                    this.initialize();
                }
            });
        });

        return {
        	FullView: Slipstream.UI.Show.FullView,
        	ContentOnlyView: Slipstream.UI.Show.ContentOnlyView,
            DefaultView: Slipstream.UI.Show.DefaultView,
            ErrorView: Slipstream.UI.Show.ErrorView,
            PrivilegesErrorView: Slipstream.UI.Show.PrivilegesErrorView,
            Error404View: Slipstream.UI.Show.Error404View,
            BusyView: Slipstream.UI.Show.BusyView
        };
});
