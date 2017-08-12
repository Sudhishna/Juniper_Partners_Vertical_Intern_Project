/** 
 * A module that implements middleware in support of server-side
 * template helpers for plugins.  These helpers allow the plugin
 * developer to reference assets (like images, etc.) in a way
 * that is independent of their location and final name in an
 * environment with an active asset pipeline.
 *
 * Supported helpers are as follows:
 *
 * img_path - Returns the fully resolved path to an image
 * img_url = Returns the fully resolved URL for an image
 *
 * Examples:
 *
 * Wnen called from a plugin at /path/to/plugin
 *
 * img_path('paper.gif') = '/path/to/plugin/img/paper.gif'
 * img_path('/paper.gif') = '/paper.gif'
 * img_url('icons/paper.gif') = 'http://localhost:3000/path/to/plugin/img/icons/paper.gif'
 *
 * @module asset_rewriter
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
var extensions = [".css", ".js"],
	path = require('path'),
	fs = require('fs');

module.exports = function(req, res, next) {
	var path_elements = req.path.split(path.sep).slice(1);

	// Only process files in plugin directories
	if (!(path_elements.length >= 2 && path_elements[0] === req.app.get("plugins_base")))
		return next();

	var ctx_name = path_elements[1];
	var extIndex = findExtensionInPath(extensions, req.path);

	if (extIndex == -1)
		return next();

	var trailing_extensions = req.path.substring(extIndex + 1).split('.');
	/*
	 * Only process files that have a supported trailing extension that
	 * immediately follows the file extension.  This can be made more general
	 * going forward if additional intermediate processors are supported.
	 * eg. css.sass.hogan
	 */
	if (trailing_extensions.length != 2)
		return next();

	var sub_extension = trailing_extensions[1];

	switch (sub_extension) {
		case 'hogan':
			var config = {
				plugins_base: req.app.get("plugins_base"),
				context: {
					name: ctx_name
				},
				asset_host: getAssetHost(req)
			},
			helpers = require('./hogan_asset_helpers')(config),
			hogan = require('hogan.js'),
			data,
			filepath = path.join(req.app.get("docroot"), req.path);

			fs.readFile(filepath, function(err, data) {
				if (err) return next();

                try {
				    data = hogan.compile(data.toString()).render(helpers);
				    res.send(data);
				    res.end();
				}
				catch (e) {
					console.log("Failed to rewrite asset for template ", req.path, ": ", e);
					return next()
				}
			});
	}

	/**
	 * Find one of a list of extensions in a given path.
	 *
	 * @param {Array} extensions - The list of extensions
	 * @param {string} path - The file path to search
	 * @returns The offset of the first extension from the list
	 * of extensions found in the given path.
	 */
	function findExtensionInPath(extensions, path) {
		var extIndex = -1;
		for (var i = 0; i < extensions.length; i++) {
			var extIndex = path.indexOf(extensions[i]);
			if (extIndex != -1) {
				return extIndex;
			}
		}
		return extIndex;
	}

	/**
	 * Get the asset host from a request
	 *
	 * @param {Object} req - The request
	 * @returns The asset host in the form protocol://host:port.
	 */
	function getAssetHost(req) {
		return req.protocol + "://" + req.host + ":" + req.app.get("port");
	}
}