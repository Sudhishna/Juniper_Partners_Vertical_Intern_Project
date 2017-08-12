define([
    'jquery',
    'widgets/donutChart/donutChartWidget'
], function ($, DonutChartWidget) {
    describe('DonutChartWidget- Unit tests:', function () {

        var donutChartWidgetObj = null;
        var widgetObj = null;            

        beforeEach(function () {

            var options = {
                series: [{
                    name: "Test Count",
                    data: [
                        ['Critical', 400],
                        ['Major', 300],
                        ['Minor', 200],
                        ['Warning', 100],
                        ['Info', 50]
                    ],
                    showInLegend: true
                }]
            };

            var conf = {
                container: '#donutchart',
                options: options
            };

            donutChartWidgetObj = new DonutChartWidget(conf);
            widgetObj = donutChartWidgetObj.build();
        });

        afterEach(function () {
            donutChartWidgetObj.destroy();
        });

        describe('donutChart widget', function () {

            it('should exist', function () {
                donutChartWidgetObj.should.exist;
            });
            it('build() function should exist', function () {
                (typeof donutChartWidgetObj.build == 'function').should.be.true;
            });
            it('build() should return donutChartWidget object', function () {
                assert.equal(widgetObj, donutChartWidgetObj);
            });
            it('destroy() function should exist', function () {
                (typeof donutChartWidgetObj.destroy == 'function').should.be.true;
            });

        });
    });
});
