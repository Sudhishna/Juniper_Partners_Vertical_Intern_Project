/** 
 * A module that implements a set of asset path helers
 * for Hogan/mustache templates.
 *
 * img_path - Return the fully resolved path to an image
 * img_url = Return the fully resolved URL to an image
 *
 * examples:
 *
 * /path/to/plugin/css/app.css.hogan contains
 *
 * body
 * {
 *    background-image:url('{{#img_path}} paper.gif {{/img_path}}');
 *    background-image:url('{{#img_path}} /paper.gif {{/img_path}}');
 *    background-image:url('{{#img_url}} icons/paper.gif {{/img_url}}');
 * }
 *
 * Results in:
 *
 * body {
 *    background-image:url('/path/to/plugin/img/paper.gif');
 *    background-image:url('/paper.gif');
 *    background-image:url('http://localhost:3000/path/to/plugin/img/icons/paper.gif');
 * }
 *
 * @module hogan_asset_helpers
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
var url = require('url');

/**
 * Create the asset helpers
 *
 * @param {Object} config - An object used to configure the asset helpers.
 * This object must contain the following members:
 *
 * plugins_base {string} -  The base plugins path.
 *
 * context (Object) - The plugin context for the helpers.  This object must contain
 * a 'name' member providing the name of the context.
 *
 * asset_host {string} - A string containing the URL of the asset host, up to and including
 * the port number.
 *
 * eg. http://cdn.juniper.net:8080.
 */
module.exports = function(config) {
	return {
		img_path: function() {
			return function(img, render) {
				return resolveImgPath(img);
			};
		},
		img_url: function() {
			return function(img, render) {
				var result = resolveImgPath(img);
				if (!url.parse(result).host) {
					result = config.asset_host + result;
				}
				return result;
			}
		}
	};

	/**
	 * Test if a provided URI is absolute i.e. it
	 * specifies a host or a full path from root.
	 *
	 * @param {string} uri - The uri to be tested
	 * @returns {boolean} true if the path is absolute, false otherwise.
	 */
	function isAbsoluteURI(uri) {
		var parsed_uri = url.parse(uri);
		return parsed_uri.protocol || parsed_uri.path.charAt(0) === "/";
	}

	/**
	 * Resolve an image path
	 *
	 * @param {string} img - The provided path to the image
	 * @returns A fully resolved image path
	 */
	function resolveImgPath(img) {
		var img_path = "/img",
			img = img.trim(),
			result = img;

		if (!isAbsoluteURI(img)) {
			result = "/" + config.plugins_base + "/" + config.context.name + img_path + "/" + img;
		}
		return result;
	}
}