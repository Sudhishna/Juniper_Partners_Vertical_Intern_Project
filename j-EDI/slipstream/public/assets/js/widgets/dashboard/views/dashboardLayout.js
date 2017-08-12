/** 
 * The main Dashboard layout.  The layout defines regions
 * into which thumbnail and dashlet views are rendered.
 *
 * @module DashboardLayout
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'marionette',
    'text!widgets/dashboard/templates/dashboard.html'
], /** @lends DashboardLayout */ function(Marionette,
	        dashboardTpl) {

    /**
     * Construct a dashboard layout from template
     * @constructor
     * @class DashboardLayout
     */
    var DashboardLayout = Marionette.Layout.extend({
        template: dashboardTpl,

        regions: {
            'titleContainer': '.dashboardTitleContainer',
            'thumbnailContainer': '.dashboardThumbnailContainer',
            'dashletContainer': '.dashboardDashletContainer'
        }
    });

    return DashboardLayout;
});