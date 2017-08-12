/** 
 * A module that implements the framework's breadcrumb elements.
 *
 * @module 
 * @name Slipstream/Navigation
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */ 
define(["./views/breadcrumbView",
        "./models/breadcrumbModel"], /** @lends Breadcrumbs */ function(BreadcrumbView, BreadcrumbModel) {

    Slipstream.module("Navigation.Breadcrumbs", function(Breadcrumbs, Slipstream, Backbone, Marionette, $, _) {

    	Slipstream.vent.on("nav:resolved", function(navElements, activity) {

            Slipstream.breadcrumbRegion.reset();
    		
            if (navElements && activity.path && activity.breadcrumb) {
                // Create breadcrumb models based on the navElement models
                var breadcrumbModels = navElements.map(function(model) {
                    return model.toJSON();
                });
                var breadcrumbCollection = new BreadcrumbModel.BreadcrumbEntryCollection(breadcrumbModels);

                // Mark the last breadcrumb as selected
                breadcrumbCollection.at(breadcrumbCollection.length - 1).selected = true;

	            var breadcrumbView = new BreadcrumbView({
                    collection: breadcrumbCollection
	            });

	            Slipstream.breadcrumbRegion.show(breadcrumbView);
            }
        });
    });

    return Slipstream.Navigation.Breadcrumbs;
 });