/** 
 * Tests for API
 *
 * @module plugin_cache
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
var assert = require('assert'),
    request = require('supertest'),
    utils = require('../../lib/test-utils'),
    server = null,
    fs = require('fs'),
    path = require('path'),
    rmdir = require('rimraf'),
    adm_zip = require('adm-zip'),
    plugin_cache = require('../../modules/plugin_cache'),
    installed_plugins_path = path.join(".", "public", "installed_plugins"),
    plugin_manifest_file_name = "plugin.json",
    spi_suffix = '.spi',
    test_resources_path = path.join('.', 'test', 'resources'),
    presetup_plugins = [
        'good-logging-reporting-for-update',
        'good-logging-reporting-for-delete'
    ],
    cleanup_folders = [];

var MANIFEST_DATA = {
  "name": "SRX Logging and Reporting",
  "publisher": "Juniper Networks, Inc.",
  "version": "0.0.1",
  "release_date": "02.07.2014",
  "min_platform_version": "0.0.1",
  "activities": [
    {
      "module": "event_viewer",
      "filters": [
        {
          "action": "MANAGE",
          "data": {
            "mime_type": "vnd.juniper.net.syslog.events"
          }
        }
      ]
    }
  ],
};

var EXPECTED_GET_MANIFEST_RESPONSE = {
  "name": "SRX Logging and Reporting",
  "publisher": "Juniper Networks, Inc.",
  "version": "0.0.1",
  "release_date": "02.07.2014",
  "min_platform_version": "0.0.1",
  "activities": [
    {
      "module": "event_viewer",
      "filters": [
        {
          "action": "MANAGE",
          "data": {
            "mime_type": "vnd.juniper.net.syslog.events"
          }
        }
      ]
    }
  ],
  "root": "installed_plugins/good-logging-reporting-for-update"
};

describe('PluginAPI', function() {

    before(function(done) {
        fs.mkdir(installed_plugins_path, function(err) {
            if (!err || err.code == 'EEXIST') {
                for (var i = 0; i < presetup_plugins.length; i++) {
                    var spi = new adm_zip(path.join(test_resources_path, presetup_plugins[i] + '.spi'));
                    spi.extractAllTo(installed_plugins_path, true);
                    cleanup_folders.push(path.join(installed_plugins_path, presetup_plugins[i]));
                }

                server = require('../../app');
                utils.startServer(server, done);
            } else {
                done(err);
            }
        });
    });

    after(function(done) {
        for (var i = 0; i < cleanup_folders.length; i ++) {
            rmdir.sync(cleanup_folders[i]);
        }

        done();
    });

    describe('/plugins', function() {

        var is_plugin_dir = function(dir_path) {
             var dir_stat = fs.statSync(dir_path);
             return dir_stat                 && 
                    dir_stat.isDirectory()   &&
                    fs.existsSync(path.join(dir_path, plugin_manifest_file_name));
        };

        describe('.get', function() {

            it('should set content type header, return 200 response, contain expected body', function(done) {
                request(server)
                    .get('/plugins')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(200, done);
            });
        });

        describe('.get(id)', function() {

            it('should set content type header, return a 200 response, contain expected body', function(done) {
                this.timeout(500);
                setTimeout(function() {
                    request(server)
                        .get('/plugins/' + presetup_plugins[0])
                        .expect('Content-Type', 'application/json; charset=utf-8')
                        .expect(200)
                        .expect(JSON.stringify(EXPECTED_GET_MANIFEST_RESPONSE));
                    done();
                }, 250);
            });

            it('should return code 404 for a entity that does not exist', function(done) {
                request(server)
                    .get('/plugins/nonExistingPlugin')
                    .expect(404)
                    .expect(JSON.stringify({
                        status: 'Error - No such plugin found'
                    }), done);
            });
        });

        describe('.post', function() {

            it('should return expected error when empty request sent', function(done) {
                request(server)
                    .post('/plugins')
                    .expect(406)
                    .expect(JSON.stringify({
                        status: 'Error - Missing plugin file'
                    }), done);
            });

            it('should return expected error when plugin file does not contain manifest', function(done) {
                request(server)
                    .post('/plugins')
                    .attach('plugin', path.join(test_resources_path, 'no-plugin-json.spi'))
                    .expect(406)
                    .expect(JSON.stringify({
                        status: 'Error - Missing manifest file'
                    }), done);
            });

            it('should return expected error when plugin file does not contain proper directory structure', function(done) {
                request(server)
                    .post('/plugins')
                    .attach('plugin', path.join(test_resources_path, 'no-js-folder.spi'))
                    .expect(406)
                    .expect(JSON.stringify({
                        status: 'Error - Missing necessary folders'
                    }), done);
            });

            it('should return expected error when plugin manifest does not match schema', function(done) {
                request(server)
                    .post('/plugins')
                    .attach('plugin', path.join(test_resources_path, 'bad-version.spi'))
                    .expect(406)
                    .expect(JSON.stringify({
                        status: 'Error - Manifest does not match schema'
                    }), done);
            });

            it('should return response 201 on success', function(done) {
                request(server)
                    .post('/plugins')
                    .attach('plugin', path.join(test_resources_path, 'good-logging-reporting.spi'))
                    .expect(201)
                    .expect(JSON.stringify({
                        status: 'Success - Added plugin good-logging-reporting',
                        id: 'good-logging-reporting'
                    }));

                cleanup_folders.push(path.join(installed_plugins_path, 'good-logging-reporting'));
                done();
            });


            it('should return response 409 when creating existing plugin', function(done) {
                this.timeout(500);
                setTimeout(function() {
                    request(server)
                        .post('/plugins')
                        .attach('plugin', path.join(test_resources_path, presetup_plugins[0] + '.spi'))
                        .expect(409)
                        .expect(JSON.stringify({
                            status: 'Error - Plugin ' + presetup_plugins[0] + ' already exists. Please use PUT request to update plugin'
                        }));
                        done();
                    }, 250);
            });
        });

        describe(".put", function() {

            var presetup_plugins_for_update = [
                'no-plugin-json',
                'no-js-folder',
                'bad-version'
            ];

            before(function (done) {
                for (var i = 0; i < presetup_plugins_for_update.length; i++) {
                    var spi = new adm_zip(path.join(test_resources_path, presetup_plugins_for_update[i] + '.spi'));
                    spi.extractAllTo(installed_plugins_path, true);
                }

                fs.writeFileSync(path.join(installed_plugins_path, 'no-plugin-json', plugin_manifest_file_name), JSON.stringify(MANIFEST_DATA));

                plugin_cache.init();

                done();
            });

            after(function (done) {
                for (var i = 0; i < presetup_plugins_for_update.length; i++) {
                    rmdir.sync(path.join(installed_plugins_path, presetup_plugins_for_update[i]));
                }
                done();
            });

            it('should 404 when no id is provided', function(done) {
                request(server)
                    .put('/plugins')
                    .attach('plugin', path.join(test_resources_path, 'good-logging-reporting.spi'))
                    .expect(404)
                    .expect(JSON.stringify({
                        status: 'Error - Could not update plugin. No ID provided'
                    }), done);
            });

            it('should return expected error when empty request sent', function(done) {
                request(server)
                    .put('/plugins/bad-version')
                    .expect(406)
                    .expect(JSON.stringify({
                        status: 'Error - Missing plugin file'
                    }), done);
            });

            it('should return expected error when plugin file does not contain manifest', function(done) {
                request(server)
                    .put('/plugins/no-plugin-json')
                    .attach('plugin', path.join(test_resources_path, 'no-plugin-json.spi'))
                    .expect(406)
                    .expect(JSON.stringify({
                        status: 'Error - Missing manifest file'
                    }), done);
            });

            it('should return expected error when plugin file does not contain proper directory structure', function(done) {
                request(server)
                    .put('/plugins/no-js-folder')
                    .attach('plugin', path.join(test_resources_path, 'no-js-folder.spi'))
                    .expect(406)
                    .expect(JSON.stringify({
                        status: 'Error - Missing necessary folders'
                    }), done);
            });

            it('should return expected error when plugin manifest does not match schema', function(done) {
                request(server)
                    .put('/plugins/bad-version')
                    .attach('plugin', path.join(test_resources_path, 'bad-version.spi'))
                    .expect(406)
                    .expect(JSON.stringify({
                        status: 'Error - Manifest does not match schema'
                    }), done);
            });

            it('should return response 200 on success', function(done) {
                request(server)
                    .put('/plugins/good-logging-reporting-for-update')
                    .attach('plugin', path.join(test_resources_path, presetup_plugins[0] + '.spi'))
                    .expect(200)
                    .expect(JSON.stringify({
                        status: 'Success - Updated plugin ' + presetup_plugins[0]
                    }));

                done();
            });
        });

        describe('.delete', function() {

            it('should return response 200 when deleting existing item', function(done) {
                request(server)
                    .del('/plugins/' + presetup_plugins[1])
                    .expect(200)
                    .expect(JSON.stringify({
                        status: 'Success - Removed plugin ' + presetup_plugins[1] + ' successfully'
                    }), done);
            });

            it('should return response 404 when trying to delete a non-existent item', function(done) {
                request(server)
                    .del('/plugins/nonExistentPlugin')
                    .expect(404)
                    .expect(JSON.stringify({
                        status: 'Error - No such plugin found'
                    }), done);
            });
        });
    });
});