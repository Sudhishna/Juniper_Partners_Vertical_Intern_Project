define([
    'jquery',
    'widgets/lineChart/lineChartWidget'
], function ($, LineChartWidget) {
    describe('LineChartWidget- Unit tests:', function () {

        var lineChartWidgetObj = null;
        var widgetObj = null;

        beforeEach(function () {

            var options = {
                xAxisTitle: '',
                yAxisTitle: 'yAxis-Title',
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

                // Line chart data
                lines: [{
                    name: 'Device 1',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'Device 2',
                    data: [2.0, 5.0, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }, {
                    name: 'Device 3',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }]
            };


            var conf = {
                container: '#linechart',
                options: options
            };

            lineChartWidgetObj = new LineChartWidget(conf);
            widgetObj = lineChartWidgetObj.build();
        });

        afterEach(function () {
            lineChartWidgetObj.destroy();
        });

        describe('lineChart widget', function () {

            it('should exist', function () {
                lineChartWidgetObj.should.exist;
            });

            it('build() function should exist', function () {
                (typeof lineChartWidgetObj.build == 'function').should.be.true;
            });

            it('build() should return lineChartWidget object', function () {
                assert.equal(widgetObj, lineChartWidgetObj);
            });

            it('build() with blank line data should return lineChartWidget object with no series', function () {
                var options = {
                };

                var conf = {
                    container: '#linechart',
                    options: options
                };

                lineChartWidgetObj = new LineChartWidget(conf);
                widgetObj = lineChartWidgetObj.build();
                assert.equal(lineChartWidgetObj.$chartElement.find('.highcharts-series-group .highcharts-series').length, 0);
                assert.equal(widgetObj, lineChartWidgetObj);
            });

            it('build() with one line object should return lineChartWidget object with one series', function () {
                var options = {
                    xAxisTitle: '',
                    yAxisTitle: 'yAxis-Title',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    lines: [{
                        name: 'Device 1',
                        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    }]
                };

                var conf = {
                    container: '#linechart',
                    options: options
                };

                lineChartWidgetObj = new LineChartWidget(conf);
                widgetObj = lineChartWidgetObj.build();
                assert.equal(lineChartWidgetObj.$chartElement.find('.highcharts-series-group .highcharts-series').length, 1);
                assert.equal(widgetObj, lineChartWidgetObj);
            });

            it('build() with legend config should return lineChartWidget object with correct number of legends', function () {
                var options = {
                    xAxisTitle: '',
                    yAxisTitle: 'yAxis-Title',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    legend: {
                        enabled: true,
                        position: 'bottom'
                    },
                    lines: [{
                        name: 'Device 1',
                        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    }, {
                        name: 'Device 2',
                        data: [2.0, 5.0, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                    }, {
                        name: 'Device 3',
                        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                    }]
                };

                var conf = {
                    container: '#linechart',
                    options: options
                };

                lineChartWidgetObj = new LineChartWidget(conf);
                widgetObj = lineChartWidgetObj.build();
                assert.equal(lineChartWidgetObj.$chartElement.find('.highcharts-legend').first().find('.highcharts-legend-item').length, 3);
                assert.equal(widgetObj, lineChartWidgetObj);
            });

            it('destroy() function should exist', function () {
                (typeof lineChartWidgetObj.destroy == 'function').should.be.true;
            });
        });
    });
});
