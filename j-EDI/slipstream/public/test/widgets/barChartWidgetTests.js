define([
    'jquery',
    'widgets/barChart/barChartWidget',
    'text!/test/templates/barChartWidgetTemplate.html'
], function ($, BarChartWidget, TestTemplate) {
    describe('BarChartWidget- Unit tests:', function () {

        var barChartWidgetObj = null;
        var widgetObj = null;            

        beforeEach(function () {

            var options = {
                xAxisTitle: 'xAxis-Title',
                yAxisTitle: 'yAxis-Title',
                categories: ['category-1', 'category-2', 'category-3'],
                data: [1, 2, 3]                   
            };

            var conf = {
                container: '#barchart',
                options: options
            };

            barChartWidgetObj = new BarChartWidget(conf);
            widgetObj = barChartWidgetObj.build();
        });

        afterEach(function () {
            barChartWidgetObj.destroy();
        });

        describe('barChart widget', function () {

            it('should exist', function () {
                barChartWidgetObj.should.exist;
            });
            it('build() function should exist', function () {
                (typeof barChartWidgetObj.build == 'function').should.be.true;
            });
            it('build() should return barChartWidget object', function () {
                assert.equal(widgetObj, barChartWidgetObj);
            });
            it('destroy() function should exist', function () {
                (typeof barChartWidgetObj.destroy == 'function').should.be.true;
            });

        });
    });
});
