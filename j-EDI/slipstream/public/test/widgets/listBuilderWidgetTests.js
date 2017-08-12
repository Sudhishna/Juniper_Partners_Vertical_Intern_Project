define([
    'widgets/listBuilder/listBuilderWidget'
],function(ListBuilderWidget) {
    describe('ListBuilderWidget - Unit tests:', function() {
        describe('ListBuilderWidget', function() {
            //var el = $('#main_content');
            var el = $('#test_widget');
            var protocolList = {"availableElements":[{"label": "LDP","value": "LDP"},{"label": "MSDP","value": "MSDP"}]};
            var listBuilderWidgetObj = new ListBuilderWidget({
                "container": el,
                "list": protocolList
            });

            it('should exist', function() {
                listBuilderWidgetObj.should.exist;
            });
            it('build() should exist', function() {
                assert.isFunction(listBuilderWidgetObj.build, 'The list builder widget must have a function named build.');
            });
            it('destroy() should exist', function() {
                assert.isFunction(listBuilderWidgetObj.destroy, 'The list builder must have a function named destroy.');
            });

            describe('Template', function() {
                beforeEach(function(){
                    listBuilderWidgetObj.build();
                });

                it('should contain a populated first list', function() {
                    listBuilderWidgetObj.conf.container.find('.box1 div').hasClass('list-group-item').should.be.true;
                });

                it('should show the number of elements in the first list', function() {
                    listBuilderWidgetObj.conf.container.find(".box1 items-info").text().should.exist;
                });

                it('should contain an empty second list', function() {
                    listBuilderWidgetObj.conf.container.find('.box2 div').hasClass('list-group-item').should.be.false;
                });

            });
        });

    });

});