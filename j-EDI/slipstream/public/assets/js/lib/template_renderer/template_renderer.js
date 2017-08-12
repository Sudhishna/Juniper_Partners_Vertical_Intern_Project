/** 
 * A module that defines a custom template renderer.
 *
 * @module 
 * @name template_renderer
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["hogan"], function(Hogan) {
	/**
     * Define a custom template renderer. 
     * @exports template_renderer
     * @param {string | Hogan.Template} template - The template to be rendered
     * @param {Object} data - The data object to be bound to the template
     * @param {Object} partials - The partial templates to expand the original template
     */
	return function(template, data, partials) {
		if (!template) {
            var error = new Error("Invalid template provided");
            error.name = "TemplateNotFoundError";
            throw error;
        }

        var compiledTemplate;
        if (typeof template === "string") {
        	/*
        	 * No point using the TemplateCache here, as templates will be pre-compiled
        	 * in production.
        	 */
        	compiledTemplate = Hogan.compile(template);
        } 
        else if (typeof template == "function") {
            // todo - discuss with andrew !!
            // todo  - currently using underscore template lib - has to go away with hogan
            compiledTemplate = template();
            return compiledTemplate;
        }
        else if ((typeof template === "object") && ('render' in template) && (typeof template.render === "function")) {
            compiledTemplate = template;
        } 
        else {
            var error = new Error("Template not a string or a compiled template");
            error.name = "InvalidTemplateError";
            throw error;
        }

        return compiledTemplate.render(data, partials);
	}
});