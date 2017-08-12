# Introduction
The Slipstream framework provides a programming construct for plugin developers to attach datepicker widget. The datepicker is tied to a standard form input field. Click calendar icon to open an interactive calendar in a small overlay. Choose a date, click elsewhere on the page (blur the input), or hit the Esc key to close calendar overlay. If a date is chosen, feedback is shown as the input field value.

#### The datepicker will be configured with localized date format:

# API
The datepicker object exposes 3 functions: a constructor, a build method that creates the datepicker and a destroy method that cleans up the resources set by itself.

```
function DatepickerWidget(conf) {…}
```

Used to attach a new datepicker to input field.
where conf is of the format:

```
{
	container: <reference to the inputField where the datepicker needs to be attached>
}
```

```
function build() {…}
```

Used to attach the datepicker icon with calendar overlay to the input field.

```
function destroy() {…}
```

Used to remove the datepicker functionality completely from the input field. This will return the element back to its pre-init state.

```
function disable(boolean) {…}
```

Used to enable / disable datepicker field & icon.

# Usage
## Steps for using datepicker widget:
#### 1. Under js/views create a object for the widget

Example: widgetView.js

```
define([
    'backbone',
    'widgets/datepicker/datepickerWidget'
], function(Backbone, DatepickerWidget){
    /**
     * Constructs a DatepickerView
     */
    var DatepickerView = Backbone.View.extend({

        initialize: function () {
                    this.render();
                },
        
                render: function () {
                    var $dateElement = $('#datepicker_test');
                    var confObj = {
                        container: $dateElement
                    };
                    var datepickerWidgetObj = new DatepickerWidget(confObj);
                    datepickerWidgetObj.build();
                    return this;
                }
            });
        
            return DatepickerView;
        });
```

#### 2. create the object of the view to attach datepicker under js/views, dateformat will be as per locale

Example: exampleView.js

```
require([ './widgetView'], function (DatepickerView) {
    new DatepickerView({});
});
```

#### 3. Instance methods

Examples

```

/**
 * Instantiate date picker widget 
 */
var $dateElement = $('#datepicker_test');
var confObj = {
    container: $dateElement
};
var datepickerWidgetObj = new DatepickerWidget(confObj);
datepickerWidgetObj.build();

/**
 * Set the date to today using setDate(date) passing in a JavaScript Date object
 */
var today = new Date();
datepickerWidgetObj.setDate(today);

/**
 * Get the date value of the instance
 */
 var dateVal = datepickerWidgetObj.getDate();

/** 
 * Set the minimum and maximum date. 
 * When using two instances of the Date Picker Widget as a date range, 
 * this can be used to enforce start date is never after end date.
 * Also can be used on a single date picker widget to restrict dates 
 * to within a certain range.
 */

var newMaxDate = new Date(Number(today.valueOf() + 604800000);
datepickerWidgetObj.minDate(today);
datepicketWidgetObj.maxDate(newMaxDate);
```






