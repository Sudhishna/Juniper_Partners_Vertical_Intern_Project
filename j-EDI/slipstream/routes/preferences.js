/** 
 * A module that implements the preferences API for the slipstream server.
 * @module preferences
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
var preferences = function preferences(app, device_port) {
	var redis = require('redis');
	var sessionKey = 'api.sid';
	var testSessionKey = 'test-key'
	var http = require('http');
	var querystring = require('querystring');
	var settings = require('../config');
	var redis_port = settings.redis_port;
	var redis_host = settings.redis_host;
	var redisClient = redis.createClient(redis_port, redis_host);

	redisClient.on('error', function(err) {
		console.log('Error ' + err);
	});

	/**
	 * Get User Preference API Handler.  This method gets the user record associated
	 *	with the logged in user.
	 *
	 * @param {Object) req - The request object.
	 * @param {Object} res - The response object
	 */
	var getUserPreferences = function(req, res) {
		var userName = req.query.userName;
		if (userName != null) {
			redisClient.get(userName, function(err, reply) {
				if (err) {
					res.status(500);
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					return res.send(JSON.stringify({
						status: 'Error - Internal DB error ' + err.toString()
					}));
				} else {
					if (reply == null) {
						res.status(200);
						res.setHeader('Content-Type', 'application/json; charset=utf-8');
						return res.send(JSON.stringify({}));
					} else {
						res.status(200);
						res.setHeader('Content-Type', 'application/json; charset=utf-8');
						return res.send(reply);
					}
				}
			});
		} else {
			res.status(401);
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			return res.send(JSON.stringify({
				status: 'Error - Need to be authenticated to perform this operation'
			}));
		}

	};

	/**
	 * Put User Preference API Handler.  This method updates the preferences for
	 *  the logged in user.
	 *
	 * @param {Object) req - The request object.
	 * @param {Object} res - The response object
	 */
	var putUserPreferences = function(req, res) {
		var userName = req.query.userName;
		if (userName != null) {
			redisClient.set(userName, JSON.stringify(req.body), function(err) {
				if (err) {
					res.status(500);
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					return res.send(JSON.stringify({
						status: 'Error - Internal DB error ' + err.toString()
					}));
				} else {
					res.status(200);
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					return res.send(JSON.stringify({
						status: 'Success - Updated preferences for user'
					}));
				}
			});
		} else {
			res.status(401);
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			return res.send(JSON.stringify({
				status: 'Error - Need to be authenticated to perform this operation'
			}));
		}
	};

	/**
	 * Delete User Preference API Handler.  This method deletes the user record associated
	 *	with the logged in user.
	 *
	 * @param {Object) req - The request object.
	 * @param {Object} res - The response object
	 */
	var deleteUserPreferences = function(req, res) {
		var userName = req.query.userName;	
		if (userName != null) {
			redisClient.del(userName, function(err) {
				if (err) {
					res.status(500);
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					return res.send(JSON.stringify({
						status: 'Error - Internal DB error ' + err.toString()
					}));
				} else {
					res.status(200);
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					return res.send(JSON.stringify({
						status: 'Success - Deleted preferences for user'
					}));
				}
			});
		} else {
			res.status(401);
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			return res.send(JSON.stringify({
				status: 'Error - Need to be authenticated to perform this operation'
			}));
		}
	};

	/**
	 * Post to the user preferences API. Fail
	 *
	 * @param {object} req - The express request object
	 * @param {object} res - The express response object
	 * @returns {function} function that sends JSON error response
	 */
	var postUserPreferences = function(req, res) {
		res.status(403);
		res.setHeader('Content-Type', 'application/json; charset=utf-8');
		return res.send(JSON.stringify({
			status: 'Error - POST not allowed. Use PUT to update/create user preferences.'
		}));
	};


	/**
	 * Get Session Preference API Handler.  This method gets the session record associated
	 *	with the session key.
	 *
	 * @param {Object) url - The request object.
	 * @param {Object} res - The response object
	 */
	var getSessionPreferences = function(req, res) {
		var sessionToken = req.cookies[sessionKey];
		if (sessionToken) {
			redisClient.get(sessionToken, function(err, reply) {
				if (err) {
					res.status(500);
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					return res.send(JSON.stringify({
						status: 'Error - Internal DB error ' + err.toString()
					}));
				} else {
					if (reply == null) {
						res.status(200);
						res.setHeader('Content-Type', 'application/json; charset=utf-8');
						return res.send(JSON.stringify({}));
					} else {
						res.status(200);
						res.setHeader('Content-Type', 'application/json; charset=utf-8');
						return res.send(reply);
					}
				}
			});
		} else {
			res.status(401);
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			return res.send(JSON.stringify({
				status: 'Error - Need to be authenticated to perform this operation'
			}));
		}
	}

	/**
	 * Put Session Preference API Handler.  This method updates the session record associated
	 *	with the session key given an object to update.
	 *
	 * @param {Object) url - The request object.
	 * @param {Object} res - The response object
	 */
	var putSessionPreferences = function(req, res) {
		var sessionToken = req.cookies[sessionKey];
		if (sessionToken) {
			redisClient.set(sessionToken, JSON.stringify(req.body), function(err) {
				if (err) {
					res.status(500);
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					return res.send(JSON.stringify({
						status: 'Error - Internal DB error ' + err.toString()
					}));
				} else {
					res.status(200);
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					return res.send(JSON.stringify({
						status: 'Success - Updated preferences for session'
					}));
				}
			});
		} else {
			res.status(401);
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			return res.send(JSON.stringify({
				status: 'Error - Need to be authenticated to perform this operation'
			}));
		}
	};

	/**
	 * Delete Session Preference API Handler.  This method deletes the session record associated
	 *	with the session key.
	 *
	 * @param {Object) url - The request object.
	 * @param {Object} res - The response object
	 */
	var deleteSessionPreferences = function(req, res) {
		var sessionToken = req.cookies[sessionKey];
		if (sessionToken) {
			redisClient.del(sessionToken, function(err) {
				if (err) {
					res.status(500);
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					return res.send(JSON.stringify({
						status: 'Error - Internal DB error ' + err.toString()
					}));
				} else {
					res.status(200);
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					return res.send(JSON.stringify({
						status: 'Success - Deleted preferences for session'
					}));
				}
			});
		} else {
			res.status(401);
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			return res.send(JSON.stringify({
				status: 'Error - Need to be authenticated to perform this operation'
			}));
		}
	};

	/**
	 * Post to the session preferences API. Fail
	 *
	 * @param {object} req - The express request object
	 * @param {object} res - The express response object
	 * @returns {function} function that sends JSON error response
	 */
	var postSessionPreferences = function(req, res) {
		res.status(403);
		res.setHeader('Content-Type', 'application/json; charset=utf-8');
		return res.send(JSON.stringify({
			status: 'Error - POST not allowed. Use PUT to update/create session preferences.'
		}));
	};


	// User preferences API
	app.get('/slipstream/preferences/user', getUserPreferences);
	app.put('/slipstream/preferences/user', putUserPreferences);
	app.delete('/slipstream/preferences/user', deleteUserPreferences);
	app.post('/slipstream/preferences/user', postUserPreferences);


	// Session preferences API
	app.get('/slipstream/preferences/session', getSessionPreferences);
	app.put('/slipstream/preferences/session', putSessionPreferences);
	app.delete('/slipstream/preferences/session', deleteSessionPreferences);
	app.post('/slipstream/preferences/session', postSessionPreferences);
};

module.exports = preferences;