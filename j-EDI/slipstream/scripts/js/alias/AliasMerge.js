var fs = require('fs'),
	async = require('async'),
	xml2js = require('xml2js'),
	builder = new xml2js.Builder(),
	parser = new xml2js.Parser(),
	combinedAliases = new Array();

var parseMainAlias = function(pathToFile) {
	fs.realpath(pathToFile, null, function (err, resolvedPath) {
		if (err){
			throw err;
		}
		fs.readFile(resolvedPath, function(err, data) {
			if (err){
				throw err;
			}			
		    parser.parseString(data, function (err, result) {
		    	if (err){
					throw err;
				}
				combinedAliases.forEach(function(item){
		    		result.CatapultAliasFile.Map.push(item);
		    	});

		        var xml = builder.buildObject(result);
				fs.writeFile(resolvedPath, xml, function(err) {
				    if(err) {
						throw err;
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

console.log(fileLocation);

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