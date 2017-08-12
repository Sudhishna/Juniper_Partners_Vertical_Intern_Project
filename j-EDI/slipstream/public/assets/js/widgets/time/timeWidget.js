/**
 * Time widget is used to display time based on period.
 * Two integral elements:
 * 1. input field: to display time
 * 2. drop down: to select period
 *
 * @module TimeWidget
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n',
    'text!widgets/time/templates/time.html',
    'widgets/time/conf/config',
    'widgets/time/lib/timePeriodInteraction',
    'lib/validator/extendedValidator',
    'widgets/form/formTemplates'
], /** @lends TimeWidget */
    function (render_template, i18n, elementsTemplate, WidgetConfig, TimePeriodInteraction, Validator, FormTemplates, validator) {

    /**
     * TimeWidget constructor
     *
     * @constructor
     * @class TimeWidget - Builds a Time widget from a configuration object.
     *
     * @param {Object} conf - It requires two parameters:
     * container: defines the container where the widget will be rendered | required
     * value: time value as input | optional
     *
     * @returns {Object} Current TimeWidget object: this
     */
    var TimeWidget = function (conf) {

        this.conf = {
            "$container": $(conf.container),
            "value": conf.value
        };

        /**
         * Renders the time widget with a time value specified by the conf object
         * or to the current time value of the client machine.
         * @instance
         * @returns {Object} this object
         */
        this.build = function () {
            var templates = new FormTemplates();
            var elementInteraction = new TimePeriodInteraction();
            var elementsTemplateHtml = render_template(elementsTemplate, WidgetConfig.getElements(), templates.getPartialTemplates());
            this.conf.$container.addClass('row time-widget').append(elementsTemplateHtml);

            var currentTime = getDisplayTime(this.conf.value);

            var time_period = this.conf.$container.find('.time_period');

            this.conf.$container.find('.time_text').val(currentTime.time);
            this.conf.$container.find('.time_period :selected').removeAttr('selected');
            this.conf.$container.find(".time_period option[value='" + currentTime.period + "']").prop('selected', true);
            time_period.data('previous', currentTime.period);

            elementInteraction.addPostValidationHandlers(this.conf.$container);
            
            // trigger a change event on the time period since setting the selection doesn't trigger it.
            time_period.trigger("change");

            return this;
        };

        /**
         * Helper method to get time for displaying in time input field.
         * If provided, then displays user defined time value else shows current time from system in required format
         * @returns {Object} with custom_time & period value
         */
        var getDisplayTime = function (value) {
            // HH:MM[:SS] [AM|PM], like: 10:10 AM, 10:10:10 PM, 10:10:10 or 23:10 or 23:59:59
            var time = (typeof value == 'string') ? value.trim() : '';
            var ampm = '';
            var custom_time = '';
            if (time.length == 0 || !Validator.isTime(time)) {
                // time not specified in conf, so get it from the client machine in HH:MM:SS AM|PM format
                var datetime = new Date();
                var hours = datetime.getHours();
                if (hours >= 0 && hours <= 11) {
                    ampm = "AM";
                } else if (hours >= 12 && hours <= 23) {
                    ampm = "PM";
                }

                time = getNumberString((hours < 13) ? hours : hours - 12) + ":"
                    + getNumberString(datetime.getMinutes()) + ":"
                    + getNumberString(datetime.getSeconds()) + " "
                    + ampm;
            }

            if ((time.indexOf('AM') > 0) || (time.indexOf('PM') > 0)) {
                ampm = time.substr(time.length - 2, 2);
                custom_time = time.replace(ampm, '').trim();
            } else {
                custom_time = time.trim();
                ampm = "24 hour";
            }

            return {
                time: custom_time,
                period: ampm
            };
        };

        /**
         * Helper method to format the time values (hours, minutes OR seconds)
         * @returns {String} formatted value
         */
        var getNumberString = function (number) {
            if (number < 10) {
                return '0' + number;
            } else {
                return '' + number
            }
        };

        /**
         * Gets the time value of the widget.
         * @instance
         * @returns The time string in HH:MM:SS AM/PM format ot HH:MM:SS (24 hours) format.
         */
        this.getTime = function () {
            var current = this.conf.$container.find('.time_period :selected').val();
            if (current === '24 hour') {
                return this.conf.$container.find('.time_text').val().trim();
            } else {
                return this.conf.$container.find('.time_text').val().trim() + ' ' + current;
            }
        };

        /**
         * Sets the time value of the widget.
         * @instance
         * @params The time string in HH:MM:SS format.
         * @params The time period - can be 'AM', 'PM', or '24 hour'
         */
        this.setTime = function (time) {
            if(time){
                this.conf.$container.find('.time_text').val(time.trim());
            }
        };

        /**
         * Sets the time period value of the widget.
         * @instance
         * @params The time period - can be 'AM', 'PM', or '24 hour'
         */
        this.setTimePeriod = function(timePeriod) {
            if (timePeriod){
                this.conf.$container.find('.time_period :selected').removeAttr('selected');
                this.conf.$container.find(".time_period option[value='" + timePeriod + "']").prop('selected', true);
                this.conf.$container.find('.time_period').trigger("change");
            }
        };

        /**
         * Destroys all elements created by the Time widget
         * @instance
         * @returns {Object} this object
         */
        this.destroy = function () {
            this.conf.$container.empty();
            return this;
        }
    };

    return TimeWidget;
});