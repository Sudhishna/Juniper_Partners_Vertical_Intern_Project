/**
 * 
 * A view representing the are of the wizard containing the wizard title.
 *
 * @module WizardTitleView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'marionette',
    'text!widgets/shortWizard/templates/shortWizardTitle.html'
], function(Marionette,
	        wizardTitleTpl) {

	var WizardTitleView = Marionette.ItemView.extend({
        template: wizardTitleTpl
    });

    return WizardTitleView;
});