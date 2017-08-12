define(['moment'], function(moment) {
	Slipstream.module("SDK", /** @lends DateFormatter */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
		SDK.DateFormatter = {};
		/**
		 * Format a date in ISO8601 format
		 *
		 * @param {Object | String} date - a Date object or a date string in ISO8601 format.
		 * @param {String} format_string - A string indicating how the date should be
		 * formatted.  See {@link https://ssd-git.juniper.net/spog/slipstream/blob/master/docs/DateFormatter.md DateFormatter}.
		 * @return The date formatted according to the supplied format_string.
		 */
		SDK.DateFormatter.format = function(date, format_string) {
			var amoment = moment(date)

			return amoment.format(format_string);
		}

		/**
		 *  Get the current browser locale
		 * 
		 *  @return The current locale setting for the browser
		 */

		function get_browser_locale() {
		    return navigator.language || navigator.userLanguage;
		}

		// set the current locale
		moment.locale(get_browser_locale());
	});

	return Slipstream.SDK.DateFormatter;
});