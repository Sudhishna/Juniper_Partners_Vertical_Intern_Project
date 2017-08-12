/** 
 * A module that defines a view adapter for bridging the gap
 * between Slipstream and Marionette views.
 *
 * @module 
 * @name Slipstream/ViewAdaptor
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(function() {
    Slipstream.module("ViewManager", function(ViewManager, Slipstream, Backbone, Marionette, $, _) {
        /**
         * Provide a ViewAdapter to bridge any gaps between Marionette views
         * and the Slipstream view definition.
         * @method ViewAdapter
         */
        ViewManager.ViewAdapter = Marionette.View.extend({
            /**
             * @see {@link https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.view.md|Marionette View}
             */
            initialize: function(options) {
                this.view = options.view;
                this.el = this.view.el;
                this.$el = $(this.view.el);
                this.rendered = true;
            },
         
            render: function() {
                if (this.view.beforeRender) {
                   this.rendered = (this.view.beforeRender() !== false);
                }
         
                if (this.rendered) {
                    this.view.render();
                    if (this.view.context) this.$el.addClass(this.view.context.ctx_name)

                    if (this.view.afterRender) {
                        this.view.afterRender();
                    }
                }
                return this;
            },
         
            onShow: function() {
                if (this.rendered) {
                    // Compatibility with Marionette views
                    if (this.view.onShow) {
                        this.view.onShow();
                    }
                }
            },
         
            close: function() {
                if (this.rendered) {
                    if (this.view.close) {
                        if (this.view.beforeClose)  {
                            this.view.beforeClose();
                        }

                        this.view.close();

                        if (this.view.afterClose)  {
                            this.view.afterClose();
                        }
                    }
                    // Support 'remove' as an alias for 'close' for compatibility with Backbone views.
                    else if (this.view.remove) {
                        if (this.view.beforeRemove) {
                            this.view.beforeRemove();
                        }
                        this.view.remove();
                        
                        if (this.view.afterRemove) {
                            this.view.afterRemove();
                        }
                    }
                }
            }
        });
	});

    return Slipstream.ViewManager.ViewAdapter;
});