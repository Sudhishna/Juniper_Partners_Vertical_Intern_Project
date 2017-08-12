/** 
 * A module that implements a Slipstream URI
 *
 * @module
 * @name Slipstream/SDK/URI
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(['URI'], function(URI) {
	Slipstream.module("SDK", /** @lends URI */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
		SDK.URI = URI;
	});

	return Slipstream.SDK.URI;
});