/**
 * A  configuration object with the parameters required to build a Confirmation Dialog widget
 *
 * @module confirmationDialogConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var confirmationDialogConfiguration = {};

    confirmationDialogConfiguration.delete = {
        title: 'Confirm Delete',
        question: 'Delete the selected item?',
        yesButtonLabel: 'Yes',
        noButtonLabel: 'No',
        kind: 'warning'
    };

    confirmationDialogConfiguration.save = {
        title: 'Save Changes',
        question: 'You made changes that have not been saved. What would you like to do with your changes?',
        yesButtonLabel: 'Save Changes',
        noButtonLabel: 'Discard Changes',
        cancelLinkLabel: 'Cancel'
    };

    confirmationDialogConfiguration.paste = { //TODO: implement pasting of a rule in different zones. Missing: UX specs.
        title: 'Zone Change',
        question: 'Pasting a rule into a new zone will automatically change the Source and Destination Zones and update the Sequence Number. Any Addresses in the Source or Destination Address elds will also be removed to avoid invalid zone addresses. Do you wish to proceed with the paste action?',
        yesButtonLabel: 'Save Changes',
        noButtonLabel: 'Cancel'
    };

    confirmationDialogConfiguration.error = {
        title: 'Error',
        question: 'The command can not be done. Try again.',
        yesButtonLabel: 'OK',
        kind: 'warning'
    };
    return confirmationDialogConfiguration;

});
