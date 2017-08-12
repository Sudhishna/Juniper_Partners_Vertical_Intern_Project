/**
 * A view that uses the Confirmation Dialog Widget. This widget is used to alert the user of a successful device addition or failure of device addition.
 *
 * @module ConfirmationDialogAppView
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Kelcy Newton <knewton@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/confirmationDialog/confirmationDialogWidget'
], function(Backbone, ConfirmationDialogWidget){
    var ConfirmationBox = Backbone.View.extend({

      /**
       * Render the Confirmation Box on the screen
       * @param none
       * @return the confirmation box view 
       */
        render: function () {
          var self = this;

          //On click of the yes button, perform this callback
          var yesButtonCallback = function() {

              self.confirmationDialogWidget.destroy();
          };

           //Gather the title and question of the Confirmation Box from where the widget is created.
          var rowData = this.options.rowData;
          var title = rowData["title"]
          var question = rowData["question"]

          //Create the widget configuration
          var conf = {
              title: title,
              question: question,
              yesButtonLabel: 'okay',
              //cancelLinkLabel: 'press esc to close',
              yesButtonCallback: yesButtonCallback,
              //cancelLinkCallback: cancelLinkCallback,
              xIcon: true
          };

            //create the widget and build it
            this.confirmationDialogWidget = new ConfirmationDialogWidget(conf);
            this.confirmationDialogWidget.build();
            return this;
        }
    });

    return ConfirmationBox;
});
