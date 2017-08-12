/**
 * A model representing the dashboard title.  The model has
 * the following attributes: 
 *
 * {String} dashboard_title - The name of the device to be shown as the
 *							  the dashboard title.
 * 
 * @module DashboardTitleModel
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone'
], function(Backbone) {

	var DashboardTitleModel = Backbone.Model.extend({
        defaults: {
            dashboard_title: "Untitled",
            thumbnailContainerState: "opened",	// set as opened/closed to re-render
            dashboardRefreshState: "refreshed"	// set as refreshing/refreshed to re-render
        }
    });

    return DashboardTitleModel;
});