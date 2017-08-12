/** 
 * A module that defines a template renderer for Slipstream
 *
 * @module
 * @name Slipstream/TemplateRenderer
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["lib/template_renderer/template_renderer"], /** @lends TemplateRenderer */ function(render_template) {
	Slipstream.module("TemplateRenderer", function(TemplateRenderer, Slipstream, Backbone, Marionette, $, _) {
		/**
       * Provide a custom Marionette Renderer
       */
		Marionette.Renderer.render = render_template;

        /** 
         * Template rendering event
         *
         * @event template:render
         * @type {Object}
         * @property {Object} template - The template to be rendered
         * @property {Object} data - The data to be bound to the template
         */
		Slipstream.reqres.setHandler("template:render", function(template, data) {
            return Marionette.Renderer.render(template, data);
		});
	});
});