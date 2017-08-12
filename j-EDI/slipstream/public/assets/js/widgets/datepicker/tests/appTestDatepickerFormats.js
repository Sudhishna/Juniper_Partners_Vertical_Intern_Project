/**
 * A view that uses the datepickerWidget to produce a form from a html file
 * This shows the validation od different dateformats with declarative style of instantiating datepicker.
 * slipstream validation framework is used for date validation on input field
 *
 * @module Application Datepicker View
 * @author vidushi gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'text!widgets/datepicker/tests/templates/datepickerFormatsValidation.html',
    'widgets/form/formValidator',
    'widgets/datepicker/datepickerWidget'
], function (Backbone, DatepickerFormatsValidation, FormValidator, DatepickerWidget) {
    var DatepickerView = Backbone.View.extend({

        initialize: function () {
            this.formValidatorWidget = new FormValidator();
            this.render();
        },

        render: function () {
            var $elementsHTML = this.$el.append(DatepickerFormatsValidation);
            var $dateElements = $elementsHTML.find("input[data-widget='datepicker']");
            var dateFormatArr = ['mm/dd/yyyy', 'dd/mm/yyyy', 'yyyy/mm/dd', 'mm-dd-yyyy', 'dd-mm-yyyy', 'yyyy-mm-dd', 'mm.dd.yyyy', 'dd.mm.yyyy', 'yyyy.mm.dd'];
            var datepickerWidgetObj;
            $dateElements.each(function (idx, dateElement) {
                var dateFormatValue = $(dateElement).attr("data-dateformat");
                var confObj = {
                    dateFormat: dateFormatArr[idx],
                    container: dateElement
                };
                datepickerWidgetObj = new DatepickerWidget(confObj);
                datepickerWidgetObj.build();
            });
            datepickerWidgetObj.disable(true); // As an example in test page, last date picker field is shown disabled.
            this.formValidatorWidget.validateForm($elementsHTML);
            return this;
        }

    });

    return DatepickerView;
});