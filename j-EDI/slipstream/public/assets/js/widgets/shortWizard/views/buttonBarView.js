/*
 * A view representing the wizard's button bar.  It
 * is responsible for managing the view of button states and
 * handling button events.
 *
 * @module ButtonBarView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'jquery',
    'underscore',
    'marionette',
    'text!widgets/shortWizard/templates/buttonBar.html',
    'lib/i18n/i18n'
], function($, _, Marionette, buttonBarTpl, i18n) {
    var ButtonBarView = Marionette.ItemView.extend({
        initialize: function(options) {
            _.extend(this, options);
        },
        events: {
            "click .shortWizardNextButton": "processNext",
            "click .shortWizardPreviousButton": "processPrevious",
            "click .shortWizardFinishButton": "processFinish",
            "click .shortWizardCommitButton": "processCommit",
            "click .shortWizardCloseButton": "processClose",
            "click .shortWizardOKButton": "processOK",
            "click .shortWizardCancelLink": "processCancel"
        },
        onRender: function(options) {
            var previousButton = $(".shortWizardPreviousButton", this.$el);
            var nextButton = $(".shortWizardNextButton", this.$el);
            var finishButton = $(".shortWizardFinishButton", this.$el);
            var commitButton = $(".shortWizardCommitButton", this.$el);
            var cancelButton = $(".shortWizardCancelButton", this.$el);
            var closeButton = $(".shortWizardCloseButton", this.$el);
            var cancelButton = $(".shortWizardCancelLink", this.$el);
            var okButton = $(".shortWizardOKButton", this.$el);

            this.options.vent.bind("step:first", function() {
                cancelButton.show();
                previousButton.hide();
                finishButton.hide();
                nextButton.show();
                commitButton.hide();
                closeButton.hide();
                okButton.hide();
            });

            this.options.vent.bind("step:last", function(hasSummary) {
                nextButton.hide();  
                previousButton.show();
                closeButton.hide();
                okButton.hide();

                if (hasSummary) {
                    finishButton.show();
                    commitButton.hide();
                } else {
                    finishButton.hide();
                    commitButton.show();
                }
            });

            this.options.vent.bind("step:summary", function() {
                nextButton.hide();
                finishButton.hide();
                commitButton.show();
                previousButton.show();
                closeButton.hide();
                okButton.hide();
            });

            this.options.vent.bind("step:other", function(step) {
                cancelButton.show();
                commitButton.hide();
                nextButton.show();  
                previousButton.show();
                finishButton.hide()
                closeButton.hide();
                okButton.hide();
            });

            this.options.vent.bind("step:commitStatus", function() {
                cancelButton.hide();
                nextButton.hide();
                finishButton.hide();
                commitButton.hide();
                previousButton.hide();
            });

            this.options.vent.bind("committing:changes", function() {
                cancelButton.hide();
                nextButton.hide();
                finishButton.hide();
                commitButton.hide();
                previousButton.hide();
                closeButton.hide();
                okButton.hide();
            });            

            this.options.vent.bind("committing:changes:success", function() {
                cancelButton.hide();
                commitButton.hide();
                nextButton.hide();
                previousButton.hide();
                closeButton.show();
                okButton.hide();
            });

            this.options.vent.bind("committing:changes:error", function() {
                cancelButton.hide();
                commitButton.hide();
                nextButton.hide();
                previousButton.hide();
                closeButton.hide();
                okButton.show();
            });

        },
        processNext: function() {
            this.options.vent.trigger("step:try_next");
        },
        processPrevious: function() {
            this.options.vent.trigger("step:try_previous");
        },
        processFinish: function() {
            this.options.vent.trigger("step:try_finish");
        },
        processCommit: function() {
            this.options.vent.trigger("wizard:commit");
        },
         processClose: function() {
            this.options.vent.trigger("wizard:close");
        },
        processOK: function() {
            this.options.vent.trigger("wizard:restart");
        },
        processCancel: function() {
            this.options.vent.trigger("wizard:cancel");
        },
        template: buttonBarTpl,
        serializeData: function() {
            return {
                cancel: i18n.getMessage('cancel_button_label'),
                previous: i18n.getMessage('back_button_label'),
                next: i18n.getMessage('next_button_label'),
                finish: i18n.getMessage('finish_button_label'),
                commit: i18n.getMessage('ok_button_label'),
                ok: i18n.getMessage('ok_button_label'),
                close: i18n.getMessage('close_button_label')
            };
        }
    });

    return ButtonBarView;
});