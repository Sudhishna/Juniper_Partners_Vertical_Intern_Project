/**
 * A view that uses the Progress Bar Widget to show busy indicator progress bar
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
            var progressBar = new ProgressBarWidget({
                                "container": this.el,
                                "statusText": 'Custom status text' 
                            }).build();

            return this;
        }

    });

    return ProgressBarView;
});