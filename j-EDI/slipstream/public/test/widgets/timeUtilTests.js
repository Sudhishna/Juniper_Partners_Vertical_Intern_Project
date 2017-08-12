define([
    'widgets/timeZone/timeUtil'
  ], function(TimeUtil) {
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
    console.log('datetime: ' + datetime.toString() + ', offset: ' + offset + " hours, dst: " + dst);

    describe('TimeUtil - Unit tests', function() {
      it('GMT: UTC +/-0:00', function() {
        TimeUtil.GetTimezoneString(0, false).should.be.equal('UTC +/-0:00');
      });
      if (offset == -5) {
        it('EST: client machine', function() {
          TimeUtil.GetTimezoneString().should.be.equal('UTC -5:00');
        });
      }
      it('EST: UTC -5:00 with DST on', function() {
        TimeUtil.GetTimezoneString(-240, true).should.be.equal(dst ? 'UTC -5:00' : 'UTC -4:00');
      });
      it('EST: UTC -5:00 with DST off', function() {
        TimeUtil.GetTimezoneString(-300, false).should.be.equal('UTC -5:00');
      });
      if (offset == -8) {
        it('PST: client machine', function() {
          TimeUtil.GetTimezoneString().should.be.equal('UTC -8:00');
        });
      }
      it('PST: UTC -8:00 with DST on', function() {
        TimeUtil.GetTimezoneString(-420, true).should.be.equal(dst ? 'UTC -8:00' : 'UTC -7:00');
      });
      it('PST UTC -8:00 with DST off', function() {
        TimeUtil.GetTimezoneString(-480, false).should.be.equal('UTC -8:00');
      });
      it('IST: UTC +5:30', function() {
        TimeUtil.GetTimezoneString(330, false).should.be.equal('UTC +5:30');
      });
      it('SBT: UTC +11:00', function() {
        TimeUtil.GetTimezoneString(660, false).should.be.equal('UTC +11:00');
      });    
      it('NZST: UTC +12:00', function() {
        TimeUtil.GetTimezoneString(720, false).should.be.equal('UTC +12:00');
      });    
    }); 
  }
);