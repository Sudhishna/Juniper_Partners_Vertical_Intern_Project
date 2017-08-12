/** 
 * This module provides a high-level interface to the Slipstream i18n service.
 *
 * @module 
 * @name i18n
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(function() {

	if (typeof Slipstream === 'undefined') {
		// Framework not defined, scaffold instead
		Slipstream = {
			request: function(evt) {
				switch(evt) {
					case 'nls:retrieve':
					    var msg_string = '',
					        msg_descriptor = arguments[1], 
					        msg = typeof msg_descriptor == "string" ? msg_descriptor : msg_descriptor.msg;
	
		                msg_string = '[' + msg + ']';
		                return msg_string;
		            default:
		                // no-op
		                break;
			    }
			}
		}
	}

	return {
		/**
		 * Get a message by key
		 *
		 * @param {Object | String} msg_descriptor - The descriptor by which the message is to be retrieved.
		 * If the msg_descriptor is a String then its value will be used as the key into the message 
		 * bundle.  If it's an object, it must minimally contain a 'msg' attribute whowse value is the
		 * key into the message bundle.  It may optionally contain a 'namespace' attribute indicating
		 * the namespace of the message key and a 'sub_values' array containing any substitution values
		 * that should be substituted into the message.
		 */
		getMessage: function(msg_descriptor) {
			return Slipstream.request("nls:retrieve", msg_descriptor);
		}, 

        /**
         * Load a message bundle for the current locale.
         *
         * @param {Object} context - The context into which the bundle should be
         * loaded.  If provided, the context object must contain the following attributes:
         *
         * ctx_root:  The root path of the context.  This is used to locate the 'assets/nls' 
         * directory containing the message bundle.
         * 
         * ctx_name: The name of the context into which the bundle should be loaded.
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
			Slipstream.execute("nls:loadBundle", context);
		}
	};
});