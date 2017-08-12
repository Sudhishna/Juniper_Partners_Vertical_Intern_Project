/*
 * A view representing the short wizard's cancel confirm object.  It
 * is responsible for displaying a view that contains a message related
 * to confirming a user generated cancel event and also receiving a
 * an 'Yes' or 'No' in regards to the cancel message.
 *
 * @module CancelConfirmView
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'jquery',
    'backbone', 
    'text!widgets/shortWizard/templates/shortWizardCancelConfirm.html',
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n'
], /** @lends CancelConfirmView */
function($, Backbone, cancelConfirmTemplate, render_template, i18n) {
    var CancelConfirmView = Backbone.View.extend({

        yesButtonClassString:     ".shortWizardCancelYesButton",
        noButtonClassString:      ".shortWizardCancelNoButton", 

        /**
         * Render the view.
         * @inner
         * @return The reference to the CancelConfirmView object instance.
         */
        render: function () {
            var confObj = {
                'title': this.getTitle(), 
                'description' : this.getDescription(),
                'yes_button_label' : i18n.getMessage('yes_button_label'),
                'no_button_label' : i18n.getMessage('no_button_label')
            };
            $(this.$el).html(render_template(cancelConfirmTemplate, confObj));
            return this;
        },

        /**
         * Get the view title.
         *
         * @instance
         * @returns {String} The title of the CancelConfirmView.  This string is rendered on the view.
         *      ie. Exit Setup?
         */
        getTitle: function() {
            return i18n.getMessage('wizard_cancel_confirm_title');
        },

        /**
         * Get the view description.
         *
         * @instance
         * @returns {String} The message of the CancelConfirmView.
         *      ie. "Do you want to exit the setup without changing other default settings?""
         */
        getDescription: function() {
            return i18n.getMessage('wizard_cancel_confirm_message');
        },

        /**
         * Get 'Yes' Button object.
         *
         * @instance
         * @returns {Object} The jquery wrapped button object.
         */
        getYesButtonObject: function(){
            return $(this.$el).find(this.yesButtonClassString);

        },

        /**
         * Get 'No' Button object.
         *
         * @instance
         * @returns {Object} The jquery wrapped button object.
         */
        getNoButtonObject: function(){
            return $(this.$el).find(this.noButtonClassString);
        }
    });

    return CancelConfirmView;
});
