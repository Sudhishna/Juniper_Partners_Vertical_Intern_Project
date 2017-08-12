/**
 * A view that uses the Spinner Widget to show busy indicator spinner
 * Used in all scenarios where a user fetches data. Prevents user from navigating till data is fetched and displayed
 *
 * @module Spinner View
 * @author Eva Wang<iwang@juniper.net>
 * @author Kelcy Newton <knewton@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
var overlayWidgetObj;
define([
    'backbone',
    'widgets/overlay/overlayWidget',
    'widgets/spinner/tests/views/activityIndicatorView'

], function(Backbone, OverlayWidget, ActivityIndicatorView){
    var SpinnerView = Backbone.View.extend({

        //button click events
        events: {
            'click #overlay_btn': 'openOverlay'
        },

        /**
         * function that opens the overlay and renders an ActivityIndicatorView containing a spinnerView
         * @param none
         */
        openOverlay: function(){
                var command = this.options.rowData;
                self = this,
                indicatorView = new ActivityIndicatorView({});

            overlayWidgetObj = new OverlayWidget({
                view: indicatorView,
                type: 'small'
            });
            indicatorView.options.myOverlay = overlayWidgetObj;
            overlayWidgetObj.build();


        }

    });

    return SpinnerView;
});
