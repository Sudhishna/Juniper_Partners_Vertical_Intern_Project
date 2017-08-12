/** 
 * A js utility for the dashboard
 * @module DashboardUtil
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([], /** @lends DashboardUtil */ function() {
    /**
     * Construct a DashboardUtil
     * @constructor
     * @class DashboardUtil
     */
    var DashboardUtil = function() {

    	/**
         * Get the colspan
         * @instance
         * @returns {String} colspan of the dashboard widget
         */

        this.getColspan = function(size) {
            switch(size) {
                case 'small':
                    return "1";
                case 'single':
                    return "1";
                case 'vertical':
                    return "1";
                case 'double':
                    return "2";
                case 'large':
                    return "2";
                case 'wide':
                    return "3";
                default:
                    return "2";
            }
        };

        /**
         * Get the style
         * @instance
         * @returns {String} styling for the dashboard widget
         */

        this.getStyle = function(size) {
            switch(size) {
                case 'small':
                    return "dashletSizeSmall";
                case 'single':
                    return "dashletSizeSingle";
                case 'vertical':
                    return "dashletSizeVertical";
                case 'double':
                    return "dashletSizeDouble";
                case 'large':
                    return "dashletSizeLarge";
                case 'wide':
                    return "dashletSizeWide";
                default:
                    return "dashletSizeDefault";
            }
        };

        /**
         * Get the content height
         * @instance
         * @returns {String} max-height for the dashlet content
         */

        this.getContentHeight = function(size) {
            switch(size) {
                case 'small':
                    return "100px";
                case 'single':
                    return "223px";
                case 'vertical':
                    return "500px";
                case 'double':
                    return "223px";
                case 'large':
                    return "555px";
                case 'wide':
                    return "223px";
                default:
                    return "223px";
            }
        };
    };

    return DashboardUtil;
});