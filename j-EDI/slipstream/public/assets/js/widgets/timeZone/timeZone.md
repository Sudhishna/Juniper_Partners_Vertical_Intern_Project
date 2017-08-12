# TimeZone Widget

## Introduction
Slipstream's TimeZone widget provides an input UI widget for any workflow which want to show and interact various timezones. It contains a single HTML select box input, which displays following options (displayable timezones):
* UTC -11:00 Samoa Standard Time (America/Pago Pago) SST,
* UTC -10:00 Hawaii–Aleutian Time (America/Honolulu) HAST,
* UTC -9:00 Alaska Standard Time (America/Anchorage) AKST,
* UTC -8:00 Pacific Standard Time (America/Los Angeles) PST,
* UTC -7:00 Phoenix Time (America/Phoenix) PNT,
* UTC -7:00 Mountain Standard Time (America/Denver) MST,
* UTC -6:00 Central Standard Time (America/Chicago) CST,
* UTC -5:00 Eastern Standard Time (America/New York) EST,
* UTC -4:30 Venezuelan Standard Time (America/Caracas) VET,
* UTC -4:00 Atlantic Standard Time (America/La Paz) AST,
* UTC -3:30 Newfoundland Standard Time (America/St. John's) NST,
* UTC -3:00 Brasília Time (America/São Paulo) BRT,
* UTC -2:00 Fernando de Noronha Time (America/Recife) FNT,
* UTC -1:00 Cape Verde Time (Africa/Praia) CVT,
* UTC +/-0:00 Western European Time (Europe/London) WET,
* UTC +1:00 Central European Time (Europe/Berlin) CET,
* UTC +2:00 Central Africa Time (Africa/Cairo) CAT,
* UTC +3:00 East Africa Time (Africa/Nairobi) EAT,
* UTC +3:30 Iran Standard Time (Asia/Teheran) IRST,
* UTC +4:00 Moscow Standard Time (Europe/Moscow) MSK,
* UTC +4:30 AfghanistanTime (Asia/Kabul) AFT,
* UTC +5:00 Pakistan Standard Time (Asia/Islamabad) PKT,
* UTC +5:30 Indian Standard Time (Asia/Mumbai) IST,
* UTC +5:45 Nepal Time (Asia/Katmandu) NPT,
* UTC +6:00 Bangladesh Standard Time (Asia/Dhaka) BST,
* UTC +7:00 Indochina Time (Asia/Bangkok) ICT,
* UTC +8:00 China Standard Time (Asia/Hong Kong) HKT,
* UTC +9:00 Japan Standard Time (Asia/Tokyo) JST,
* UTC +9:30 Australian Central Standard Time (Australia/Adelaide) ACST,
* UTC +10:00 Australian Eastern Time (Australia/Canberra) AEST,
* UTC +11:00 Solomon Islands Time (Oceania/Honiara) SBT,
* UTC +12:00 New Zealand Standard Time (Oceania/Auckland) NZST


Above displayable text values for a timezone has 4 parts in it:
* a text value (timezone-offset-format), like __UTC -8:00__
* a text value (timezone-full-name), like __Pacific Standard Time__
* a text value (timezone-olson-format, in parenthesis), like __(America/Los Angeles)__
* a text value (timezone-abbreviation), like __PST__

This widget works with Olson timezone format (like: __America/Los_Angeles__, which uses known names of cities or regions with spaces in names replaced with underscores). 

## API

### Constructor
```javascript
// definition
var TimeZoneWidget = function(conf) {
  .....
}

// use
var timezoneWidget = new TimeZoneWidget({
  container: $("#time-zone-widget")[0],     // required
  selectedTimezone: 'America/Los_Angeles'   // optional value in Olson format
})
```
Creates a timezone widget object instance with specified __conf__ object specifying the required __container__ (DOM element) where the widget will render itself and an optional __selectedTimezone__ value (in Olson format) for default selected timezone. Note: when a selectedTimezone value is not specified, the widget auto-selects the timezone of the client machine.

### build
```javascript
// definition
function build() {
  .....
  return this;
}

// use
timeWidget.build();
```
Renders the time widget's UI elements in the specified container (DOM element).

### destroy
```javascript
// definition
function destroy() {
  .....
  return this;
}

// use
timeWidget.destroy();
```
Removes the rendered view from the specified container and unbinds events.

### getSelectedTimezoneText
```javascript
// definition
function getSelectedTimezoneText() {
  .....
  return selectedText;
}

// use
// for getting selected timezone displayable value string
var timezoneTextStr = timezoneWidget.getSelectedTimezoneText();
```
Returns the selected timezone displayable text value.

### getSelectedTimezone
```javascript
// definition
function getSelectedTimezone() {
  .....
  return selectedOlson;
}

// use
// for getting selected timezone Olson value string
var timezoneOlsonStr = timezoneWidget.getSelectedTimezone();
```
Returns the selected timezone Olson text value.

### setSelectedTimezone
```javascript
// definition
function setSelectedTimezone(olsonIn) {
  .....
}

// use
// for setting the timezone selection from specified Olson format timezone value
timezoneWidget.setSelectedTimezone('America/Los_Angeles');
```
Sets the timezone selection from the olson format timezone value.


### destroy
```javascript
// definition
function destroy() {
  .....
  return this;
}

// use
timezoneWidget.destroy();
```
Cleans up resources created by the timezone widget.


## Usage

### Programmatic Form (Form Widget)
The timeZone widget is integrated to the form widget. To include it, the configuration object of the Form Widget (elements parameter) should include an element_timeZoneWidget parameter like the following:

```
{
    "element_timeZoneWidget": true,
    "id": "timezone_widget",
    "label": "Timezone"
}
```

When the form widget is build, it will include the timeZone widget. The JS object for above timeZone widget is obtained using:
    
```
var timezoneWidget = formWidget.getInstantiatedWidgets()['timeZone_timezone_widget'];
```


### Declarative Form
To add a timezone widget in a container, do following:

```
var timezoneWidget = new TimeZoneWidget({
    container: $("#time-zone-widget")[0],     // required
    selectedTimezone: 'America/Los_Angeles'   // optional value in Olson
});
timezoneWidget.build();
```
