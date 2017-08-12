/**
 * Bar Chart Widget
 *
 * @module BarChart
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'jquery',
    'highcharts',
    'highchartsmore',
    'text!widgets/barChart/templates/barChart.html',
    'text!widgets/barChart/templates/barLabel.html',
    'lib/template_renderer/template_renderer'

], /** @lends BarChart */ function ($, highcharts, highchartsmore, BarChartTemplate, LabelTemplate, render_template) {

    /**
     * BarChartWidget constructor
     *
     * @constructor
     * @class BarChartWidget
     *
     * @param {Object} conf - Bar Chart's configuration object
     * container - id of the bar chart div
     * options - object containing chart options
     *
     * where options can contain one or more of the following:
     * type - chart type (bar or column, default is bar)
     * title - chart title
     * xAxisTitle - xAxis title
     * yAxisTitle - yAxis title
     * yAxisThreshold - array of threshold values used to draw vertical plot lines common to all bars
     * yAxisLabelFormat - string appended to the yAxisLabel
     * categories - array of names used for the bars
     * tooltip - tooltips displayed on hover for each bar
     * color - used when all bars need to display the same color
     * data - array of data points for the series
     *     data can be given in following ways:
     *     1. An array of numerical values.
     *        In this case, the numerical values will be interpreted as y values,
     *        and x values will be automatically calculated.
     *        Eg. data: [0, 5, 3, 5]
     *
     *     2. An array of arrays with two values.
     *        In this case, the first value is the x value
     *        and the second is the y value.
     *        Eg. data: [[5, 2], [6, 3], [8, 2]]
     *
     *     3. An array of objects with named values.
     *        Eg. data: [{ y: 10, color: '#00FF00' },
     *                   { y: 20, color: '#FF00FF' }]
     *
     *     4. An array of objects with named values with threshold values & threshold colors.
     *        Eg. data: [{ y: 50, threshold: {values: [25], colors: ['#78bb4c', '#f58b39']}},
                         { y: 70, threshold: {values: [20, 45], colors: ['#78bb4c', '#f58b39', '#ec1c24']}}]
     *
     * @return {Object} instance of bar chart object
     */

    var BarChartWidget = function (conf) {

        var $chartContainer = $(conf.container);
        var chartDefaultColor = "#6398CF";
        var maxNumberOfThresholdValues = 0;
        var spaceFillDefaultColor = "#EEEEEE";
        var thresholdDefaultColor = "#000000";
        var thresholdLowValue = 0;
        var thresholdHighValue = 100;
        var barWidth = 16;
        var minBarWidth = 10;
        var maxBarWidth = 20;
        var chartDefaultWidth = 380;
        var chartDefaultHeight = 223;
        var lineColor = "#CCCCCC";
        var chart = conf.options;
        var chartType = chart.type;
        var chartStacking = false;
        var labelStyle = {
            fontFamily: 'Arial',
            fontWeight: 'normal',
            color: '#666666'
        };
        var titleStyle = {
            fontFamily: 'Helvetica Neue',
            //fontWeight: '100',
            fontSize: '16px',
            color: '#666666'
        };

        var yAxisPlotLines = [];
        if (chart.yAxisThreshold && (chartType == 'bar')) {
            for (i = 0; i < chart.yAxisThreshold.length; i++) {
                yAxisPlotLines.push({color: lineColor, width: 3, zIndex: 5, value: chart.yAxisThreshold[i]});
            }
        }

        var tickInterval = null;
        var yAxisMax = undefined;
        if(chart.type === 'stacked-bar') {
            var yValues = _.pluck(chart.data, 'y');
            var nBars = yValues.length;

            tickInterval = 1;
            yAxisMax = 1;
            for (var ii = 0; ii < nBars; ii++) {
                // if any of the y values are greater than 1
                var values = _.filter(yValues[ii], function(val){ return val > 0; });
                if (values.length > 0) {
                    tickInterval = null;
                    yAxisMax = undefined;
                    break;
                }
            }

        }
        /**
         * Build the bar chart
         *
         * @return {Object} this BarChartWidget object
         */
        this.build = function () {
            var truncateLabel = function () {
                var label = this.value,
                    maxLabelSize = chart.maxLabelSize;
                    formattedLabel = label.length > (maxLabelSize) ? label.substring(0, maxLabelSize) + '...' : label;

                var formattedDiv = render_template(LabelTemplate, { label: label,
                                                                    formattedLabel: formattedLabel });
                return formattedDiv;
            };

            this.$chartElement = $(render_template(BarChartTemplate));

            // Default blue color for bar charts
            chart.color || (chart.color = chartDefaultColor);
            chart.title || (chart.title = '');
            chart.yAxisLabelFormat || (chart.yAxisLabelFormat = '');
            chart.data || (chart.data = []);

            // Set default chart width and height to fit inside a dashlet
            // This can be overridden by setting the div width and height
            var chartWidth = ($chartContainer.width() > 0) ? $chartContainer.width() : chartDefaultWidth;
            var chartHeight = ($chartContainer.height() > 0) ? $chartContainer.height() : chartDefaultHeight;

            // Override the chartWidth and chartHeight, if plugin manually configures it
            if (chart.width) {
                chartWidth = chart.width;
            }
            if (chart.height) {
                chartHeight = chart.height;
            }

            switch (chart.type) {
                case 'column':
                    chartType = 'column';
                    break;
                case 'stacked-bar':
                    chartType = 'bar';
                    chartStacking = true;
                    break;
                case 'bar':
                default:
                    chartType = 'bar';
            }

            if(chart.yAxisLabelFormat == '%') {
                yAxisMax = 100;
                // tickInterval = 10;
            }

            this.$chartElement.highcharts({
                // Set the chart type
                chart: {
                    type: chartType,
                    marginRight: 25,
                    width: chartWidth,
                    height: chartHeight
                },
                // Set chart title
                title: {
                    text: chart.title,
                    style: titleStyle
                },
                // xAxis options
                xAxis: {
                    // array of names used for the bars
                    categories: chart.categories,
                    title: {
                        text: chart.xAxisTitle
                    },
                    // Options for labels
                    labels: {
                        style: labelStyle,
                        overflow: 'justify',
                        formatter: (chart.maxLabelSize) ? truncateLabel : undefined,
                        useHTML: true
                    }
                },
                // yAxis options
                yAxis: {
                    min: 0,
                    max: yAxisMax,
                    // gridLineColor, tickInterval are used to display
                    // lines at an interval of 10
                    gridLineColor: lineColor,
                    tickInterval: tickInterval,
                    lineWidth: 1,
                    lineColor: lineColor,
                    title: {
                        text: chart.yAxisTitle
                    },
                    // To display a common vertical line for all bars at each threshold
                    plotLines: yAxisPlotLines,
                    // Options for labels
                    labels: {
                        // Setting the step to 2 shows every other label on bar chart
                        // Setting the step to undefined allows highCharts to choose the best option
                        step: (chartType =='bar') ? 2 : undefined,
                        style: labelStyle,
                        // Callback JavaScript function to format the label
                        formatter: (chart.yAxisLabelFormat) ? function () { return this.value + chart.yAxisLabelFormat; } : undefined,
                        overflow: 'justify'
                    }
                },
                // Options for the tooltip that appears when the user hovers over a bar
                tooltip: {
                    enabled: (chart.tooltip) ? true : false,
                    backgroundColor: null,
                    borderWidth: 0,
                    //shadow: false,
                    useHTML: true,
                    style: {
                        padding: 0,
                        fontSize: '11px'
                    },
                    // Callback function to format the text of the tooltip
                    formatter: function () {
                        var index = chart.categories.indexOf(this.x);
                        return chart.tooltip[index];
                    }
                },
                // The plotOptions is a wrapper object for charting objects for each series type
                plotOptions: {
                    series: {

                        stacking: (chartStacking) ? 'normal' : undefined,

                        //pointWidth: barWidth + 1,
                        events: {
                            legendItemClick: function() {
                                return false;
                            }
                        }
                    },

                    bar: {
                        // When a value on a bar is relatively small compared to other much larger values, minPlotLength ensures a visible bar is drawn instead of blank
                        minPointLength: 5,
                        dataLabels: {
                            enabled: false,
                        }
                    },

                    column: {
                        dataLabels: {
                            enabled: false
                        }
                    },

                    errorbar: {
                        dataLabels: {
                            enabled: false
                        }
                    }
                },
                legend: {
                    enabled: true,
                    reversed: (chartStacking) ? true : false,
                    layout: 'horizontal',
                    //y: 10,
                    padding: 0,
                    symbolHeight: 12,
                    symbolWidth: 12,
                    itemStyle: {
                        fontWeight: 'normal',
                        fontSize: '11px'
                    },
                    itemHoverStyle: {
                        cursor: 'default'
                    }
                },
                // Highchart by default puts a credits label on the chart - disable it
                credits: {
                    enabled: false
                },

                // create the series object based on individual threshold values (if present)
                series: createSeries(chart.data)

            }, function (chart) {
                /* Uncomment the following code to show labels at the end of the bars with individual thresholds
                 * This is no longer a UX requirement.
                 *

                // callback function to adjust the labels
                var adjustWidth = 40;
                var topPosition = chart.plotWidth - adjustWidth;

                if (chart.series.length && maxNumberOfThresholdValues && (chartType == 'bar')) {
                    // Show datalabels at the end of chart for each bar
                    $.each(chart.series[0].data, function (i, data) {
                        data.dataLabel.attr({
                            x: topPosition
                        });
                    });
                }
                */

                // If the bar width selected by Highcharts is too small or large, adjust the width.
                if (chart.series) {
                    for (ii = 0; ii < chart.series.length; ii++) {
                        var series = chart.series[ii];

                        if (series != null && series.data != null && series.data.length) {
                            if (series.data[0].series.barW < minBarWidth) {
                                chart.series[ii].update({
                                    pointWidth: minBarWidth
                                });
                            } else {
                                if (series.data[0].series.barW > maxBarWidth) {
                                        chart.series[ii].update({
                                        pointWidth: maxBarWidth
                                    });
                                }
                            }
                        }
                    }

                    // Adjust label style for stacked chart with more than 8 entries
                    if (chartStacking) {
                        for (ii = 0; ii < chart.series.length; ii++) {
                            var series = chart.series[ii];
                            if (series != null && series.data != null && series.data.length) {
                                if (series.data.length > 8) {
                                    chart.xAxis[0].update({
                                        labels: {
                                            style: {
                                                fontSize: '10px'
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    }
                }

            });

            $chartContainer.empty().append(this.$chartElement);

            return this;
        };

        /**
         * Method to create the series containing the data points with different types of bars
         *
         * @return {Array} series containing all the bars for representation
         */
        var createSeries = function (dataObj) {

            // The actual series that append to the chart based on individual threshold values (if present)
            var series = [];

            // stacked bar chart
            if (chartStacking) {
                for (var dataIndex = 0; dataIndex < dataObj.length; dataIndex++) {
                    var stackedBar = {};
                    if (dataObj[dataIndex].name) {
                        stackedBar.name = dataObj[dataIndex].name;
                    }
                    if (dataObj[dataIndex].color) {
                        stackedBar.color = dataObj[dataIndex].color;
                    }
                    if (dataObj[dataIndex].y) {
                        stackedBar.data = dataObj[dataIndex].y;
                    }
                    series.push(stackedBar);
                }
                return series;
            }

            if (dataObj.length) {

                // find the maximum number of threshold values among all data points
                for (var dataIndex = 0; dataIndex < dataObj.length; dataIndex++) {
                    if (dataObj[dataIndex].threshold && dataObj[dataIndex].threshold.values && dataObj[dataIndex].threshold.values.length > maxNumberOfThresholdValues) {
                        maxNumberOfThresholdValues = dataObj[dataIndex].threshold.values.length;
                    }
                }

                // create actual data bar
                var dataBar = {
                    showInLegend: false,
                    name: '',
                    color: chart.color,
                    id: 'barChart',
                    // An array of data points for the series
                    data: getBarData(dataObj)
                };
                series.push(dataBar);

                if (maxNumberOfThresholdValues && (chartType == 'bar')) {
                 // create filler bar to the end of chart data, space is filled based on %
                    var spaceFillBar = {
                        color: spaceFillDefaultColor,
                        type: 'errorbar',
                        stemWidth: barWidth,
                        whiskerLength: 0,
                        whiskerWidth: 0,
                        linkedTo: 'barChart',
                        data: getSpaceFillData(dataObj)
                    };
                    series.push(spaceFillBar);

                    // loops through individual threshold in each data point
                    for (var thresholdValueIndex = 0; thresholdValueIndex < maxNumberOfThresholdValues; thresholdValueIndex++) {
                        var errorbarObj = {};
                        errorbarObj.color = thresholdDefaultColor;
                        errorbarObj.type = 'errorbar';
                        errorbarObj.stemWidth = barWidth;
                        errorbarObj.whiskerLength = 0;
                        errorbarObj.whiskerWidth = 0;
                        errorbarObj.linkedTo = 'barChart';
                        errorbarObj.data = getErrorbarData(thresholdValueIndex, dataObj);

                        series.push(errorbarObj);
                    }
                }
            }

            // Display legend at the bottom of the chart
            if (chart.legend) {
                for (var i = 0; i < chart.legend.length; i++) {
                    var legendObj = {};
                    legendObj.name = chart.legend[i].name;
                    legendObj.color = chart.legend[i].color;
                    series.push(legendObj);
                }
            }

            return series;
        };

        /**
         * Method to modify the color of each data point based on individual threshold colors (if present)
         *
         * @return {Object} barData containing data with updated colors (if required)
         */
        var getBarData = function (dataObj) {
            var barData = dataObj;

            if (maxNumberOfThresholdValues && (chartType == 'bar')) {
                for (var index in dataObj) {
                    // update data point color if threshold values exists
                    dataObj[index].color = getBarColorOnThreshold(index, dataObj);
                }
            }

            return barData;
        };

        /**
         * Method to get the right color from threshold colors based on data point values
         *
         * @return {String} thresholdcolor
         */
        var getBarColorOnThreshold = function (dataIndex, dataObj) {
            // create a temp threshold array adding the 0 at beginning & 100 at end, to complete the range of threshold
            var tempThresholdValues = [];
            $.extend(tempThresholdValues, dataObj[dataIndex].threshold.values);
            tempThresholdValues.unshift(thresholdLowValue);
            tempThresholdValues.push(thresholdHighValue);

            var barDataValue = dataObj[dataIndex].y;
            // loop on all threshold values of a data point & return relative threshold color
            for (var index = 0; index < tempThresholdValues.length - 1; index++) {
                var rangelowValue = tempThresholdValues[index];
                var rangeHighValue = tempThresholdValues[index + 1];
                if (barDataValue > rangelowValue && barDataValue <= rangeHighValue) {
                    return dataObj[dataIndex].threshold.colors[index];
                }
            }
        };

        /**
         * Method to create a data object that covers the bar area from end of actual bar to end of chart
         *
         * @return {Array} spaceFillData data with low and high value for bar type as 'errorbar'
         */
        var getSpaceFillData = function (dataObj) {
            var spaceFillData = [];
            var adjustWidth = 0.34;
            var endValue = 100;

            for (var index in dataObj) {
                var dataValue = [dataObj[index].y - adjustWidth, endValue];
                spaceFillData.push(dataValue);
            }

            return spaceFillData;
        };

        /**
         * Method to get data with low and high values for each bar type as 'errorbar'
         *
         * @return {Array} errorbarData containing low,high values for data
         */
        var getErrorbarData = function (thresholdValueIndex, dataObj) {
            var thresholdWidth = 0.3;  // regulates the width of each threshold line
            var adjutErrorbarWidth = [20, 25, 30, 35, 75, 80, 85, 90]; // contains value points where highchart have line width glitch
            var errorbarData = [];

            for (var index in dataObj) {
                var thresholdValue = dataObj[index].threshold.values[thresholdValueIndex];
                var errorbarDataValue = [];

                if (thresholdValue) {
                    if ($.inArray(thresholdValue, adjutErrorbarWidth) >= 0) {
                        // Highchart has a bug of not showing same width on different plot points. A hack to adjust to the same width across the plot points with the interval of 5.
                        errorbarDataValue = [thresholdValue - thresholdWidth - 0.1, thresholdValue + thresholdWidth];
                    } else {
                        errorbarDataValue = [thresholdValue - thresholdWidth, thresholdValue + thresholdWidth];
                    }
                }
                errorbarData.push(errorbarDataValue);
            }

            return errorbarData;
        };

        this.update = function (options) {

            function areArraysEqual(arr1, arr2) {
                var i = arr1.length;
                if (i != arr2.length) return false;
                while (i--) {
                    if (arr1[i] !== arr2[i]) return false;
                }
                return true;
            }

            var highChart = this.$chartElement.highcharts();
            if (highChart) {
                var series = highChart.series[0];
                if (areArraysEqual(chart.categories, options.categories)) {
                    var showData = createSeries(options.data);
                    for (var index = 0; index < showData.length; index++) {
                        highChart.series[index].setData(showData[index].data, false)
                    }
                    highChart.redraw();
                } else {
                    series.update(options);
                }
            }

        };

        /**
         * Remove bar chart
         *
         * @return {Object} this BarChartWidget object
         */
        this.destroy = function () {
            ($chartContainer).highcharts("destroy");
            return this;
        };
    };

    return BarChartWidget;
});
