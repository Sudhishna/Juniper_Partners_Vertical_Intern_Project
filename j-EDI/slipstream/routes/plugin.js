/** 
 * A module that implements routes for plugins.
 * @module plugin
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
var plugins = function(app) {
	var plugin_cache = require('../modules/plugin_cache'),
		fs = require('fs');
	path = require('path'),
	rmdir = require('rimraf'),
	adm_zip = require('adm-zip'),
	validator = require('../lib/PluginValidator').validator,
	settings = require('../config');

	var plugin_manifest_file_name = "plugin.json";
	var installed_plugins_path = path.join(".", "public", "installed_plugins");
	var http_codes = {
		'OK': 200,
		'CREATED': 201,
		'NOT_FOUND': 404,
		'NOT_ACCEPTABLE': 406,
		'CONFLICT': 409,
		'INTERNAL_SERVER_ERROR': 500
	}


	//initialize plugins cache and start watcher
	plugin_cache.init();

	/**
	 * Get ID from spi filename.
	 *
	 * @param {Object) spi - The adm-zip object representing the spi file.
	 * @returns {string} The name of the plugin that serves as ID, null otherwise.
	 */
	var get_id_from_spi = function(spi) {

		var entries = spi.getEntries();
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			if (entry.entryName.indexOf(plugin_manifest_file_name) != -1) {
				return entry.entryName.substr(0, entry.entryName.lastIndexOf(plugin_manifest_file_name) - 1);
			}
		}
		return null;
	}

	/**
	 * Get the current set of installed plugins.
	 *
	 * @returns {Array} Array of plugins.
	 */
	get_plugins = function() {
		var pluginsArray = [];
		var plugins = plugin_cache.plugins;
		if (plugins) {
			for (key in plugins) {
				pluginsArray.push(plugins[key]);
			}
		}
		return pluginsArray;
	};


	/**
	 * Get the plugin manifest by id.
	 *
	 * @param {string} id - The plugin id to be searched and removed.
	 * @param {Function} callback - The function to be called on task completion.
	 * @returns {Object} A plugin manifest or error JSON.
	 */
	get_plugin_by_id = function(id, callback) {
		var plugins = plugin_cache.plugins;
		if (plugins[id]) {
			callback(http_codes.OK, plugins[id]);
		} else {
			callback(http_codes.NOT_FOUND, {
				status: 'Error - No such plugin found'
			});
		}
	};


	/**
	 * Remove the plugin folder.
	 *
	 * @param {string} id - The plugin id to be searched and removed.
	 * @param {Function} callback - The function to be called on task completion.
	 */
	remove_plugin_by_id = function(id, callback) {
		var plugins = plugin_cache.plugins;
		if (plugins[id]) {
			var plugin_path = path.join(installed_plugins_path, id);
			// will need a different status model if using async
			rmdir(plugin_path, function(err) {
				if (err == undefined) {
					callback(http_codes.OK, {
						status: 'Success - Removed plugin ' + id + ' successfully'
					});
				} else {
					callback(http_codes.INTERNAL_SERVER_ERROR, {
						status: 'Error - Could not remove plugin ' + id + ' err - ' + err.toString()
					});
				}
			});
		} else {
			callback(http_codes.NOT_FOUND, {
				status: 'Error - No such plugin found'
			});
		}
	};

	/**
	 * Create a plugin from given manifest.
	 *
	 * @param {File} plugin_file - The compressed plugin file to be added to system.
	 * @param {Function} callback - The function to be called on task completion.
	 */
	add_plugin = function(plugin_file, callback) {

		var plugins = plugin_cache.plugins;

		fs.readFile(plugin_file.path, function(err, data) {

			var fileName = plugin_file.name;

			if (err) {
				return callback(http_codes.INTERNAL_SERVER_ERROR, {
					status: 'Error - Error in reading plugin file. err - ' + err
				})
			} else {
				var spi = new adm_zip(data);

				var id = get_id_from_spi(spi);

				if (null == id) {
					return callback(http_codes.NOT_ACCEPTABLE, {
						status: 'Error - Missing manifest file'
					});
				} else {
					if (plugins[id]) {
						return callback(http_codes.CONFLICT, {
							status: 'Error - Plugin ' + id + ' already exists. Please use PUT request to update plugin'
						});
					}
				}

				validator.validateSPI(id, data, function(err) {
					if (err == undefined) {
						spi.extractAllTo(installed_plugins_path, false);
						callback(http_codes.CREATED, {
							status: 'Success - Added plugin ' + id,
							id: id
						});
					} else {
						callback(http_codes.NOT_ACCEPTABLE, {
							status: 'Error - ' + err
						});
					}
				});
			}
		});
	};

	/**
	 * Update a plugin with given manifest. Will remove and add dir if name changes.
	 *
	 * @param {string} id - The plugin id to be searched and updated.
	 * @param {File} plugin_file - The compressed plugin_file to update plugin with.
	 * @param {callback} callback - The function to be called on task completion.
	 */
	update_plugin = function(id, plugin_file, callback) {

		var plugins = plugin_cache.plugins;

		fs.readFile(plugin_file.path, function(err, data) {

			var fileName = plugin_file.name;

			if (err) {
				return callback(http_codes.INTERNAL_SERVER_ERROR, {
					status: 'Error - Error in reading plugin file. err - ' + err
				});
			} else {
				var spi = new adm_zip(data);

				var newId = get_id_from_spi(spi);

				if (null == newId) {
					return callback(http_codes.NOT_ACCEPTABLE, {
						status: 'Error - Missing manifest file'
					});
				} else if (newId != id) {
					return callback(http_codes.NOT_ACCEPTABLE, {
						status: 'Error - Provided ID does not match plugin file'
					});
				} else {
					if (!plugins[id]) {
						return callback(http_codes.NOT_FOUND, {
							status: 'Error - No such plugin found'
						});
					}
				}

				var plugin_path = path.join(installed_plugins_path, id);

				validator.validateSPI(id, data, function(err) {
					if (err == undefined) {
						rmdir(plugin_path, function(err) {
							if (err == undefined) {
								spi.extractAllTo(installed_plugins_path, true);
								return callback(http_codes.CREATED, {
									status: 'Success - Updated plugin ' + id,
									id: id
								});
							} else {
								return callback(http_codes.INTERNAL_SERVER_ERROR, {
									status: 'Error - Could not delete previous plugin ' + id + ' err - ' + err.toString()
								});
							}
						});
					} else {
						return callback(http_codes.NOT_ACCEPTABLE, {
							status: 'Error - ' + err
						});
					}
				});
			}
		});
	};


	/**
	 * Get all plugins on system and return response.
	 *
	 * @param {object} req - The express request object
	 * @param {object} res - The express response object
	 * @returns {function}  function that sends JSON response error/response.
	 */
	var findPlugins = function(req, res) {
		var plugins = get_plugins();

		res.setHeader('Content-Type', 'application/json; charset=utf-8');
		return res.send(JSON.stringify(plugins));
	};

	/**
	 * Find a plugin on system by id and return response.
	 *
	 * @param {object} req - The express request object
	 * @param {object} res - The express response object
	 * @returns {function}  function that sends JSON response error/response.
	 */
	var findPluginById = function(req, res) {
		get_plugin_by_id(req.params.id, function(status, message) {

			res.status(status);
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			return res.send(JSON.stringify(message));
		});


	};

	/**
	 * Add a new plugin to system.
	 *
	 * @param {object} req - The express request object
	 * @param {object} res - The express response object
	 * @returns {function}  function that sends JSON response error/response.
	 */
	var addPlugin = function(req, res) {

		if (!req.files.plugin) {
			// empty request
			res.status(http_codes.NOT_ACCEPTABLE);
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			return res.send(JSON.stringify({
				status: 'Error - Missing plugin file'
			}));
		}

		add_plugin(req.files.plugin, function(status, message) {
			res.status(status);
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			return res.send(JSON.stringify(message));
		});
	};

	/**
	 * Update a plugin by id in the system.
	 *
	 * @param {object} req - The express request object
	 * @param {object} res - The express response object
	 * @returns {function}  function that sends JSON response error/response.
	 */
	var updatePlugin = function(req, res) {

		if (!req.files.plugin) {
			// empty request
			res.status(http_codes.NOT_ACCEPTABLE);
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			return res.send(JSON.stringify({
				status: 'Error - Missing plugin file'
			}));
		}

		update_plugin(req.params.id, req.files.plugin, function(status, message) {
			res.status(status);
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			return res.send(JSON.stringify(message));
		});
	};

	/**
	 * Delete a plugin by id in the system.
	 *
	 * @param {object} req - The express request object
	 * @param {object} res - The express response object
	 * @returns {function}  function that sends JSON response error/response.
	 */
	var deletePlugin = function(req, res) {
		remove_plugin_by_id(req.params.id, function(status, message) {
			res.status(status);
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			return res.send(JSON.stringify(message));
		});
	};

	/**
	 * Update called without an id. Fail
	 *
	 * @param {object} req - The express request object
	 * @param {object} res - The express response object
	 */
	var updatePluginWithoutId = function(req, res) {
		res.status(404);
		res.setHeader('Content-Type', 'application/json; charset=utf-8');
		return res.send(JSON.stringify({
			status: 'Error - Could not update plugin. No ID provided'
		}));
	};


	// Get information about all plugins
	app.get('/plugins', findPlugins);

	// Get information about plugin by id
	app.get('/plugins/:id', findPluginById);

	// Create a new plugin
	app.post('/plugins', addPlugin);

	// Update without id
	app.put('/plugins', updatePluginWithoutId)

	// Update an existing plugin
	app.put('/plugins/:id', updatePlugin);

	// Delete a plugin
	app.delete('/plugins/:id', deletePlugin);
};

module.exports = plugins;