define([
    'widgets/ipCidr/ipCidrWidget',
    'text!../../test/templates/ipCidrWidgetTemplate.html'
],function(IpCidrWidget, declarativeForm) {
    describe('IpCdirWidget - Unit tests:', function() {
        describe('IpCdirWidget', function() {
            //var el = $('#main_content');
            var el = $('#test_widget');
            var form = $(el).append(declarativeForm);
            var ipCidrWidgetObj = new IpCidrWidget({
                "container": '#ipCidr'
            });

            it('should exist', function() {
                ipCidrWidgetObj.should.exist;
            });
            it('build() should exist', function() {
                assert.isFunction(ipCidrWidgetObj.build, 'The IP CDIR widget must have a function named build.');
            });
            it('destroy() should exist', function() {//TODO: fix me!
                assert.isFunction(ipCidrWidgetObj.destroy, 'The IP CDIR widget must have a function named destroy.');
            });

            describe('Form Elements', function() {
                beforeEach(function(){
                    ipCidrWidgetObj.build();
                });

                it('should contain a first element for the IP input', function() {
                    $(ipCidrWidgetObj.conf.$container.children()[0]).hasClass('row row_ip').should.be.true;
                });

                it('should contain a second element for the CIDR input', function() {
                    $(ipCidrWidgetObj.conf.$container.children()[1]).hasClass('row row_cidr').should.be.true;
                });

                it('should contain a third element for the Subnet input', function() {
                    $(ipCidrWidgetObj.conf.$container.children()[3]).hasClass('row row_subnet').should.be.true;
                });

            });
        });

    });

});