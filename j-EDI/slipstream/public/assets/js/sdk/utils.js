/** 
 * A module that implements a set of Slipstream-provided utility functions
 *
 * @module
 * @name Slipstream/SDK/Utils
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(['uuid'], function(uuid) {
	Slipstream.module("SDK", /** @lends Utils */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
		/**
		 * Get a UUID
		 *
		 * @returns a universally unique identifier
		 */
		function uuid_fn() {
		    return uuid.v4();
		}

        /**
		 * URL encode a base64 string
		 *
		 * @param {String} str - The string to be encoded.
		 * @returns A URL encoded version of the input base64 string.
		 */
		function urlencodeBase64(str) {
            return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
        }

        /**
		 * Get a URL-safe UUID
		 *
		 * @returns A URL-safe UUID.
		 */
		function url_safe_uuid() {
	    	return urlencodeBase64(btoa(uuid_fn()));
	    }

		SDK.Utils = {
		    uuid: uuid_fn,
		    url_safe_uuid: url_safe_uuid  			    
		}
	});

	return Slipstream.SDK.Utils;
})