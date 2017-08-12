# DropDown Widget


## Introduction
The DropDown widget is a reusable graphical user interface that allows users to show a searchable dropdown with simple or multiple selection dropdown in the selected container.

## API
The DropDown widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods. Any data required by the widget is passed by its constructor.


### Configuration
The configuration object has the following parameters:

```
{
	container: <DOM object that defines where the widget will be rendered>,
	data: <JSON object that defines the elements that will be showed in the drop down (select elements)>,
    matcher: <javascript function that defines a specific filter functionality>,
    placeholder: <string that defines a short hint for the user>,
    multipleSelection: <object that defines the configuration for multi-value select boxes>,
    showCheckboxes: <boolean, true allows to show a checkbox next to the dropdown option>
    initValue: <The initial value of the dropdown>
    onChange: <function called when the value of the dropdown is changed>,
    enableSearch: <true if search should be enabled for the values in the dropdown, false otherwise>,
    remoteData: <JSON object that is used to initiate lazy loading of remote data>
    templateResult: optional, function should return a string containing the text to be displayed, or an object that contains the data that should be displayed.
    templateSelection: optional, function should return a string containing the text to be displayed as selection.
    allowClearSelection: optional. allows to remove all elements from the list of selected options when it is set to true. <true if clear button should be visible, false otherwise> Defaults value is false. placeholder  configuration option should be set when setting allowClearSelection to true.
}
```

The container that will have a DropDown widget should be a select tag. For example:

```
<select class="basic-selection-nodata">
    <option value="one">First</option>
    <option value="two" disabled="disabled">Second (disabled)</option>
    <option value="three" selected="selected">Third</option>
</select>
```

A DropDown widget with default values should be instantiated with:

```
var dropDown = new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
});
```

A DropDown widget with user defined values could be instantiated with:

```
var dropDown = new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
    "data": application,
    "matcher": newMatcher
}).build();
```

where the "data" should be a JSON object defined in a set of key/value pairs. For example:

```
var application = [{
  "id": "tftp",
  "text": "junos-tftp",
  "disabled": true
},
{
  "id": "rtsp",
  "text": "junos-rtsp"
},
{
  "id": "netbios",
  "text": "junos-netbios-session"
},
{
  "id": "smb",
  "text": "junos-smb-session",
  "selected": true
}]
```

### Container
The container parameter represents the DOM element that will have the drop down widget.

### Data
The data parameter represents the select elements that the drop down will be showing. It could be composed by:

- only html tags; for example:

```
<select class="basic-selection-nodata">
    <option value="one">First</option>
    <option value="two" disabled="disabled">Second (disabled)</option>
    <option value="three" selected="selected">Third</option>
</select>
```

and a widget configuration like:

```
var dropDown = new DropDownWidget({
    "container": this.$el.find('.basic-selection-nodata')
}).build();
```

will produce a widget with select elements coming only from the html select definition.


- only data from a JSON object (data parameter); for example:

```
<select class="basic-selection-data"></select>
```

and a widget configuration like:

```
var dropDown = new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
    "data": application
}).build();
```

will produce a widget with only select elements coming from the data parameter (application object).

- html tags and widget data configuration; for example:

```
<select class="basic-selection-data">
    <option value="one">First</option>
    <option value="two" disabled="disabled">Second (disabled)</option>
    <option value="three" selected="selected">Third</option>
</select>
```

and a widget configuration like:

```
var dropDown = new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
    "data": application
}).build();
```

will produce a drop down widget with select elements coming from the data parameter (application object) and the html declaration (option tags).

Data parameter can also define some attributes of the option tag like the disabled and selected. For example:

```
[ ...
    {
        "id": "tftp",
        "text": "junos-tftp",
        "disabled": true
    },
    {
        "id": "rtsp",
        "text": "junos-rtsp"
    },
    {
        "id": "smb",
        "text": "junos-smb-session",
        "selected": true
    },
...]
```
### Initializing the value of the dropdown
The initial value of the dropdown can be set by specifiying the *initValue* property in the configuration object.  This property is an object with the following attributes:

**id**
The identifier associated with the value to be set

**text**
The text value to be set

For example:

```
var someInitialValue = {
    id: 10,
    text: 'California'
};

var dropDown = new DropDownWidget({
   ...
   initValue: someInitialValue
});
```

### Matcher
This parameter allows a javascript function to overwrite the default widget match implementation. It can be used when the match criteria should be only the options starting with the filter word or be case sensitive, etcetera. For example the following matcher function:

```
var newMatcher = function (params, data) {
    // if there are no search terms, return all of the data
    if ($.trim(params.term) === '') {
        return data;
    }
    // params.term should be the term that is used for searching and data.text is the text that is displayed for the data object
    if (data.text.indexOf(params.term) > -1) {
        var modifiedData = $.extend({}, data, true);
        modifiedData.text += ' (matched)'; //return search with modified object
        return modifiedData;
    }
    // return 'null' if the term should not be displayed
    return null;
}
```

adds the word 'matched' at the end of each result when the function is added in the configuration of the Drop Down widget, like in the following:

```
new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
    "matcher": newMatcher
}).build();
```

