/** 
 * A module that implements an activity context
 *
 * @module
 * @name SDK.ActivityContext
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(function() {
	Slipstream.module("SDK", /** @lends ActivityContext */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
		// private 

		// public

		/**
		 * Construct an ActivityContext object
      	 *
      	 * @constructor
		 * @class ActivityContext
		 * @classdesc Represents an activity's runtime context. The context can be used for
		 * loading plugin-local resources such as localized message strings.
		 *
		 * @param {String} ctx_name - The name of the context
		 * @param {String} ctx_root - The path to the root of the context.
		 * @param {Object} props    - Additional properties for the context.
		 */
		SDK.ActivityContext = function(ctx_name, ctx_root, props) {
			this.ctx_name = ctx_name;
			this.ctx_root = ctx_root;
			_.extend(this, props);
		}

        /**
         * Retreive a localized message by key
         * 
         * @param {String} key - The key to the message to be retrieved
         * @param {Array} sub_values - An array of substitution values that should be
         * interpolated into the retrieved message string.  
         * 
         * @example
         * my_key = A message key with not {0} but {1] substitution values
         *
         * context.getMessage("my_key", ["one", "two"]);
         *
         * returns the string
         *
         * "A message with not one but two substitution values"
         */
		SDK.ActivityContext.prototype.getMessage = function(key, sub_values) {
			var msg_descriptor = {
				msg: key, 
				namespace: this.ctx_name, 
				sub_values: sub_values
			};
			return Slipstream.request("nls:retrieve", msg_descriptor);
		}

        /**
         * Retreive a fully qualified path for given key
         * 
         * @param {String} key - The key for which the namespace needs to be retrieved 
         *
         * @example
         * my_key = "Create_Firewall_Policy"
         *
         * context.getHelpKey(my_key)
         * 
         * return the String:
         * 
         * "Security-Management.Create_Firewall_Policy"
         */
        SDK.ActivityContext.prototype.getHelpKey = function(key){
            var help_key = this.ctx_name+"."+key;
            return help_key;
        }
        /**
         * Start an activity
         * 
         * @param {Slipstream.SDK.Intent} intent - The intent used to define the activity to be started
         */
		SDK.ActivityContext.prototype.startActivity = function(intent) {
			Slipstream.vent.trigger("activity:start", intent);
		}

        /**
         * Start an activity with the expectation of getting a result
         * 
         * @param {Slipstream.SDK.Intent} intent - The intent used to define the activity to be started
         * @param {Int} id - An identifier that will be included when the result callback is called 
         */
        SDK.ActivityContext.prototype.startActivityForResult = function(intent, callback) {
            Slipstream.vent.trigger("activity:start", intent, {
                callback: callback
            });
        }

		/**
         * Lookup an activity
         * 
         * @param {Slipstream.SDK.Intent} intent - The intent used to lookup the activity to be started
         * @return true if an activity matching the intent is found, false otherwise
         */
		SDK.ActivityContext.prototype.lookupActivity = function(intent) {
			return Slipstream.request("activity:resolve", intent);
		}

        /**
         * Signal completion of a preload plugin
         * 
         * @param {Slipstream.SDK.Intent} intent - The intent to be executed when the preload plugin is complete
         */
		SDK.ActivityContext.prototype.done = function(intent) {
            Slipstream.vent.trigger("plugin:preload:done", intent);
        }
	});

	return Slipstream.SDK.ActivityContext;
});