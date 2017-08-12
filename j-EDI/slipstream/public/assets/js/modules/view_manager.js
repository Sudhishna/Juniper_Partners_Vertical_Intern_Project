/** 
 * A module that manages views in the framework's main content pane
 *
 * @module 
 * @name Slipstream/ViewManager
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["text!views/default_content.tpl", 
        "./view_adapter",
        'widgets/overlay/overlaySingletonLayout'], /** @lends ViewManager */ function(defaultView, ViewAdapter, OverlayManager) {
	Slipstream.module("ViewManager", function(ViewManager, Slipstream, Backbone, Marionette, $, _) {
		var API = {
			/** 
             * Render a view into the framework's main UI region.
             *
             * @method
             * @param {Slipstream.View} view - the view to be rendered.
             */
			renderView: function(view) {
                var viewAdapter = new ViewAdapter({
                    view: view
                });
                
                Slipstream.mainRegion.show(viewAdapter);
			}
		};

       /**
        *  On startup render a default view into the framework's 
        *  main region.
        */
        Slipstream.on("dontstart", function() {
        	var DefaultView = Marionette.ItemView.extend({
                template: defaultView,

        		render: function() {
                    var html = Marionette.Renderer.render(this.getTemplate(), {msg: Slipstream.request("i18n:retrieve", "welcome")});
                    this.$el.html(html);
                }
        	});
            // render the default Slipstream view.
            API.renderView(new DefaultView());
        });

        /** 
         * View rendering event
         * 
         * @event view:render
         * @type {Object}
         * @property {Object} view - The view to be rendered
         */
		Slipstream.vent.on('view:render', function(view) {
			API.renderView(view);
            // Setup the tracking on content impressions for the content sections in the main content pane.
            Slipstream.commands.execute("analytics_provider:trackContentImpressionsWithinNode", Slipstream.mainRegion.$el[0])
		});

        Slipstream.vent.on("ui:nav:url", function() {
            // Close all open overlays on navigation
            OverlayManager.getInstance().modals.closeAll();    
        })
	});

	return Slipstream.ViewManager;
});