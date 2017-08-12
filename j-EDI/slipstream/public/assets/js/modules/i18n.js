/** 
 * A module that implements i18n services for Slipstream.
 *
 * @module i18n
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["jquery-i18n"], function(jqi18n) {
	Slipstream.module("i18n", /** @namespace Slipstream.i18n */ function(i18n, Slipstream, Backbone, Marionette, $, _) {
		var loaded_namespaces = {};
		var nls_directory_path = "nls";

		var API = {
			/**
			 * Get a message by key
			 *
			 * @memberof Slipstream.i18n
			 * @param {Object | String} msg_descriptor - The descriptor by which the message is to be retrieved.
			 * If the msg_descriptor is a String then its value will be used as the key into the message 
			 * bundle.  If it's an object, it must minimally contain a 'msg' attribute whowse value is the
			 * key into the message bundle.  It may optionally contain a 'namespace' attribute indicating
			 * the namespace of the message key and a 'sub_values' array containing any substitution values
			 * that should be substituted into the message.
			 */
			getMessage: function(msg_descriptor) {
				var default_descriptor = {
					msg: undefined,
					namespace: null,
					sub_values: null
				}
				var descriptor = {};
				if (typeof msg_descriptor == "string") {
					descriptor.msg = msg_descriptor;
					descriptor = _.extend(default_descriptor, descriptor);
				}
				else {
					if ("msg" in msg_descriptor) {
						descriptor = _.extend(default_descriptor, msg_descriptor);
					}
					else {
						throw new Error("message descriptor must contain a 'msg' attribute");
					}
				}
				var qualified_key = descriptor.namespace ? descriptor.namespace + "." + descriptor.msg : descriptor.msg;
				if (descriptor.sub_values && !Array.isArray(descriptor.sub_values)) {
					throw new Error("Substitution values must be provided as an array");
				}
				return jqi18n.prop.apply(null, [qualified_key].concat(descriptor.sub_values || []));
			}, 

            /**
             * Load a message bundle for the current locale.
             *
             * @memberof Slipstream.i18n
             *
             * @param {Object} context - The context into which the bundle should be
             * loaded.  If provided, the context object must contain the following attributes:
             *
             * ctx_root:  The root path of the context.  This is used to locate the 'assets/nls' 
             * directory containing the message bundle.
             * 
             * ctx_name: The name of the context into which the bundle should be loaded.
             *
             * ctx_lang: The language of the context which the bundle should be loaded.
             *
             * Not providing a context object is logically equivalent to providing
             *
             * \{
	         *    ctx_root: '',
	         *    ctx_name: ''
	         * \}
             }
             */
			loadBundle: function(context) {
				default_context = {
					ctx_name: '',
					ctx_root: '',
					ctx_lang: ''
				};
				var context = _.extend(default_context, context || {});

				if (!loaded_namespaces[context.ctx_name]) {
					// ensure ctx_root ends with a slash
					if (context.ctx_root.charAt(context.ctx_root.length - 1) != '/') {
						context.ctx_root += "/";
					}
					var path = context.ctx_root + nls_directory_path  + "/";
					
				    jqi18n.properties({
						name: 'msgs',
						path: path,
						mode: 'map',
						namespace: context.ctx_name,
						language: context.ctx_lang
				    });
					loaded_namespaces[context.ctx_name] = true;	
				}
			}
		};

		// Initialize the i18n service
		i18n.addInitializer(function(options) {
			// load the framework's message bundle
			var context = {
				ctx_name: '',
				ctx_root: '/assets',
				ctx_lang: ''
			};

			if (options && options.baseUrl) {
				context.ctx_root = options.baseUrl;
			}

			API.loadBundle(context);
		});

        /** 
         * Retrieve localized message event
         *
         * @event nls:retrieve
         * @type {Object}
         * @property {Object} msg_descriptor - The descriptor for the message that should be retrieved.
         */
		Slipstream.reqres.setHandler("nls:retrieve", function(msg_descriptor) {
			return API.getMessage(msg_descriptor);
		});

        /** 
         * Load message bundle event
         * 
         * @event nls:loadBundle
         * @type {Object}
         * @property {Object} context - The context into which the bundle should be loaded.
         */
		Slipstream.commands.setHandler("nls:loadBundle", function(context) {
            API.loadBundle(context);
		})
	});

	return Slipstream.i18n;
});