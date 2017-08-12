/**
 * Donut Chart Widget
 *
 * @module DonutChart
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'jquery',
    'highcharts',
    'text!widgets/donutChart/templates/donutChart.html',
    'text!widgets/donutChart/templates/donutLegendLabel.html',
    'lib/template_renderer/template_renderer'

], /** @lends DonutChart */ function ($, highcharts, DonutChartTemplate, LegendLabelTemplate, render_template) {

	var DonutChartWidget = function (conf) {

		var $chartContainer = $(conf.container),
			options = conf.options,
			total = 0,
			donut,
			series = [],
			positionLeft,
			positionTop,
			marker;

		// Set default chart width and height to fit inside a dashlet
		// This can be overridden by setting the div width and height
        var chartWidth = ($chartContainer.width() > 0) ? $chartContainer.width() : 398;
        var chartHeight = ($chartContainer.height() > 0) ? $chartContainer.height() : 223;

        if (options.donut) {

        	series.push(options.donut);

        	// if showInLegend parameter is not defined, set it to true by default
        	if (series[0].showInLegend == undefined) {
        		series[0].showInLegend = true;
        	}

        	// if colors array is not provided, set it to a default colors array
        	if (options.colors ==  undefined) {
                options.colors = ['#ff3333', '#ff9933', '#f9d854', '#aa4ace', '#05a4ff', '#b4b4f9', '#ebd0e4', '#c7a0ca', '#a763a5', '#814598'];
                // options.colors = ['#ff3333', '#ff9933', '#f9d854', '#aa4ace', '#05a4ff']; // Alarms colors
                // options.colors = ['#b72841', '#ff3366', '#ff3333', '#ff6666', '#ff9933', '#f9a885', '#fec240', '#ffcc90', '#ffea81', '#ffff99']; // Threat colors
                // options.colors = ['#814598', '#a763a5', '#c7a0ca', '#ebd0e4', '#b4b4f9', '#567cbe', '#6198d0', '#95c1e7', '#c6e2f6', '#bce3e5']; // Blue/purple colors
        	}
    	}

		/**
         * Build the donut chart
         *
         * @return {Object} this DonutChartWidget object
         */
        this.build = function () {
            this.$chartElement = $(render_template(DonutChartTemplate));

            var truncateLegendLabel = function () {
                var label = this.name,
                    maxLabelSize = 16;
                    formattedLabel = label.length > (maxLabelSize) ? label.substring(0, maxLabelSize) + '...' : label;

                var formattedDiv = render_template(LegendLabelTemplate, { label: label,
                                                                     formattedLabel: formattedLabel });
                return formattedDiv;
            };

            this.$chartElement.highcharts({

            	chart: {
            		type: 'pie',
            		width: chartWidth,
            		height: chartHeight
            	},
        
		        title: {
		            text: ''
		        },

		        tooltip: {
		            pointFormat: '{series.name}:{point.y} ({point.percentage:.0f}%)'
		        },

		        colors: options.colors,

		        plotOptions: {
		            pie: {
		                innerSize: "70%",
		                center: ["50%", "50%"],
		                dataLabels: {
		                    enabled: false
		                },
		                point: {
                    		events: {
                        		legendItemClick: function () {
                        			//update the total count, when an item on the legend is clicked
                        			(this.visible) ? (total-= this.y) : (total+= this.y);
                        			removeText(marker);
                        			if (total > 0) {
                        				marker = displayText(this.series.chart, total);
                        			}
                        		}
                    		}
                		}
		            }
		        },
		        
		        legend: {
		            align: 'right',
		            verticalAlign: 'middle',
		            layout: 'vertical',
		            useHTML: true,
		            labelFormatter: truncateLegendLabel,
		            borderWidth: 0,
		            itemMarginTop: 5,
		            symbolHeight: 12,
		            symbolWidth: 12,
		            itemStyle: {
		                fontWeight: 'normal',
		                fontSize: '12px',
		                fontFamily: 'Arial'
		            },
		        },

		        // Highchart by default puts a credits label on the chart - disable it
                credits: {
                    enabled: false
                },

		        series: series

		    }, function (chart) { // on complete

		    	if (chart.series.length) {
			    	donut = chart.series[0];
	                positionLeft = chart.plotLeft + donut.center[0];
	                positionTop = chart.plotTop + donut.center[1] + 8;

			    	if (donut.data.length) {
				    	total = donut.data[0].total;
				        if (total > 0) {
				            marker = displayText(chart, total);
				        }
			    	}
		    	}

            });

            $chartContainer.empty().append(this.$chartElement);

            return this;
        };
        
        // Display total count in the center of the chart
        // Format the string to be comma separated
		function displayText(chart, num) {
			var totalString = num.toLocaleString();
			
            var marker = chart.renderer.text(totalString, positionLeft, positionTop)
            	.attr( {'text-anchor': 'middle'})
            	.addClass('donutText')
                .css({
                    color: '#999',
                    fontSize: '24px'
                })
            	.add();
            return marker;
        };

        // Remove total count previously displayed in the center of the chart
        function removeText(marker) {
            if (marker.element != null) {
                marker.destroy();
            }
            // $('.donutText')
            //     .removeClass('donutText')
            // 	   .remove();
        };

        /**
	     * Update the donut chart with new data
	     *
	     * @param [Array] updated array of data points
	     */
        this.update = function (data) {
	        var highChart = this.$chartElement.highcharts();
	        if (highChart) {
	            var series = highChart.series[0];
	            if (data) {
		            series.setData(data);
		            highChart.redraw();
		            removeText(marker);
		            total = donut.data[0].total;
		            if (total > 0) {
		                marker = displayText(highChart, total);
		            }
				}
	        }
        };

	    /**
	     * Remove the donut chart
	     *
	     * @return {Object} this DonutChartWidget object
	     */
	    this.destroy = function () {
	    	var highChart = this.$chartElement.highcharts();
	        highChart.destroy();
	        return this;
	    };

    };

    return DonutChartWidget;
});