var fs = require('fs'),
	async = require('async'),
	xml2js = require('xml2js'),
	builder = new xml2js.Builder(),
	parser = new xml2js.Parser(),
	combinedTocs = new Array();

var parseMainToc = function(pathToFile) {
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
		    	var referencesTocEntry = result.CatapultToc.TocEntry.pop();
		    	combinedTocs.forEach(function(item){

		    		result.CatapultToc.TocEntry.push(item);
		    	});

		        result.CatapultToc.TocEntry.push(referencesTocEntry);

		        var xml = builder.buildObject(result);
		        // console.log(xml);
				fs.writeFile(resolvedPath, xml, function(err) {
				    if(err) {
						throw err;
				    } else {
				        console.log("The file was saved!");
				    }
					combinedTocs = null;
					builder = null;
					parser = null;
				}); 
		    });
		});
	});	
};

function PluginHelpTocFile(fileName){
	this.fileName = fileName;
}

PluginHelpTocFile.prototype.parsePluginToc = function(callback){
	fs.readFile(this.fileName, function(err, data) {
	    parser.parseString(data, function (err, result) {
	        var tocFragment = result.CatapultToc.TocEntry;
	        combinedTocs = combinedTocs.concat(tocFragment);
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
var tocFileLocation = installPath + '/' + pluginName + '/help/' + locale + '/Data/Toc.xml';
var mainTocFileLocation = installPath + '/../help/' +  locale + '/Data/Toc.xml';

var items = [];
items.push(new PluginHelpTocFile(tocFileLocation));

var asyncTasks = [];

items.forEach(function(item){
	asyncTasks.push(function(callback){
		item.parsePluginToc(function(){
			callback();
		});
	});
});

async.parallel(asyncTasks, function(){
  // All tasks are done now
  parseMainToc(mainTocFileLocation);
});