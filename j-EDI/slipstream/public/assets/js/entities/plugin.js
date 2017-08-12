/** 
 * A module that implements an entity representing a plugin.
 *
 * @module 
 * @name Slipstream/Entities/Plugin
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(/**  @lends Plugin */ function() {
	Slipstream.module("Entities", function(Entities, Slipstream, Backbone, Marionette, $, _) {
		// private 
		var plugins;

		// public

		/**
         * Construct a model representing a plugin
         *
         * @constructor
         * @class Plugin
         * @classdesc A plugin model
         */
		Entities.Plugin = Backbone.Model.extend({
			urlRoot: "/plugins",

			defaults: {
				name: "unknown",
				publisher: "unknown",
				version: "unknown",
				release_date: "unknown",
				min_platform_version: "unknown",
				activities: [],
                providers: [],
                dashboard: {
                	widgets: []
                }
			}
		});

        /**
         * Construct a plugin collection
         *
         * @constructor
         * @class PluginCollection
         * @classdesc A plugin collection
         */
		Entities.PluginCollection = Backbone.Collection.extend({
			url: "/plugins",
			model: Entities.Plugin
		});

        /**
         * @class API
         * @classdesc The plugin entity API
         */
		var API = {
			/**
			 * Get the set of plugins
			 * 
			 * @memberof API
			 */
			getPluginEntities: function() {
				var defer = new $.Deferred();
				var promise = defer.promise();

				if (plugins === undefined) {
					plugins = new Entities.PluginCollection();

					plugins.fetch({
						success: function(data) {
							defer.resolve(data);
						},
						error: function(data) {
							defer.resolve(undefined);
						}
					});
				} else {
					defer.resolve(plugins);
				}
				return promise;
			}
		};

        /** 
	     * Get plugin entities event
	     *
	     * @event plugin:entities
	     * @type {Object}
	     */
		Slipstream.reqres.setHandler("plugin:entities", function() {
			return API.getPluginEntities();
		});
	});

	return Slipstream.Entities;
});
