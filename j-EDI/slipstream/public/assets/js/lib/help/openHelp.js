/**
 * The module that opens the help page
 *
 * @module Help
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(['lib/template_renderer/template_renderer','conf/global_config'],function(template_renderer, globalConf) {

 		var Help = function(){
	
			var win;

			/**
			 * To open help page for given identifier.
			 * @param {string} id - the UA help identifier 
			 * @param {string} locale - specific locale for help page 
			 */
		
			this.openHelp = function(url, locale){

			if(url && locale){
			 	var host = template_renderer(globalConf.url,{language:locale});
			 	// url = host+"/Content/"+url;
			 	url = host+ '/' +url;
			 	if (win && !win.closed) {
			 		win.location.href = url;
			 	}
			 	else {
			 		win = window.open(url);
			 	}
			 	if(win != null){
			 			win.focus();
			 	}
			}
			};
		};
	return Help;
});
