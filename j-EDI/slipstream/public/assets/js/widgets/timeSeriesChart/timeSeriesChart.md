# Introduction
A time-series chart is a graph with multiple time lines shown in the main chart area and a focus area below to allow selection of time range for viewing a certain subset of the available data.

A time-series chart in Slipstream can be implemented using the framework's time-series chart widget.

# API
The time-series chart widget exposes 3 functions: a constructor, a build method that creates the chart and a destroy method that cleans up the resources set by itself.

```
function TimeSeriesChartWidget(conf) {…}
```

Used to create a new time-series chart.
where conf is of the format:

```
{
    container: <reference to the DOM element where the chart needs to be rendered>,
    options: <object containing time-series chart options>
}
```

options is of the format:


```
{
    title: <chart title>, // optional parameter to use for chart title. To be used when timeSeriesChart is used in a standalone page rather than a dashboard dashlet
    yAxisTitle: <yAxis title>, // optional
    yAxisThreshold: {   //optional
      value: <value for threshold>,
      color: <color to be used for threshold line>
    },
    timeRangeSelectorEnabled: <true/false> // optional parameter to display time range selector used to zoom in and out on parts of the data. enabled by default
    presetTimeRangesEnabled:  <true/false> // optional parameter to display preconfigured time ranges like year, month, week etc. disabled by default
    data: <array of data points for the series>
}
```

data can be specified in following ways:

```
  1. An array of objects, each object having a name key, color key and a points key.
     The name is a string value and points is an array of arrays representing
     each point on the chart.
     The optional color key is the color to be used for the timeline.
     In the data value, each point's x value represents the epoch 
     time-stamp (https://en.wikipedia.org/wiki/Unix_time), 
     the y value represents the value you want to display,
     marker.symbol is configured as 'url(<url_name>)' where <url_name> is a link 
     to the marker symbol you want to be used at that point. Ignore setting it
     if you want the default symbol set.
     
     Note: Ensure your list is sorted in ascending order of x values (timestamp)
           in case you are setting a threshold, so excessive processing isn't done
           in the browser for the threhold line

     Eg. data: [{
                   name: 'MSFT',
                   color: '#78bb4c',
                   points: [[1147651200000,23.15],{x: 1147737600000, y: 23.01, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}]},[1147824000000,22.73],[1147910400000,22.83],[1147996800000,22.56],[1148256000000,22.88],[1148342400000,22.79],[1148428800000,23.5],[1148515200000,23.74],[1148601600000,23.72],[1148947200000,23.15],[1149033600000,22.65],[1149120000000,22.82],[1149206400000,22.76],[1149465600000,22.5],[1149552000000,22.13],[1149638400000,22.04],[1149724800000,22.11],[1149811200000,21.92],[1150070400000,21.71],[1150156800000,21.51],[1150243200000,21.88],[1150329600000,22.07],[1150416000000,22.1],[1150675200000,22.55],[1150761600000,22.56],[1150848000000,23.08],[1150934400000,22.88],[1151020800000,22.5],[1151280000000,22.82],[1151366400000,22.86],[1151452800000,23.16],[1151539200000,23.47],[1151625600000,23.3],[1151884800000,23.7],[1152057600000,23.35],[1152144000000,23.48],[1152230400000,23.3],[1152489600000,23.5],[1152576000000,23.1]]
                },
                {
                   name: 'AAPL',
                   color: '#ec1c24',
                   points: [[1147651200000,67.79],[1147737600000,64.98],[1147824000000,65.26],[1147910400000,63.18],[1147996800000,64.51],[1148256000000,63.38],[1148342400000,63.15],[1148428800000,63.34],[1148515200000,64.33],[1148601600000,63.55],[1148947200000,61.22],[1149033600000,59.77],[1149120000000,62.17],[1149206400000,61.66],[1149465600000,60],[1149552000000,59.72],[1149638400000,58.56],[1149724800000,60.76],[1149811200000,59.24],[1150070400000,57],[1150156800000,58.33],[1150243200000,57.61],[1150329600000,59.38],[1150416000000,57.56],[1150675200000,57.2],[1150761600000,57.47],[1150848000000,57.86],[1150934400000,59.58],[1151020800000,58.83],[1151280000000,58.99],[1151366400000,57.43],[1151452800000,56.02],[1151539200000,58.97],[1151625600000,57.27],[1151884800000,57.95],[1152057600000,57],[1152144000000,55.77],[1152230400000,55.4],[1152489600000,55],[1152576000000,55.65]]
                }]
```

```
function build() {…}
```

Used to render the time-series chart.

```
function destroy() {…}
```

Used to destroy the chart and clean up resources.

# Usage
Steps to add a time-series chart:
1. Instantiate the time-series chart widget and provide the configuration object
2. Call the build method

#### Example 1:

The following configuration object renders a time-series chart with
- chart title
- threshold of 500, to be shown in red
- data with numerical values

```
var conf = {
                container: timeSeriesChartElement,
                options: options
           };
```

```
var options = {
                title: 'Stock price comparison'
                yAxisTitle: 'Price',
                yAxisThreshold: {
                    value: 500,
                    color: '#ff0000'
                },
                data: [{
                   name: 'MSFT',
                   color: '#78bb4c',
                   points: [[1147651200000,23.15],{x: 1147737600000, y: 23.01, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}]},[1147824000000,22.73],[1147910400000,22.83],[1147996800000,22.56],[1148256000000,22.88],[1148342400000,22.79],[1148428800000,23.5],[1148515200000,23.74],[1148601600000,23.72],[1148947200000,23.15],[1149033600000,22.65],[1149120000000,22.82],[1149206400000,22.76],[1149465600000,22.5],[1149552000000,22.13],[1149638400000,22.04],[1149724800000,22.11],[1149811200000,21.92],[1150070400000,21.71],[1150156800000,21.51],[1150243200000,21.88],[1150329600000,22.07],[1150416000000,22.1],[1150675200000,22.55],[1150761600000,22.56],[1150848000000,23.08],[1150934400000,22.88],[1151020800000,22.5],[1151280000000,22.82],[1151366400000,22.86],[1151452800000,23.16],[1151539200000,23.47],[1151625600000,23.3],[1151884800000,23.7],[1152057600000,23.35],[1152144000000,23.48],[1152230400000,23.3],[1152489600000,23.5],[1152576000000,23.1]]
                },
                {
                   name: 'AAPL',
                   color: '#ec1c24',
                   points: [[1147651200000,67.79],[1147737600000,64.98],[1147824000000,65.26],[1147910400000,63.18],[1147996800000,64.51],[1148256000000,63.38],[1148342400000,63.15],[1148428800000,63.34],[1148515200000,64.33],[1148601600000,63.55],[1148947200000,61.22],[1149033600000,59.77],[1149120000000,62.17],[1149206400000,61.66],[1149465600000,60],[1149552000000,59.72],[1149638400000,58.56],[1149724800000,60.76],[1149811200000,59.24],[1150070400000,57],[1150156800000,58.33],[1150243200000,57.61],[1150329600000,59.38],[1150416000000,57.56],[1150675200000,57.2],[1150761600000,57.47],[1150848000000,57.86],[1150934400000,59.58],[1151020800000,58.83],[1151280000000,58.99],[1151366400000,57.43],[1151452800000,56.02],[1151539200000,58.97],[1151625600000,57.27],[1151884800000,57.95],[1152057600000,57],[1152144000000,55.77],[1152230400000,55.4],[1152489600000,55],[1152576000000,55.65]]
                }]
           };
```
