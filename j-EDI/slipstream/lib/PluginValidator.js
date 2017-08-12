/** 
 * Validator/Sanitizer helpers built on top of other validators
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

var SchemaValidator = require('amanda'),
    validator = require('../public/assets/js/lib/validator/extendedValidator'),
    adm_zip = require('adm-zip');


var plugin_manifest_file_name = 'plugin.json',
    plugin_required_directories = ['js'];


// Our own patterns
var versionPattern = /^(\d{1,2}\.\d{1,2}\.\d{1,2})$/; // MM.mm.rr


//Our own schemas
var manifestSchema = {
    "id": "/plugin",
    "type": "object",
    "properties": {
        "name": {"type": "string", "required": true},
        "description": {"type": "string"},
        "publisher": {"type": "string"},
        "version": {"type": "string", "required": true, "version": true},
        "release_date": {"type": "string", "required": true, "date": true},
        "min_platform_version": {"type": "string", "required": true, "version": true},
        "activities": [
        {
            "type": "object",
            "required": false,
            "properties": {
                "url_path": {"type": "string", "required": false},
                "module": {"type": "string"},
                "filters" : [
                {
                    "type": "object",
                    "properties": {
                        "action": {"type": "string"},
                        "data": {
                            "type": "object",
                            "properties": {
                                "mime_type": "string"
                            }
                        }
                    }
                }
                ]
            }
        }
        ]
    } 
};

var json_schema_validator = SchemaValidator('json');

/**
 * Validates input string against the MM.mm.rr version pattern.
 *
 * @param {string} str - The string to be verified against the accepted version pattern.
 * returns {boolean} True if valid, false otherwise.
 */
var isValidVersion = function(str) {
    return versionPattern.test(str);
};

var versionAttribute = function(property,
    propertyValue,
    attributeValue,
    propertyAttributes,
    callback) {
    if (attributeValue) {
        if (!isValidVersion(propertyValue)) {
            this.addError();
        }
    }

    return callback();
};

var dateAttribute = function(property,
    propertyValue,
    attributeValue,
    propertyAttributes,
    callback) {
    if (attributeValue) {
        if (!validator.isDate(propertyValue)) {
            this.addError();
        }
    }

    return callback();
};

json_schema_validator.addAttribute('version', versionAttribute);
json_schema_validator.addAttribute('date', dateAttribute);


/**
 * Validates input object against the JSON schema.
 *
 * @param {Object} manifest - The manifest to be validated against schema.
 * @param {Function} callback - The function to callback on completion of task.
 */
var validateManifest = function(manifest, callback) {
    var validationErrors = [];
    json_schema_validator.validate(manifest, manifestSchema, function(err) {
        if (err == undefined) {
            callback();
        } else {
            callback('Manifest does not match schema');
        }
    });
};


/**
 * Validates input compressed SPI file to be valid.
 *
 * @param {string} id - The name of the plugin file being uploaded, which serves as ID.
 * @param {File} data - The file to be validated before installation.
 * @param {Function} callback - The function to callback on completion of task.
 */
var validateSPI = function(id, data, callback) {
    var spi = new adm_zip(data);
    var spiEntries = spi.getEntries();
    var spiEntriesHash = {};

    spiEntries.forEach(function(spiEntry) {
        spiEntriesHash[spiEntry.entryName] = spiEntry;
    });

    var baseDirectoryPath = id + '/',
        pluginManifestFilePath = id + '/' + plugin_manifest_file_name,
        pluginRequiredDirectoriesPath = [];

    for (var i = 0; i < plugin_required_directories.length; i++) {
        pluginRequiredDirectoriesPath.push(id + '/' + plugin_required_directories[i] + '/');
    }

    if (!spiEntriesHash[pluginManifestFilePath] ||
        spiEntriesHash[pluginManifestFilePath].isDirectory) {

        return callback('Missing manifest file');
    }

    for (var i = 0; i < pluginRequiredDirectoriesPath.length; i++) {
        if (!spiEntriesHash[pluginRequiredDirectoriesPath[i]] || !spiEntriesHash[pluginRequiredDirectoriesPath[i]].isDirectory) {

            return callback('Missing necessary folders');
        }
    }

    validateManifest(spi.readAsText(spiEntriesHash[id + '/' + plugin_manifest_file_name]), function(err) {
        callback(err);
    });
};


// Extend validator with our code
validator.validateManifest = validateManifest;
validator.validateSPI = validateSPI;

exports.validator = validator;