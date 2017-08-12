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
    'text!widgets/datepicker/tests/templates/DateRangepicker.html',
    'widgets/form/formValidator',
    'widgets/datepicker/datepickerWidget'
], function (Backbone, dateRangepicker, FormValidator, DatepickerWidget) {
    var DatepickerView = Backbone.View.extend({

        initialize: function () {
            this.formValidatorWidget = new FormValidator();
            this.render();
        },

        render: function () {
            var $elementsHTML = this.$el.append(dateRangepicker),
                $startDateElement = $elementsHTML.find("#startDateEl"),
                $endDateElement = $elementsHTML.find("#endDateEl"),
                $restrictedDateElement = $elementsHTML.find("#restrictedDateEl"),
                today = new Date(),
                that = this;

            this.startDatePicker = new DatepickerWidget({
                container: $startDateElement
            });
            this.startDatePicker.build();
            this.startDatePicker.setDate(today);

            this.endDatePicker = new DatepickerWidget({
                container: $endDateElement
            });
            this.endDatePicker.build();
            this.endDatePicker.setDate(today);

            this.setDateRangeLimits();

            this.$el.on('change', '.date-range-picker', function() {
                that.setDateRangeLimits();
            });
            

            this.restrictedDatePicker =  new DatepickerWidget({
                container: $restrictedDateElement
            });
            this.restrictedDatePicker.build();
            this.restrictedDatePicker.minDate(today);

            var maxDate = new Date(Number(today.valueOf() + 604800000));
            this.restrictedDatePicker.maxDate(maxDate);
            return this;
        },

        setDateRangeLimits : function() {
            this.endDatePicker.minDate(this.startDatePicker.getDate());
            this.startDatePicker.maxDate(this.endDatePicker.getDate());
        }

    });

    return DatepickerView;
});