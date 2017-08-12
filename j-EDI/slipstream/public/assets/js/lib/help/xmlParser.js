/**
 * The module to parse Help files
 *
 * @module xmlParser
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([],function(){
	var xmlParser = function(){
		var map = {};
		var xhttp = new XMLHttpRequest();

		/**
		 * To find help URL for given namespace and key.
		 * @param {string} key - the help identifier 
		 *
		 * @return {string} - the help URL for given key
		 */

		this.findUrl = function(descriptor) {
		    var url;
		    if(descriptor) {
		    	url = map[descriptor];
		    }
			if(url){
				return url;
			}
			else {
				throw new Error("URL not found");
			}

		};

		/**
		 * To load help property for given context.
		 * @param {Object} descriptor - the object having default path and namespace to load help file
		 * 
		 * @example
		 * my_descriptor = {name: 'Alias', path:'/installed_plugins/security_management/help/', namespace: 'security-management'}
		 */

		this.properties = function(helpPath) {
			var defaultPath = {
			name: '',
			path: '',
			namespace: ''
			};
			if(helpPath.namespace){
				defaultPath = _.extend(defaultPath, helpPath || {});
			}
			path = defaultPath.path+defaultPath.name+".xml";
			loadXMLFile(path, defaultPath.namespace);
		};

		/**
		 * To fetch the xml file and construct the map object.
		 * @param {string} pathForXml - Path to load xml file
		 * 
		 */

		var loadXMLFile = function(pathForXml, namespace) {
			$.ajax({
	            type: "GET",
	            url: pathForXml,
	            cache: false,
	            async: false,
	            dataType: "xml",
	            success: function(xml) {
						$(xml).find('Map').each(function(){
							var key = namespace + "." + $(this).attr('Name');
							var link = $(this).attr('Link');
							if(key && link) {
								map[key] = link;
							}
						});
	            }
	        });
		};

	   };
	return xmlParser;
});