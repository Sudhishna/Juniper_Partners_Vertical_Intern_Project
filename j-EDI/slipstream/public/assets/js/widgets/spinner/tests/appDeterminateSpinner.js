/**
 * A view that uses the Spinner Widget to show progress indicator spinner
 *
 * @module Spinner View
 * @author Eva Wang<iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/spinner/spinnerWidget'
], function(Backbone, SpinnerWidget){
    var SpinnerView = Backbone.View.extend({
        initialize: function () {
            this.render();
        },

        render: function () {
            console.log("Spinner View")
            var progress = 0.0,
                time = 15000,
                spinner = new SpinnerWidget({
                                "container": this.el,
                                "hasPercentRate": true,
                                "statusText": 'Current stage of operation...'
                            }).build();

            var setTime = setInterval(function(){
                if (progress >= 1.0){
                    spinner.setStatusText('Complete');
                    spinner.hideTimeRemaining();
                    clearInterval(setTime);
                }
                spinner.setSpinnerProgress(progress);
                spinner.setTimeRemaining(time);
                progress += 0.02;
                time -= 300;

            }, 300);

            return this;
        }

    });

    return SpinnerView;
});
