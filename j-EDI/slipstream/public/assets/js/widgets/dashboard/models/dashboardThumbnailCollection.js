/**
 * A collection of models representing thumbnails in the dashboard.  
 * Each member of the collection is a Thumbnail.
 *
 * @module DashboardThumbnailCollection
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone',
    './dashboardThumbnailModel'
], /** @lends DashboardThumbnailCollection */ function(Backbone, DashboardThumbnail) {
    /**
     * Construct a collection of dashboard thumbnails for dashboardThumbnailsView
     * @constructor
     * @class DashboardThumbnailCollection
     */
    var DashboardThumbnailCollection = Backbone.Collection.extend({
        model: DashboardThumbnail
    });

    return DashboardThumbnailCollection;
});