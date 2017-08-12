/** 
 * A Confirmation Dialog Widget using the Overlay Widget to
 * be used in the Slipstream context
 * @module ConfirmationDialogWidget
 * @author Kiran <kkashalkar@juniper.net>
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'widgets/overlay/overlayWidget',
    'widgets/confirmationDialog/models/confirmationDialogModel',
    'widgets/confirmationDialog/views/confirmationDialogView'
], /** @lends ConfirmationDialogWidget */ function(
    OverlayWidget,
    ConfirmationDialogModel,
    ConfirmationDialogView) {

    /**
     * ConfirmationDialogWidget constructor
     *
     * @constructor
     * @class ConfirmationDialogWidget
     * @param {Object} config - ConfirmartionDialogWidget's configuration object
     * @return {Object} instance of ConfirmationDialogWidget class
     *
     * config object
     * @param {string} kind - (optional) string to indicate the kind of dialog box 
     *                        'warning' (colored outline on overlay to grab user's attention); no outline otherwise.
     * @param {string} title - (required) text to be shown on the title bar of the dialog
     * @param {string} question - (required) text to be asked in the content of the dialog. Usually a question
     * @param {string} yesButtonLabel - (optional) string label for the Yes button.
     * @param {string} noButtonLabel - (optional) string label for the No button.
     * @param {Function} yesButtonCallBack - (optional) callback for Yes Button clicked.
     *                                       The yesButtonCallbackwill be called with a true/false 
     *                                       argument - true if the user selected the "do not show again" checkbox, false otherwise.
     * @param {Function} noButtonCallback - (optional) callback for No Button clicked.
     * @param {Function} cancelLinkCallback - (optional) callback for Cancel Link clicked.
     * @param {string} yesButtonTrigger - (optional) event that gets triggered on Yes button being clicked.
     *                                    The yesButtonTrigger  will be triggered with an additional
     *                                    true/false value - true if the user selected the "do not show again" checkbox, false otherwise.
     * @param {string} noButtonTrigger - (optional) event that gets triggered on No button being clicked.
     * @param {string} cancelLinkTrigger - (optional) event that gets triggered on Cancel link being clicked.
     * @param {string} doNotShowAgainMessage - (optional) text to be shown for checkbox to ask user whether s/he wants the dialog to be shown again.
     *                                         If not passed in, no checkbox and message are shown.
     *                                         It is the widget user's responsibility to keep a track of the parameter sent back if the checkbox was
     *                                         selected.
     * @param {boolean} xIcon - (optional) true/false to indicate if an X (close) icon should appear in the upper right corner of the dialog.
     *                          If not passed in, no xIcon is shown.
     */
    var ConfirmationDialogWidget = function(config) {

        var conf = config || {};
        this.vent = new Backbone.Wreqr.EventAggregator();

        var confirmationDialogModel = new ConfirmationDialogModel(conf);

        var confirmationDialogView = new ConfirmationDialogView({
            model: confirmationDialogModel,
            vent: this.vent
        });

        var containerClass = 'confirmationDialog ' + (conf.kind ? conf.kind: '');

        var overlayWidgetView = new OverlayWidget({
            view: confirmationDialogView,
            type: 'xsmall',
            class: containerClass,
            xIconEl: conf.xIcon ? conf.xIcon: false
        });

        bindEvents.call(this);

        /**
         * Render overlay, thus rendering confirmationDialogView and populate this object's el attribute
         * If container is specified, append to it.
         */
        this.build = function() {
            overlayWidgetView.build();
            confirmationDialogView.$el.find(".yesButton").focus();
            return this;
        };

        /**
         * Cleanup resources, unbind events, remove DOM nodes
         */
        this.destroy = function() {
            confirmationDialogView.unbindEvents();
            confirmationDialogView.close();
            unbindEvents.call(this, conf);
            this.vent = null;
            overlayWidgetView.destroy();
            return this;
        };

        /**
         * Set up event handlers for coordinating updates with
         * the confirmation widget views.
         * @inner
         */
        function bindEvents() {
            // Nothing for now
        };

        /**
         * Clean up event handlers for coordinating updates with
         * the confirmation widget views.
         * @inner
         */
        function unbindEvents(conf) {
            if(conf.yesButtonTrigger) {
                this.vent.off(conf.yesButtonTrigger);
            }
            if(conf.noButtonTrigger) {
                this.vent.off(conf.noButtonTrigger);
            }
            if(conf.cancelLinkTrigger) {
                this.vent.off(conf.cancelLinkTrigger);
            }
        };
    }

    return ConfirmationDialogWidget;
});