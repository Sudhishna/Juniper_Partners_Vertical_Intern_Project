/** 
 * A module that implements the base class of all Slipstream activities.
 *
 * @module 
 * @name Slipstream/SDK/BaseActivity
 * @author Andrew Chasin <achasin@juniper.net>
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(function() {
    Slipstream.module("SDK", /** @lends BaseActivity */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct a BaseActivity object.
         *
         * @constructor
         * @class BaseActivity
         * @classdesc Represents a Slipstream base activity.
         */
        SDK.BaseActivity = function() {
            this.context = null;
            this.intent = null;
            this.result = {
                code: null,
                data: null
            };
        };

        /**
         * Represents a successful completion of an Activity that was called for a result
         */
        SDK.BaseActivity.RESULT_OK = "RESULT_OK";

        /**
         * Represents the cancellation of an Activity that was called for a result
         */
        SDK.BaseActivity.RESULT_CANCELLED = "RESULT_CANCELLED";

        /**
         * The lifecycle callback that is invoked when an Activity
         * is created. Anything that an activity needs to do before
         * it is started should be done here.
         *
         * This method should be overridden by objects implementing
         * an Activity.
         */
        SDK.BaseActivity.prototype.onCreate = function() {}

        /**
         * The lifecycle callback that is invoked when an Activity
         * is started.  This is where an activity should render its view(s),
         * view event handlers, etc.
         *
         * This method should be overridden by objects implementing
         * an Activity.
         */
        SDK.BaseActivity.prototype.onStart = function() {}

        /**
         * The lifecycle callback that is invoked when an Activity
         * is destroyed.
         *
         * This method should be overridden by objects implementing
         * an Activity.
         */
        SDK.BaseActivity.prototype.onDestroy = function() {}

        /**
         * Get the runtime context for this activity
         *
         * @return The context in which this activity is running.
         */
        SDK.BaseActivity.prototype.getContext = function() {
            return this.context;
        }

        /**
         * Get the intent used to launch this activity
         *
         * @return The intent used to launch this activity
         */
        SDK.BaseActivity.prototype.getIntent = function() {
            return this.intent;
        }

        /**
         * Sets the result of the activity.  When the activity is finished, this
         * is the data that is passed into the calling activity's onActivityResult 
         * callback.
         *
         * @param {String} resultCode - An OK or Cancelled indicator
         * @param {SDK.Intent} data - An intent containing the result of the activity
         */
        SDK.BaseActivity.prototype.setResult = function(resultCode, data) {
            this.result.code = resultCode;
            this.result.data = data;
        }

        /**
         * Calls parent Activity's result callback and finishes with a call to the
         * onDestroy lifecycle method.
         */
        SDK.BaseActivity.prototype.finish = function() {

            var callback = this.getContext().onResult;

            if (typeof callback == 'function') {
                callback(this.result.code, this.result.data);
            }

            this.onDestroy();
        }

        /**
         * Get the arbitrary data stored in this activity's intent
         *
         * @return The extras object stored in this activity's intent object
         */
        SDK.BaseActivity.prototype.getExtras = function() {
            return this.intent.getExtras();
        }
    });

    return Slipstream.SDK.BaseActivity;
});
