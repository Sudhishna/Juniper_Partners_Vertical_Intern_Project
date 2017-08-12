/** 
 * A Confirmation Dialog View using Marionette
 * @module ConfirmationDialogView
 * @author Kiran <kkashalkar@juniper.net>
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'marionette',
    'text!widgets/confirmationDialog/templates/confirmationDialog.html',
    'lib/template_renderer/template_renderer'
], /** @lends ConfirmationDialogView */
    function(Marionette,
            confirmationDialogTpl,
            render_template) {

    /**
     * ConfirmationDialogView constructor
     *
     * @constructor
     * @class ConfirmationDialogView
     */
    var ConfirmationDialogView = Marionette.ItemView.extend({
        // Template to use for confirmation dialog
        template: confirmationDialogTpl,

        // UI hash for easy jQuery access through the module
        ui: {
            'question': '.question',
            'yesButton': '.yesButton',
            'noButton': '.noButton',
            'cancelLink': '.cancelLink'
        },

        // Events hash that specifies what UI events are binded to
        events: {
            'click @ui.yesButton': 'processYesButton',
            'click @ui.noButton': 'processNoButton',
            'click @ui.cancelLink': 'processCancelLink'
        },

        /**
         * Initialize the view with passed in options.
         * @inner
         */
        initialize: function(options) {
            this.bindEvents();
        },

        /**
         * Bind to events that we want to listen and act on
         * @inner
         */
        bindEvents: function() {
            //Nothing for now
        },

        unbindEvents: function() {
            //Nothing for now
        },

        /**
         * Process the clicking of Yes Button
         * @inner
         */
        processYesButton: function() {
            var yesButtonTrigger = this.options.model.get('yesButtonTrigger');
            var yesButtonCallback = this.options.model.get('yesButtonCallback');

            var $checkbox = $('.doNotShowAgainCheckbox', this.$el);
            var doNotShowAgain = false;

            if ($checkbox != []) {
                if ($checkbox.is(':checked')) {
                    doNotShowAgain = true;
                }
            }

            if (yesButtonTrigger) {
                this.options.vent.trigger(yesButtonTrigger, doNotShowAgain);
            }

            if (yesButtonCallback) {
                yesButtonCallback(doNotShowAgain);    
            }
            
            return this;
        },

        /**
         * Process the clicking of No Button
         * @inner
         */
        processNoButton: function() {
            var noButtonTrigger = this.options.model.get('noButtonTrigger');
            var noButtonCallback = this.options.model.get('noButtonCallback');
            if (noButtonTrigger) {
                this.options.vent.trigger(noButtonTrigger);
            }

            if (noButtonCallback) {
                noButtonCallback();    
            }
            
            return this;
        },


        /**
         * Process the clicking of Cancel Link
         * @inner
         */
        processCancelLink: function() {
            var cancelLinkTrigger = this.options.model.get('cancelLinkTrigger');
            var cancelLinkCallback = this.options.model.get('cancelLinkCallback');
            if (cancelLinkTrigger) {
                this.options.vent.trigger(cancelLinkTrigger);
            }

            if (cancelLinkCallback) {
                cancelLinkCallback();
            }

            return this;
        },

        // Render the view, defaulting to underscore.js templates.
        // You can override this in your view definition to provide
        // a very specific rendering for your view. In general, though,
        // you should override the `Marionette.Renderer` object to
        // change how Marionette renders views.
        render: function(){
            this.isClosed = false;

            this.triggerMethod("before:render", this);
            this.triggerMethod("item:before:render", this);

            var data = this.serializeData();
            data = this.mixinTemplateHelpers(data);

            var template = this.getTemplate();
            var html = render_template(template, data);

            this.$el.html(html);
            this.bindUIElements();

            this.triggerMethod("render", this);
            this.triggerMethod("item:rendered", this);

            return this;
        }

    });

    return ConfirmationDialogView;
});