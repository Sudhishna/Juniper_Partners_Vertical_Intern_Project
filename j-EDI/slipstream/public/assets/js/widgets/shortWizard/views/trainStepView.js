/**
 * A view of a step in the wizard train.  
 * 
 * @module TrainStepView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'marionette',
    'text!widgets/shortWizard/templates/shortWizardStep.html',
], function(Marionette,
	        stepTpl) {

    var TrainStepView = Marionette.ItemView.extend({
        initialize: function(options) {
            _.extend(this, options);
        },

        template: stepTpl,
        className: 'trainCircle',
        attributes: {'tabindex': '0'},

        events: {
            "click": "selectStep"
        },
        selectionHandler: function(step) {
            if (step === this.model.get("step")) {
                this.$el.addClass("current");
                this.$el.removeClass("visited");
            }
            else {
                if (this.$el.hasClass("current")) {
                    this.$el.removeClass("current");
                    this.$el.addClass("visited");
                }
            }
        },
        selectStep: function() {
            this.options.vent.trigger("step:try_selected", this.model.get("step"));
        },
        fixFocus: function(step) {
            if (step === this.model.get("step")) {
                this.$el.focus();    
            }
        },
        serializeData: function() {
            return _.extend(this.model.toJSON(), 
                { 
                    step: this.model.get("step"),
                    relStep: this.model.get("relStep") + 1
                });
        }
    });

    return TrainStepView;
});