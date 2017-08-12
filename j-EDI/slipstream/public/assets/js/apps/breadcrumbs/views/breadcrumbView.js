/** 
 * A module that implements a view representing the navigation breadcrumbs
 *
 * @module 
 * @name Slipstream/BreadcrumbApp/List/View
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["text!./templates/breadcrumbItem.tpl"], /** @lends Breadcrumb */ function(breadcrumbItemTpl) {
        Slipstream.module("Navigation.Breadcrumb", function(Breadcrumb, Slipstream, Backbone, Marionette, $, _) {

            /**
             * Construct a Breadcrumb item view.
             * @constructor 
             * @class Breadcrumb 
             */
            Breadcrumb.ItemView = Marionette.ItemView.extend({
                template: breadcrumbItemTpl,
                tagName: "dd",
                className: "breadcrumb-entry",
                events: {
                    "click span": "navigate"
                },
                navigate: function(e) {
                    e.preventDefault();
                    var self = this;                    
                    var doNavigate = function() {
                        if (self.model.selected !== true) {
                            if (self.model.get('intent')) {
                                Slipstream.vent.trigger("activity:start", self.model.get('intent'));
                                return;
                            }
                            // Catch primary nav elements with children, they will not have an intent
                            Slipstream.vent.trigger("nav:primary:selected", self.model);
                        }
                    };
                    Slipstream.commands.execute('navigation:request',{success: doNavigate, fail:function(){}});
                }
            });

            /**
             * Construct a Breadcrumb collection view.
             * @constructor 
             * @class Breadcrumb 
             */
            Breadcrumb.CollectionView = Marionette.CollectionView.extend({
                itemView: Breadcrumb.ItemView,
                tagName: "dl",
                className: "breadcrumb"
            })
    });

    return Slipstream.Navigation.Breadcrumb.CollectionView;
});