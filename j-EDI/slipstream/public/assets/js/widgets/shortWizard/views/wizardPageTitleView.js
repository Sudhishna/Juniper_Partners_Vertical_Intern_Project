/**
 * A view representing the area containing the title of a 
 * page displayed in the wizard.
 *
 * @module WizardPageTitleView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'marionette',
    'text!widgets/shortWizard/templates/shortWizardPageTitle.html',
], function(Marionette,
	        wizardPageTitleTpl) {

	var WizardPageTitleView = Marionette.ItemView.extend({
        template: wizardPageTitleTpl
    });

    return WizardPageTitleView;
});