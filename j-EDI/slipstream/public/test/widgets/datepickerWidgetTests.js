define([
    'jquery',
    'widgets/datepicker/datepickerWidget'
], function ($, DatepickerWidget) {
    describe('DatepickerWidget- Unit tests:', function () {

        var datepickerWidgetObj = null;
        var widgetObj = null;
        // will execute for each describe
        beforeEach(function () {

            var confObj = {
                container: '#datepicker_test'
            };
            datepickerWidgetObj = new DatepickerWidget(confObj);
            widgetObj = datepickerWidgetObj.build();
            //widgetObj.setDate('01/26/2015');

        });

        // will execute for each describe
        afterEach(function () {
            datepickerWidgetObj.destroy();
        });

        describe('datepicker widget', function () {

            it('should exist', function () {
                datepickerWidgetObj.should.exist;
            });
            it('build() function should exist', function () {
                (typeof datepickerWidgetObj.build == 'function').should.be.true;
            });
            it('build() should return datepickerWidget object', function () {
                assert.equal(widgetObj, datepickerWidgetObj);
            });
            it('destroy() function should exist', function () {
                (typeof datepickerWidgetObj.destroy == 'function').should.be.true;
            });
            it('Datepicker icon should be attached to container field', function () {
                assert.notEqual($('img.ui-datepicker-trigger').length, 0);
                assert.equal($('#ui-datepicker-div').length, 1);
            });

            it('Datepicker calendar should be closed by default', function () {
                //assert.equal($('#ui-datepicker-div').css("display"), "none");
            });

            it('Datepicker icon click should open the calendar', function () {
                $('.ui-datepicker-trigger').click();
                assert.equal($('#ui-datepicker-div').length, 1);
                assert.equal($('#ui-datepicker-div').css("display"), "block");
                // call event to use jquery default datepicker behaviour to handle close of calendar popup
                $('.ui-datepicker-trigger').click();
            });

            it('Datepicker popup should have header', function () {
                $('.ui-datepicker-trigger').click();
                assert.equal($('#ui-datepicker-div > div.ui-datepicker-header').length, 1);
                assert.equal($('#ui-datepicker-div > table.ui-datepicker-calendar').length, 1);
                assert.equal($('#ui-datepicker-div > div.ui-datepicker-buttonpane').length, 1);
                // call event to use jquery default datepicker behaviour to handle close of calendar popup
                $('.ui-datepicker-trigger').click();
            });

            it('Datepicker popup should have month & year in header', function () {
                $('.ui-datepicker-trigger').click();
                assert.equal($('#ui-datepicker-div select.ui-datepicker-month').length, 1);
                assert.equal($('#ui-datepicker-div select.ui-datepicker-year').length, 1);
                // call event to use jquery default datepicker behaviour to handle close of calendar popup
                $('.ui-datepicker-trigger').click();
            });

            it('Left arrow click should get the previous month', function () {
                $('.ui-datepicker-trigger').click();

                var currentMonth = $('#ui-datepicker-div select.ui-datepicker-month option:selected').val();
                $('a.ui-datepicker-prev').click();
                var prevMonth = $('#ui-datepicker-div select.ui-datepicker-month option:selected').val();
                currentMonth = (currentMonth == 0) ? 12 : currentMonth;
                assert.equal(parseInt(currentMonth) - 1, prevMonth);
                // call event to use jquery default datepicker behaviour to handle close of calendar popup
                $('.ui-datepicker-trigger').click();
                $('#ui-datepicker-div').css("display", "none");
                $('#ui-datepicker-div .ui-datepicker-header').css("display", "none");
                $('#ui-datepicker-div .ui-datepicker-calendar').css("display", "none");
                $('#ui-datepicker-div .ui-datepicker-buttonpane').css("display", "none");
            });

            it('Right arrow click should get the next month', function () {
                $('.ui-datepicker-trigger').click();

                var currentMonth = $('#ui-datepicker-div select.ui-datepicker-month option:selected').val();
                $('a.ui-datepicker-next').click();
                var nextMonth = $('#ui-datepicker-div select.ui-datepicker-month option:selected').val();
                currentMonth = (currentMonth == 11) ? -1 : currentMonth;
                assert.equal(parseInt(currentMonth) + 1, nextMonth);

                // call event to use jquery default datepicker behaviour to handle close of calendar popup
                $('.ui-datepicker-trigger').click();
                $('#ui-datepicker-div').css("display", "none");
                $('#ui-datepicker-div .ui-datepicker-header').css("display", "none");
                $('#ui-datepicker-div .ui-datepicker-calendar').css("display", "none");
                $('#ui-datepicker-div .ui-datepicker-buttonpane').css("display", "none");
            });

            it('Non-current month should have grey color dates', function () {
                $('.ui-datepicker-trigger').click();
                $('#ui-datepicker-div').css("display", "none");
                var prevMonthDates = $('.ui-datepicker-other-month');
                if(prevMonthDates.length > 0 ) {
                    assert.equal(prevMonthDates.hasClass("ui-state-disabled"), true);
                }
                // call event to use jquery default datepicker behaviour to handle close of calendar popup
                $('.ui-datepicker-trigger').click();
                $('#ui-datepicker-div').css("display", "none");
                $('.ui-datepicker-header').css("display", "none");
                $('.ui-datepicker-calendar').css("display", "none");
                $('.ui-datepicker-buttonpane').css("display", "none");
            });

//            it('Today date will be highlighted with blue outline in popup', function () {
//                $('.ui-datepicker-trigger').click();
//                $('#ui-datepicker-div').css("display", "none");
//                var currentDateElement = $('#ui-datepicker-div td.ui-datepicker-today > a');
//                assert.equal(currentDateElement.css("border-top-color"), "rgb(5, 164, 255)");
//                assert.equal(currentDateElement.css("border-right-color"), "rgb(5, 164, 255)");
//                assert.equal(currentDateElement.css("border-bottom-color"), "rgb(5, 164, 255)");
//                assert.equal(currentDateElement.css("border-left-color"), "rgb(5, 164, 255)");
//                assert.equal(currentDateElement.css("background-color"), "rgb(255, 255, 255)");
//                assert.equal(currentDateElement.css("color"), "rgb(68, 68, 68)");
//                // call event to use jquery default datepicker behaviour to handle close of calendar popup
//                $('.ui-datepicker-trigger').click();
//                $('#ui-datepicker-div').css("display", "none");
//                $('.ui-datepicker-header').css("display", "none");
//                $('.ui-datepicker-calendar').css("display", "none");
//                $('.ui-datepicker-buttonpane').css("display", "none");
//            });

            it('Datepicker popup should have today button', function () {
                $('.ui-datepicker-trigger').click();
                $('#ui-datepicker-div').css("display", "none");
                assert.equal($('#ui-datepicker-div div.ui-datepicker-buttonpane button.ui-datepicker-current').length, 1);
                // call event to use jquery default datepicker behaviour to handle close of calendar popup
                $('.ui-datepicker-trigger').click();
                $('#ui-datepicker-div').css("display", "none");
                $('.ui-datepicker-header').css("display", "none");
                $('.ui-datepicker-calendar').css("display", "none");
                $('.ui-datepicker-buttonpane').css("display", "none");
            });

//            it('Datepicker popup should not have close button', function () {
//                $('.ui-datepicker-trigger').click();
//                $('#ui-datepicker-div').css("display", "none");
//                assert.equal($('#ui-datepicker-div div.ui-datepicker-buttonpane button.ui-datepicker-close').css("display"), "none");
//                // call event to use jquery default datepicker behaviour to handle close of calendar popup
//                $('.ui-datepicker-trigger').click();
//                $('#ui-datepicker-div').css("display", "none");
//                $('.ui-datepicker-header').css("display", "none");
//                $('.ui-datepicker-calendar').css("display", "none");
//                $('.ui-datepicker-buttonpane').css("display", "none");
//            });

        });
    });
});
