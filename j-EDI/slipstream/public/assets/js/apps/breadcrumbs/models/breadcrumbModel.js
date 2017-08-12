/** 
 * A module that implements a model representing elements
 * of the framework's breadcrumb navigation.
 *
 * @module 
 * @name Slipstream/Navigation/Breadcrumbs
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([], /** @lends Breadcrumbs */ function() {
    Slipstream.module("Navigation.Breadcrumbs", function(Breadcrumbs, Slipstream, Backbone, Marionette, $, _) {
        /**
         * Construct a model representing a breadcrumb element.
         *
         * @constructor
         * @class BreadcrumbEntry
         * @classdesc A breadcrumb model
         */
        Breadcrumbs.BreadcrumbEntry = Backbone.Model.extend({
            defaults: {
                selected: false
            }
        });

        /**
         * Construct a model representing a breadcrumb collection.
         *
         * @constructor
         * @class BreadcrumbCollection
         * @classdesc A breadcrumb collection
         */
        Breadcrumbs.BreadcrumbEntryCollection = Backbone.Collection.extend({
            model: Breadcrumbs.BreadcrumbEntry
        });
     });

    return Slipstream.Navigation.Breadcrumbs;
});
