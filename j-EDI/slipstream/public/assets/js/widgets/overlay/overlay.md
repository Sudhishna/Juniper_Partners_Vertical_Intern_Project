# Introduction
An overlay is a mini page in a layer on top of a page. It provides a way for the user to access additional information without leaving the current page or loading a new page. It is also effective for catching the user’s attention to something vital.
Overlays are typically modal, disabling the original page beneath the overlay. They require acknowledgement from the user, who needs to take an action or cancel the overlay until he or she can continue interacting with the original page. The Slipstream framework provides a programming construct for plugin developers to display their content on overlay widget.

There are five different sizes for overlay. Each overlay has a fixed width and min to max height.

xlarge | wide - width(1100px); min-height(570px) to max-height(900px) 
large - width(780px); min-height(550px) to max-height(800px) 
medium - width(620px); min-height(520px) to max-height(700px) 
small - width(620px); min-height(350px) to max-height(680px) 
xsmall - width(460px); min-height(150px) to max-height(300px) 


#### Usage consideration:
Consider using an overlay when:

1. You want to interrupt the current process and catch the user’s full attention to something really important.
2. You need to display application preferences or other options that are “independent” from other pages.
3. It is important to show additional or related content/options in context.
4. You need to get input from the user. Overlays work well for showing forms for feedback, sign-up, contact, etc.
5. You have content that needs to be easily accessible from any page.

# API
The overlay object exposes undermentioned 5 functions:

```
function OverlayWidget(conf) {…}
```

Constructor, used to create a new overlay.

```
function build() {…}
```

Used to setup and render the overlay in the middle of screen using the config values.

```
function destroy() {…}
```

Used to close the overlay, free up other resources and remove the overlay from DOM.

```
function destroyAll() {…}
```

Used to close all the nested overlays, free up other resources and remove the overlays from DOM.

```
function getOverlay() {…}
```

Use to get the reference of most recent created overlay object within nested overlays.

```
function getOverlayContainer() {…}
```
Use to get the reference of the created overlay container.

# Usage

***Note***:
If you are using the overlay widget outside the context of the Slipstream framework, you need to add an HTML element with id="overlay_content" at a location in your HTML template that spans 100% height and width. This is because the Overlay Widget searches for #overlay_content to determine the size and location of the modal. Add the following line to your HTML document under  a location that spans 100% height and width.

```html
<div id="overlay_content"></div>
```

## Steps for instantiating a new overlay widget:
#### 1. Under js/conf create a model for the widget

Example: widgetConf.js

```
define([], function () {

    var config = {};

    config.elements = {
        title: "Dialogue Message",
        message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor cillum dolore eu fugiat nulla pariatur.",
        "buttons": [
            {
                "id": "callNestedOverlay",
                "name": "callNestedOverlay",
                "value": "callNestedOverlay"
            },
            {
                "id": "yes",
                "name": "yes",
                "value": "Yes"
            }
        ]
    };
    return config;

});
```

#### 2. Under js/views create a view for the widget

Example: widgetView.js

```
define([
    'hogan',
    'backbone',
    '../conf/widgetConf.js',
    'text!../../templates/widgetTemplate.html',
    'widgets/overlay/overlayWidget'
], function (Hogan, Backbone, Conf, ExampleTemplate, OverlayWidget) {
    /**
	 * Constructs a WidgetView
	 */
    var WidgetView = Backbone.View.extend({

        displayWidget: function () {
            var template = Hogan.compile(ExampleTemplate);
            var elementsTemplateHtml = template.render(Conf.elements);
            $(this.el).append(elementsTemplateHtml);
            return this;
        }
    });

    return WidgetView;
});
```

#### 3.In the templates directory, create a template for your widget view

Example: widgetTemplate.html

```
<div class="content-wrapper">
    <div class="title">{{title}}</div>
    <div>{{message}}</div>
    <div>
        {{#buttons}}
        <input type="submit" class="button right"
        {{#id}}id="{{id}}"{{/id}}
        {{#name}}name="{{name}}"{{/name}}
        {{#value}}value="{{value}}"{{/value}}
        >
        <span class="right">&nbsp;&nbsp;</span>
        {{/buttons}}
    </div>
</div>
```

#### 4. After developing the widget conf, view and template, create the object to show overlay

Example: js/views/exampleView.js

```
require([ './WidgetView', 'widgets/overlay/overlayWidget'], function (OverlayView, OverlayWidget) {

    var overlayViewObj = new OverlayView({});

    var conf = {
        view: overlayViewObj,
        xIconEl: true,
        cancelButton: true,
        okButton: true,
        showScrollbar: true,
        type: 'wide',
        beforeSubmit: function(){
            console.log("-- beforeSubmit is executed");
            var valid = true;

            if(contentHasInputField.is(":checked")) {
                var numberVal = this.$el.find('#field_number').val();
                valid = numberVal && !isNaN(parseFloat(numberVal)) && isFinite(numberVal);
                if (valid) {
                    console.log("No Error, submit method will be executed next");
                } else {
                    console.log("Validation failed, submit method will not be executed");
                }
            }

            return  valid;
        },
        submit: function(){
            console.log("-- submit is executed");
        },
        beforeCancel: function(){
            console.log("-- beforeCancel is executed");
        },
        cancel: function(){
            console.log("-- cancel is executed");
        }
    };
    this.overlayWidgetObj = new OverlayWidget(conf);
    this.overlayWidgetObj.build();

});
```
***Note***:
The child view should always 'return this;' in render method. If this is missing overlay will not have the reference to the view which in turn will not render the user view.


Configuration attributes defined as below

**view** - required attribute; object that contains content which needs to be displayed on overlay. 

**xIconEl** - optional attribute; accepted values: true / false; default value: false; used to show/hide the X icon on top-right corner of overlay, which can be used to close the current overlay.

**cancelButton** - optional attribute; accepted values: true / false; default value: false; used to show/hide the Cancel button in the bottom-right corner of overlay, which can be used to close the current overlay.

**okButton** - optional attribute; accepted values: true / false; default value: false; used to show/hide the OK button in the bottom-right corner (after Cancel button) of overlay, which can be used to close the current overlay.

**showScrollbar** - optional attribute; accepted values: true / false; default value: false; used to show/hide the vertical scroll bar in the right side of overlay.

**type** - optional attribute; accepted four sizes: wide, large, medium, small; default value: wide; used to display the overlay in center of screen with the defined size.

**beforeSubmit** - Optional callback function. This will be called when the user hits ENTER or clicking on the submitEl. It can return 'true' or 'false'. Submit() will not be invoked only if it returns 'false'. For example, this can be used for any validations before submit.

**submit** - Optional callback function. This method is called when the user clicks the ok button.

**beforeCancel** - Optional callback function. This will be called when the user hits ESC, clicking on the cancel button or clicking outside the modal. It can return 'true' or 'false'. Cancel() method will not be invoked only if it returns 'false'.

**cancel** - Optional callback function. This method is called when the user clicks on the cancel button.
Note: overlay Widget has a cancel method that internally executes view's close method. Sequence of execution for methods is
1. beforeCancel: Optional, overlay widget config beforeCancel callback
2. close: Optional, View's close method
3. cancel: Optional, overlay widget config cancel callback
4. onClose: overlay widget internal method, executed immediately before closing the modal


