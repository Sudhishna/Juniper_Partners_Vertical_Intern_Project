/** 
 * This module provides a high-level interface to the Slipstream help service.
 *
 * @module 
 * @name helpMap
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(function() {

	return {
		   
         /**
          * Get a help URL by key
          * @param {String} help_descriptor - The key by which the help url is to be retrieved.
          * 
          * @example:
          * my_help_descriptor - "security-management.FIREWALL_POLICY_OVERVIEW"
          *
          */
		getHelp: function(help_descriptor) {
			return Slipstream.request("help:retrieve", help_descriptor);
		}, 

        /**
         * Load help file for the given context.
         *
         * @param {Object} context - The context into which the help file should be
         * loaded.  If provided, the context object must contain the following attributes:
         *
         * ctx_root:  The root path of the context.  This is used to locate the 'assets/help' 
         * directory containing the help file.
         * 
         * ctx_name: The name of the context into which the help file should be loaded.
         *
         * Not providing a context object is logically equivalent to providing
         *
         * \{
         *    ctx_root: '.',
         *    ctx_name: ''
         * \}
         }
         */
		loadBundle: function(context) {
			Slipstream.execute("help:loadBundle", context);
		}
	};
});