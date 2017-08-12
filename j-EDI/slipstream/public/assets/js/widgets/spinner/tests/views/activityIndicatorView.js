/**
 * A view that uses the overlay widget + a form to serve as the basis for a spinner view
 *
 * @module Spinner View
 * @author Eva Wang<iwang@juniper.net>
 * @author Kelcy Newton <knewton@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/spinner/spinnerWidget',
    'widgets/form/formWidget',
    'widgets/tabContainer/tests/conf/formConfiguration',
    'lib/template_renderer/template_renderer',
    'text!widgets/spinner/templates/loadingBackground.html'
], function (Backbone, SpinnerWidget, FormWidget, FormConfiguration, render_template, LoadingBackgroundTemplate) {
    var ActivityIndicatorView = Backbone.View.extend({

        events: {
            'click #fetch_data': 'loadSpinner',
            'click #close_overlay': 'closeOverlay'
        },
        /**
         * Initialize the view
         * @param none
         */
        initialize: function () {
            var indicatorOverlay;
        },

        /**
         * create and build the form used to open the spinner
         * @param none
         */
        render: function () {
            this.form = new FormWidget({
                    "elements": FormConfiguration.utmPolicy,
                    "container": this.el
                });
                this.form.build();
            return this;
        },

        /**
         * create the spinner to show a progress view to the user. Locks the screen till data loads.
         * @param none
         */
        loadSpinner: function(){
            // Check is form valid
            // if (! this.form.isValidInput()) {
            //     console.log('form is invalid');
            // }else{
                var self = this,
                    spinner = new SpinnerWidget({
                        "container": this.options.myOverlay.getOverlayContainer(),
                        "statusText": 'Loading. Please wait...'
                    }).build();

                //Add spinner and spinner background to the overlay element
                //We can use slipstream-indicator-background class to set up the default spinner background
                this.$el.append(spinner).append(render_template(LoadingBackgroundTemplate));

                // indicatorOverlay = setTimeout(function () {
                //     self.$el.trigger("spinner_timeout");
                // }, 2000);
            // }
        },

        /**
         * on call, destroy the spinner and the overlay the spinner sits in
         * @param none
         */
        closeOverlay: function(){
            // this.$el.trigger("spinner_timeout");
            // clearTimeout(indicatorOverlay);
            overlayWidgetObj.destroy();
        }
    });

    return ActivityIndicatorView;
});
