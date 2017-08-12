/** 
 * A module that implements a URL router for 
 * routing URL requests to action methods.
 *
 * @module Slipstream/URLRouter
 * @author Andrew Chasin <achasin@juniper.net>
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(['URI', 'jquery-deparam'], function(URI, deparam) {
    Slipstream.module("URLRouter", /** @namespace Slipstream.URLRouter */ function(URLRouter, Slipstream, Backbone, Marionette, $, _) {
        var route_map = {};
        var url_router = null;

        URLRouter.addInitializer(function() {
             /** 
              * Activity discovered event
              *
              * @event activity:discovered
              * @type {Object}
              * @property {Object} route - The route that's been discovered
              */
             Slipstream.vent.on("activity:discovered", function(activity) {
                // console.log("url router got activity:discovered event", JSON.stringify(activity));
                if (activity.url_path) {
                    register_route(activity);
                }
             });

             /** 
              * Plugin discovery complete event
              *
              * @event plugin:discovery:complete
              */
              Slipstream.vent.on("ui:afterShow", function() {
                  console.log("setting up URL router");
                  /**
                    * Create a custom URL router
                    */
                  URLRouter = Backbone.Router.extend({
                      routes: {
                          ":plugin_name(/*url_path)": "triggerActivity"
                      },
                      triggerActivity: function(plugin_name, url_path) {
                          /**
                           * If no plugin name is provided in the URL, plugin_name
                           * could start with a query string or hash parameter.  Remove them
                           * before trying to resolve the plugin name.
                           */
                          var nameStripper = /^[#?].*$/;
                          plugin_name = plugin_name.replace(nameStripper, '');

                          if (plugin_name) {
                             Slipstream.vent.trigger("ui:nav:url", url_path);
                             
                             // strip off the params before resolving the activity
                             if (url_path) {
                                 var params_start = url_path.indexOf("?");
                                 if (params_start != -1) {
                                     url_path = url_path.slice(0, params_start);
                                 }
                                 
                                 if (url_path == "") {
                                     url_path = null;
                                 }
                             }

                             var activity = resolve_route(plugin_name, url_path);

                             if (activity) {
                                var action = activity.filters[0].action;
                                var data = activity.filters[0].data.mime_type;
                                activity.intent = new Slipstream.SDK.Intent(action, data);

                                var params = window.location.search.substring(1);

                                if (params) {
                                    // URI.js needs a string pre-pended with ? to know
                                    // where to start processing for url params
                                    var uri = new URI("?" + params);
                                    var extras = $.deparam(uri.query(), true);  
                                    activity.intent.putExtras(extras);
                                }
                                
                                Slipstream.vent.trigger("activity:start", activity, {pushHistory:false}); 
                            }
                            else {
                                Slipstream.vent.trigger("ui:404", window.location);
                            }
                         }
                      }
                 });
     
                 url_router = new URLRouter();

                 Backbone.history.getFragment = 
                     function(fragment, forcePushState) {
                         if (fragment == null) {
                             fragment = window.location.pathname + window.location.search;
                         }
                         return Backbone.History.prototype.getFragment.call(this, fragment, forcePushState);
                     }

                 Slipstream.vent.trigger("router:beforeStart");

                 Backbone.history.start({pushState: true});

                 Slipstream.vent.trigger("router:afterStart");

                 //var ui_preferences = Slipstream.reqres.request("ui:preferences:get");

                 //if (window.location.pathname == "/") {
                 //    if (ui_preferences.nav.url) {
                 //        Slipstream.execute("route:navigate", ui_preferences.nav.url, {trigger:true});
                 //    }
                 //}
            });

            Slipstream.commands.setHandler("route:navigate", function(path, options) {
                url_router.navigate(path, options); 
                Slipstream.commands.execute("analytics_provider:trackEvent", "Navigate", "URL", path);
            });
        });  

        /**
         * Register a URL route to an activity
         *
         * @memberof Slipstream.URLRouter
         * @param {Activity} activity - A plugin activity whose URL route is to be registered.
         */
         var register_route = function(activity) {
             if (!route_map[activity.plugin_name]) {
                 route_map[activity.plugin_name] = {};
             }
            
             var url_path = activity.url_path.substr(1);  // remove leading '/' from url_path
             var url_path = url_path == "" ? null : url_path;
             route_map[activity.plugin_name][url_path] = activity;  
             console.log("registered route for " + activity.plugin_name + "/" + (url_path ? url_path : ""));  
         }
        
        /**
         * Resolve a URL route to an activity
         *
         * @memberof Slipstream.URLRouter
         * @param {String} plugin_name - The name of the plugin from the route.
         * @param {String} url_path - The URL path portion of the route.
         * @returns {Activity} - The activity corresponding to the resolved route, or null if none exists
         */
         var resolve_route = function(plugin_name, url_path) {
             console.log("resolving router for ", plugin_name, url_path);
             var activity = null;
             if (route_map[plugin_name]) {
                 activity = route_map[plugin_name][url_path]; 
             }
             
             return activity == undefined ? null : activity;
         }  
    
        return Slipstream.URLRouter;
    });
});
