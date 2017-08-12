/** 
 * A wrapper around the Marionette Application event aggregator
 *
 * @module
 * @name Slipstream/SDK/MessageBus
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(function() {
	Slipstream.module("SDK", /** @lends MessageBus */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
		// private 

		// public

		/**
		 * Return the Slipstream messagebus object
      	 *
      	 * @constructor
		 * @class MessageBus
		 * @classdesc Represents an event aggregstor for use by Slipstream plugins
		 *
		 * This is nothing more than an alias for Slipstream.vent, but
         * insulates clients from name changes should the underlying
         * message bus implementation change.
		 */
		SDK.MessageBus = Slipstream.vent;
	});

	return Slipstream.SDK.MessageBus;
});