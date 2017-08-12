define([
  'backbone'
], function(Backbone) {
	
	/**
	* Login model definition
	*/
	var LoginModel = Backbone.Model.extend({
		urlRoot: '/slipstream/api/login'
	});

	return LoginModel;
});