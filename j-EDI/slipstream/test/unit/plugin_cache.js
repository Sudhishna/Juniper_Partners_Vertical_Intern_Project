/** 
 * Tests for plugin_cache module
 * 
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

 var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    rmdir = require('rimraf'),
    installed_plugins_path = path.join('.', 'public', 'installed_plugins'),
    plugin_manifest_file_name = 'plugin.json',
    plugin_cache = require('../../modules/plugin_cache');
    invalid_plugin_dir = path.join(installed_plugins_path, 'invalid_plugin_dir'),
    plugins = plugin_cache.plugins,
    cleanup_folders = [];


var GOOD_MANIFESTS = [
{
    "name": "SRXDeviceConfiguration",
    "publisher": "Juniper Networks, Inc.",
    "version": "0.0.1",
    "release_date": "02.07.2014",
    "min_platform_version": "0.0.1",
    "activities": [{
        "module": "time_management",
        "filters": [{
            "action": "MANAGE",
            "data": {
                "mimeType": "vnd.juniper.net.system.time"
            }
        }]
    }],
}
];

var BAD_MANIFESTS = [
{
    // No name
    "publisher": "Juniper Networks, Inc.",
    "version": "0.0.1",
    "release_date": "02.07.2014",
    "min_platform_version": "0.0.1",
    "activities": [{
        "module": "time_management",
        "filters": [{
            "action": "MANAGE",
            "data": {
                "mimeType": "vnd.juniper.net.system.time"
            }
        }]
    }],
},
{
    //No version
    "name": "SRXDeviceConfiguration",
    "publisher": "Juniper Networks, Inc.",
    "release_date": "02.07.2014",
    "min_platform_version": "0.0.1",
    "activities": [{
        "module": "time_management",
        "filters": [{
            "action": "MANAGE",
            "data": {
                "mimeType": "vnd.juniper.net.system.time"
            }
        }]
    }],
},
{
    // No min platform
    "name": "SRXDeviceConfiguration",
    "publisher": "Juniper Networks, Inc.",
    "version": "0.0.1",
    "release_date": "02.07.2014",
    "activities": [{
        "module": "time_management",
        "filters": [{
            "action": "MANAGE",
            "data": {
                "mimeType": "vnd.juniper.net.system.time"
            }
        }]
    }],
},
{
    // Bad release date
    "name": "SRXDeviceConfiguration",
    "publisher": "Juniper Networks, Inc.",
    "version": "0.0.1",
    "release_date": "31.07.2014",
    "min_platform_version": "0.0.1",
    "activities": [{
        "module": "time_management",
        "filters": [{
            "action": "MANAGE",
            "data": {
                "mimeType": "vnd.juniper.net.system.time"
            }
        }]
    }],
},
{
    // Bad version
    "name": "SRXDeviceConfiguration",
    "publisher": "Juniper Networks, Inc.",
    "version": "0.0.100",
    "release_date": "02.07.2014",
    "min_platform_version": "0.0.1",
    "activities": [{
        "module": "time_management",
        "filters": [{
            "action": "MANAGE",
            "data": {
                "mimeType": "vnd.juniper.net.system.time"
            }
        }]
    }],
},
{
    // Bad min_platform_version
    "name": "SRXDeviceConfiguration",
    "publisher": "Juniper Networks, Inc.",
    "version": "0.0.1",
    "release_date": "02.07.2014",
    "min_platform_version": "abc.0.1",
    "activities": [{
        "module": "time_management",
        "filters": [{
            "action": "MANAGE",
            "data": {
                "mimeType": "vnd.juniper.net.system.time"
            }
        }]
    }],
}
];


describe('plugin_cache', function() {

    var make_package_json = function(plugin_name, plugin_json, callback) {
        var file_path = path.join(installed_plugins_path, plugin_name, plugin_manifest_file_name);
        fs.writeFile(file_path, JSON.stringify(plugin_json), function(err) {
            if (err) {
                callback(err);
            } else {
                callback();
            }
        });
    };


    before(function(done) {
        fs.mkdir(installed_plugins_path, function(err) {
            if (!err || err.code == 'EEXIST') {
                var dir_path = path.join(installed_plugins_path, GOOD_MANIFESTS[0].name);
                fs.mkdir(dir_path, function(err) {
                    if (!err || err.code == 'EEXIST') {
                        cleanup_folders.push(dir_path);
                        make_package_json(GOOD_MANIFESTS[0].name, GOOD_MANIFESTS[0], function(err) {
                            if (!err) {
                                plugin_cache.init(installed_plugins_path);
                            } else {
                                return done(err);
                            }
                        });
                    } else {
                        return done(err);
                    }
                });
            } else {
                return done(err);
            }
        });

        fs.mkdir(installed_plugins_path, function(err) {
            if (!err || err.code == 'EEXIST') {
                fs.mkdir(invalid_plugin_dir, function(err) {
                    cleanup_folders.push(invalid_plugin_dir);
                    if (!err || err.code == 'EEXIST') {
                        done();
                    } else {
                        return done(err);
                    }
                });
            } else {
                return done(err);
            }
        });

    });


    after(function(done) {

        for (var i = 0; i < cleanup_folders.length; i ++) {
            rmdir.sync(cleanup_folders[i]);
        }
        done();
    });

    describe('is_plugin_dir', function() {
        it('should return true for valid plugin dir', function(done) {
            this.timeout(500);
            setTimeout(function() {
                assert.ok(plugin_cache.is_plugin_dir(path.join(installed_plugins_path, GOOD_MANIFESTS[0].name)));
                done();
            }, 250);
            
        });

        it('should return false for invalid plugin dir', function(done) {
            this.timeout(500);
            setTimeout(function() {
                assert.equal(false, plugin_cache.is_plugin_dir(invalid_plugin_dir));
                done();
            }, 250);
        });
    });

    describe('load_plugin_manifest', function() {
        it('should load plugin manifest from a valid plugin dir', function(done) {
            this.timeout(500);
            setTimeout(function() {
                assert.ok(plugin_cache.load_plugin_manifest(path.join(installed_plugins_path, GOOD_MANIFESTS[0].name)));
                done();
            }, 250);
        });
    });
});