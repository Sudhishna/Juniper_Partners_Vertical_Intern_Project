/**
 * Datepicker widget uses Jquery UI datepicker for attaching calender popup to input field.
 * Date format will be picked based on the locale
 *
 * @module Datepicker
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'jqueryDatepicker',
    'widgets/datepicker/conf/datepicker.i18n',
    'lib/i18n/i18n'
], /** @lends Datepicker */ function (jQueryDatepicker, i18nConf, i18n) {

    /**
     * DatepickerWidget constructor
     *
     * @constructor
     * @class DatepickerWidget
     * @param {Object} confObj - Datepicker's configuration object
     * @return {Object} instance of datepicker object
     *
     * conf object
     * @param {String} container - id for the input field where datepicker will be attached
     * @example
     * var conf={
             container: '#inputField'
             };
     */

    var DatepickerWidget = function (confObj) {

        var $dateElement = $(confObj.container);

        /*
        * Getter returns selected date as a javascript Date object
        * @return {Date} Javascript Date Object
        *
        */
        this.getDate = function(){
            return ($dateElement).datepicker("getDate");
        };

        /*
        * Set sets date with a javascript Date object
        *
        * @param {Date} Javascript Date Object with desired date.
        *
        */
        this.setDate = function(newDate){
            ($dateElement).datepicker("setDate", newDate);
        };


        /*
        * Set minimum (earliest) date with a javascript Date object
        *
        * @param {Date} Javascript Date Object with desired minimum date.
        *
        */
        this.minDate = function(newMinDate) {
            ($dateElement).datepicker("option", "minDate", newMinDate);
        };


         /*
        * Set maximum (latest) date with a javascript Date object
        *
        * @param {Date} Javascript Date Object with desired maximum date.
        *
        */
        this.maxDate = function(newMaxDate) {
            ($dateElement).datepicker("option", "maxDate", newMaxDate);
        };

        /*
         * Enables / Disables the input field & date picker icon
         *
         * @param {Boolean} value as true / false
         *
         */
        this.disable = function (value) {
            ($dateElement).datepicker("option", "disabled", value);
        };

        /**
         * Attach datepicker icon with calendar overlay to the input field.
         *
         * @return {Object} this DatepickerWidget object
         */
        this.build = function () {

            var jqueryDateFormat;

            var locale = window.navigator.language || window.navigator.userLanguage;
            // remove '-' from locales
            locale = locale.toLowerCase().replace(/-/g,'_');

            if(!locale  || !i18nConf["regional_" + locale]){ //last OR fixes IE10 issue where i18nConf["regional_" + locale] is undefined
                locale = 'en';
            }

            if (confObj.dateFormat) {
                // if custom dateformat provided, insert it in the container as attribute for validations
                $dateElement.attr("data-dateformat", confObj.dateFormat);
                // if custom dateformat provided, override the locale dateformat
                jqueryDateFormat = confObj.dateFormat.toLowerCase().trim().replace("yyyy", "yy");
                i18nConf["regional_" + locale].dateFormat = jqueryDateFormat;
                if (!$dateElement.attr("placeholder")) {
                    $dateElement.attr("placeholder", confObj.dateFormat.toUpperCase());
                }
            } else {
                // insert dateFormat in the container as attribute for validations
                var customDateFormat = i18nConf["regional_" + locale].dateFormat.replace("yy", "yyyy");
                $dateElement.attr("data-dateformat", customDateFormat);
                if (!$dateElement.attr("placeholder")) {
                    $dateElement.attr("placeholder", customDateFormat.toUpperCase());
                }
            }

            // bind jquery UI datepicker
            $.datepicker.setDefaults({
                inline: true,
                showOn: "button",
                buttonImage: "/assets/images/date_picker_icon.png",
                buttonImageOnly: true,
                buttonText: i18n.getMessage('selectDate'),
                changeMonth: true,
                changeYear: true,
                showOtherMonths: true,
                showButtonPanel: true,
                yearRange: '-20:+20',
                currentText: i18n.getMessage('Today'),
                dayNames: [i18n.getMessage('Sunday'), i18n.getMessage('Monday'), i18n.getMessage('Tuesday'), i18n.getMessage('Wednesday'), i18n.getMessage('Thursday'), i18n.getMessage('Friday'), i18n.getMessage('Saturday')],
                dayNamesShort: [ i18n.getMessage('Su'), i18n.getMessage('Mo'), i18n.getMessage('Tu'), i18n.getMessage('We'), i18n.getMessage('Th'), i18n.getMessage('Fr'), i18n.getMessage('Sa') ],
                dayNamesMin: [i18n.getMessage('Sun'), i18n.getMessage('Mon'), i18n.getMessage('Tue'), i18n.getMessage('Wed'), i18n.getMessage('Thu'), i18n.getMessage('Fri'), i18n.getMessage('Sat')],
                monthNames: [i18n.getMessage('January'), i18n.getMessage('February'), i18n.getMessage('March'), i18n.getMessage('April'), i18n.getMessage('May'), i18n.getMessage('June'), i18n.getMessage('July'), i18n.getMessage('August'), i18n.getMessage('September'), i18n.getMessage('October'), i18n.getMessage('November'), i18n.getMessage('December')],
                monthNamesShort: [i18n.getMessage('Jan'), i18n.getMessage('Feb'), i18n.getMessage('Mar'), i18n.getMessage('Apr'), i18n.getMessage('May'), i18n.getMessage('Jun'), i18n.getMessage('Jul'), i18n.getMessage('Aug'), i18n.getMessage('Sep'), i18n.getMessage('Oct'), i18n.getMessage('Nov'), i18n.getMessage('Dec')]
            });

            $dateElement.datepicker(i18nConf["regional_" + locale]);
            $("#ui-datepicker-div").wrap("<div id='datepicker_wrapper'></div>");

            var custom_goToToday = $.datepicker._gotoToday;
            $.datepicker._gotoToday = function (id) {
                custom_goToToday.call(this, id);
                this._selectDate(id);
            };
            return this;
        };

        /**
         * Remove datepicker functionality completely from the input field. This will return the element back to its pre-init state.
         *
         * @return {Object} this DatepickerWidget object
         */
        this.destroy = function () {
            ($dateElement).datepicker("destroy");
            $('#ui-datepicker-div').remove();
            return this;
        };
    };

    return DatepickerWidget;
});