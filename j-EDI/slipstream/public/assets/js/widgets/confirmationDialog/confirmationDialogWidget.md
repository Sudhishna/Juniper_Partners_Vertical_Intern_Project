# Introduction
A confirmation dialog widget is an overlay programmed to perform the task of providing a uniform way to plugin developers to write Yes/No kind of confirmation dialogs.
The confirmation dialog widget uses the Slipstream overlay widget underneath and hence always renders on top of the current content on the page, disabling any clicks outside the area of the widget.

#### Usage consideration:
Consider using the confirmation dialog widget when you want to ask the user to confirm on an action s/he intends to do.

# API
The confirmation object exposes the following methods and attributes:

```javascript
function ConfirmationDialogWidget(config) {…}
```

Constructor, used to create a new confirmation dialog widget.
The configuration attributes are defined as below:

**kind** - (optional) string to indicate the kind of dialog box. One of the following: 'warning' (displayed with an outline); when not specified no special outline will be shown on the dialog. Use the 'warning' parameter to capture user attention for important confirmation questions.

**title** - (required) text to be shown on the title bar of the dialog.

**question** - (required) text to be asked in the content of the dialog. Usually a question like "Are you sure you want to do this?".

**yesButtonLabel** - (optional) string label for the Yes Button.

**noButtonLabel** - (optional) string label for the No button.

***Note***: Our recommendation is to use either events or callbacks as outlined by below parameters but not mix both in a view instantiating the confirmation dialog object.

**yesButtonCallBack** - (optional) callback function when Yes Button clicked.  The yesButtonCallbackwill be called with a true/false argument - true if the user selected the "do not show again" checkbox, false otherwise.
***Note***: The view needs to cleanup the confirmation dialog widget by calling it's destroy() method in yesButtonCallback function. This is so that the view can show other overlays such as a progress indicator on some action happening and destroy the confirmation dialog once done successfully or unsuccessfully.

**noButtonCallback** - (optional) callback function when No Button clicked.
***Note***: The view needs to cleanup the confirmation dialog widget by calling it's destroy() method in noButtonCallback function. This is so that the view can show other overlays such as a progress indicator on some action happening and destroy the confirmation dialog once done successfully or unsuccessfully.

**yesButtonTrigger** - (optional) event that gets triggered on Yes button being clicked. The yesButtonTrigger  will be triggered with an additional value - true if the user selected the "do not show again" checkbox, false otherwise.
***Note***: The view needs to cleanup the confirmation dialog widget by calling it's destroy() method on yesButtonTrigger event received. This is so that the view can show other overlays such as a progress indicator on some action happening and destroy the confirmation dialog once done successfully or unsuccessfully.

**noButtonTrigger** - (optional) event that gets triggered on No button being clicked.
***Note***: The view needs to cleanup the confirmation dialog widget by calling it's destroy() method on noButtonTrigger event received. This is so that the view can show other overlays such as a progress indicator on some action happening and destroy the confirmation dialog once done successfully or unsuccessfully.

**doNotShowAgainMessage** - (optional) text to be shown for checkbox to ask user whether s/he wants the dialog to be shown again. If not passed in, no checkbox and message are shown. 
***Note***: It is the widget user's responsibility to keep a track of the parameter sent back if the checkbox was selected.

**xIcon** - (optional) true/false to indicate if an X (close) icon should appear in the upper right corner of the dialog. If not passed in, no xIcon is shown.

```javascript
Object vent
```
Once a ConfirmationDialogWidget object has been created, you can listen to the yesButtonTrigger and noButtonTrigger events on the vent object exposed by the ConfirmationDialogWidget.
e.g.
```javascript
var conf = {
                title: 'Test Confirmation Dialog',
                question: 'Are you sure you want to do this?',
                yesButtonLabel: 'Yes',
                noButtonLabel: 'No',
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered'
            };

var new confirmationDialogObj = new ConfirmationDialogObject(conf);

confirmationDialogObj.vent.on('yesEventTriggered', function() {
	console.log('Yes button event triggered');
});

confirmationDialogObj.vent.on('noEventTriggered', function() {
	console.log('No button event triggered');
});
```


```javascript
function build() {…}
```

Used to setup and render the confirmation dialog in the middle of screen using the config values.

```javascript
function destroy() {…}
```

Used to close the confirmation dialog, free up other resources and remove it from the DOM.


# Usage

## Sample html template for view using confirmation dialog widget:
***Note***: If you are using the confirmation dialog widget without Slipstream, your html template needs to have a div with id="overlay_content" under a location that spans 100% of height and width of your page. This is required by the overlay widget to render itself with the proper size and at the proper location.

Example testConfirmationDialog.html:

```html
<!doctype html>
<html class="no-js" lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Test Confirmation Dialog Widget</title>
        <link rel="stylesheet" href="/assets/css/app.css" />
    </head>
    <body>
        <div id="overlay_content" class="confirmation-widget-test"></div>
		<!-- Include your scripts here that will load and instatiate confirmationDialogAppView below -->
    </body>
</html>

```

## Example for instantiating a new confirmation dialog widget:

Example: confirmationDialogAppView.js

```javascript
define([
    'backbone',
    'widgets/confirmationDialog/confirmationDialogWidget'
], function(Backbone, ConfirmationDialogWidget){
    var ConfirmationDialogAppView = Backbone.View.extend({

        initialize: function (config) {
            var self = this;

            // use either the callback or the trigger. Here both are used only as an example
            var yesButtonCallback = function(doNotShowAgain) {
                console.log('Yes button callback called with do not show checkbox', doNotShowAgain? 'selected': 'unselected');
                
                // you can do other things here such as open a progress view overlay
                
                // remember to destroy the dialog once done
                self.confirmationDialogWidget.destroy();
            };

            var noButtonCallback = function() {
                console.log('No button callback called');

                // you can do other things here such as open a progress view overlay
                
                // remember to destroy the dialog once done
                self.confirmationDialogWidget.destroy();
            };

            var conf = {
                title: 'Test Confirmation Dialog',
                question: 'Are you sure you want to respond Yes to this question?',
                yesButtonLabel: 'Yes',
                noButtonLabel: 'No',
                yesButtonCallback: yesButtonCallback,
                noButtonCallback: noButtonCallback,
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered',
                // kind: 'warning'
            };

            this.confirmationDialogWidget = new ConfirmationDialogWidget(conf);

            this.bindEvents();

            this.render();
        },

        bindEvents: function() {
            var self = this;
            // use either the callback or the trigger. Here both are used only as an example
            this.confirmationDialogWidget.vent.on('yesEventTriggered', function(doNotShowAgain) {
                console.log('Yes button event triggered with do not show checkbox', doNotShowAgain? 'selected': 'unselected');
                
                // you can do other things here such as open a progress view overlay

                // remember to destroy the dialog once done
                // self.confirmationDialogWidget.destroy();
            });

            this.confirmationDialogWidget.vent.on('noEventTriggered', function() {
                console.log('No button event triggered');

                // you can do other things here such as open a progress view overlay

                // remember to destroy the dialog once done
                // self.confirmationDialogWidget.destroy();
            });
        },

        render: function () {

            this.confirmationDialogWidget.build();

            return this;
        }
    });

    return ConfirmationDialogAppView;
});
```