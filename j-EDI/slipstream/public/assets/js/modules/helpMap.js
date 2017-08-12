/** 
 * A module that implements help services for Slipstream.
 *
 * @module helpMap
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["lib/help/xmlParser"], function(Parser) {
	Slipstream.module("helpMap", /** @namespace Slipstream.helpMap */ function(helpMap, Slipstream, Backbone, Marionette, $, _) {
		var loaded_namespaces = {};
		var help_directory_path = "help";
		var xmlParser = new Parser();
		var API = {
			
			/**
			 * Get a help URL by key
			 * @param {String} help_descriptor - The key by which the help url is to be retrieved.
			 *
			 */
			getHelp: function(help_descriptor) {
				if(help_descriptor){
					return xmlParser.findUrl(help_descriptor);
				}
				throw new Error("Help descriptor should exist");
				
				
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
				default_context = {
					ctx_name: '',
					ctx_root: ''
				};
				var context = _.extend(default_context, context || {});

				if (!loaded_namespaces[context.ctx_name]) {
					// ensure ctx_root ends with a slash
					if (context.ctx_root.charAt(context.ctx_root.length - 1) != '/') {
						context.ctx_root += "/";
					}
					var path = context.ctx_root + help_directory_path  + "/";
					
				    xmlParser.properties({
						name: 'Alias',
						path: path,
						namespace: context.ctx_name
				    });
					loaded_namespaces[context.ctx_name] = true;	
				}
			}
		};

        /** 
         * Retrieve help event
         *
         * @event help:retrieve
         * @type {String}
         * @property {String} help_descriptor - The key for the help url to be retrieved.
         */
		Slipstream.reqres.setHandler("help:retrieve", function(help_descriptor) {
			console.log(API.getHelp(help_descriptor));
			return API.getHelp(help_descriptor);
		});

        /** 
         * Load message bundle event
         * 
         * @event help:loadBundle
         * @type {Object}
         * @property {Object} context - The context into which the help file should be loaded.
         */
		Slipstream.commands.setHandler("help:loadBundle", function(context) {
            API.loadBundle(context);
		});
	});

	return Slipstream.helpMap;
});