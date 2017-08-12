/** 
 * A module that implements creation of the framework's utility toolbar
 * elements.
 *
 * @module 
 * @name Slipstream/UtilityToolbar
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["./list/list_controller"], /** @lends Navigation.Secondary */ function(ListController) {
    Slipstream.module("UtilityToolbar", function(UtilityToolbar, Slipstream, Backbone, Marionette, $, _, Mustache) {
        /**
         * @class API
         * @classdesc internal API class
         */
        var API = {
            /**
             * Render the header elements
             * @memberof API
             */
            listToolbarElements: function() {
                ListController.listToolbarElements();
            }
        };

        this.startWithParent = false;

        UtilityToolbar.on("start", function() {
            API.listToolbarElements();
        });
    });

    return Slipstream.UtilityToolbar;
});