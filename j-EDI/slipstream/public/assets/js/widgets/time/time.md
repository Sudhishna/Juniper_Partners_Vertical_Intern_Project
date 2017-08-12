# Time Widget

## Introduction
Slipstream's Time widget provides an input UI widget for any workflow which needs to show and interact time values. It contains following HTML input fields: 
* a text-input field for display and take time value in __HH:MM__ or __HH:MM:SS__ format. 
* a select box with options: __AM__, __PM__ and __24 hour__

The widget handles all user input validations using slipstream validator & displays an error message: *Must be HH:MM:SS.* The widget automatically adjusts the time value when user select different period in select box (e:g if the current shown values 03:45:56 with PM option and then user selects 24 hour, the time value is changed to 15:45:56.)

## API
The Time widget follows the widget programming interface standards.
Time widget object exposes undermentioned functions:

```
function TimeWidget(conf) {…}
```

Creates a time widget object instance with specified __conf__ object specifying the required __container__ (DOM element) where the widget will render itself and an optional __value__ for a pre-set time value. Note: when a value is not specified, the widgets shows time of the client machine.


```
function build() {…}
```

Renders the time widget's UI elements (time input field and period drop down)in the specified container (DOM element).


```
function destroy() {…}
```

Removes the rendered view from the specified container and unbinds events.


```
function getTime() {…}
```

Returns the current time value string.

###Configuration
The configuration object has two variables:

```
{
	container: <define the container where the widget will be rendered | required>,
	value: <time value as input | default: current time from system | optional>
}
```

## Usage
### Steps for using Time widget:
#### 1. Under js/views create a object for the widget

Example: widgetView.js

```
define([
    'jquery',
    'underscore',
    'backbone',
    'widgets/time/timeWidget'
], function($, _, Backbone, TimeWidget){
    /**
     * Constructs a TimeView
     */
  var TimeView = Backbone.View.extend({

    el: '#main-sample-content',

    initialize: function () {
      this.render();
    },

    render: function () {
      this.timeWidget = new TimeWidget({
        'container': "#time-widget"
      });
      this.timeWidget.build();

      return this;
    }
  });

  return TimeView;
});
```

#### 2. Under js/views create a view for the widget

Example: exampleView.js

```
define([
    'jquery',
    'foundation.dropdown'
], function ($, foundation) {
    $(document).foundation();
        require([ './widgetView'], function(TimeView){
          new TimeView({});
    });
});
```