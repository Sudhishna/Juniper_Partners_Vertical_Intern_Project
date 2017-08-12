/**
 * A view that uses the datepickerWidget to produce a form from a html file
 * This shows the usage of programmatic style of instantiating datepicker
 *
 * @module Application Datepicker View
 * @author vidushi gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/datepicker/datepickerWidget'
], function (Backbone, DatepickerWidget) {
    var DatepickerView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            var $dateElement = $('#datepicker_test');
            var confObj = {
                container: $dateElement
            };
            var datepickerWidgetObj = new DatepickerWidget(confObj);
            datepickerWidgetObj.build();
            return this;
        }
    });

    return DatepickerView;
});