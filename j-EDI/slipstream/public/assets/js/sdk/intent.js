/** 
 * A module that implements a Slipstream Intent.
 *
 * @module
 * @name Slipstream/SDK/Intent
 * @author Andrew Chasin <achasin@juniper.net>
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(function() {
	Slipstream.module("SDK", /** @lends Intent */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct an Intent object
         *
         * @constructor
         * @class Intent
         * @classdesc Represents an intent to start an activity.
         *
         * @param {string} action - The action the target activity is being asked to perform.
         * @param {Object} data   - The description of the data to be operated on by the activity.  The data object
         * must contain at least one of the following attributes:
         * 
         * uri: The URI of the data to be operated on
         * type: The MIME type of the data to be operated on.  
         */
        SDK.Intent = function(action, data) {
            this.action = action;
    	    this.data = data;

            this.extras = {};

            /**
             * Arbitrary data for matching activity's consumption.
             * Calling multiple times on same intent will overwrite previous value.
             *
             * @param {Object} extras - Key: value pairs of extra information to be passed on to the activity when it starts.
             */
            this.putExtras = function(extras) {
                this.extras = extras;
            };

            /**
             * Retrieve extras stored in this Intent object.
             *
             * @returns The extras object stored in this intent.
             */
            this.getExtras = function() {
                return this.extras;
            }
        };

        SDK.Intent.action = {};
        /**
	     * Allow a user to authenticate himself to the system.
	     *
         * Input data required: None
         */
	    SDK.Intent.action.ACTION_AUTHENTICATE = "slipstream.intent.action.ACTION_AUTHENTICATE";

        /**
         * Unauthenticate a user
         *
         * Input data required: None
         */
        SDK.Intent.action.ACTION_UNAUTHENTICATE = "slipstream.intent.action.ACTION_UNAUTHENTICATE";
     
        /**
         * View the definition of a resource
         * 
         * Input data required:  The URI of the resource to be viewed.
         */
        SDK.Intent.action.ACTION_VIEW = "slipstream.intent.action.ACTION_VIEW";

        /**
         * Display a list of resources of the given type.
         *
         * Input data required:  The MIME type of the resources to be listed.
         */
        SDK.Intent.action.ACTION_LIST = "slipstream.intent.action.ACTION_LIST";

        /**
         * Create a resource of the given type.
         *
         * Input data required: The MIME type of the resource to be created.
         */
        SDK.Intent.action.ACTION_CREATE = "slipstream.intent.action.ACTION_CREATE";

        /**
         * Edit a resource.  Similar to slipstream.intent.action.ACTION_VIEW except that slipstream.intent.action.ACTION_EDIT
         * allows the resource to be modified.
         *
         * Input data required: The URI of the resource to be edited.
         */
        SDK.Intent.action.ACTION_EDIT = "slipstream.intent.action.ACTION_EDIT";

        /**
         * Clone a resource. Create a resource based on the properties of an existing resource.
         *
         * Input data required: The URI of the resource to be cloned.
         */
        SDK.Intent.action.ACTION_CLONE = "slipstream.intent.action.ACTION_CLONE";

        /**
         * Select from the available resources.
         *
         * Input data required: An optional list of resources that have already been selected.
         */
        SDK.Intent.action.ACTION_SELECT = "slipstream.intent.action.ACTION_SELECT";

        /**
         * Import resources
         *
         * Input data required:  The MIME type of the resources to be imported.
         */
        SDK.Intent.action.ACTION_IMPORT = "slipstream.intent.action.ACTION_IMPORT";
 
        /**
         * Export resources
         *
         * Input data required:  An optional list of resources that have already been selected.
         */
        SDK.Intent.action.ACTION_EXPORT = "slipstream.intent.action.ACTION_EXPORT";

        /**
         * Provide user assistance for a given topic
         *
         * Input data required:  The URI of the help topic to be displayed.
         */
        SDK.Intent.action.ACTION_ASSIST = "slipstream.intent.action.ACTION_ASSIST";

        /** 
         * Search for resources that match a query
         *
         * Input data required:  The search query to be executed.
         */
        SDK.Intent.action.ACTION_SEARCH = "slipstream.intent.action.ACTION_SEARCH";

        /** 
         * Display a dashboard of system health and performance monitoring data
         *
         * Input data required: None
         */
        SDK.Intent.action.ACTION_MONITOR = "slipstream.intent.action.ACTION_MONITOR";

        /**
         * Perform a quick setup of some portion of the configuration
         *
         * Input data required: A URI identifying the configuration area to be configured.  eg. config://initial, config://vpn
         */
        SDK.Intent.action.ACTION_QUICK_SETUP = "slipstream.intent.action.ACTION_QUICK_SETUP";
	});

	return Slipstream.SDK.Intent;
});