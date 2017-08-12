define([
    'widgets/timeZone/timeUtil',
    'widgets/timeZone/timeZoneWidget'
  ], function(TimeUtil, TimeZoneWidget) {
    var datetime = new Date();
    var dst = TimeUtil.IsClientDSTEnabled();
    var offset = TimeUtil.GetClientTimezoneOffset();
    if (dst) {
      if (offset < 0) {
        offset -= 60;
      } else {
        offset += 60;
      }
    }
    offset /= 60;
    console.log('datetime: ' + datetime.toString() + ', offset: ' + offset + " hours");

    describe('TimeZoneWidget - Unit tests', function() {
      it('widget creation', function() {
        var tzw = new TimeZoneWidget({
          'container': '#test_widget' // '#main_content'
        });
        tzw.should.exist;
      });

      it('set and get olson timezone string for \'America/Chicago\'', function() {
        var tzw = new TimeZoneWidget({
          'container': '#test_widget', //'#main_content'
          'selectedTimezone': "America/Chicago"
        });
        tzw.build();
        tzw.getSelectedTimezone().should.be.equal("America/Chicago");
      });

      if (offset == -5) {
        it('set and get olson timezone string to client machine in EST', function() {
          var tzw = new TimeZoneWidget({
            'container': '#test_widget' //'#main_content'
          });
          tzw.build();
          tzw.getSelectedTimezone().should.be.equal("America/New_York");
        });
      }

      if (offset == -8) {
        it('set and get olson timezone string to client machine in PST', function() {
          var tzw = new TimeZoneWidget({
            'container': '#test_widget' //'#main_content'
          });
          tzw.build();
          tzw.getSelectedTimezone().should.be.equal("America/Los_Angeles");
        });
      }
    });
  }
);