# Introduction
A bar chart is a graph containing rectangular bars with lengths proportional to the values that they represent. The bars are plotted horizontally or vertically to show comparisons among categories. One axis of the chart shows the specific categories being compared, and the other axis represents discrete values.

A bar chart in Slipstream can be implemented using the framework's bar chart widget.

# API
The bar chart widget exposes 4 functions: a constructor, a build method that creates the chart, an update method that updates the chart and a destroy method that cleans up the resources set by itself.

```
function BarChartWidget(conf) {…}
```

Used to create a new bar chart.
where conf is of the format:

```
{
    container: <reference to the DOM element where the chart needs to be rendered>,
    options: <object containing bar chart options>
}
```

options is of the format:


```
{
    type: <chart type (bar or column), default is set to bar when type is not specified>
    width: <chart width, default is set to fit inside a 400px X 300px dashlet when width is not specified>
    height: <chart height, default is set to fit inside a 400px X 300px dashlet when height is not specified>
    title: <chart title>,
    xAxisTitle: <xAxis title>,
    yAxisTitle: <yAxis title>,
    yAxisThreshold: <array of threshold values used to draw vertical plot lines common to all bars, not supported on type:column charts>,
    yAxisLabelFormat: <string appended to the yAxis label>,
    maxLabelSize: <maximum number of characters, a label exceeding this size is truncated and full label is displayed only on hover>,
    categories: <array of names used for the bars>,
    tooltips: <tooltips displayed on hover for each bar>,
    color: <used when all bars need to display the same color>,
    legend: <legend box displaying name and color for items appearing on the chart>,
    data: <array of data points for the series>
}
```

data can be specified in following ways:

```
  1. An array of numerical values.
     In this case, the numerical values will be interpreted as y values,
     and x values will be automatically calculated.
     Eg. data: [0, 1, 2]

  2. An array of arrays with two values.
     In this case, the first value is the x value
     and the second is the y value.
     Eg. data: [[5, 0], [5, 1], [5, 2]]

  3. An array of objects with named values.
     Eg. data: [{ y: 10, color: '#00FF00' },
                { y: 20, color: '#FF00FF' }]
                
  4. An array of objects with named values, threshold values and threshold colors.
     (Not supported on type:column charts)
     Eg. data: [{ y: 50, threshold: {values: [25], colors: ['#78bb4c', '#f58b39']}},
                { y: 70, threshold: {values: [20, 45], colors: ['#78bb4c', '#f58b39', '#ec1c24']}}]

  5. An array of objects with name, color and an array of y values for stacked bar chart.
      Eg. data: [{ name: 'Major', color: '#ec1c24', y: [40, 35, 25, 20, 10] },
                 { name: 'Minor', color: '#fbae17', y: [30, 25, 20, 20, 25] }]
```

The following types of bar charts are supported:

```
1. Bar: default horizontal chart

2. Column: vertical chart

3. Stacked Bar: horizontal chart with data stacked for each category.

#### Bar chart supports the following configuration formats:
- data array of values
- data array of objects with multiple colors
- data array of objects with threshold values and threshold colors
- vertical plot lines at various thresholds
- legend box displayed at the bottom

#### Column chart supports the following configuration formats:
- data array of values
- data array of objects with multiple colors
- legend box displayed at the bottom

#### Stacked Bar chart supports the following configuration formats:
- data array of objects with name, color and an array of y values
- legend box is automatically added based on the 'name' and 'color' specified for each the data object

###### Note: Vertical plotlines and individual threshold values/colors are not supported on the column or stacked-bar charts. These options are available only on the horizontal bar chart.

```

#### Chart Size

```
<div id="barchart-test" style="width:600px; height:400px;"></div>
```
As shown in the example above, the chart will inherit the size (width and height) specified in the container's div.


```
function build() {…}
```

Used to render the bar chart.

```
function update(options) {…}
```

Used to update the chart with new options.

```
function destroy() {…}
```

Used to destroy the chart and clean up resources.

# Usage
Steps to add a bar chart:
1. Instantiate the bar chart widget and provide the configuration object
2. Call the build method

#### Example 1:

The following configuration object renders a bar chart with
- chart title
- titles on both axes
- IP Addresses for each bar
- tooltips for each bar on hover
- data with numerical values
- since color is not specified, default color #6398CF will be used

```
var conf = {
                container: barChartElement,
                options: options
           };
```

```
var options = {
                title: 'Top 3 Source IP Addresses'
                xAxisTitle: 'Source IP Addresses',
                yAxisTitle: 'Count',
                categories: ['192.168.1.1', '192.168.1.2', '192.168.1.3'],
                tooltip: ['hostname-1', 'hostname-2', 'hostname-3'],
                data: [10, 20, 30]
           };
```

#### Example 2:

The following configuration object renders a column (vertical bar) chart with
- chart title
- titles on both axes
- IP Addresses for each bar
- tooltips for each bar on hover
- data with numerical values
- since color is not specified, default color #6398CF will be used

```
var conf = {
                container: barChartElement,
                options: options
           };
```

```
var options = {
                type: 'column',
                title: 'Top 3 Source IP Addresses',
                xAxisTitle: 'Source IP Addresses',
                yAxisTitle: 'Count',
                categories: ['192.168.1.1', '192.168.1.2', '192.168.1.3'],
                tooltip: ['hostname-1', 'hostname-2', 'hostname-3'],
                data: [10, 20, 30]
           };
```

