/**
 * A Message provider that notifies subscribers of Navigate away events.  These events triggered whenever the browser
 *  window ior the Slipstream content pane is loaded.
 *
 * @module NavigateAwayProvider
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(['widgets/confirmationDialog/confirmationDialogWidget'], function(ConfirmationDialogWidget) {
    function NavigateAwayProvider() {
        var publisher;      
        var confirmationDialogConfig = {
                title: 'Caution',
                question: 'Are you sure you want to navigate away from the current page?',  // FIXME - localize
                yesButtonLabel: 'Yes',                                                      // FIXME - localize
                noButtonLabel: 'No',                                                        // FIXME - localize
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered',
                kind: 'warning',
                noButtonCallback : null,
                yesButtonCallback : null
        };

        this.onCreate = function() {
            publisher = this.getContext().getPublisher();
            Slipstream.commands.setHandler("navigation:request", function(cbObject) {
                var awaitedResult = publisher.publishAndWaitForResult("navigateAway");
                if(awaitedResult) {
                    if(awaitedResult.title) {
                        confirmationDialogConfig.title = awaitedResult.title;
                    }
                    if (awaitedResult.message) {
                        confirmationDialogConfig.question = awaitedResult.message;
                        if (awaitedResult.navAwayQuestion) {
                            confirmationDialogConfig.question += '<br /> <br />' + awaitedResult.navAwayQuestion;
                        }
                    } else {
                        confirmationDialogConfig.question = confirmationDialogConfig.question;
                    }
                    if(awaitedResult.yesButtonCallback){
                        confirmationDialogConfig.yesButtonCallback = awaitedResult.yesButtonCallback;
                    }
                    if(awaitedResult.noButtonCallback) {
                        confirmationDialogConfig.noButtonCallback = awaitedResult.noButtonCallback;
                    }
                    var confirmationDialog = new ConfirmationDialogWidget(confirmationDialogConfig);
                    confirmationDialog.vent.on('yesEventTriggered', function(evt) {
                        confirmationDialog.destroy();
                        confirmationDialog = null;
                        if (cbObject && cbObject.success) {
                            // clear subscriptions for the navigate away event so that the browser
                            //      native does not do another confirmation dialog.
                            var messageResolver = new Slipstream.SDK.MessageResolver();                  
                            var listenersList = publisher.getSubscriptionsForEvent("navigateAway");
                            var nListeners = listenersList.length;
                            for (var ii = 0; ii < nListeners; ii++) {
                                messageResolver.unsubscribe(listenersList[ii]);
                            }
                            messageResolver = null;
                            cbObject.success();
                        }
                    });
                    confirmationDialog.vent.on('noEventTriggered', function(evt) {
                        confirmationDialog.destroy();
                        confirmationDialog = null;
                        if (cbObject && cbObject.fail) {
                            cbObject.fail();
                        }                        
                    });                    
                    confirmationDialog.build();
                }
                else if (cbObject && cbObject.success) {
                    cbObject.success();
                }
            });
            window.addEventListener('beforeunload', function (event_data) {
                var message = "";
                var awaitedResult = publisher.publishAndWaitForResult("navigateAway", event_data);
                // If a string, then place string result on event_data.returnValue 
                //   and return string message to be rendered in browser native confirmation box.
                if (awaitedResult) {
                    if(awaitedResult.message) {
                        message = awaitedResult.message;
                    }
                    event_data.returnValue = message;   // Gecko and Trident
                }
                if(message.length > 0) {
                    event_data.returnValue = message;
                    return message;  // Gecko and WebKit
                } else {
                    delete event_data.returnValue;
                    return;
                }
            });
        }
    }

    NavigateAwayProvider.prototype = Object.create(Slipstream.SDK.MessageProvider.prototype);
    NavigateAwayProvider.prototype.constructor = Slipstream.SDK.MessageProvider;

    return NavigateAwayProvider;
});