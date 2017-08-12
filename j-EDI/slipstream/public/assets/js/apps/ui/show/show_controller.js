/** 
 * A module that implements a controller responsible for
 * rendering the framework UI.
 *
 * @module 
 * @name Slipstream/UI/Show
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["./show_view", "lib/help/openHelp"], function(UIView, Help) {
    Slipstream.module("UI.Show", /** @lends Controller */ function(Show, Slipstream, Backbone, Marionette, $, _) {

    	var all_regions = {
        	primaryNavRegion: '#primary-nav-region',
        	secondaryNavRegion: '#secondary-nav-region',
        	mainRegion: '#main_content',
            breadcrumbRegion: '#breadcrumb-region',
            overlayRegion: '#overlay_content'
    	};
        var help = new Help();
        var busyView;

        /**
         * @class Controller
         * @classdesc Controller for displaying the framework UI
         */
        Show.Controller = {
            /**
             * Display the framework UI
             *
             * @memberof Controller
             */
            show: function(contentOnly) {
                Slipstream.vent.trigger("ui:beforeShow");
                deleteExistingRegions();

                var regions = all_regions;
                
                if (contentOnly) {
                    new UIView.ContentOnlyView().render();
                    regions = {
                        mainRegion: all_regions.mainRegion
                    };
                }
                else {
                    new UIView.FullView().render();
                }
                Slipstream.addRegions(regions);

                busyView = new UIView.BusyView();
               
                if (!contentOnly) {
                    require(["apps/navigation/navigation_app",
                             "apps/utilityToolbar/app", 
                             "apps/breadcrumbs/app"], function(Navigation, Toolbar, Breadcrumbs) {
                        Navigation.stop();
                        Toolbar.stop();
                        Navigation.start();
                        Toolbar.start();

                        Slipstream.vent.trigger("ui:afterShow");
                    });
                }

                 // add listener for events that bubble up from child.
               $('body').on('click', "[data-ua-id]", function(evt){
                    var $target = evt.originalEvent? $(evt.originalEvent.target) : $(evt.target);
                    if ($target.hasClass("ua-field-help") || ( $target.hasClass("slipstream-top-help") && $target.hasClass("toolbar_icon") ) ) {
                        evt.stopPropagation();
                        var ua_csh_id = evt.target.getAttribute('data-ua-id');
                        if(ua_csh_id){
                            /*
                             uncomment this block when iX will have locale specific help pages
                             */
                            // var locale = window.navigator.language.toLowerCase();
                            // if(locale ==='en-us'){
                            //     locale = 'en_US';
                            // }

                            var locale = 'en_US';
                            if($target.hasClass("slipstream-top-help")) {
                                help.openHelp(ua_csh_id, locale);
                            } else {
                                require(["lib/help/helpMap"], function(helpMap){
                                    var url = helpMap.getHelp(ua_csh_id);
                                    help.openHelp(url, locale);
                                });
                            }
                        }
                    }
                });
            },

            /**
             * Show a fatal error in the main content pane
             */
            fatalError: function() {
                var errorView = new UIView.ErrorView();
                Slipstream.vent.trigger('view:render', errorView);
            },
            privilegesError: function() {
                var errorView = new UIView.PrivilegesErrorView();
                Slipstream.vent.trigger('view:render', errorView);
            },
            error404: function(url_path) {
                var errorView = new UIView.Error404View({url_path: url_path});
                Slipstream.vent.trigger('view:render', errorView);
            },
            showBusy: function() {
                if (busyView) {
                    busyView.render();
                }
            },
            hideBusy: function() {
                if (busyView) {
                    busyView.remove();
                }
            }
        };

        /**
         * Delete all existing UI regions
         */
        function deleteExistingRegions() {
            for (var r in all_regions) {
                if (Slipstream.getRegion(r)) { 
                    Slipstream.removeRegion(r);
                }
            }

            $('#slipstream_ui').off('click');
        }

        Slipstream.vent.on("router:afterStart", function() {
            Slipstream.commands.execute("nav:selectDefault");
        })
    });

    return Slipstream.UI.Show.Controller;
});