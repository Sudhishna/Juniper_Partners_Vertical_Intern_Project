/** 
 * A view representing the dashlet container. Each
 * itemView in the view is a DashletView.
 *
 * @module DashboardDashletsView
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'marionette',
    './dashletView',
], /** @lends DashboardDashletsView */
    function(
    Marionette,
    DashletView) {

    /**
     * Construct a DashboardDashletsView
     * @constructor
     * @class DashboardDashletsView
     */
    var DashboardDashletsView = Marionette.CollectionView.extend({
        /**
         * Initialize the view with passed in options.
         * @inner
         */
        initialize: function(options) {
            _.extend(this, options);
            var self = this;
        },
        /**
         * Re-render the dashlets view.
         * @inner
         */
        refresh: function(evt) {
            this.render();
        },

        /**
         * Marionette callback method to build an item view for a dashlet.
         * @inner
         * @returns {Object} ItemView built with the model, along with vent and container attached
         */
        buildItemView: function(item, ItemView) {
            var view = new ItemView({
                model: item,
                vent: this.options.vent,
                reqres: this.options.reqres,
                context: item.get('context')
            });
            return view;
        },

        // Overriding the default appendHtml method to render the new view at
        // a specific location in the list
        appendHtml: function(collectionView, itemView, index){
            if (collectionView.isBuffering) {
                // buffering happens on reset events and initial renders
                // in order to reduce the number of inserts into the
                // document, which are expensive.
                collectionView.elBuffer.appendChild(itemView.el);
                collectionView._bufferedChildren.push(itemView);
            } else {
                // If we've already rendered the main collection, just
                // append the new items directly into the element.
                // collectionView.$el.append(itemView.el);

                this.removeThumbnails();

                var container = collectionView.$el;
                var children = container.children();

                if (children.size() <= index) {
                    container.append(itemView.el);
                } else {
                    children.eq(index).before(itemView.el);
                }
            }
        },

        // This is default Marionette 1.6.1 implementation but have added 
        // it here in case we need to override behavior
        // This method is used for first-time render
        appendBuffer: function(collectionView, buffer) {
            collectionView.$el.append(buffer);
        },

        /**
         * Remove thumbnails from the dashletContainer in the DOM that were
         * added by shapeshift
         * @inner
         */
        removeThumbnails: function() {
            var dashletContainer = this.$el;
            var thumbnails = $('.dashboardThumbnail', dashletContainer);

            if(thumbnails) {
                thumbnails.remove();
            }
        },

        itemView: DashletView,
        el: '.dashboardDashletContainer'
    });

    return DashboardDashletsView;
});
