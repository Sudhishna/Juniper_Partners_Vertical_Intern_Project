/**
 * A collection of models representing dashlets in the dashboard.  
 * Each member of the collection is a Dashlet.
 *
 * @module DashboardDashletCollection
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone',
    './dashboardDashletModel'
], /** @lends DashboardDashletCollection */ function(Backbone, DashboardDashlet) {
    
    /**
     * Construct a collection of dashlets for dashboardDashletsView
     * @constructor
     * @class DashboardDashletCollection
     */
    var DashboardDashletCollection = Backbone.Collection.extend({
        model: DashboardDashlet
    });

    return DashboardDashletCollection;
});