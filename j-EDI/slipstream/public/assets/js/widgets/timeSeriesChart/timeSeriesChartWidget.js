/**
 * TimeSeries Chart Widget
 *
 * @module TimeSeriesChart
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'jquery',
    'highcharts',
    'text!widgets/timeSeriesChart/templates/timeSeriesChart.html',
    'lib/template_renderer/template_renderer',
    'widgets/tooltip/tooltipWidget',
    'text!widgets/timeSeriesChart/templates/timeSeriesChartTooltip.html',
    'text!widgets/timeSeriesChart/templates/timeSeriesLegendLabel.html',
    'lib/i18n/i18n'

], /** @lends TimeSeriesChart */ function ($, highcharts, TimeSeriesChartTemplate, render_template, TooltipWidget, timeSeriesChartTooltipTemplate, LegendLabelTemplate, i18n) {

    /**
     * TimeSeriesChartWidget constructor
     *
     * @constructor
     * @class TimeSeriesChartWidget
     *
     * @param {Object} conf - TimeSeries Chart's configuration object
     * container - id of the timeSeries chart div
     * options - object containing chart options
     *
     * where options can contain one or more of the following:
     * title (optional) - chart title
     * timeRangeSelectorEnabled (optional) - whether to display the time range selector for custom zoom
     * presetTimeRangesEnabled  (optional) - whether to display preconfigured time ranges like year, month, week etc.
     * yAxisTitle (optional) - yAxis title
     * yAxisThreshold (optional) - an object with value and color
     *      Eg. yAxisThreshold: {
     *                              value: 80,
     *                              color" '#ff0000'
     *                          }
     * data - array of data points for the lines that need to be shown in this chart
     *     data can be given in following ways:
     *     1. An array of objects, each object having a name key, color key and a points key.
     *        The name is a string value and points is an array of arrays representing each point on the chart.
     *        The color is the color to be used for the timeline.
     *        In the data value, each point's x value represents the epoch 
     *        time-stamp (https://en.wikipedia.org/wiki/Unix_time), 
     *        the y value represents the value you want to display,
     *        marker.symbol is configured as 'url(<url_name>)' where <url_name> is a link 
     *        to the marker symbol you want to be used at that point. Ignore setting it
     *        if you want the default symbol set.
     *        
     *        Note: ensure your list is sorted in ascending order of x values (timestamp)
     *              in case you are setting a threshold, so excessive processing isn't done
     *              in the browser for the threhold line
     * 
     *        Eg. data: [{
     *                      name: 'MSFT',
     *                      color: '#78bb4c',
     *                      points: [[1147651200000,23.15],{x: 1147737600000, y: 23.01, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}]},[1147824000000,22.73],[1147910400000,22.83],[1147996800000,22.56],[1148256000000,22.88],[1148342400000,22.79],[1148428800000,23.5],[1148515200000,23.74],[1148601600000,23.72],[1148947200000,23.15],[1149033600000,22.65],[1149120000000,22.82],[1149206400000,22.76],[1149465600000,22.5],[1149552000000,22.13],[1149638400000,22.04],[1149724800000,22.11],[1149811200000,21.92],[1150070400000,21.71],[1150156800000,21.51],[1150243200000,21.88],[1150329600000,22.07],[1150416000000,22.1],[1150675200000,22.55],[1150761600000,22.56],[1150848000000,23.08],[1150934400000,22.88],[1151020800000,22.5],[1151280000000,22.82],[1151366400000,22.86],[1151452800000,23.16],[1151539200000,23.47],[1151625600000,23.3],[1151884800000,23.7],[1152057600000,23.35],[1152144000000,23.48],[1152230400000,23.3],[1152489600000,23.5],[1152576000000,23.1]]
     *                   },
     *                   {
     *                      name: 'AAPL',
     *                      color: '#ec1c24',
     *                      points: [[1147651200000,67.79],[1147737600000,64.98],[1147824000000,65.26],[1147910400000,63.18],[1147996800000,64.51],[1148256000000,63.38],[1148342400000,63.15],[1148428800000,63.34],[1148515200000,64.33],[1148601600000,63.55],[1148947200000,61.22],[1149033600000,59.77],[1149120000000,62.17],[1149206400000,61.66],[1149465600000,60],[1149552000000,59.72],[1149638400000,58.56],[1149724800000,60.76],[1149811200000,59.24],[1150070400000,57],[1150156800000,58.33],[1150243200000,57.61],[1150329600000,59.38],[1150416000000,57.56],[1150675200000,57.2],[1150761600000,57.47],[1150848000000,57.86],[1150934400000,59.58],[1151020800000,58.83],[1151280000000,58.99],[1151366400000,57.43],[1151452800000,56.02],[1151539200000,58.97],[1151625600000,57.27],[1151884800000,57.95],[1152057600000,57],[1152144000000,55.77],[1152230400000,55.4],[1152489600000,55],[1152576000000,55.65]]
     *                   }]
     * @return {Object} instance of timeSeries chart object
     */

    var TimeSeriesChartWidget = function (conf) {

        var $chartContainer = $(conf.container);
        var chart = conf.options;
        var chartDefaultWidth = 800;
        var chartDefaultHeight = 213;
        var yAxisLabelStyle = {
            fontFamily: 'Arial',
            fontWeight: 'normal',
            fontSize: 12,
            color: '#466575'
        };
        var titleStyle = {
            fontFamily: 'Helvetica Neue',
            fontSize: '16px',
            color: '#666666'
        };
        var buttonsStyle = {
            fontFamily: 'Arial',
            fontSize: '12',
            fontWeight: 'normal',
            color: '#466575'
        }
        var buttonsHoverSyle = buttonsSelectedStyle = {
            fontFamily: 'Arial',
            fontSize: '12',
            fontWeight: 'normal',
            color: '#07A4EA'
        };
        var rangeSelectorLabelStyle = {
            fontFamily: 'Arial',
            fontSize: '12',
            fontWeight: 'bold',
            color: '#466575'
        };
        var legendStyle = {
            //fontFamily: 'Arial',
            fontWeight: 'normal',
            fontSize: '11px'
        };
        var timeRangeSelectorEnabled = true;
        var presetTimeRangesEnabled = false;

        var once = true;

        if (chart.timeRangeSelectorEnabled != null) {
            timeRangeSelectorEnabled = chart.timeRangeSelectorEnabled;
        }

        if (chart.presetTimeRangesEnabled != null) {
            presetTimeRangesEnabled = chart.presetTimeRangesEnabled;
        }

        /**
         * Build the timeSeries chart
         *
         * @return {Object} this TimeSeriesChartWidget object
         */
        this.build = function () {
            this.el = render_template(TimeSeriesChartTemplate);
            this.$el = this.$chartElement = $(this.el);

            var truncateLegendLabel = function () {
                var label = this.name,
                    maxLabelSize = 12;
                    formattedLabel = label.length > (maxLabelSize) ? label.substring(0, maxLabelSize) + '...' : label;

                var formattedDiv = render_template(LegendLabelTemplate, { label: label,
                                                                     formattedLabel: formattedLabel });
                return formattedDiv;
            };

            var thresholdPlotLine = null;

            var tooltipConf = {};

            // Set default chart width and height to fit inside a dashlet
            // This can be overridden by setting the div width and height
            var chartWidth = ($chartContainer.width() > 0) ? $chartContainer.width() : chartDefaultWidth;
            var chartHeight = ($chartContainer.height() > 0) ? $chartContainer.height() : chartDefaultHeight;

            if (chart.yAxisThreshold && chart.yAxisThreshold != {}) {

                tooltipConf.templateContent = {
                    "minWidth": 100,
                    "maxWidth": 200,
                    "position": 'bottom',
                    "interactive": true
                };

                var thresholdData = {
                    threshold_label: 'Threshold', // i18n.getMessage('timeseries_threshold_tooltip_label'), // TODO: Localize this
                    threshold_value: chart.yAxisThreshold.value
                };

                var templateView = render_template(timeSeriesChartTooltipTemplate, thresholdData);

                var tooltip = null;

                thresholdPlotLine = [{
                    value: chart.yAxisThreshold.value,
                    width: 2,
                    color: chart.yAxisThreshold.color,
                    dashStyle: 'dash',
                    events: {
                        mouseover: function (e) {
                            if (once) {
                                tooltip = new TooltipWidget({
                                    "container": $(e.target),
                                    "elements": tooltipConf.templateContent,
                                    "view": $(templateView)
                                }).build();
                                once = false;
                            }
                        }
                    }
                }]
            }

            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang:{
                    rangeSelectorZoom: 'Zoom Level'
                }
            });

            this.$chartElement.highcharts('StockChart', {
                chart: {
                    width: chartWidth,
                    height: chartHeight,
                    alignTicks: false
                },

                title: {
                    text: chart.title,
                    style: titleStyle
                },

                navigator: {
                    enabled : timeRangeSelectorEnabled,
                    maskFill: 'rgba(5, 164, 255, 0.2)',
                    height: 42,
                    series: {
                        lineWidth: 1.5,
                        lineColor: '#05a4ff',
                        fillColor :  'rgba(5, 164, 255, 0.1)'
                    },
                    handles: {
                        backgroundColor: '#FFF',
                        borderColor: '#999'
                    },
                    xAxis: {
                        labels: {
                            x: -16,
                            y: 12
                        }
                    }
                },

                scrollbar: {
                    //enabled: timeRangeSelectorEnabled
                    enabled: false
                },

                rangeSelector: {
                    enabled: presetTimeRangesEnabled,
                    buttons: [{
                        type: 'year',
                        count: 1,
                        text: 'Year'
                    },
                    {
                        type: 'month',
                        count: 1,
                        text: 'Month'
                    },
                    {
                        type: 'week',
                        count: 1,
                        text: 'Week'
                    },
                    {
                        type: 'day',
                        count: 1,
                        text: 'Day'
                    },
                    {
                        type: 'hour',
                        count: 1,
                        text: 'Hour'
                    },
                    {
                        type: 'minute',
                        count: 1,
                        text: 'Min'
                    },
                    {
                        type: 'all',
                        text: 'All'
                    }],
                    inputEnabled: false,
                    buttonTheme: {
                        fill: 'none',
                        stroke: 'none',
                        'stroke-width': 0,
                        style: buttonsStyle,
                        states: {
                            hover: {
                                fill: 'none',
                                style: buttonsHoverSyle
                            },
                            select: {
                                fill: 'none',
                                style: buttonsSelectedStyle
                            }
                        },
                    },
                    labelStyle: rangeSelectorLabelStyle,
                },

                yAxis: {
                    title: {
                        text: chart.yAxisTitle
                    },
                    labels: {
                        style: yAxisLabelStyle,
                        overflow: 'justify'
                    },
                    min: 0,
                    minRange: chart.yAxisThreshold?chart.yAxisThreshold.value:null,
                    plotLines: thresholdPlotLine
                },

                legend: {
                    enabled: true,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    floating: false,
                    borderWidth: 0,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: false,
                    itemStyle: legendStyle,
                    useHTML: true,
                    labelFormatter: truncateLegendLabel
                },

                tooltip: {
                    shared: false,
                    formatter: function() {
                        return '<span style="color:' + this.series.color + '">' + this.series.name + '</span>: <b>' + Highcharts.numberFormat(this.y, 0) + '</b><br/>';
                    },
                    followPointer: false,
                    crosshairs: [false, false]
                },
                
                credits: {
                    enabled: false
                },
                
                series: createSeries(chart),

                plotOptions: {
                    series: {
                        turboThreshold: 0
                    }
                }

            });

            this.el = this.$chartElement[0];

            $chartContainer.empty().append(this.$chartElement);

            return this;
        };

        var createSeries = function (chart) {
            var series = [];

            for (var ii = 0; ii < chart.data.length; ii++) {
                series.push({
                    name: chart.data[ii].name,
                    color: chart.data[ii].color,
                    data: chart.data[ii].points,
                    stickyTracking: false
                });
            }

            return series;
        };

        /**
         * Remove timeSeries chart
         *
         * @return {Object} this TimeSeriesChartWidget object
         */
        this.destroy = function () {
            if (this.$chartElement) {
                var highChart = this.$chartElement.highcharts();
                if (highChart) {
                    highChart.destroy();
                }
            }

            return this;
        };
    };

    return TimeSeriesChartWidget;
});