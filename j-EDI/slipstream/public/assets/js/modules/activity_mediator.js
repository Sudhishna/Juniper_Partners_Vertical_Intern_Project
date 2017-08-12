/** 
 * A module that implements a mediator for plugin activities.
 *
 * @module Slipstream/ActivityMediator
 * @author Andrew Chasin <achasin@juniper.net>
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(['URI', 'lib/utils'], function(URI, Utils) {
    Slipstream.module("ActivityMediator", /** @namespace Slipstream.ActivityMediator */ function(ActivityMediator, Slipstream, Backbone, Marionette, $, _) {
         function isIntent(obj) {
             return obj instanceof Slipstream.SDK.Intent;
         }

         function isActivityModule(obj) {
             return obj instanceof Object && obj.module  && obj.context;
         }

         function isActivityAllowed(activity) {
             if (!activity.capabilities) {
                return true;
             }

             return Utils.userHasCapabilities(activity.capabilities);
         }

         /**
          * Start an activity
          *
          * @memberof Slipstream.ActivityMediator
          * @param {Intent | Object} intent - If an Intent, then the intent to be
          * matched against registered Activity intents.  If an Object, then the 
          * object must have a 'string' prooperty named 'context' and a string property 
          * named 'module' containing the full path to the activity module.
          * @param {Object} options - Optional object used to pass additional options 
	      * such as properties from a calling activity.
          */
         var start_activity = function(intent, options) {
            var activity;
            options = _.extend({pushHistory: true}, options);

            if (isIntent(intent)) {
                activity = Slipstream.reqres.request("activity:resolve", intent);
            
                if (!activity) {
                    console.log("No activity found for intent", JSON.stringify(intent));
                    return;
                }
            }
            else {
                if (isActivityModule(intent) || (intent instanceof Slipstream.SDK.Activity)) {
                    activity = intent;
                    intent = activity.intent;
                }
            }
            
            if (!activity) {
                throw new Error("An activity can only be started from an Intent or Activity object");
            }

            // Is the current user allowed to execute the activity?
            if (!isActivityAllowed(activity)) {
                console.log("Activity for intent", intent, "cannot be executed because of insufficient user capabilities");
                Slipstream.vent.trigger("ui:privilegesError");
                return;
            }

            console.log("loading module", activity.module);
            Slipstream.vent.trigger("module:load:start", activity.module);

            require([activity.module], function(module) {
                Slipstream.commands.execute("nls:loadBundle", activity.context);
                Slipstream.commands.execute("help:loadBundle", activity.context);
                module_instance = new module();
                
                if (!(module_instance instanceof Slipstream.SDK.BaseActivity)) {
                    throw new Error("module " + activity.module + " is not an activity")
                }
                module_instance.context = activity.context;
                module_instance.context.module = module_instance;
                module_instance.context.onResult = options.callback || null;
                module_instance.intent = intent;
                module_instance.dashboard = activity.dashboard;

                Slipstream.vent.trigger("module:load:success", module_instance);
                console.log("starting module", activity.module);

                Slipstream.vent.trigger("activity:beforeStart", activity);

                // Start the activity's lifecycle
                module_instance.onCreate();
                module_instance.onStart();

                Slipstream.vent.trigger("activity:afterStart", activity);

                if (options.pushHistory && activity.url_path) { 
                    // Push the activity's url into the browser history
                    // along with the intent parameters so that if user bookmarks
                    // and launches the activity via the bookmark, the url_router can
                    // extract the parameters when launched.
                    var full_path = activity.plugin_name + activity.url_path;
                    var url_extras = module_instance.getExtras();
                    
                    if (url_extras) {
                        var uri = new URI(full_path);
                        var query = $.param(url_extras);
    
                        uri.query(query);
                        full_path = uri.toString() /*+ query*/;
                    }
                    Slipstream.execute("route:navigate", full_path);
                }
            }, 
            function(err) {
                Slipstream.vent.trigger("module:load:fail", module_instance);
                console.log("Can't start activity in module", activity.module);
                console.log("Failed module: ", err.requireModules ? err.requireModules[0] : "Unknown");
                console.log("Stack trace:", err.stack);
            });
         }

         ActivityMediator.addInitializer(function() {
             /** 
              * Activity start event
              *
              * @event activity:start
              * @type {Object}
              * @property {Object} intent - The intent for the activity to be started
              * @param {Object} options - Optional object used to pass additional options 
	          * such as properties from a calling activity.
              */
             Slipstream.vent.on("activity:start", function(intent, options) {
                if (!intent) {
                    console.log("Can't start activity from null intent");
                    return;
                }

                var activity = intent;

                if (isIntent(intent)) {
                    activity = Slipstream.reqres.request("activity:resolve", intent);
                
                    if (!activity) {
                        console.log("No activity found for intent", JSON.stringify(intent));
                        return;
                    }

                    activity.intent = intent;
                }

               if (!activity.auth_required) {
                   start_activity(activity, options);
               }
               else {
                     var auth_resolver = new Slipstream.SDK.AuthenticationResolver();

                     auth_resolver.isUserAuthenticated({
                         success: function() {
                             start_activity(intent, options);
                         },
                         fail: function() {
                             var auth_intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_UNAUTHENTICATE, {
                                   uri: new URI("auth://")
                             });

                             start_activity(auth_intent);  
                         }
                    });
                }
             });

         });
    });
    
    return Slipstream.ActivityMediator;
});
