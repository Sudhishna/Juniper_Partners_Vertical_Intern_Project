/** 
 * A module that implements a base nav model object
 *
 * @module 
 * @name Slipstream/Entities/BaseModel
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(/** @lends BaseModel */ function() {
    Slipstream.module("Navigation.Entities", function(Entities, Slipstream, Backbone, Marionette, $, _) {
        /**
         * Construct a base navigation model
         * @constructor 
         * @class BaseModel
         */
        Entities.BaseModel = Backbone.Model.extend({
            nls_context: "@slipstream_nav"
        });

    });

    return Slipstream.Navigation.Entities.BaseModel;
});