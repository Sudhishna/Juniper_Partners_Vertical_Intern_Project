/** 
 * A module that implements an interface to the Slipstream
 * template renderer.
 *
 * @module
 * @name Slipstream/SDK/Renderer
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(function() {
	Slipstream.module("SDK.Renderer", /** @namespace Slipstream.SDK.Renderer */ function(Renderer, Slipstream, Backbone, Marionette, $, _) {
		// private 

		// public

		/**
		 * Render a template
		 * @memberof Slipstream.SDK.Renderer
         * @param {string | Hogan.Template} template - The template to be rendered
         * @param {Object} data - The data object to be bound to the template
		 */
		Renderer.render = /** @methodof Renderer */ function(template, data) {
			return Slipstream.request("template:render", template, data);
	    }
	});

	return Slipstream.SDK.Renderer;
});