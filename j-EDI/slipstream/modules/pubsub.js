/** 
 * A module that implements a simple pub/sub mechanism based on socket.io.
 * 
 * @module pubsub
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
var io;
var pending_subscriptions = [];
var log_level = 0; // log errors only

/**
 * Initialize the pub/sub system.
 *
 * @param {Object} http_server - The http server object to which this
 *                               pubsub object should be associated.
 *
 * Note: Any calls to 'publish' prior to the call to this function
 * will be ignored.
 */
exports.init = function(http_server) {
	io = require('socket.io').listen(http_server);
	io.set('log level', log_level);

    /**
     * Run the list of pending subscriptions and execute the 
     * subscription requests.
     */ 
	pending_subscriptions.forEach(function(p) {
		p.fn.apply(this, p.args);
	});
	pending_subscriptions.length = 0;
}

/**
 * Create a subscription to a channel
 *
 * @param {Object}            channel - The channel to which to subscribe.
 * @param {subscribeCallback} cb - Callback function to be invoked when
 *                                 messages arrive on the channel.  
 *
 * Subscriptions can be defined prior to the pubsub system being initialized, however
 * the subscriptions will not be put into effect until 'init' is called.                              
 */
exports.subscribe = function(channel, cb) {
	io ? io.sockets.on(channel, cb) : pending.push({fn: exports.subscribe, args: [channel, cb]});
}

/**
 * Publish a message to a channel
 *
 * @param {Object} channel - The channel to publish on.
 * @param {Object} data - The data to be published.                             
 */
exports.publish = function(channel, data) {
	// ignore publish requrests that arrive before the init() has been called.
    io ? io.sockets.emit(channel, data) : null; 
}
