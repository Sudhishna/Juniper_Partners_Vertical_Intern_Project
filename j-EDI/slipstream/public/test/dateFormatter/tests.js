define(['moment'], function(moment) {
	describe('Date Formatter tests', function() {
      describe('Some format tests', function() {
          describe('format 1', function() {
              var fmt = "dddd, MMMM Do YYYY";

              describe('from Date object', function() {
                  var date = new Date(2015, 6, 16);
                  var formatted_date = Slipstream.SDK.DateFormatter.format(date, fmt);

                  it('formatted date should equal JS date object', function() {
                      assert.equal(formatted_date, "Thursday, July 16th 2015");
                  });   
              });

              describe('from string', function() {
                  var date = new Date(2015, 6, 16).toISOString();
                  var formatted_date = Slipstream.SDK.DateFormatter.format(date, fmt);

                  it('formatted date should equal ISO string date', function() {
                      assert.equal(formatted_date, "Thursday, July 16th 2015");
                  });   
              });
          });

          describe('format 2', function() {
              var fmt = "Mo Do YYYY";

              describe('from Date object', function() {
                  var date = new Date(2014, 9, 21);
                  var formatted_date = Slipstream.SDK.DateFormatter.format(date, fmt);

                  it('formatted date should equal JS date object', function() {
                      assert.equal(formatted_date, "10th 21st 2014");
                  });   
              });

              describe('from string', function() {
                  var date = new Date(2014, 9, 21).toISOString();
                  var formatted_date = Slipstream.SDK.DateFormatter.format(date, fmt);

                  it('formatted date should equal ISO string date', function() {
                      assert.equal(formatted_date, "10th 21st 2014");
                  });   
              });
          });

          describe('format 1, i18n French', function() {
              var fmt = "dddd, MMMM Do YYYY";

              // validate that language bundles are loaded
              moment.locale('fr');

              describe('from Date object', function() {
                  var date = new Date(2015, 6, 16);
                  var formatted_date = Slipstream.SDK.DateFormatter.format(date, fmt);

                  it('formatted date should equal JS date object', function() {
                      assert.equal(formatted_date, "jeudi, juillet 16 2015");
                  });  

                  moment.locale('en');
              });
          });


      });
   });
});