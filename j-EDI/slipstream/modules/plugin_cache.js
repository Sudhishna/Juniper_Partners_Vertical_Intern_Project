
/** 
 * A module that implements a cache of plugins.  The cache will be primed when
 * the module is loaded and will be kept up to date as new plugins are installed/removed.
 * 
 * @module plugin_cache
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

var fs = require('fs'),
    path = require('path'),
    watcher = require('chokidar'),
    pubsub = require('./pubsub'),
    plugins = {},
    plugin_manifest_file_name = "plugin.json",
    installed_plugins_root = path.join("installed_plugins"),
    installed_plugins_path = path.join(".", "public", "installed_plugins");

/**
 * Test if a provided path is a plugin directory.
 *
 * @param {string} dir_path - The path to be tested
 * @returns {boolean} true if the path is a plugin direfctory, false otherwise.
 */
var is_plugin_dir = function(dir_path) {
     var dir_stat = fs.statSync(dir_path);
     return dir_stat                 && 
            dir_stat.isDirectory()   &&
            (installed_plugins_path == path.dirname(dir_path)) &&
            fs.existsSync(path.join(dir_path, plugin_manifest_file_name));
};


/**
 * Load a plugin's manifest.
 *
 * @param {string} plugin_dir - The path to the plugin directory.
 * @returns {Object} An object representing the plugin manifest or undefined 
 *                   if the manifest can't be loaded.
 */
var load_plugin_manifest = function(plugin_dir) {
    var path_to_manifest = path.join(plugin_dir, plugin_manifest_file_name);
    var plugin_manifest = undefined;
    try {
        plugin_manifest = JSON.parse(fs.readFileSync(path_to_manifest));
        plugin_manifest.root = path.join(installed_plugins_root, path.sep, path.basename(plugin_dir));
    }
    catch (err) {
        console.log("Failed to load plugin manifest", path_to_manifest, ": err=", err);
    }
    return plugin_manifest;
};


/**
 * Initialize plugins object.
 *
 * @param {string} dir - The root directory to search for plugins.
 */
var initialize_plugins = function(dir) {
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        dir_path = path.join(dir, file);
        add_plugin_to_cache(dir_path);
    });
};


/**
 * Add the plugin to cache after validation.
 *
 * @param {string} dir_name - The dir name where new file was created.
 */
var add_plugin_to_cache = function(dir_name) {
    if (is_plugin_dir(dir_name)) {
        console.log('Plugin directory', dir_name, 'added');
        // load the plugin manifest file
        plugin_manifest = load_plugin_manifest(dir_name);
        plugins[path.basename(dir_name)] = plugin_manifest;
        pubsub.publish('new_plugin', plugin_manifest);
    } else {
        console.log(dir_name, ' is not a plugin directory - no manifest');  
    }
};


/**
 * Update the plugin cache.
 *
 * @param {string} dir_name - The plugin dir where a file was modified.
 */
var update_plugin_cache = function(dir_name) {
    add_plugin_to_cache(dir_name);
};


/**
 * Remove the plugin from cache.
 *
 * @param {string} dir_name - The plugin dir that was removed.
 */
var remove_plugin_from_cache = function(dir_name) {
    console.log('Plugin directory', dir_name, 'removed');
    delete plugins[path.basename(dir_name)];
};


/**
 * Watch for addition/removal of plugins.
 *
 * @param {string} plugins_root - The root directory to search for plugins.
 */
var watch_plugins = function(plugins_root) {
    var plugin_watcher = watcher.watch(plugins_root, {ignoreInitial: true});

    plugin_watcher
        .on('add', function(file_path) {
            // a new file was found, add to cache if it's a plugin
            var dir_name = path.dirname(file_path);
            add_plugin_to_cache(dir_name);
        })
        .on('change', function(file_path) {
            // a file changed, update plugin cache
            var dir_name = path.dirname(file_path);
            update_plugin_cache(dir_name);
        })
        .on('unlinkDir', function(dir) {
            // remove plugin from cache
            remove_plugin_from_cache(dir);
        })
        .on('error', function(error) {
            console.error('Error in file watcher', error);
        });
};


/**
 * Initialize the cache
 *
 * @param {string} [plugin_dir] Plugin dir to work in. Mainly to enable testing.
 */
exports.init = function(plugin_dir) {
    // watch for changes on the installed plugins directory
    if(plugin_dir) {
        installed_plugins_path = path.join('.', plugin_dir);
    }
    try {
        fs.mkdirSync(installed_plugins_path);
    } catch (err) {
        if (err.code != 'EEXIST') {
            console.log('Failed to create root plugins directory ' + err);
        }
    }
    watch_plugins(installed_plugins_path);
    console.log("watching plugins in", path.resolve(installed_plugins_path));
    initialize_plugins(installed_plugins_path);
};

exports.plugins = plugins;

// For testing
exports.is_plugin_dir = is_plugin_dir;
exports.load_plugin_manifest = load_plugin_manifest;

