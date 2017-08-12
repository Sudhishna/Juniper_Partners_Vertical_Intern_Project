/** 
 * A module that implements a view representing the utility toolbar
 *
 * @module 
 * @name Slipstream/UtilityToolbarApp/List/View
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["./elementView", 
        "./userElement/view"
        ], function(ElementView, UserElementView) {
     Slipstream.module("UtilityToolbarApp.List.View", function(View, Slipstream, Backbone, Marionette, $, _) {
        /**
         * Define a collection of views representing the elements of the toolbar.
         */
         View.UtilityToolbarCollectionView = Marionette.CollectionView.extend({
           el: "#toolbar_elements",
           getItemView: function(item) {
               switch (item.get("bindsTo")) {
                   case 'user': 
                       return UserElementView;
                   // add cases for other bindsTo elements here
               }
               if (item.get("icon")) {
                  return ElementView;
               }
           },
           itemViewOptions: function(model, index) {
               return {
                  onSelectActivity: model.onSelectActivity
               } 
           }
        });
    });
    return Slipstream.UtilityToolbarApp.List.View;
});