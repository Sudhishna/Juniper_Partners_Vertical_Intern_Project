# Schedule Recurrence Widget


## Introduction
The schedule recurrence widget is a reusable graphical user interface that allows users to schedule a job optionally with recurrence. 

## API
The schedule recurrence widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods and any data required by the widget is passed by its constructor.

###Configuration
The configuration object has the following variables:

```
{
	container: <define the container where the widget will be rendered>,
	isFormSection: <define whether the "container" is a section of a form>,
	title: <define the heading for the widget(optional)>,
	disableScheduleSection: <define whether to disable the schedule section of widget(optional, default: false)>,
	disableRecurrenceSection: <define whether to disable the recurrence section of widget(optional, default: false)>,
	values: <define the values to set in the schedule recurrence widget(optional)>,
	scheduleLabel: <define custom label for the schedule section of widget(optional, if not specified default label will displayed)>,
	scheduleTooltip: <define the tooltip content for the schedule section of widget(optional, if not specified default tooltip content will displayed)>,
	recurrenceRepeatUnits: <define the time units for the repeat options in the recurrence section of widget(optional, default:all) Repeat options can be any of ScheduleRecurrenceWidget.recurrence.repeatUnits.*>
}
```
where the ```values``` should be an object and can have the following parameters:

```
{
	scheduleStartTime: <define the Date object used to set schedule start date and time>
    recurrenceInfo: {
		repeatUnit : <define the repeat unit which has to be set. It can be any of ScheduleRecurrenceWidget.recurrence.repeatUnits.* >
		repeatValue : <define the repeat value to set>
		selectedDays : <define the days which has to be selected for weekly 'repeatUnit'.It should be an array of integers representing days (i.e) 1 for sunday, 2 for monday ... 7 for saturday)>
		endTime : <define the Date object used to set recurrence end date and time>
             }
}
```
If the schedule recurrence widget has to be placed inside a form (i.e The container provided in the configuration is a part of the form (form section) ) then the "isFormSection" configuration parameter should be "true". If "isFormSection" is set to "false" or not provided then the schedule recurrence widget will be constructed with a form and then appended to the given container. 

For example:

```
{
    var scheduleRecurrence = new ScheduleRecurrenceWidget({
		"container": this.$el,
		"title": "Heading of the widget",//optional
		"disableRecurrenceSection": true, // optional and default value is false
		"scheduleLabel": "Schedule Type", // optional custom label. Default is "Type"
		"scheduleTooltip": "ScheduleRecurrenceWidget schedule types", // optional
		"recurrenceRepeatUnits": [
				ScheduleRecurrenceWidget.recurrence.repeatUnit.MINUTES,
				ScheduleRecurrenceWidget.recurrence.repeatUnit.HOURS          
        ] // optional
	});
}
```

where the "disableRecurrenceSection" is an optional variables and default value for this variable is false. The "title" is optional and the heading will not be shown if "title" is not provided.

###Build
Adds the DOM elements and events of the schedule recurrence in the specified container. For example:

```
{
    scheduleRecurrence.build();
}
```

###Destroy
Clean up the specified container from the resources created by the schedule recurrence widget.

```
{
    scheduleRecurrence.destroy();
}
```

## Usage
### Adding the schedule recurrence widget to a form
To add a schedule recurrence widget to a form, follow these steps:
1. Instantiate the schedule recurrence widget by providing a configuration object with "container" as the section of a form(where the schedule recurrence widget will be rendered) and "isFormSection" as "true" and other attributes as mentioned in Configuration section.
2. Call the build method of the schedule recurrence widget.

Optionally, the destroy method can be called to clean up the resources created by the schedule recurrence widget.

```
{
    var scheduleRecurrence = new ScheduleRecurrenceWidget({
		"container": $formSection, //Should be a section of a form 
		"isFormSection": true,
		"title": "Heading of the widget",//optional,
		"scheduleLabel": "Schedule Type", // optional custom label. Default is "Type"		
		"scheduleTooltip": "ScheduleRecurrenceWidget schedule types" // optional
	});

    scheduleRecurrence.build();
}
```

### Adding the schedule recurrence widget to a container
To add a schedule recurrence widget to a container which is not a part of the form, follow these steps:
1. Instantiate the schedule recurrence widget by providing a configuration object with the container where the schedule recurrence widget will be rendered and other attributes as mentioned in Configuration section.
2. Call the build method of the schedule recurrence widget.

