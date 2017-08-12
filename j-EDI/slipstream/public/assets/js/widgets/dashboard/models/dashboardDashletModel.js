/**
 * A model representing a dashlet in the dashboard. The model
 * contains the following attributes:
 *
 * {Integer} index - 0-based index of the dashlet in the dashboard container.
 *
 * @module DashboardDashlet
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone'
], /** @lends DashboardDashlet */ function(Backbone) {

	/**
	 * Construct a DashboardDashlet to bind to dashletView
	 * @constructor
	 * @class DashboardDashlet
	 */
    var DashboardDashlet = Backbone.Model.extend({
        defaults: {
            "index" : 0,
            "title" :"",
            "details": "",
            "size": "",
            "colspan": "",
            "style": "",
            "footer": "",
            "context": null,
            "view": null,
            "customEditView": null,
            "dashletId": null,
            "thumbnailId": 0,
            "customInitData": null,
            "filters": null
        }
    });

    return DashboardDashlet;
});
