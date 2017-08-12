/** 
 * Tests for Preferences API
 *
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

var server = require("../../app"),
    assert = require("assert"),
    request = require('supertest'),
    utils = require('../../lib/test-utils'),
   	redis = require('redis'),
   	redisClient = null,
   	prefs = require('../../routes/preferences');


var TEST_PREFERENCES_DATA = {
	"dashboard": "preferences"
};

var EXPECTED_TEST_PREFERENCES_RESPONSE = {
		"dashboard": "preferences"
};

var EXPECTED_TESTUSER_PREFERENCES_RESPONSE = EXPECTED_TEST_PREFERENCES_RESPONSE
var EXPECTED_DEFAULTUSER_PREFERENCES_RESPONSE = EXPECTED_TEST_PREFERENCES_RESPONSE;
var EXPECTED_TESTSESSION_PREFERENCES_RESPONSE = EXPECTED_TEST_PREFERENCES_RESPONSE;


var TEST_PREFERENCES_DATA_FOR_UPDATE = {
	"dashboard": "updated_preferences"
};


var EXPECTED_TEST_PREFERENCES_RESPONSE_FOR_UPDATE = {
		"dashboard": "updated_preferences"
};

var EXPECTED_TESTUSER_PREFERENCES_RESPONSE_FOR_UPDATE = EXPECTED_TEST_PREFERENCES_RESPONSE_FOR_UPDATE;
var EXPECTED_DEFAULTUSER_PREFERENCES_RESPONSE_FOR_UPDATE = EXPECTED_TEST_PREFERENCES_RESPONSE_FOR_UPDATE;
var EXPECTED_TESTSESSION_PREFERENCES_RESPONSE_FOR_UPDATE = EXPECTED_TEST_PREFERENCES_RESPONSE_FOR_UPDATE;


describe('Preference API Tests', function(){
	before(function(done) {
		redisClient = redis.createClient();
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

	describe('User preferences API Tests', function() {
		describe('.post', function() {
			it('should return expected error for default user', function(done) {
				request(server)
					.post('/slipstream/preferences/user')
					.expect(403)
					.expect('Content-Type', 'application/json; charset=utf-8')
					.expect(JSON.stringify({
						status: 'Error - POST not allowed. Use PUT to update/create user preferences.'
					}), done);
			});

			it('should return expected error for unauthenticated user', function(done) {
				request(server)
					.post('/slipstream/preferences/user')
					.set('Cookie', 'api.sid=someRandomSessionId')
					.expect(403)
					.expect('Content-Type', 'application/json; charset=utf-8')
					.expect(JSON.stringify({
						status: 'Error - POST not allowed. Use PUT to update/create user preferences.'
					}), done);
			});

			it('should return expected error for authenticated user', function(done) {
				request(server)
					.post('/slipstream/preferences/user')
					.set('Cookie', 'test-key=testSessionId')
					.expect(403)
					.expect('Content-Type', 'application/json; charset=utf-8')
					.expect(JSON.stringify({
						status: 'Error - POST not allowed. Use PUT to update/create user preferences.'
					}), done);
			});
		});

		describe('.get', function() {
			// it('should return expected preferences object for default user', function(done) {
			// 	redisClient.set('', JSON.stringify(TEST_PREFERENCES_DATA), function(err) {
			// 		if (!err) {
			// 			request(server)
			// 				.get('/slipstream/preferences/user?userName=super')
			// 				.expect(200)
			// 				.expect('Content-Type', 'application/json; charset=utf-8')
			// 				.expect(JSON.stringify(EXPECTED_DEFAULTUSER_PREFERENCES_RESPONSE))
			// 				.end(function(res) {
			// 					redisClient.del('');
			// 					done();		
			// 				});
			// 		} else {
			// 			done(err);
			// 		}
			// 	});
			// });

			it('should return expected error for unauthenticated user', function(done) {
				redisClient.set('testuser', JSON.stringify(TEST_PREFERENCES_DATA), function(err) {
					if (!err) {
						request(server)
							.get('/slipstream/preferences/user')
							.set('Cookie', 'api.sid=someRandomSessionId')
							.expect(401)
							.expect('Content-Type', 'application/json; charset=utf-8')
							.expect(JSON.stringify({
								status: 'Error - Need to be authenticated to perform this operation'
							}))
							.end(function(res) {
								redisClient.del('testuser');
								done();		
							});
					} else {
						done(err);
					}
				});
			});

			// it('should return expected preferences object for authenticated user', function(done) {
			// 	redisClient.set('testuser', JSON.stringify(TEST_PREFERENCES_DATA), function(err) {
			// 		if (!err) {
			// 			request(server)
			// 				.get('/slipstream/preferences/user?userName=super')
			// 				.set('Cookie', 'test-key=testSessionId')
			// 				.expect(200)
			// 				.expect('Content-Type', 'application/json; charset=utf-8')
			// 				.expect(JSON.stringify(EXPECTED_TESTUSER_PREFERENCES_RESPONSE))
			// 				.end(function(res) {
			// 					redisClient.del('testuser');
			// 					done();		
			// 				});
			// 		} else {
			// 			done(err);
			// 		}
			// 	});
			// });
		});

		describe('.put', function() {
			// it('should return 200 for default user and should create preferences', function(done) {
			// 	request(server)
			// 		.put('/slipstream/preferences/user')
			// 		.set('Accept', 'application/json')
			// 		.set('Content-Type', 'application/json')
			// 		.send(TEST_PREFERENCES_DATA)
			// 		.expect(200)
			// 		.expect('Content-Type', 'application/json; charset=utf-8')
			// 		.expect(JSON.stringify({
			// 				status: 'Success - Updated preferences for user'
			// 		}), function() {
			// 			redisClient.get('', function(err, reply) {
			// 				if (!err) {
			// 					if (reply != JSON.stringify(EXPECTED_DEFAULTUSER_PREFERENCES_RESPONSE)){
			// 						done(new Error('Did not create entry as expected'));
			// 					} else {
			// 						redisClient.del('');
			// 						done();
			// 					}
			// 				} else {
			// 					done(err);
			// 				}
			// 			});
			// 		});
			// });

			it('should return expected error for unauthenticated user', function(done) {
				request(server)
					.put('/slipstream/preferences/user')
					.set('Cookie', 'api.sid=someRandomSessionId')
					.set('Content-Type', 'application/json')
					.send(TEST_PREFERENCES_DATA)
					.expect(401)
					.expect('Content-Type', 'application/json; charset=utf-8')
					.expect(JSON.stringify({
						status: 'Error - Need to be authenticated to perform this operation'
					}), done);
			});

			// it('should return 200 for authenticated user and should create preferences for user that does not have any preferences', function(done) {
			// 	request(server)
			// 		.put('/slipstream/preferences/user')
			// 		.set('Cookie', 'test-key=testSessionId')
			// 		.set('Accept', 'application/json')
			// 		.set('Content-Type', 'application/json')
			// 		.send(TEST_PREFERENCES_DATA)
			// 		.expect(200)
			// 		.expect('Content-Type', 'application/json; charset=utf-8')
			// 		.expect(JSON.stringify({
			// 				status: 'Success - Updated preferences for user'
			// 		}), function() {
			// 			redisClient.get('testuser', function(err, reply) {
			// 				if (!err) {
			// 					if (reply != JSON.stringify(EXPECTED_TESTUSER_PREFERENCES_RESPONSE)){
			// 						done(new Error('Did not create entry as expected'));
			// 					} else {
			// 						redisClient.del('testuser');
			// 						done();
			// 					}
			// 				} else {
			// 					done(err);
			// 				}
			// 			});
			// 		});
			// });

			// it('should return 200 for default user and should update preferences when preferences were already set', function(done) {	
			// 	redisClient.set('', JSON.stringify(TEST_PREFERENCES_DATA), function(err) {
			// 		if (!err) {
			// 			request(server)
			// 				.put('/slipstream/preferences/user')
			// 				.set('Accept', 'application/json')
			// 				.set('Content-Type', 'application/json')
			// 				.send(TEST_PREFERENCES_DATA_FOR_UPDATE)
			// 				.expect(200)
			// 				.expect('Content-Type', 'application/json; charset=utf-8')
			// 				.expect(JSON.stringify({
			// 						status: 'Success - Updated preferences for user'
			// 				}), function() {
			// 					redisClient.get('', function(err, reply) {
			// 						if (!err) {
			// 							if (reply != JSON.stringify(EXPECTED_DEFAULTUSER_PREFERENCES_RESPONSE_FOR_UPDATE)){
			// 								done(new Error('Did not update entry as expected'));
			// 							} else {
			// 								redisClient.del('');
			// 								done();
			// 							}
			// 						} else {
			// 							done(err);
			// 						}
			// 					});
			// 				});
			// 		} else {
			// 			done(err);
			// 		}
			// 	});
			// });

			// it('should return 200 for authenticated user and should update preferences for user that already has preferences', function(done) {	
			// 	redisClient.set('testuser', JSON.stringify(TEST_PREFERENCES_DATA), function(err) {
			// 		if (!err) {
			// 			request(server)
			// 				.put('/slipstream/preferences/user')
			// 				.set('Cookie', 'test-key=testSessionId')
			// 				.set('Accept', 'application/json')
			// 				.set('Content-Type', 'application/json')
			// 				.send(TEST_PREFERENCES_DATA_FOR_UPDATE)
			// 				.expect(200)
			// 				.expect('Content-Type', 'application/json; charset=utf-8')
			// 				.expect(JSON.stringify({
			// 						status: 'Success - Updated preferences for user'
			// 				}), function() {
			// 					redisClient.get('testuser', function(err, reply) {
			// 						if (!err) {
			// 							if (reply != JSON.stringify(EXPECTED_TESTUSER_PREFERENCES_RESPONSE_FOR_UPDATE)){
			// 								done(new Error('Did not update entry as expected'));
			// 							} else {
			// 								redisClient.del('testuser');
			// 								done();
			// 							}
			// 						} else {
			// 							done(err);
			// 						}
			// 					});
			// 				});
			// 		} else {
			// 			done(err);
			// 		}
			// 	});
			// });
		});

		describe('.delete', function() {

			// it('should delete the preferences and return 200 with expected response for default user', function(done) {
			// 	redisClient.set('', JSON.stringify(TEST_PREFERENCES_DATA), function(err) {
			// 		if (!err) {
			// 			request(server)
			// 				.del('/slipstream/preferences/user')
			// 				.expect(200)
			// 				.expect('Content-Type', 'application/json; charset=utf-8')
			// 				.expect(JSON.stringify({
			// 					status: 'Success - Deleted preferences for user'
			// 				}))
			// 				.end(function(res) {
			// 					done();		
			// 				});
			// 		} else {
			// 			done(err);
			// 		}
			// 	});
			// });

			it('should return expected error for unauthenticated user', function(done) {
				redisClient.set('testuser', JSON.stringify(TEST_PREFERENCES_DATA), function(err) {
					if (!err) {
						request(server)
							.del('/slipstream/preferences/user')
							.set('Cookie', 'api.sid=someRandomSessionId')
							.expect(401)
							.expect('Content-Type', 'application/json; charset=utf-8')
							.expect(JSON.stringify({
								status: 'Error - Need to be authenticated to perform this operation'
							}))
							.end(function(res) {
								redisClient.del('testuser');
								done();		
							});
					} else {
						done(err);
					}
				});
			});

			// it('should delete the preferences and return 200 with expected response for authenticated user', function(done) {
			// 	redisClient.set('testuser', JSON.stringify(TEST_PREFERENCES_DATA), function(err) {
			// 		if (!err) {
			// 			request(server)
			// 				.del('/slipstream/preferences/user')
			// 				.set('Cookie', 'test-key=testSessionId')
			// 				.expect(200)
			// 				.expect('Content-Type', 'application/json; charset=utf-8')
			// 				.expect(JSON.stringify({
			// 					status: 'Success - Deleted preferences for user'
			// 				}))
			// 				.end(function(res) {
			// 					done();		
			// 				});
			// 		} else {
			// 			done(err);
			// 		}
			// 	});
			// });
		});
	});

	describe('Session preferences API Tests', function() {

		describe('.post', function() {
			it('should return expected error when used without a session-key', function(done) {
				request(server)
					.post('/slipstream/preferences/session')
					.expect(403)
					.expect('Content-Type', 'application/json; charset=utf-8')
					.expect(JSON.stringify({
						status: 'Error - POST not allowed. Use PUT to update/create session preferences.'
					}), done);
			});

			it('should return expected error when used with a session-key', function(done) {
				request(server)
					.post('/slipstream/preferences/session')
					.set('Cookie', 'api.sid=testUserSessionId')
					.expect(403)
					.expect('Content-Type', 'application/json; charset=utf-8')
					.expect(JSON.stringify({
						status: 'Error - POST not allowed. Use PUT to update/create session preferences.'
					}), done);
			});
		});

		describe('.get', function() {
			it('should return expected error when used without a session key', function(done) {
				redisClient.set('testUserSessionId', JSON.stringify(TEST_PREFERENCES_DATA), function(err) {
					if (!err) {
						request(server)
							.get('/slipstream/preferences/session')
							.expect(401)
							.expect('Content-Type', 'application/json; charset=utf-8')
							.expect(JSON.stringify({
								status: 'Error - Need to be authenticated to perform this operation'
							}))
							.end(function(err, res) {
								redisClient.del('testUserSessionId');
								if (err) {
									done(err);
								} else {
									done();	
								}
							});
					} else {
						done(err);
					}
				});
			});

			// it('should return expected preferences object when used with a sessionId', function(done) {
			// 	redisClient.set('testUserSessionId', JSON.stringify(TEST_PREFERENCES_DATA), function(err) {
			// 		if (!err) {
			// 			request(server)
			// 				.get('/slipstream/preferences/session')
			// 				.set('Cookie', 'api.sid=testUserSessionId')
			// 				.expect(200)
			// 				.expect('Content-Type', 'application/json; charset=utf-8')
			// 				.expect(JSON.stringify(EXPECTED_TESTSESSION_PREFERENCES_RESPONSE))
			// 				.end(function(err, res) {
			// 					redisClient.del('testUserSessionId');
			// 					if (err) {
			// 						done(err);
			// 					} else {
			// 						done();	
			// 					}
								
			// 				});
			// 		} else {
			// 			done(err);
			// 		}
			// 	});
			// });
		});

		describe('.put', function() {
			it('should return expected error when used without a sessionId', function(done) {
				request(server)
					.put('/slipstream/preferences/session')
					.set('Content-Type', 'application/json')
					.send(TEST_PREFERENCES_DATA)
					.expect(401)
					.expect('Content-Type', 'application/json; charset=utf-8')
					.expect(JSON.stringify({
						status: 'Error - Need to be authenticated to perform this operation'
					}), done);
			});

			// it('should return 200 and should create preferences when used with a sessionId and session preferences don\'t exist', function(done) {
			// 	request(server)
			// 		.put('/slipstream/preferences/session')
			// 		.set('Cookie', 'api.sid=testUserSessionId')
			// 		.set('Accept', 'application/json')
			// 		.set('Content-Type', 'application/json')
			// 		.send(TEST_PREFERENCES_DATA)
			// 		.expect(200)
			// 		.expect('Content-Type', 'application/json; charset=utf-8')
			// 		.expect(JSON.stringify({
			// 				status: 'Success - Updated preferences for session'
			// 		}), function() {
			// 			redisClient.get('testUserSessionId', function(err, reply) {
			// 				if (!err) {
			// 					if (reply != JSON.stringify(EXPECTED_TESTSESSION_PREFERENCES_RESPONSE)){
			// 						done(new Error('Did not create entry as expected'));
			// 					} else {
			// 						redisClient.del('testUserSessionId');
			// 						done();
			// 					}
			// 				} else {
			// 					done(err);
			// 				}
			// 			});
			// 		});
			// });

			// it('should return 200 and should update preferences for session that already has preferences', function(done) {	
			// 	redisClient.set('testUserSessionId', JSON.stringify(TEST_PREFERENCES_DATA), function(err) {
			// 		if (!err) {
			// 			request(server)
			// 				.put('/slipstream/preferences/session')
			// 				.set('Cookie', 'api.sid=testUserSessionId')
			// 				.set('Accept', 'application/json')
			// 				.set('Content-Type', 'application/json')
			// 				.send(TEST_PREFERENCES_DATA_FOR_UPDATE)
			// 				.expect(200)
			// 				.expect('Content-Type', 'application/json; charset=utf-8')
			// 				.expect(JSON.stringify({
			// 						status: 'Success - Updated preferences for user'
			// 				}), function() {
			// 					redisClient.get('testUserSessionId', function(err, reply) {
			// 						if (!err) {
			// 							if (reply != JSON.stringify(EXPECTED_TESTSESSION_PREFERENCES_RESPONSE_FOR_UPDATE)){
			// 								done(new Error('Did not update entry as expected'));
			// 							} else {
			// 								redisClient.del('testUserSessionId');
			// 								done();
			// 							}
			// 						} else {
			// 							done(err);
			// 						}
			// 					});
			// 				});
			// 		} else {
			// 			done(err);
			// 		}
			// 	});
			// });
		});

		describe('.delete', function() {
			it('should return expected error when used without a sessionId', function(done) {
				redisClient.set('testUserSessionId', JSON.stringify(TEST_PREFERENCES_DATA), function(err) {
					if (!err) {
						request(server)
							.del('/slipstream/preferences/session')
							.expect(401)
							.expect('Content-Type', 'application/json; charset=utf-8')
							.expect(JSON.stringify({
								status: 'Error - Need to be authenticated to perform this operation'
							}))
							.end(function(err, res) {
								redisClient.del('testUserSessionId');
								if (err) {
									done(err);
								} else {
									done();	
								}
							});
					} else {
						done(err);
					}
				});
			});

			// it('should delete the preferences and return 200 with expected response for authenticated user', function(done) {
			// 	redisClient.set('testUserSessionId', JSON.stringify(TEST_PREFERENCES_DATA), function(err) {
			// 		if (!err) {
			// 			request(server)
			// 				.del('/slipstream/preferences/session')
			// 				.set('Cookie', 'api.sid=testUserSessionId')
			// 				.expect(200)
			// 				.expect('Content-Type', 'application/json; charset=utf-8')
			// 				.expect(JSON.stringify({
			// 					status: 'Success - Deleted preferences for session'
			// 				}))
			// 				.end(function(err, res) {
			// 					if (err) {
			// 						done(err);
			// 					} else {
			// 						done();	
			// 					}
			// 				});
			// 		} else {
			// 			done(err);
			// 		}
			// 	});
			// });
		});
	});
});
