/**
 * A model representing the confirmation dialog.
 * 
 * @module ConfirmationDialogModel
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone'
], function(Backbone) {

	var ConfirmationDialogModel = Backbone.Model.extend({
        defaults: {
            title: '',
            question: '',
            yesButtonLabel: 'Yes',
            noButtonLabel: null,
            cancelLinkLabel: null,
            yesButtonTrigger: null,
            noButtonTrigger: null,
            cancelLinkTrigger: null,
            yesButtonCallback: null,
            noButtonCallback: null,
            cancelLinkCallback: null,
            doNotShowAgainMessage: null
        }
    });

    return ConfirmationDialogModel;
});