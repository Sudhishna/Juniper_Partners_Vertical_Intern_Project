/**
 * A module that contains helper methods to reformat date/time
 *
 * @module dateFormatter
 * @author Vidushi Gupta<vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([], /** @lends DateFormatter */
function () {

    /**
     * Reformat the date column filter data as per space specification
     * Converts AM/PM time in 24 hr format
     * DateFormatter constructor
     *
     * @returns {Object} Current DateFormatter's object: this
     */
    var DateFormatter = function () {

        this.formatDateTime = function (dateTime) {
            var dateTimeArr = dateTime.split(" ");

            var time = dateTimeArr[1].split(":");
            var hours = parseInt(time[0]);
            var minutes = time[1];
            var seconds = typeof(time[2]) === "undefined" ? time[2] = "00" : time[2];

            var timePeriod = dateTimeArr[2];

            var formattedTime = time.join(":");

            if (timePeriod == "AM") {
                if (hours == 12) {
                    formattedTime = "00:" + minutes + ":" + seconds; // (hours-12)
                }
            } else if (timePeriod == "PM") {
                if (hours >= 1 && hours <= 11) {
                    formattedTime = hours + 12 + ":" + minutes + ":" + seconds; // (hours+12)
                }
            }
            return dateTimeArr[0] + " " + formattedTime; //returning the 24 hour format
        };
    };

    return DateFormatter;
});