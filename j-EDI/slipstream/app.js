/** 
 * The express/node app server
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

var express = require('express');
var http = require('http');
var path = require('path');
var pubsub = require('./modules/pubsub');

var app = express();

app.use(express.compress());  
app.use(express.cookieParser());

app.engine('html', require('hogan-express'));

var device_port = process.env.DEVICE_PORT || 4730;

// all environments
app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.set('docroot', path.join(path.dirname(require.main.filename), "public"));
    app.set('plugins_base', "installed_plugins");
    app.use(express.favicon(path.join("public", "assets", "images", "favicon.png")));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('./modules/asset_rewriter'));
});

// Development mode configuration params
app.configure('development', function() {
    console.log('Configuring development mode');
    app.use(logErrors);
    app.use(clientErrorHandler);
    app.use(errorHandler);
    app.use(express.bodyParser());
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
});

// Production mode configuration params
app.configure('production', function() {
    console.log('Configuring production mode');
    var oneYear = 365*24*60*60*1000;
    app.use(express.bodyParser());
    // never cache index.html
    app.use(express.static(path.join(__dirname, 'views', 'index.html'), {maxAge: 0}));
    // cache all other static files
    app.use(express.static(path.join(__dirname, 'public'), {maxAge: oneYear}));
    app.use(app.router);
});

/* Log errors on console.
 *
 * @param {object} err - error object to log.
 * @param {object} req - express request object.
 * @param {object} res - express response object.
 * @param {Function} next - next function to call with error.
 */
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

/* Send error to client if request was issued with the "X-Requested-With" 
 * header field set to "XMLHttpRequest" (jQuery etc).
 *
 * @param {object} err - error object to log.
 * @param {object} req - express request object.
 * @param {object} res - express response object.
 * @param {Function} next - next function to call with error.
 */
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.send(500, {
            error: 'Something blew up!'
        });
    } else {
        next(err);
    }
}

/* Render error in current view.
 *
 * @param {object} err - error object to log.
 * @param {object} req - express request object.
 * @param {object} res - express response object.
 * @param {Function} next - next function to call with error.
 */
function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', {
        error: err
    });
}

// Routes
require('./routes/preferences')(app, device_port);
require('./routes/plugin')(app);
require('./routes/index')(app);

// Enable development mode
// To enable producttion mode; set the environment variable
//    NODE_ENV => production
app.enable(process.env.NODE_ENV || "development");

var server = http.createServer(app);

// initialize pubsub system
pubsub.init(server);

// Only start if called directly, to facilitate testing
if (!module.parent) {
    server.listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });
}

exports = module.exports = server;

// delegates use() function
exports.use = function() {
  app.use.apply(app, arguments);
};
