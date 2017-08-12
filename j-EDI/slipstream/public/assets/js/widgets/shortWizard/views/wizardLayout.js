/** 
 * The main Wizard layout.  The layout defines regions
 * into which individual wizard views are rendered.
 *
 * @module WizardLayout
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'marionette',
    'text!widgets/shortWizard/templates/shortWizard.html'
], function(Marionette,
	        wizardTpl) {
    
    var WizardLayout = Marionette.Layout.extend({
        template: wizardTpl,
        regions: {
            pageRegion: '.shortWizardPageContent'
        }
    });

    return WizardLayout;
});