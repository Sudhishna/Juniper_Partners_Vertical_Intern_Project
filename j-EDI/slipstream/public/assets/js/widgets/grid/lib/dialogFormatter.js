/**
 * A module that formats the configuration object for the Confirmation Dialog widget
 *
 * @module DialogFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'widgets/grid/conf/confirmationDialogConfiguration'
],  /** @lends DialogFormatter */
    function(confirmationDialogConfiguration) {

    /**
     * DialogFormatter constructor
     *
     * @constructor
     * @class DialogFormatter - Formats the configuration object for the Confirmation Dialog widget
     *
     * @param {Object} userConfiguration - User configuration object
     * @returns {Object} Current DialogFormatter's object: this
     */
    var DialogFormatter = function(userConfiguration){

        /**
         * Gets the default configuration for Confirmation Dialog widget and overwrites it with user defined configuration object
         * @returns {Object} Configuration object to be used to build the Confirmation Dialog widget
         * @inner
         */

        this.getConfirmationDialogs = function () {
            var dialogs = {},
                self = this;
            for (var key in confirmationDialogConfiguration){
                var conf = _.clone(confirmationDialogConfiguration[key]);
                if (userConfiguration&&userConfiguration[key])
                    _.extend(conf, userConfiguration[key]);
                dialogs[key] = conf;
            }
            return dialogs;
        };

    };

    return DialogFormatter;
});