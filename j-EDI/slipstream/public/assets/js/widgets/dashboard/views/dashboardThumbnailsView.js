/** 
 * A view representing the thumbnail container. Each
 * itemView in the view is a ThumbnailView.
 *
 * @module DashboardThumbnailsView
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'marionette',
    './thumbnailView',
], /** @lends DashboardThumbnailsView */
    function(
    Marionette,
	ThumbnailView) {

    /**
     * Construct a dashboard thumbnails view for use in dashboard
     * @constructor
     * @class DashboardThumbnailsView
     */
    var DashboardThumbnailsView = Marionette.CollectionView.extend({
        /**
         * Initialize object with options passed in
         * @inner
         */
        initialize: function(options) {
            _.extend(this, options);
        },

        /**
         * Re-render the thumbnails view
         * @inner
         */
        refresh: function(evt) {
            this.render();
        },

        /**
         * Marionette callback to build an item view for a thumbnail
         * @inner
         * @returns {Object} ItemView built with the model, along with vent and container attached
         */
        buildItemView: function(item, ItemView) {
            var view = new ItemView({
                model: item,
                vent: this.options.vent
            });
            return view;
        },

        onAfterItemAdded: function(itemView){
            // work with the itemView instance, here
        },
        
        itemView: ThumbnailView,
        el: '.dashboardThumbnailContainer'
    });

    return DashboardThumbnailsView;
});