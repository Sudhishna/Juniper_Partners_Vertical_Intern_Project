# Introduction
A time range widget is a graph to allow selection of time range for viewing a certain subset of the available data.

A time range widget in Slipstream can be implemented using the framework's time range widget.

# API
```
function TimeRangeWidget(conf) {…}
```

Used to create a new time range.
where conf is of the format:

```
{
    container: <reference to the DOM element where the time range widget needs to be rendered>,
    options: <object containing time range options>
}
```

options is of the format:


```
{
    data: <array of data points for the series>
    afterSetTimeRange: <callback function after the time range changed>
}
```

data can be specified in an array of objects:
* name: is a string value that represents the name of the data series
* point: is an array of arrays representing each point in the time range widget
* color: is the color to be used for the timeline.

```
     In the data value, each point's x value represents the epoch time-stamp (https://en.wikipedia.org/wiki/Unix_time), the y value represents the value you want to display.
     
     Note: Ensure your list is sorted in ascending order of x values (timestamp) in case you are setting a threshold, so excessive processing isn't done in the browser for the threhold line

     Eg. data: [{
                   name: 'AAPL',
                   color: '#ec1c24',
                   points: [[1147651200000,67.79],[1147737600000,64.98],[1147824000000,65.26],[1147910400000,63.18],[1147996800000,64.51],[1148256000000,63.38],[1148342400000,63.15],[1148428800000,63.34],[1148515200000,64.33],[1148601600000,63.55],[1148947200000,61.22],[1149033600000,59.77],[1149120000000,62.17],[1149206400000,61.66],[1149465600000,60],[1149552000000,59.72],[1149638400000,58.56],[1149724800000,60.76],[1149811200000,59.24],[1150070400000,57],[1150156800000,58.33],[1150243200000,57.61],[1150329600000,59.38],[1150416000000,57.56],[1150675200000,57.2],[1150761600000,57.47],[1150848000000,57.86],[1150934400000,59.58],[1151020800000,58.83],[1151280000000,58.99],[1151366400000,57.43],[1151452800000,56.02],[1151539200000,58.97],[1151625600000,57.27],[1151884800000,57.95],[1152057600000,57],[1152144000000,55.77],[1152230400000,55.4],[1152489600000,55],[1152576000000,55.65]]
                }]
```

```
function build() {…}
```

Used to render the time range widget.

```
function destroy() {…}
```

Used to destroy the time range widget and clean up resources.


```
function addSeries(options) {…}
```

Used to add data dynamically in the time range widget.

var options = [{
                 name: 'AAPL',
                 color: '#ec1c24',
                 points: [[1147651200000,67.79],[1147737600000,64.98],[1147824000000,65.26],[1147910400000,63.18],[1147996800000,64.51],[1148256000000,63.38],[1148342400000,63.15],[1148428800000,63.34],[1148515200000,64.33],[1148601600000,63.55],[1148947200000,61.22],[1149033600000,59.77],[1149120000000,62.17],[1149206400000,61.66],[1149465600000,60],[1149552000000,59.72],[1149638400000,58.56],[1149724800000,60.76],[1149811200000,59.24],[1150070400000,57],[1150156800000,58.33],[1150243200000,57.61],[1150329600000,59.38],[1150416000000,57.56],[1150675200000,57.2],[1150761600000,57.47],[1150848000000,57.86],[1150934400000,59.58],[1151020800000,58.83],[1151280000000,58.99],[1151366400000,57.43],[1151452800000,56.02],[1151539200000,58.97],[1151625600000,57.27],[1151884800000,57.95],[1152057600000,57],[1152144000000,55.77],[1152230400000,55.4],[1152489600000,55],[1152576000000,55.65]]
              }]

```
function removeSeries(name) {…}
```

Used to remove existing data series from the time range widget.

@param: name is a String which is the name of a data series, eg: 'AAPL'

```
function getTimeRange() {…}
```

Used to get current range in the time range widget.

@return {Object} contains the following info:
* dataMax: The maximum value of the axis' associated series.
* dataMin: The minimum value of the axis' associated series.
* max: The maximum axis value, either automatic or set manually. If the max option is not set and maxPadding is 0, this value will be the same as dataMax.
* min: The minimum axis value, either automatic or set manually. If the min option is not set and minPadding is 0, this value will be the same as dataMin.

```
function setTimeRange(min, max) {…}
```

Used to set range in the time range widget.



# Usage
Steps to add a time range widget:
1. Instantiate the time range widget and provide the configuration object
2. Call the build method

#### Example 1:

The following configuration object renders a time range widget with
- data with numerical values

```
var conf = {
                container: timeRangeElement,
                options: options
           };
```

```
var options = {
                data: [{
                   name: 'AAPL',
                   color: '#ec1c24',
                   points: [[1147651200000,67.79],[1147737600000,64.98],[1147824000000,65.26],[1147910400000,63.18],[1147996800000,64.51],[1148256000000,63.38],[1148342400000,63.15],[1148428800000,63.34],[1148515200000,64.33],[1148601600000,63.55],[1148947200000,61.22],[1149033600000,59.77],[1149120000000,62.17],[1149206400000,61.66],[1149465600000,60],[1149552000000,59.72],[1149638400000,58.56],[1149724800000,60.76],[1149811200000,59.24],[1150070400000,57],[1150156800000,58.33],[1150243200000,57.61],[1150329600000,59.38],[1150416000000,57.56],[1150675200000,57.2],[1150761600000,57.47],[1150848000000,57.86],[1150934400000,59.58],[1151020800000,58.83],[1151280000000,58.99],[1151366400000,57.43],[1151452800000,56.02],[1151539200000,58.97],[1151625600000,57.27],[1151884800000,57.95],[1152057600000,57],[1152144000000,55.77],[1152230400000,55.4],[1152489600000,55],[1152576000000,55.65]]
                }]
           };
```

# Event

#### afterSetTimeRange

After changing the time range, this event will get trigger
- define the callback function in the configuration

```
var afterSetTimeRangeFn = function(event, data){
        console.log(data);
    };
var conf = {
      container: el,
      options: { data: TestData.navigatorData.data,  
                 afterSetTimeRange: afterSetTimeRangeFn
    }

var timeRangeWidgetObj = new TimeRangeWidget(conf);
```
