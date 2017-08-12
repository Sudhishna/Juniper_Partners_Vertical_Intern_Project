/**
 * A set commonly used functions to assist with testing
 */
var http = require('http'),
    assert = require('assert'),
    pubsub = require('../modules/pubsub'),
    svr,
    URL_LOGIN  = 'http://localhost:3000/api/login',
    URL_LOGOUT = 'http://localhost:3000/api/logout',
    sockets = [];


/**
 * Gets the credentials to use for test environment
 */
exports.getTestCredentials = function() {
    return {
        user: "root",
        password: "Embe1mpls",
        host: "vre"
    };
};

/**
 * Perform login so that tests can be performed against the API
 *
 * @param {Request} request
 * @param {Function} done - The mocha done callback
 */
exports.login = function(request, done) {
    var credentials = exports.getTestCredentials();
    request
        .post(URL_LOGIN)
        .send(credentials)
        .end(function(err, response) {
            if (err) throw err;

            done(response);
        });
};

/**
 * Perform logout so that sessions close
 *
 * @param {Request} request
 * @param {Object} cookies - The express cookie object
 * @param {Function} done - The mocha done callback
 */
exports.logout = function(request, cookies, done) {
    request
        .get(URL_LOGOUT)
        .set('Cookie', cookies)
        .end(function(err, response) {
            if (err) throw err;
     
            done();
        });
};

/**
 * Starts the provided application and informs watchers when complete
 *
 * @param {server} server - The express server to start
 * @param {Function} done - The done callback for mocha
 */
exports.startServer = function(server, done) {
    sockets = [];

    svr = server.listen(3000, function(err, result) {
        if (err) {
            done(err);
        } else {
            done();
        }
    });

    svr.on("connection", function(socket) {
        sockets.push(socket);
    });
};

/**
 * Closes all sockets connected to the application
 *
 * @param {Function} done - The done callback for mocha, if used
 */
exports.stopServer = function(done) {
    for (var i = 0, j = sockets.length; i < j; i++) {
        sockets[i].destroy();
    }

    svr.close(function() {
        if (done) {
            done();
        }
    });
};


