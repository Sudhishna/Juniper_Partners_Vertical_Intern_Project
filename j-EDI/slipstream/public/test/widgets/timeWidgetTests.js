define([
    'widgets/time/timeWidget'
    ], function (TimeWidget) {
        var containerId = 0;

        function createContainer() {
            var container = $("<div id = container-id" + containerId++ + "></div>");
            $('#test_widget').append(container);

            return container;
        }

        describe('TimeWidget - Unit tests', function () {
            it('widget creation', function () {
                var tw = new TimeWidget({
                    'container': createContainer()
                });
                tw.should.exist;
            });

            it('get time of client machine', function () {
                var tw = new TimeWidget({
                    'container': createContainer()
                });
                tw.build();
                tw.getTime().should.exist;
            });

            describe("Testing set and get time values", function () {
                it('set and get time value: 11:30:00 PM', function () {
                    var tw = new TimeWidget({
                        'container': createContainer(),
                        'value': "11:30:00 PM"
                    });
                    tw.build();
                    tw.getTime().should.be.equal("11:30:00 PM");
                });

                it('set and get time value: 12:50:09 AM', function () {
                    var tw = new TimeWidget({
                        'container': createContainer(),
                        'value': "12:50:09 AM"
                    });
                    tw.build();
                    tw.getTime().should.be.equal("12:50:09 AM");
                });

                it('set and get time value: 00:00:00', function () {
                    var timeStr = "00:00:00";
                    var tw = new TimeWidget({
                        'container': createContainer(),
                        'value': timeStr
                    });
                    tw.build();
                    tw.getTime().should.be.equal(timeStr);
                });

                it('set and get time value: 11:22:13', function () {
                    var timeStr = "11:12:13";
                    var tw = new TimeWidget({
                        'container': createContainer(),
                        'value': timeStr
                    });
                    tw.build();
                    tw.getTime().should.be.equal(timeStr);
                });

                it('set and get time value: 23:59:59', function () {
                    var timeStr = "23:59:59";
                    var tw = new TimeWidget({
                        'container': createContainer(),
                        'value': timeStr
                    });
                    tw.build();
                    tw.getTime().should.be.equal(timeStr);
                });
            });


            describe("Testing select box change: AM => PM", function () {
                it('set time: 12:00:00 AM and change to PM', function () {
                    var tw = new TimeWidget({
                        'container': createContainer(),
                        'value': "12:00:00 AM"
                    });
                    tw.build();
                    $('#test_widget').find("#time_period :selected").val("PM");
                    $('#test_widget').find("#time_period").trigger('change');
                    tw.getTime().should.be.equal("12:00:00 PM");
                });

                it('set time: 11:59:59 AM and change to PM', function () {
                    var tw = new TimeWidget({
                        'container': createContainer(),
                        'value': "11:59:59 AM"
                    });
                    tw.build();
                    $('#test_widget').find("#time_period :selected").val("PM");
                    $('#test_widget').find("#time_period").trigger('change');
                    tw.getTime().should.be.equal("11:59:59 PM");
                });
            });

            describe("Testing select box change: AM => 24 hour", function () {
                it('12:00:00 AM => 00:00:00', function () {
                    var c = createContainer();
                    var tw = new TimeWidget({
                        'container': c,
                        'value': "12:00:00 AM"
                    });
                    tw.build();
                    c.find("#time_period :selected").val("24 hour");
                    c.find("#time_period").trigger('change');
                    tw.getTime().should.be.equal("00:00:00");
                });

                it('01:23:59 AM => 03:23:59', function () {
                    var c = createContainer();
                    var tw = new TimeWidget({
                        'container': c,
                        'value': "01:23:59 AM"
                    });
                    tw.build();
                    c.find("#time_period :selected").val("24 hour");
                    c.find("#time_period").trigger('change');
                    tw.getTime().should.be.equal("01:23:59");
                });

                it('01:23:59 PM => 13:23:59', function () {
                    var c = createContainer();
                    var tw = new TimeWidget({
                        'container': c,
                        'value': "01:23:59 PM"
                    });
                    tw.build();
                    c.find("#time_period :selected").val("24 hour");
                    c.find("#time_period").trigger('change');
                    tw.getTime().should.be.equal("13:23:59");
                });
            });

            describe("Testing select box change: PM => AM", function () {
                it('01:00:01 PM => 01:00:01 AM', function () {
                    var c = createContainer();
                    var tw = new TimeWidget({
                        'container': c,
                        'value': "01:00:01 PM"
                    });
                    tw.build();
                    c.find("#time_period :selected").val("AM");
                    c.find("#time_period").trigger('change');
                    tw.getTime().should.be.equal("01:00:01 AM");
                });

                it('11:12:13 PM => 11:12:13 AM', function () {
                    var c = createContainer();
                    var tw = new TimeWidget({
                        'container': c,
                        'value': "11:12:13 PM"
                    });
                    tw.build();
                    c.find("#time_period :selected").val("AM");
                    c.find("#time_period").trigger('change');
                    tw.getTime().should.be.equal("11:12:13 AM");
                });
            });

            describe("Testing select box change: PM => 24 hour", function () {
                it('01:00:01 PM => 13:00:01', function () {
                    var c = createContainer();
                    var tw = new TimeWidget({
                        'container': c,
                        'value': "01:00:01 PM"
                    });
                    tw.build();
                    c.find("#time_period :selected").val("24 hour");
                    c.find("#time_period").trigger('change');
                    tw.getTime().should.be.equal("13:00:01");
                });

                it('11:12:13 PM => 23:12:13', function () {
                    var c = createContainer();
                    var tw = new TimeWidget({
                        'container': c,
                        'value': "11:12:13 PM"
                    });
                    tw.build();
                    c.find("#time_period :selected").val("24 hour");
                    c.find("#time_period").trigger('change');
                    tw.getTime().should.be.equal("23:12:13");
                });
            });

            describe("Testing select box change: 24 hour => AM", function () {
                it('02:00:01 => 02:00:01 AM', function () {
                    var c = createContainer();
                    var tw = new TimeWidget({
                        'container': c,
                        'value': "02:00:01"
                    });
                    tw.build();
                    c.find("#time_period :selected").val("AM");
                    c.find("#time_period").trigger('change');
                    tw.getTime().should.be.equal("02:00:01 AM");
                });

                it('23:00:01 => 11:00:01 AM', function () {
                    var c = createContainer();
                    var tw = new TimeWidget({
                        'container': c,
                        'value': "23:00:01"
                    });
                    tw.build();
                    c.find("#time_period :selected").val("AM");
                    c.find("#time_period").trigger('change');
                    tw.getTime().should.be.equal("11:00:01 AM");
                });
            });

            describe("Testing select box change: 24 hour => PM", function () {
                it('02:00:01 => 02:00:01 PM', function () {
                    var c = createContainer();
                    var tw = new TimeWidget({
                        'container': c,
                        'value': "02:00:01"
                    });
                    tw.build();
                    c.find("#time_period :selected").val("PM");
                    c.find("#time_period").trigger('change');
                    tw.getTime().should.be.equal("02:00:01 PM");
                });

                it('23:00:01 => 11:00:01 PM', function () {
                    var c = createContainer();
                    var tw = new TimeWidget({
                        'container': c,
                        'value': "23:00:01"
                    });
                    tw.build();
                    c.find("#time_period :selected").val("PM");
                    c.find("#time_period").trigger('change');
                    tw.getTime().should.be.equal("11:00:01 PM");
                });
            });

            describe("Testing setting of time period programatically", function () {
                it('Set 24 hour period', function () {
                    var tw = new TimeWidget({
                        'container': createContainer(),
                        'value': "02:00:01 PM"
                    });
                    tw.build();
                    tw.setTimePeriod("24 hour");
                    tw.getTime().should.be.equal("14:00:01");
                });

                
                it('Set AM', function () {
                    var tw = new TimeWidget({
                        'container': createContainer(),
                        'value': "02:00:01 PM"
                    });
                    tw.build();
                    tw.setTimePeriod("AM");
                    tw.getTime().should.be.equal("02:00:01 AM");
                });


                it('Set PM', function () {
                    var tw = new TimeWidget({
                        'container': createContainer(),
                        'value': "02:00:01 AM"
                    });
                    tw.build();
                    tw.setTimePeriod("PM");
                    tw.getTime().should.be.equal("02:00:01 PM");
                });
                
            });

        });
    }
);