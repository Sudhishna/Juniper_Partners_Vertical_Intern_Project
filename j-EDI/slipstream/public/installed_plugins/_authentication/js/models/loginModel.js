/**
 * A Backbone model representing the user login and logout.
 *
 * @module LoginModel
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
  'backbone'
], function(Backbone) {
	
	/**
	* Login model definition
	*/
    var LoginModel = {

        login: Backbone.Model.extend({
            urlRoot: '/api/login',

            defaults: {
                'user': 'root',
                'password': 'Juniper1!'
            }

        }),
        username: Backbone.Model.extend({
            urlRoot: '/api/whoami'
        }),
        logout: Backbone.Model.extend({
            urlRoot: '/api/logout'
        })

    };

	return LoginModel;
});