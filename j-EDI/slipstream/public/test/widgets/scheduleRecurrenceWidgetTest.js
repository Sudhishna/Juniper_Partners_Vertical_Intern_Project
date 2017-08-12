define([
    'widgets/scheduleRecurrence/scheduleRecurrenceWidget'
],function(ScheduleRecurrenceWidget) {
    describe('ScheduleRecurrenceWidget - Unit tests:', function() {
        describe('ScheduleRecurrenceWidget', function() {
            var el = $('#test_widget');
            
            var scheduleRecurrenceWidgetObj = new ScheduleRecurrenceWidget({
                "container": el
            });
            
            it('should exist', function() {
            	scheduleRecurrenceWidgetObj.should.exist;
            });
            it('build() should exist', function() {
                assert.isFunction(scheduleRecurrenceWidgetObj.build, 'The schedule recurrence widget widget must have a function named build.');
            });
            it('destroy() should exist', function() {
                assert.isFunction(scheduleRecurrenceWidgetObj.destroy, 'The schedule recurrence widget must have a function named destroy.');
            });
            it('getScheduleStartTime() function should exist', function () {
                (typeof scheduleRecurrenceWidgetObj.getScheduleStartTime == 'function').should.be.true;
            });
            it('getScheduleRecurrenceInfo() function should exist', function () {
                (typeof scheduleRecurrenceWidgetObj.getScheduleRecurrenceInfo == 'function').should.be.true;
            });
            it('getScheduleInfoAsURLQuery() function should exist', function () {
                (typeof scheduleRecurrenceWidgetObj.getScheduleInfoAsURLQuery == 'function').should.be.true;
            });
            it('isValid() function should exist', function () {
                (typeof scheduleRecurrenceWidgetObj.isValid == 'function').should.be.true;
            });
        });
    });
});