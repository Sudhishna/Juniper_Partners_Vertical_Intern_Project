/**
 * A model representing a thumbnail in the dashboard. The model
 * contains the following attributes:
 *
 * {Integer} index - 0-based index of the thumbnail in the thumbnail container.
 *
 * @module DashboardThumbnail
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone'
], /** @lends DashboardThumbnail */ function(Backbone) {

    /**
     * Construct a DashboardThumbnail to bind to thumbnailView
     * @constructor
     * @class DashboardThumbnail
     */
    var DashboardThumbnail = Backbone.Model.extend({
        defaults: {
            "thumbnailId" : 0,
            "title": "",
            "details": "",
            "view": null,
            "context": null,
            "activeInstances": 0
        }
    });

    return DashboardThumbnail;
});