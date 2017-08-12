/** 
 * A module that implements a resolver for intents.
 *
 * @module Slipstream/IntentResolver
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(function(utils) {
    Slipstream.module("IntentResolver", /** @namespace Slipstream.IntentResolver */ function(IntentResolver, Slipstream, Backbone, Marionette, $, _) {

        /**
         *  A local class representing an intent filter.
         */
        function Filter(action, data) {
            this.action = action;
            this.data = data;    
        }

        /**
         * Determine if a filter has specified a MIME type
         *
         * @return true if the filter has specified a MIME type,
         * false otherwise.
         */
        Filter.prototype.hasMimeType = function() {
           return this.data && this.data.mime_type;
        }

        /**
         * Determine if a filter has specified a URI scheme.
         *
         * @return true if the filter has specified a URI scheme,
         * false otherwise.
         */
        Filter.prototype.hasScheme = function() {
           return this.data && this.data.scheme;
        }

        var action_to_activity_map = {},
            type_to_activity_map = {},
            scheme_to_activity_map = {};

         /**
          * Register the filters for an activity.
          *
          * @memberof Slipstream.ActivityMediator
          * @param {Activity} activity - An activity whose filters are
          * to be registered.
          */
         var register_activity_filters = function(activity) {
            console.log("registering activity filters");
            if (activity.filters) {
                activity.filters.forEach(function(filter) {
                    register_filter(filter, activity);
                });
            }
         }

         /**
          * Register an activcity filter.
          *
          * @memberof Slipstream.ActivityMediator
          * @param {Object} filter - The filter to be registered
          * @param {Activity} activity - The activity associated with
          * the filter.
          */
         var register_filter = function(filter, activity) {
             register_type_filter(filter, activity);
             register_scheme_filter(filter, activity);
         }

         /**
          * Register a type filter.
          *
          * @memberof Slipstream.ActivityMediator
          * @param {Object} filter - The filter to be registered by type.
          * @param {Activity} activity - The activity associated with
          * the filter.
          */
         var register_type_filter = function(filter, activity) {
              if (filter.data && filter.data.mime_type) {
                  var arr = type_to_activity_map[filter.data.mime_type] || [];
                  arr.push({activity: activity, filter: new Filter(filter.action, filter.data)});
                  type_to_activity_map[filter.data.mime_type] = arr;
              }
         }

         /**
          * Register a scheme filter.
          *
          * @memberof Slipstream.ActivityMediator
          * @param {Object} filter - The type filter to be registered by scheme.
          * @param {Activity} activity - The activity associated with
          * the filter.
          */
         var register_scheme_filter = function(filter, activity) {
             if (filter.data && filter.data.scheme) {
                  var arr = scheme_to_activity_map[filter.data.scheme] || [];
                  arr.push({activity: activity, filter: new Filter(filter.action, filter.data)});
                  scheme_to_activity_map[filter.data.scheme] = arr;
              } 
         }

         /**
          * Resolve an intent to a set of activities.
          *
          * @memberof Slipstream.ActivityMediator
          * @param {Object} intent - the Intent to be resolved.
          */
         var resolve_intent = function(intent) {
             var resolved_activities = [],
                 activities_by_scheme = null,
                 activities_by_type = null,
                 uri = intent.data.uri || null,
                 scheme = uri ? uri.scheme() : null, //intent.data && intent.data.scheme ? intent.data.scheme : null;
                 mimeType = intent.data.mime_type && intent.data.mime_type ? intent.data.mime_type : null;

             if (scheme) {
                 activities_by_scheme = scheme_to_activity_map[scheme];
                 if (activities_by_scheme) {
                     Array.prototype.push.apply(resolved_activities, resolve_activities(activities_by_scheme, intent.action, mimeType, scheme));
                 }
             }

             if (mimeType) {
                 activities_by_type = type_to_activity_map[intent.data.mime_type];
                 if (activities_by_type) {
                     Array.prototype.push.apply(resolved_activities, resolve_activities(activities_by_type, intent.action, mimeType, scheme));
                 }
             }

             return resolved_activities.length == 0 ? null : _.extend(new Slipstream.SDK.Activity(), resolved_activities[0]);
         }

         /**
          * Resolve activities by action/URI.
          *
          * @memberof Slipstream.ActivityMediator
          * @param {Object} filter_map - The map of filters to be checked for resolution.
          * @param {String} action - The action to be checked during resolution.
          * @param {String} mimeType - The MIME tyep to be checked during resolution.
          * @param {String} scheme - The scheme to be checcked during resolution.
          * @return The set of activities that match the resolution criteria.
          */
         var resolve_activities = function(filter_map, action, mimeType, scheme) {
            var activities = [];

            for (i = 0; i < filter_map.length; i++) {
                 var filter = filter_map[i].filter;

                 if (filter.action != action) {
                     continue;
                 }

                 if (mimeType) {
                     if (!filter.hasMimeType() || mimeType != filter.data.mime_type) {
                        continue;
                     }
                 } 

                 if (scheme) {
                     if (!filter.hasScheme() || scheme != filter.data.scheme) {
                        continue;
                     }
                 }

                 activities.push(filter_map[i].activity);
             }; 

             return activities;
         }

         IntentResolver.addInitializer(function() {
             /** 
              * Activity discovered event
              *
              * @event activity:discovered
              * @type {Object}
              * @property {Object} activity - The activity that's been discovered
              */
             Slipstream.vent.on("activity:discovered", function(activity) {
                // console.log("got activity:discovered event", JSON.stringify(activity));
                register_activity_filters(activity);
             });

             /** 
              * Activity resolve event
              *
              * @event activity:resolve
              * @type {Object}
              * @property {Object} intent - The intentn to be resolved.
              */
             Slipstream.reqres.setHandler("activity:resolve", function(intent) {
                console.log("got activity:resolve event", JSON.stringify(intent));
                return resolve_intent(intent);
             });
         });
    });
    
    return Slipstream.IntentResolver;
});