Optionally, the destroy method can be called to clean up the resources created by the schedule recurrence widget.

```
{
    var scheduleRecurrence = new ScheduleRecurrenceWidget({
		"container": this.$el,
		"title": "Heading of the widget",//optional
		"scheduleLabel": "Schedule Type", // optional custom label. Default is "Type"
		"scheduleTooltip": "ScheduleRecurrenceWidget schedule types" // optional
	});

    scheduleRecurrence.build();
}
```

## Methods

### getScheduleStartTime
Gets the date object containing the date and time when the schedule should start and it returns null if schedule section is not enabled or if the schedule type is "Run now" or if the inputs are invalid. For example:

```
   var schedulerStartTime = scheduleRecurrence.getScheduleStartTime();
```

### getScheduleRecurrenceInfo
Gets the object containing the recurrence information.It has 
repeatUnit, repeatValue, selectedDays array and endTime. The "selectedDays" is returned only if the "repeatUnit" is "Weeks" and if the recurrence end type is selected as "Never" then "endTime" will be returned as "null". 

It returns null if recurrence section is not enabled or if the inputs are invalid. For example:

```
     var scheduleRecurrenceInfo = scheduleRecurrence.getScheduleRecurrenceInfo();
	 var repeatUnit = scheduleRecurrenceInfo.repeatUnit; //ex: "Weeks"
	 var repeatvalue = scheduleRecurrenceInfo.repeatvalue; // ex: 2
	 var selectedDays = scheduleRecurrenceInfo.selectedDays; // ex: ["2", "3"] if monday and tuesday is selected.
	 var recurrenceEndTime = scheduleRecurrenceInfo.endTime;// Javascript Date object representing end time
```

The following scheduleRecurrenceInfo  
```
	{
		"repeatUnit" : "Weeks",
		"repeatvalue" : 2,
		"selectedDays" : ["1", "2"]
	}
```
means repeat every 2 weeks on sunday and monday.


### getScheduleInfoAsURLQuery
Gets the schedule(if enabled) and recurrence(if enabled) component informations as a URL query which can be appended with a REST URL.

Example : 

```
schedule-at= ( 10-03-2018 10:20:30 am )&schedule-recurrence= ( unit eq Weeks and repeat-interval eq 1 days eq ( 1 , 2 ) end-date eq ( 10-03-2018 10:20:30 pm ) )
```

Example usage : 
```
    var params = "..";
    params = params + "&" +scheduleRecurrence.getScheduleInfoAsURLQuery();
    var url = "/some/REST/URL";
    url = url + "?" +  params;
```


### setScheduleStartTime(startTime)
Sets the schedule start date and time from the input JavaScript Date Object.
If the input Date is null or undefined then the schedule start type is selected to be 'Run now' in UI.

Example usage : 
```
var today = new Date(); 
scheduleRecurrence.setScheduleStartTime(today);
```


### setScheduleRecurrenceInfo(recurrenceInfo)
Sets the recurrence values from the input 'recurrenceInfo' Object.
The input 'recurrenceInfo' object can have the following properties

```
repeatUnit : <define the repeat unit which has to be set. It can be "Minutes", "Hours", "Days", "Weeks", "Months", "Years">
repeatValue : <define the repeat value to set>
selectedDays : <define the days which has to be selected for weekly 'repeatUnit'.It should be an array of integers representing days (i.e) 1 for sunday, 2 for monday ... 7 for saturday)>
endTime : <define the Date object used to set recurrence end date and time>
```

If the 'recurrenceInfo' is null or undefined then the recurrence section will be collapsed

Example usage : 
```
var recurrenceInfo = {
    "repeatUnit":"Weeks", // It can be any of ScheduleRecurrenceWidget.recurrence.repeatUnits.*
    "repeatValue":"2",
    "selectedDays":[2, 3],
    "endTime":new Date()
}; 
scheduleRecurrence.setScheduleRecurrenceInfo(recurrenceInfo);
```


### isValid
Returns boolean value representing whether the input provided in the widget is valid or not.
If the schedule recurrence widget is not added to an existing form section( i.e ```isFormSection``` = false ) then this method can be used to find if the input provided in the widget is valid or not.
If the schedule recurrence widget is added to an existing form then invoking this method would invoke existing form's ```isValidInput``` method


```
    if (scheduleRecurrence.isValid()) {
    	...
    }
    else {
    	return;
    }
```
