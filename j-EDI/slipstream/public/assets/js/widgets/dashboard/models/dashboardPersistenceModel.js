/**
 * A model representing the state of the dashboard.
 *
 * @module DashboardPersistenceModel
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone'
], /** @lends DashboardPersistenceModel */ function(Backbone) {

	/**
	 * Construct a DashboardPersistenceModel to save the state of the dashboard
	 * @constructor
	 * @class DashboardPersistenceModel
	 */
    var DashboardPersistenceModel = Backbone.Model.extend({
        defaults: {
            'dashboard': {
                'id' : 0,
                'dashletModels': [],
                'globalPrefs': {
                    'doNotShowConfirmClose'     : false,
                    'thumbnailContainerState'   : 'opened'
                }
            }
        },
        url: '/slipstream/preferences/user'
    });

    return DashboardPersistenceModel;
});