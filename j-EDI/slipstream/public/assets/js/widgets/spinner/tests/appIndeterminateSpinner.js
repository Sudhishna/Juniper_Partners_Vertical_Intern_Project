/**
 * A view that uses the Spinner Widget to show busy indicator spinner
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

            var spinner = new SpinnerWidget({
                                "container": this.el,
                                "statusText": 'Current stage of operation...'
                            }).build();

            return this;
        }

    });

    return SpinnerView;
});
