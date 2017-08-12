/** 
 * The MessageProvider module defines the interface between a message provider and the
 * Slipstream framework.
 * 
 * @module 
 * @name Slipstream/SDK/MessageProvider
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['sdk/baseActivity'], function(BaseActivity) {
    Slipstream.module("SDK", /** @lends MessageProvider */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct a MessageProvider
         *
         * @constructor
         * @class MessageProvider
         * @classdesc Represents a Slipstream MessageProvider
         */
        SDK.MessageProvider = function() {
            BaseActivity.call(this);
        }

        SDK.MessageProvider.prototype = Object.create(BaseActivity.prototype);
        SDK.MessageProvider.prototype.constructor = SDK.MessageProvider;
    });

    return Slipstream.SDK.MessageProvider;
});