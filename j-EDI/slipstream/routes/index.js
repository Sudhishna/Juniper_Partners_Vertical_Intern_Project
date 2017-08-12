/*
 * GET home page.
 */

var index = function(app) {
	var fs, configurationFile;
	var buildInfo = {};

    if (process.env.NODE_ENV == 'production') {
	    buildInfoFile = app.get("docroot") + '/assets/js/build-info.json';
	    fs = require('fs');

	    try {
	    	if (fs.statSync(buildInfoFile).isFile()) {
		        buildInfo = JSON.parse(
				    fs.readFileSync(buildInfoFile)
				);	
			}
	    }
	    catch (err) {
	    	console.log("Failed to read build info from", buildInfoFile);
        }
    }

	app.get('*', function(req, res) {
		res.header("Cache-Control", "nocache");
		return res.render('index', buildInfo);
	});
};

module.exports = index;