### Multiple Selection
The multipleSelection parameter defines an object that allows to add multiple selection to a simple dropdown. It has the following parameters:
- maximumSelectionLength: restricts the maximum number of options selected
- createTags: allows user to create new entries to the list of available options.
- allowClearSelection: allows to remove all elements from the list of selected options when it is set to true (Will be depracated in future releases and moved up to dropdown config. See allowClearSelection under dropdown config options)

For example:

```
var dropDown = new DropDownWidget({
    "container": this.containers.multipleDefault,
    "data": application,
    "multipleSelection": {
        maximumSelectionLength: 3,
        createTags: true,
        allowClearSelection: true
    },
    "placeholder": "Select an option"
});
```

### Lazy loading / Infinite scrolling
The parameter defines an object that allows to add the lazy loading of the records. This option is advisable with huge data set.
- remoteData: required, if virtual scroll is to be used.if used it will ignore the 'data' parameter used for static listing of values in drop down. It is composed by following under mentioned configuration parameters.
 - headers: an object of additional header key/value pairs to send along with requests.
 - url: required, a string containing the URL to which the request is sent.
 - delay: optional, the number of milliseconds to wait for the user to stop typing before issuing the ajax request. Default value is 250.
 - dataType: optional, the type of data that is expected back from the server. Default value is json.
 - numberOfRows: required, defines the number of rows that will be requested from the API to show the next set of rows for virtual scrolling (pagination).
 - jsonRoot: required, defines where the data begins in the JSON response.
 - jsonRecords: required, defines a function that returns the total number of records for API response.
 - success: optional, a function to be called if the request succeeds. This indicates the server request was successful & can be used to parse the data.
 - error: optional, a function to be called if the request fails. This indicates the error in API response & can be used to handle error conditions related to data manipulation.

For example:

```
var dropDown = new DropDownWidget({
    "container": this.containers.SimpleDataInfiniteScroll,
    "enableSearch": true,
    "remoteData": {
           headers: {
               "accept" : "application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01",
               "Content-Type": "application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01"
           },
           "url": "/api/juniper/sd/address-management/addresses?sortby=(name(ascending))",
           "numberOfRows": 10,
           "jsonRoot": "addresses.address",
           "jsonRecords": function(data) {
               return data['addresses']['total']
           },
           "success": function(data){console.log("call succeeded")},
           "error": function(){console.log("error while fetching data")}
       },
     "templateResult": formatRemoteResult,
     "templateSelection": formatRemoteResultSelection
});

var formatRemoteResult =  function (data) {
    if (data.loading) return data.text;
    var markup = data.name;
    return markup;
},

var formatRemoteResultSelection =  function (data) {
   return data.name;
},
```

### build
Adds the dom elements and events of the DropDown widget in the specified container. For example:

```
dropDown.build();
```

### destroy
Clean up the specified container from the resources created by the DropDown widget.

```
dropDown.destroy();
```

### setValue
Set the value of the dropdown

```
dropDown.setValue(value);
```

value can either be an Object or a String, depending on the type of the dropdown.
  - For remote data dropdown - value must be an object of the format {"id": <id of the dropdown>, "text": <text to be displayed in the dropdown>}
  - For local data dropdown - 
        When String value is passed, it must be the id of the dropdown option and the parameter is used as is.
        When Object is passed, value.id is used and value.text is ignored

*  For remoteData, setValue can be used to change the displayed value to ANY value by passing the params {id: < >, text: < >}. 
*  ****** Care should be taken to pass the same value to the remote data source
*  ****** If setValue() is used for setting the initial value of a remote dropdown, the text and id must match a value from the expected remote data.
*  For local data, setValue can be used to change the displayed value to a value that exists in conf.data. The method CANNOT be used to set the display to a value that is not in conf.data. 


For example;

```
var dropDown = new DropDownWidget({...});
// For local data - String Input
dropDown.setValue("California");

// For local data - object Input ()
dropDown.setValue({
      "id": "12345",
      "text": "California"
  });

// For remote data - string input
dropDown.setValue({
      "id": "12345",
      "text": "California"
  });

```

### getValue
Get the value of the dropdown

```
var value = dropDown.getValue();
```

For example:

```
var dropDown = new DropDownWiddget({...});
...
var value = dropDown.getValue();
console.log("dropdown value=", value);

> California
```

### addData
Append or reset data in the dropdown based on the resetData parameter:
resetData = true  will replace the dropdown list with new list
resetData = false will append the new list to existing list

 *** Not for use with remoteData since addData extends conf.data which is ignored in cases of conf.remoteData ***

```
var value = dropDown.addData(dataArray, resetData);
```

For example:

```
var dropDown = new DropDownWiddget({...});
dropDown.addData(application, true);
```

## Usage
To include the DropDown widget, a select element should be defined. For example:

```
<select class="basic-selection-data"></select>
```

The Javascript code that will be used to render a drop down for the HTML markup above with simple selection could be:

```
new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
    "data": application,
}).build();
```


The Javascript code that will be used to render a drop down for the HTML markup above with multiple selection could be:

```
new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
    "data": application,
    "multipleSelection": {
        maximumSelectionLength: 3,
        createTags: true,
        allowClearSelection: true
    }
}).build();
```

