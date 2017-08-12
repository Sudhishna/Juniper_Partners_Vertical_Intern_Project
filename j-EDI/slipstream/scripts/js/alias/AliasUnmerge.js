var fs = require('fs'),
	async = require('async'),
	xml2js = require('xml2js'),
	builder = new xml2js.Builder(),
	parser = new xml2js.Parser(),
	combinedAliases = new Array();

// Array Remove - By John Resig (MIT Licensed)
Array.remove = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

var parseMainAlias = function(pathToFile) {
	fs.realpath(pathToFile, null, function (err, resolvedPath) {
		if (err){
			throw err;
		}	
		fs.readFile(resolvedPath, function(err, data) {
		    parser.parseString(data, function (err, result) {

				combinedAliases.forEach(function(item){
		    		var nEntriesInMainAlias = result.CatapultAliasFile.Map.length;
		    		for(var i = 0; i < nEntriesInMainAlias; i++){
		    			if(result.CatapultAliasFile.Map[i].$){
		    				if(result.CatapultAliasFile.Map[i].$.Name){
		    					if(item.$.Name.trim() == result.CatapultAliasFile.Map[i].$.Name.trim()){
		    						Array.remove(result.CatapultAliasFile.Map, i);
		    						break;
		    					}
		    				}
		    			}
		    		}
		    	});

		        var xml = builder.buildObject(result);
		        // console.log(xml);
				fs.writeFile(resolvedPath, xml, function(err) {
				    if(err) {
				        console.log(err);
				    } else {
				        console.log("The file was saved!");
				    }

					combinedAliases = null;
					builder = null;
					parser = null;

				}); 
		    });
		});
	});
};

function PluginHelpAliasFile(fileName){
	this.fileName = fileName;
}

PluginHelpAliasFile.prototype.parsePluginAlias = function(callback){
	fs.readFile(this.fileName, function(err, data) {
	    parser.parseString(data, function (err, result) {
	        var AliasFragment = result.CatapultAliasFile.Map;
	        combinedAliases = combinedAliases.concat(AliasFragment);
	        if(typeof callback === "function"){
	        	callback();
	        }
	    });
	});
};

var pluginInstallLocation = process.argv[2];
var installPath = process.argv[3];
var locale = process.argv[4];
var pluginSegments = pluginInstallLocation.split('/');
var nSegments = pluginSegments.length;
var pluginName = pluginSegments[nSegments - 1];
var fileLocation = installPath + '/' + pluginName + '/help/' + locale + '/Data/Alias.xml';
var mainFileLocation = installPath + '/../help/' + locale + '/Data/Alias.xml';
// console.log(fileLocation);

var items = [];
items.push(new PluginHelpAliasFile(fileLocation));

var asyncTasks = [];

items.forEach(function(item){
	asyncTasks.push(function(callback){
		item.parsePluginAlias(function(){
			callback();
		});
	});
});

async.parallel(asyncTasks, function(){
  // All tasks are done now
  parseMainAlias(mainFileLocation);
});