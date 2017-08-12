# Introduction
The line chart is represented by a series of datapoints connected with a straight line. Line charts are most often used to visualize data that changes over time.

A line chart in Slipstream can be implemented using the framework's line chart widget.

# API
The line chart widget exposes 4 functions: a constructor, a build method that creates the chart, an update method that updates the chart and a destroy method that cleans up the resources set by itself.

```
function LineChartWidget(conf) {…}
```

Used to create a new line chart.
where conf is of the format:

```
{
    container: <reference to the DOM element where the chart needs to be rendered>,
    options: <object containing line chart options>
}
```

options is of the format:


```
{
    title: <chart title>
    xAxisTitle: <xAxis title>
    yAxisTitle: <yAxis title>
    maxLabelSize: <maximum number of characters, a label exceeding this size is truncated and full label is displayed only on hover>
    categories: <array of names used for the xAxis>
    colors: <array to specify custom colors and override default colors>
    legend: <legend box displaying name and color for items appearing on the chart>
        enabled: <boolean, setting to true displays legend on the chart>
        position: <string specifying the legend position 'right' or 'bottom'>
    markers: <marker symbols displayed for each data point appearing on the line>
        enabled: <boolean, setting to true displays markers on the lines>
        multiple: <boolean, setting to true displays multiple marker symbols on the lines instead of only circles>
    lines: <array of objects for each series>
        name: <name of the series>
        data: <array of data points for the series>
}
```


#### Chart Size

```
<div id="linechart-container" style="width:800px; height:300px;"></div>
```
As shown in the example above, the chart will inherit the size (width and height) specified in the container's div.


```
function build() {…}
```

Used to render the line chart.

```
function update(options) {…}
```

Used to update the chart with new options.

```
function destroy() {…}
```

Used to destroy the chart and clean up resources.

# Usage
Steps to add a line chart:
1. Instantiate the line chart widget and provide the configuration object
2. Call the build method

#### Example 1:

The following configuration object renders a line chart with
- chart title
- titles on both axes
- names of the months displayed on the x-axis (categories)
- legend label exceeding 10 characters is truncated
- lines with name and data array for each series
- since colors array is not specified, widget default colors array will be used
- since legend parameters are not specified, legend will be dispalyed on the right
- since markers parameters are not specified, markers will be hideen and displayed only on hover

```
var conf = {
                container: lineChartElement,
                options: options
           };
```

```
var options = {
                title: 'Sample Chart'
                xAxisTitle: 'Months',
                yAxisTitle: 'Count',
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                maxLabelSize: 10,
                lines: [{
                        name: 'Device 1',
                        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    }, {
                        name: 'Device 2',
                        data: [2.0, 5.0, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                    }, {
                        name: 'Device 3',
                        data: [5.9, 6.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 2.0]
                    }, {
                        name: 'Device 4',
                        data: [10, 20, 23, 12, 5, 4, 11, 16, 17, 15, 14, 5]
                    }, {
                        name: 'Long Device Name',
                        data: [7, 7, 7, 7, 17, 7, 7, 7, 14.3, 9.0, 3.9, 2.0]
                    }, {
                        name: 'Device 6',
                        data: [5,5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
                    }, {
                        name: 'Device 7',
                        data: [2, 3, 3.9, 3, 3, 3, 3, 3, 3, 3, 3, 3]
                    }, {
                        name: 'Device 8',
                        data: [12, 12, 14, 14, 14, 16, 16, 16, 16, 18, 18, 18]
                    }, {
                        name: 'Device 9',
                        data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
                    }, {
                        name: 'Device 10',
                        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }]
           };
```

#### Example 2:

The following configuration object renders a line chart with
- no chart title
- titles on y-axis only
- names of the months displayed on the x-axis
- 3 lines (names and data)
- custom colors 

```
var conf = {
                container: lineChartElement,
                options: options
           };
```

```
var options = {
                xAxisTitle: '',
                yAxisTitle: 'Alarm Count',
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                colors: ['#EC1C24', '#F58B39', '#ECEC20'],
                lines: [{
                    name: 'Critical',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'Major',
                    data: [2.0, 5.0, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }, {
                    name: 'Minor',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }]

```

#### Example 3:

The following configuration object renders a line chart with
- no chart title
- titles on y-axis only
- names of the months displayed on the x-axis
- default colors
- lines with markers and diffrent symbols (eg. circle, square, triangle) for each line

```
var conf = {
                container: lineChartElement,
                options: options
           };
```

```
var options = {
                xAxisTitle: '',
                yAxisTitle: 'Alarm Count',
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                markers: {
                    enabled: true,
                    multiple: true
                },
                lines: [{
                    name: 'Critical',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'Major',
                    data: [2.0, 5.0, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }, {
                    name: 'Minor',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }]

```

#### Example 4:

The following configuration object renders a line chart with
- no chart title
- titles on y-axis only
- names of the months displayed on the x-axis
- default colors
- legend positioned at the bottom

```
var conf = {
                container: lineChartElement,
                options: options
           };
```

```
var options = {
                xAxisTitle: '',
                yAxisTitle: 'Alarm Count',
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                legend: {
                    enabled: true,
                    position: 'bottom'
                },
                lines: [{
                    name: 'Critical',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'Major',
                    data: [2.0, 5.0, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }, {
                    name: 'Minor',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }]

```