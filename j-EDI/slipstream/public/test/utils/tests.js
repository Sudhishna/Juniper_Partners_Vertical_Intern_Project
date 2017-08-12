define(['lib/utils'], function(utils) {
	describe('Utilities tests', function() {
      describe('Compare versions tests', function() {
          describe('identical version strings', function() {
              var v1 = "1.2.3.4", v2 = "1.2.3.4";
              var compare = utils.version_compare(v1, v2);

              it('Should be equal', function() {
                  assert.equal(compare, 0);
              });
          });

          describe('unequal version string lengths', function() {
              var v1 = "1.2.3.4", v2 = "1.2.3";
              var compare = utils.version_compare(v1, v2);

              it('longer version string should be greater if same prefix', function() {
                  assert.isTrue(compare > 0);
              });

              v1 = "1.2.5", v2 = "1.2.4.5";

              var compare = utils.version_compare(v1, v2);

              it('shorter version string should be greater if larger number after common prefix', function() {
                  assert.isTrue(compare > 0);
              });

              v1 = "5", v2 = "1.2.4.5";

              var compare = utils.version_compare(v1, v2);

              it('shorter version string should be greater if larger number after common prefix', function() {
                  assert.isTrue(compare >0);
              });

          });

          describe('same version string lengths, different values in M.m.r', function() {
              var v1 = "1.2.3.4", v2 = "1.5.3.4";
              var compare = utils.version_compare(v1, v2);

              it('after common prefix, larger number => larger version number', function() {
                  assert.isFalse(compare > 0);
              });
          });
      });
   });
});