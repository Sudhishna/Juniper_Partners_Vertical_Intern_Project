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
    'lib/i18n/i18n'
], function($, Backbone, i18n) {
    var WizardSummaryView = Backbone.View.extend({             
            attributes: {
                class: "shortWizardSummaryPage"
            },

            getTitle: function () {                
                return this.summaryTitle || i18n.getMessage('wizard_summary_page_title');
            }
    });

    return WizardSummaryView;
});