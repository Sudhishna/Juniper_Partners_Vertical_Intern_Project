/**
 * A library that handles the interaction between time field & period drop down.
 *
 * @module TimePeriodInteraction
 * @author Vidushi Gupta <vidgupta@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['widgets/form/formValidator','lib/i18n/i18n'], /** @lends TimePeriodInteraction */
    function (FormValidator, i18n) {
        var timeSeparator = ":";

        var TimePeriodInteraction = function () {
            this.validator = new FormValidator();

            /**
             * Defines the events handlers that will be called after an element validation is completed
             * @param {Object} container - Jquery object that contains all the elements of Time widget (time field & period drop down)
             */
            this.addPostValidationHandlers = function(container) {
                this.time_ele = container.find('.time_text');
                this.period_ele = container.find('.time_period');
                var self = this;

                this.period_ele.bind('change', function(e, isValid) {
                    var validationPattern;

                    // remove validation error if one exists
                   self.clearTimeError();

                    if (self.period_ele.val() == '24 hour') {
                         validationPattern = 'time24hrs';
                    }  
                    else {
                         validationPattern = 'time12hrsWithoutPeriod';  
                    }  

                    self.time_ele.attr('data-validation', validationPattern);
                    self.updateTimeForPeriod(this, isValid, e);

                    if (!self.validator.isValidValue(validationPattern, self.time_ele[0])) {
                        self.displayTimeError(i18n.getMessage('time_widget_error_message'));
                    }
                });
            };

            this.clearTimeError = function() {
                 this.time_ele.removeAttr('data-invalid');
                 this.time_ele.closest(".row_time_input").find(".elementlabel, .elementinput").removeClass("error");
            }

            this.displayTimeError = function(errorString) {
                this.time_ele.closest(".row_time_input").find(".elementlabel, .elementinput").addClass("error");
                this.time_ele.siblings(".error").text(errorString);
                this.time_ele.attr('data-invalid', '');
            }

            /**
             * Updates time input field based on option selected from period drop down
             *
             * @param {Object} ele - DOM element (period drop down) bind to the custom event handler
             * @param {string} isValid - true if the value of the field is valid, and false otherwise
             * @param {Object} e - Event
             * @inner
             */
            this.updateTimeForPeriod = function (ele, isValid, e) {
                var time = this.time_ele.val();
                var select = this.period_ele;

                if (select.data('previous') === e.target.value) {
                    return;
                }

                var parsedTime = time.split(':', 3);
                var hoursStr = parsedTime[0], minsStr = parsedTime[1], secsStr = parsedTime.length == 3 ? parsedTime[2] : '';
                var hours = Number(hoursStr);
                var newHours = hours;

                if ($.isNumeric(newHours)) {
                    if (select.data('previous') === 'AM' && e.target.value === 'PM') {
                        if (newHours == 0) {
                            newHours = +1;
                        }
                    } else if (select.data('previous') === 'AM' && e.target.value === '24 hour') {
                        if (hours == 12) {
                            newHours = 0;
                        }
                    } else if (select.data('previous') === 'PM' && e.target.value === '24 hour') {
                        if (hours > 0 && hours < 12) {
                            newHours += 12;
                        }
                    } else if (select.data('previous') === '24 hour') {
                        if (newHours > 12) {
                            newHours -= 12;
                        }
                    }

                    if (newHours == 0 && e.target.value == 'AM') {
                        newHours = 12;
                    }

                    if (newHours != hours) {
                        if (newHours < 10) {
                            hoursStr = '0' + newHours;
                        } else {
                            hoursStr = '' + newHours;
                        }
                        this.time_ele.val(hoursStr + timeSeparator + minsStr + (secsStr != "" ? timeSeparator + secsStr : ""));
                    }

                    this.period_ele.data('previous', e.target.value);
                }
            };
        };

        return TimePeriodInteraction;
});
