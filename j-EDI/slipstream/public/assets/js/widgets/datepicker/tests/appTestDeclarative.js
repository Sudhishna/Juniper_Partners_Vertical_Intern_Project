/**
 * A view that uses the datepickerWidget to produce a form from a html file
 * This shows the usage of declarative style of instantiating datepicker.
 * slipstream validation framework is used for date validation on input field
 *
 * @module Application Datepicker View
 * @author vidushi gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'text!widgets/datepicker/tests/templates/declarativeDatepicker.html',
    'widgets/form/formValidator',
    'widgets/datepicker/datepickerWidget'
], function (Backbone, declarativeDatepicker, FormValidator, DatepickerWidget) {
    var DatepickerView = Backbone.View.extend({

        initialize: function () {
            this.formValidatorWidget = new FormValidator();
            this.render();
        },

        render: function () {
            var $elementsHTML = this.$el.append(declarativeDatepicker);
            var $dateElements = $elementsHTML.find("input[data-widget='datepicker']");
            $dateElements.each(function (idx, dateElement) {
                var confObj = {
                    container: dateElement
                };
                var datepickerWidgetObj = new DatepickerWidget(confObj);
                datepickerWidgetObj.build();
            });
            this.formValidatorWidget.validateForm($elementsHTML);
            return this;
        }

    });

    return DatepickerView;
});