/**
 * Renders the custom summary view
 *
 * @module Custom Summary View
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'jquery',
    'backbone',
    'widgets/shortWizard/views/wizardSummaryView',

], function($, Backbone, WizardSummaryView) {
    var CustomSummaryView = WizardSummaryView.extend({

        initialize: function (options) {
            this.view = new options.view(options.pages);
            this.summaryTitle = options.summaryTitle;
            return this;
        },

        render: function () {
            this.$el.empty().append(this.view.render().$el);                
        
            return this;
        }       
    });

    return CustomSummaryView;
});