#### Example 3:

The following configuration object renders a bar chart with
- no chart title
- no titles on both axes
- two vertical plot lines at thresholds 50 and 80
- % sign appended to the yAxis label
- category names for each bar
- tooltips are disabled
- data with an array of objects
- each bar with a different color, specified under data
- labels are truncated to 7 characters eg. category-1 is displayed as 'categor...' and full string is displayed on hover.

```
var conf = {
                container: barChartElement,
                options: options
           };
```

```
var options = {
                xAxisTitle: '',
                yAxisTitle: '',
                yAxisThreshold: [50, 80],
                yAxisLabelFormat: '%',
                categories: ['category-1', 'category-2', 'category-3'],
                maxLabelSize: 7,
                data: [{ y: 10, color: '#F58B39'},
                       { y: 20, color: '#78BB4C'},
                       { y: 30, color: '#EC1C24')}]
           };
```

#### Example 4:

##### Individual bar threshold values

The following configuration object renders a bar chart with individual threshold values for each bar
- no chart title
- no titles on both axes
- % sign appended to the yAxis label
- category names for each bar
- tooltips are disabled
- data with an array of objects including threshold values for individual bars.
- each bar will contain different threshold values and empty array for threshold values is used to refrain showing any threshold on bar.
- corresponding threshold colors for every threshold range are provided, default chart color applies if color is not defined for threshold range.


```
var conf = {
                container: barChartElement,
                options: options
           };
```

```
var options = {
                xAxisTitle: '',
                yAxisTitle: '',
                yAxisLabelFormat: '%',
                categories: ['Bar 1', 'Bar 2', 'Bar 3', 'Bar 4', 'Bar 5', 'Bar 6'],
                data: [
                        { y: 85, threshold: {values: [], colors: []}},
                        { y: 85, threshold: {values: [], colors: ['#78bb4c']}},
                        { y: 50, threshold: {values: [25], colors: ['#78bb4c', '#f58b39']}},
                        { y: 70, threshold: {values: [20, 45], colors: ['#78bb4c', '#f58b39', '#ec1c24']}},
                        { y: 80, threshold: {values: [25, 50, 60], colors: ['#78bb4c', '#f58b39', '#ec1c24', '#ec1c24']}},
                        { y: 10, threshold: {values: [30, 55], colors: ['#78bb4c', '#f58b39', '#ec1c24']}}
                      ]
           };
```

#### Example 5:

##### An optional legend box displayed at the bottom of the chart

The following configuration object renders a bar chart with
- titles on both axes
- category names for each bar
- legend with name and color for one or more items on the chart
- data with an array of objects
- each bar with a different color, specified under data

```
var conf = {
                container: barChartElement,
                options: options
           };
```

```
var options = {
                xAxisTitle: 'Titles',
                yAxisTitle: 'Number of Attacks',
                categories: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10'],
                legend: [{ name: 'Critical', color: '#EC1C24'},
                         { name: 'Major', color: '#F58b39'},
                         { name: 'Minor', color: '#ECEC20'},
                         { name: 'Warning', color: '#800080'},
                         { name: 'Info', color: '#0000FF'}],
                data: [{ y: 90, color: '#EC1C24'},
                       { y: 80, color: '#F58B39'},
                       { y: 75, color: '#ECEC20'},
                       { y: 73, color: '#800080'},
                       { y: 72, color: '#EC1C24'},
                       { y: 63, color: '#0000FF'},
                       { y: 39, color: '#ECEC20'},
                       { y: 32, color: '#800080'},
                       { y: 20, color: '#0000FF'},
                       { y: 10, color: '#EC1C24'}]
           };
```

### Example 6:

##### Stacked bar chart

The following configuration object renders a stacked bar chart with
- titles on both axes
- category names for each bar
- data with an array of objects (name, color and an array of y values)
- the y values represent information for all the categories
- each bar with a different color, based on the data 'name' and 'color'
- tooltips on each bar
- legend box automatically added based on the 'name' and 'color' specified for each the data object

```
var conf = {
                container: barChartElement,
                options: options
           };
```

```
var tooltipArr = [ 'Device: 192.168.1.1' + '<br>' + 'Minor: 30' + '<br>' + 'Major: 40',
                   'Device: 192.168.1.2' + '<br>' + 'Minor: 25' + '<br>' + 'Major: 35',
                   'Device: 192.168.1.3' + '<br>' + 'Minor: 20' + '<br>' + 'Major: 25',
                   'Device: 192.168.1.4' + '<br>' + 'Minor: 20' + '<br>' + 'Major: 20',
                   'Device: 192.168.1.5' + '<br>' + 'Minor: 25' + '<br>' + 'Major: 10'
                  ];
var options = {
                type: 'stacked-bar',
                xAxisTitle: 'Devices',
                yAxisTitle: 'Alarm Count',
                categories: ['192.168.1.1', '192.168.1.2', '192.168.1.3', '192.168.1.4', '192.168.1.5'],
                tooltip: tooltipArr,
                data: [{ name: 'Major', color: '#ec1c24', y: [40, 35, 25, 20, 10] },
                       { name: 'Minor', color: '#fbae17', y: [30, 25, 20, 20, 25] }]
              };
```