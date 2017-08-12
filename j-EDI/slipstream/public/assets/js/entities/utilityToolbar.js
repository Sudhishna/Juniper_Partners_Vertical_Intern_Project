/** 
 * A module that implements an entity representing a plugin.
 *
 * @module 
 * @name Slipstream/Entities/Plugin
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(/**  @lends Plugin */ function() {
	Slipstream.module("Entities.UtilityToolbar", function(UtilityToolbar, Slipstream, Backbone, Marionette, $, _) {
		// private 
		var utilityToolbarCollections = {
			iconElements: null,
			genericElements: null
		};

		/**
         * Construct a model representing a utility toolbar
         * element
         *
         * @constructor
         * @class UtiilityToolbarElement
         * @classdesc A utility toolbar element model
         */
		UtilityToolbar.UtilityToolbarElement = Backbone.Model.extend();

        /**
         * Construct a UtilityToolbar collection
         *
         * @constructor
         * @class UtilityToolbar
         * @classdesc A utility toolbar element collection.
         */
		UtilityToolbar.UtilityToolbarElementCollection = Backbone.Collection.extend({
			model: UtilityToolbar.UtilityToolbarElement,
			comparator: function(m1, m2) {
				return m2.get("priority") - m1.get("priority");
			}
		});

        /**
         * @class API
         * @classdesc The plugin entity API
         */
		var API = {
			getUtilityToolbarEntities: function() {
				return utilityToolbarCollections;
			}
		};

        UtilityToolbar.addInitializer(function() {
            /** 
		     * Get utility toolbar entities event
		     *
		     * @event utilityToolbar:entities
		     * @type {Object}
		     */
			Slipstream.reqres.setHandler("utilityToolbar:entities", function() {
				return API.getUtilityToolbarEntities();
			});

			Slipstream.vent.on("utilityToolbar_element:discovered", function(toolbarElement) {
				var collection;

				if (toolbarElement.icon || toolbarElement.bindsTo) {
		            if (!utilityToolbarCollections.iconElements) {
		            	utilityToolbarCollections.iconElements = new UtilityToolbar.UtilityToolbarElementCollection();
		            }

					collection = utilityToolbarCollections.iconElements;		            
		        }
		        else {
		        	if (!utilityToolbarCollections.genericElements) {
		        		utilityToolbarCollections.genericElements = new UtilityToolbar.UtilityToolbarElementCollection();
		        	}

		        	collection = utilityToolbarCollections.genericElements;
		        }

	            /**
	             * Toolbar elements are ordered in terms of integer 'priority'.
	             * Higher priority elements are rendered before lower priority elements, 
	             * in left to right sequence.
	             */
	            toolbarElement.priority = 1;

	            if (toolbarElement.icon) {
	            	toolbarElement.priority = 2;
	            }
	            else if (toolbarElement.bindsTo == "user") {
	            	toolbarElement.priority = 0; 
	            }

	            collection.add(toolbarElement);    
			})
        });
	});

	return Slipstream.Entities.UtilityToolbar;
});
