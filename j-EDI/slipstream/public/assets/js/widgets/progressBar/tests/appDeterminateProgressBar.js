/**
 * A view that uses the Progress Bar Widget to show progess indicator progress bar
 *
 * @module Progress Bar View
 * @author Eva Wang<iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/progressBar/progressBarWidget'
], function(Backbone, ProgressBarWidget){
    var ProgressBarView = Backbone.View.extend({
        initialize: function () {
            this.render();
        },

        render: function () {
            var progress = 0.0,
                time = 15000,
                progressBar = new ProgressBarWidget({
                                "container": this.el,
                                "hasPercentRate": true,
                                "statusText": 'Current stage of operation...'
                            }).build();

            var setTime = setInterval(function(){ 
                if (progress >= 1.0){
                    progressBar.setStatusText('Complete');
                    progressBar.hideTimeRemaining();
                    clearInterval(setTime);
                }
                progressBar.setProgressBar(progress);
                progressBar.setTimeRemaining(time);
                progress += 0.02;
                time -= 300;
                
            }, 300); 

            return this;
        }

    });

    return ProgressBarView;
});