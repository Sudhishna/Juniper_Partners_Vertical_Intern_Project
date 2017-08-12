/** 
 * A module that implements a controller for rendering the utility toolbar.
 * @module 
 * @name Slipstream/UtilityToolbar/List/Controller
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["./list_view", "./util"], /** @lends Controller */ function(View, Util) {
    Slipstream.module("UtilityToolbar.List", function(List, Slipstream, Backbone, Marionette, $, _) {
        /**
         * @class Controller
         * @classdesc List controller class
         */
        List.Controller = {
            /**
             * Display the toolbar elements
             * @memberof Controller
             */
            listToolbarElements: function() { 
                var toolbarElements = Slipstream.request("utilityToolbar:entities");
                var toolbarIconView = new View.UtilityToolbarCollectionView({
                    collection: toolbarElements.iconElements
                });

                toolbarIconView.render();
                activateToolbar(toolbarElements.iconElements);

                if (toolbarElements.genericElements) {
                    // listen for the view to be set on generic elements
                    toolbarElements.genericElements.each(function(element) {
                        element.on("change:view", function(genericElement) {
                            var view = genericElement.get("view");

                            // render the provided view
                            view.render();

                            // insert the view's DOM nodes into the toolbar
                            var $el = $("<li>");
                            $el.attr("class", 'utility_toolbar_element');
                            $el.append(view.$el);

                            $('#view_elements').append($el);
                        })
                    })
                    activateToolbar(toolbarElements.genericElements);
                }
            }
        };

        /**
         * Activate the toolbar.  This methods starts the activity associated with
         * managing the toolbar state (if one is provided)
         */
        function activateToolbar(elements) {
            if (elements) {
                elements.each(function(element) {
                    var activity = element.get("activity");

                    if (activity) {
                        require([element.get("protoModule")], function(ProtoModule) {
                            var intent = Util.createToolbarIntent(activity, element, ProtoModule);
                            Slipstream.vent.trigger("activity:start", intent); 
                        });
                    }
                });
            }
        }
    });

    return Slipstream.UtilityToolbar.List.Controller;
});