/** Test for Redis connection
 *  @author Sanket Desai <sanketdesai@juniper.net>
 *  @copyright Juniper Networks, Inc. 2014
 */

var redis = require('redis'),
   	redisClient = null,
   	config = require('../../config'),
   	server = require("../../app"),
   	preferences = require('../../routes/preferences'),
   	utils = require('../../lib/test-utils'),
   	routes = require("../../routes"),
   	request = require('supertest'),
   	assert = require('assert');
   	
var TEST_PREFERENCES_DATA = {
	"test": "preferences"
};

var EXPECTED_TEST_PREFERENCES_RESPONSE = {
		"test": "preferences"
};

describe('Redis configuration check for preferences module: ', function(){
	before(function(done) {
		var redis_port = config.redis_port;
		var redis_host = config.redis_host;
		redisClient = redis.createClient(redis_port, redis_host);
		redisClient.on("error", function (err) {
	        console.log("Redis Client encountered error " + err);
	    });
	    utils.startServer(server, done);
	});

	after(function(done){
		redisClient.quit();
		utils.stopServer();
        done();
	});

	describe('Pushing sample data in redis for testUser ', function() {
			it(' should use Redis configuration declared in config file ', function(done) {
				request(server)
					.put('/slipstream/preferences/user?userName=testUser')
					.set('Accept', 'application/json')
					.set('Content-Type', 'application/json')
					.send(TEST_PREFERENCES_DATA)
					.expect(200)
					.expect('Content-Type', 'application/json; charset=utf-8')
					.expect(JSON.stringify({
							status: 'Success - Updated preferences for testUser'
					}), function() {
						redisClient.get('testUser', function(err, reply) {
							if (!err) {
								console.log(reply);
								if (reply != JSON.stringify(EXPECTED_TEST_PREFERENCES_RESPONSE)){
									done(new Error('Did not create entry as expected'));
								} else {
									redisClient.del('testUser');
									done();
								}
							} else {
								done(err);
							}
						});
					});
			});
	});
});

