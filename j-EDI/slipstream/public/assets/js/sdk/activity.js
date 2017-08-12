/** 
 * A module that implements a Slipstream Activity.  A Slipstream workflow is
 * composed of an ordered sequence of activities.  
 *
 * @module 
 * @name Slipstream/SDK/Activity
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['sdk/baseActivity'], function(BaseActivity) {
    Slipstream.module("SDK", /** @lends Activity */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct an Activity object.
         *
         * @constructor
         * @class Activity
         * @classdesc Represents a Slipstream activity.
         */
        SDK.Activity = function() {
            BaseActivity.call(this);
            this.dashboard = null;
        }

        SDK.Activity.prototype = Object.create(BaseActivity.prototype);
        SDK.Activity.prototype.constructor = SDK.Activity;

        /**
         * Set the view in the framework's content pane.
         *
         * @param {Slipstream.View} - the view object to be rendered into the framework's 
         *        content area.
         */
        SDK.Activity.prototype.setContentView = function(view) {
            Slipstream.vent.trigger("view:render", view);
        }

        SDK.Activity.prototype.getDashboard = function() {
            return this.dashboard;
        }
    });


    return Slipstream.SDK.Activity;
});