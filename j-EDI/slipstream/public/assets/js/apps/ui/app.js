/** 
 * A module that implements creation of the framework's UI
 *
 * @module 
 * @name Slipstream/UI
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["./show/show_controller"], /** @lends UI */ function(ShowController) {
    var busy_timer = null, busy_displayed = false;
    var busy_ref_count = 0;

    Slipstream.module("UI", function(UI, Slipstream, Backbone, Marionette, $, _) {    
        /**
         * Render the UI
         *
         * @param {Boolean} contentOnly - true if only the content pane is to be
         * rendered, false if the entire UI is to be rendered.
         */
        UI.render = function(contentOnly) {
        	var controller = ShowController;

        	controller.show(contentOnly);
        }
    });

    Slipstream.vent.on("module:load:start", function() {
        var controller = ShowController;
        busy_ref_count++;

        if (!busy_timer) {
             busy_timer = setTimeout(function() {
                controller.showBusy(); 
                busy_displayed = true;
            }, 2000); 
        }   
    })

    function hideBusyIndicator() {
        var controller = ShowController;
        busy_ref_count--;

        /**
         * Only clear the busy indicator if there are no other
         * outstanding busy module:load:start events.
         */
        if (busy_ref_count == 0) {  
            clearTimeout(busy_timer);
            busy_timer = null;

            if (busy_displayed) {
                controller.hideBusy(); 
                busy_displayed = false;
            }
        }
    }

    Slipstream.vent.on("activity:afterStart", hideBusyIndicator);
    Slipstream.vent.on("module:load:fail", hideBusyIndicator);
    Slipstream.vent.on("ui:fatalError", ShowController.fatalError);
    Slipstream.vent.on("ui:404", ShowController.error404);
    Slipstream.vent.on("ui:privilegesError", ShowController.privilegesError);

    return Slipstream.UI;
});