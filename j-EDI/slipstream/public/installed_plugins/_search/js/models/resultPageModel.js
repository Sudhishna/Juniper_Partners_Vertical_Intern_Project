/** 
 * A module that implements a model representing a page
 * in a result set collection.
 *
 * @module Slipstream/ResultPageModel
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(['backbone'], function(Backbone) {
	var ResultPageModel = Backbone.Model.extend({
		initialize: function() {
            var selectable = new Backbone.Picky.Selectable(this);
            _.extend(this, selectable);
		},
		defaults: {
			pageNumber: 0
		}
	});

	return ResultPageModel;
});