var fs = require('fs'),
	async = require('async'),
	xml2js = require('xml2js'),
	builder = new xml2js.Builder(),
	parser = new xml2js.Parser(),
	combinedSearchEnts = new Array(),
	combinedSearchUrls = new Array();

// Array Remove - By John Resig (MIT Licensed)
Array.remove = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

var parseMainSearch = function() {
	fs.readFile('../public/help/en/Data/Search.xml', function(err, data) {
	    parser.parseString(data, function (err, result) {

	    	// remove Urls
	    	combinedSearchUrls.forEach(function(item){
	    		var urlLength = result.index.urls[0]['Url'].length;
	    		for(var i = 0; i < urlLength; i++){
	    			if(result.index.urls[0]['Url'][i].$.Source.trim() == item.$.Source.trim()){
	    					Array.remove(result.index.urls[0]['Url'], i);
	    				break;
	    			}
	    		}
	    	});

	    	// remove ents
	        combinedSearchEnts.forEach(function(item){
	    		// result.index.ents.push(item);
	    	});

	        var xml = builder.buildObject(result);
	        // console.log(xml);
			fs.writeFile('../public/help/en/Data/Search.xml', xml, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file was saved!");
			    }

				combinedSearchUrls = null;
				combinedSearchEnts = null;
				builder = null;
				parser = null;

			}); 
	    });
	});
};

function PluginHelpSearchFile(fileName){
	this.fileName = fileName;
}

PluginHelpSearchFile.prototype.parsePluginSearch = function(callback){
	fs.readFile(this.fileName, function(err, data) {
	    parser.parseString(data, function (err, result) {
	        var searchEntsFragment = result.index.ents;
	        combinedSearchEnts = combinedSearchEnts.concat(searchEntsFragment);

	        var searchUrlsFragment = result.index.urls[0]['Url'];
	        combinedSearchUrls = combinedSearchUrls.concat(searchUrlsFragment);

	        if(typeof callback === "function"){
	        	callback();
	        }
	    });
	});
};

var pluginInstallLocation = process.argv[2];
var scriptPath = process.argv[3];
var pluginSegments = pluginInstallLocation.split('/');
var nSegments = pluginSegments.length;
var pluginName = pluginSegments[nSegments - 1];
var fileLocation = '../public/installed_plugins/' + pluginName + '/help/en/Data/Search.xml';
// console.log(fileLocation);

var items = [];
items.push(new PluginHelpSearchFile(fileLocation));

var asyncTasks = [];

items.forEach(function(item){
	asyncTasks.push(function(callback){
		item.parsePluginSearch(function(){
			callback();
		});
	});
});

async.parallel(asyncTasks, function(){
  // All tasks are done now
  parseMainSearch();
});