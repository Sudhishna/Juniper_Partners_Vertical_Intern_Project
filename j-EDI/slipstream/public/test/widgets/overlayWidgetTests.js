define([
    'jquery',
    'widgets/overlay/tests/smallView',
    'widgets/overlay/tests/testView',
    'widgets/overlay/overlayWidget',
    'widgets/overlay/overlaySingletonLayout'
], function ($, SmallView, TestView, OverlayWidget, overlaySingletonLayout) {
    describe('overlayWidget - Unit tests:', function () {


        describe('overlayWidget', function () {

            var overlayWidgetObj = null;
            var overlayType = null;
            var $el = null;
            var widgetObj = null;
            var overlayObj = null;

            beforeEach(function () {
                var smallViewObj = new SmallView({});

                overlayType = "small";

                var config = {
                    view: smallViewObj,
                    xIconEl: true,
                    cancelButton: true,
                    okButton: true,
                    type: overlayType
                };

                overlayWidgetObj = new OverlayWidget(config);
                widgetObj = overlayWidgetObj.build();
                overlayObj = overlayWidgetObj.getOverlay();
                $el = overlayObj.$el;
            });

            afterEach(function () {
                overlayWidgetObj.destroyAll();
            });

            it('overlay_content should exist', function () {
                $('#overlay_content').should.exist;
            });
            it('overlay_content should contain overlay', function () {
                assert.equal($el.parent().parent().parent().attr('id'), "overlay_content");
            });
            it('should exist', function () {
                overlayWidgetObj.should.exist;
            });
            it('build() function should exist', function () {
                (typeof overlayWidgetObj.build == 'function').should.be.true;
            });
            it('build() should return overlayWidget object', function () {
                // var widgetObj = overlayWidgetObj.build();
                assert.equal(widgetObj, overlayWidgetObj);
            });
            it('destroy() function should exist', function () {
                (typeof overlayWidgetObj.destroy == 'function').should.be.true;
            });
            it('destroy() function should close the current overlay', function () {
                $el.find("#callNestedOverlay").click();
                assert.equal($('body').find(".bbm-wrapper").length, 2);
                overlayWidgetObj.destroy();
                overlayWidgetObj.destroy();
                assert.equal($('body').find(".bbm-wrapper").length, 0);
                assert.equal($('body').find(".modals-container").length, 0);

            });
            it('destroyAll() function should exist', function () {
                (typeof overlayWidgetObj.destroyAll == 'function').should.be.true;
            });
            it('destroyAll() function should close all overlays', function () {
                $el.find("#callNestedOverlay").click();
                assert.equal($('body').find(".bbm-wrapper").length, 2);
                overlayWidgetObj.destroyAll();
                assert.equal($('body').find(".bbm-wrapper").length, 0);
                assert.equal($('body').find(".modals-container").length, 0);
            });
            it('getOverlay() should exist', function () {
                (typeof overlayWidgetObj.getOverlay == 'function').should.be.true;
            });
            it('getOverlay() should return overlay Object', function () {
                var overlayObj = overlayWidgetObj.getOverlay();
                overlayObj.should.not.be.null;
            });
            it('should have correct overlayType assigned', function () {
                assert.equal($el.find(".overlay-" + overlayType).length, 1);
            });
            it('should be able to create 2-level nested overlay', function () {
                $el.find("#callNestedOverlay").click();
                assert.equal($('body').find(".bbm-wrapper").length, 2);
            });
            it('should be able to create 3-level nested overlay', function () {
                $el.find("#callNestedOverlay").click();
                assert.equal($('body').find(".bbm-wrapper").length, 2);
                $el.find("#callNestedOverlay").click();
                assert.equal($('body').find(".bbm-wrapper").length, 3);
            });
        });

        describe('overlayWidget callback functions', function () {

            beforeEach(function () {
                var self = this;

                var testViewObj = new TestView({});

                var config = {
                    view: testViewObj,
                    xIconEl: true,
                    cancelButton: true,
                    okButton: true,
                    type: "small",
                    beforeSubmit: function () {
                        var numberVal = this.$el.find('#field_number').val();
                        var valid = numberVal && !isNaN(parseFloat(numberVal)) && isFinite(numberVal);
                        self.testBeforeSubmit++;
                        return valid;
                    },
                    submit: function () {
                        self.testSubmit++;
                    },
                    beforeCancel: function () {
                        self.testBeforeCancel++;
                    },
                    cancel: function () {
                        self.testCancel++;
                    }
                };

                this.overlayWidgetObj = new OverlayWidget(config).build();
                this.$el = this.overlayWidgetObj.getOverlay().$el;

                this.$okButton = this.$el.find('#ok');
                this.$cancelButton = this.$el.find('#cancel');
            });


            it('beforeSubmit callback exists', function () {
                this.testBeforeSubmit = 0;
                this.$okButton.click();
                assert.equal(this.testBeforeSubmit, 1, "beforeSubmit callback is missing");
            });

            it('submit callback exists', function () {
                this.testSubmit = 0;
                this.$okButton.click();
                assert.equal(this.testSubmit, 1, "submit callback is missing");
            });

            it('beforeSubmit & submit callback executed', function () {
                this.testBeforeSubmit = 0;
                this.testSubmit = 0;
                this.$el.find('#field_number').val('123');
                this.$okButton.click();
                assert.equal(this.testBeforeSubmit, 1, "beforeSubmit should be executed");
                assert.equal(this.testSubmit, 1, "submit callback should be executed");
            });

            it('submit callback not executed', function () {
                // if the beforeCancel callback returns false, submit is not expected to execute.
                this.testBeforeSubmit = 0;
                this.testSubmit = 0;
                this.$el.find('#field_number').val('test');
                this.$okButton.click();
                assert.equal(this.testBeforeSubmit, 1, "beforeSubmit should be executed");
                assert.equal(this.testSubmit, 0, "submit callback should Not be executed");
                // Only this test case need explicit call to destroy, internally submit & cancel destroys the overlays.
                this.overlayWidgetObj.destroy();
            });

            it('beforeCancel callback exists', function () {
                this.testBeforeCancel = 0;
                this.$cancelButton.click();
                assert.equal(this.testBeforeCancel, 1, "beforeCancel callback is missing");
            });

            it('cancel callback exists', function () {
                this.testCancel = 0;
                this.$cancelButton.click();
                assert.equal(this.testCancel, 1, "cancel callback is missing");
            });

            it('beforeCancel & cancel callback executed', function () {
                this.testBeforeCancel = 0;
                this.testCancel = 0;
                this.$cancelButton.click();
                assert.equal(this.testBeforeCancel, 1, "beforeCancel should be executed");
                assert.equal(this.testCancel, 1, "cancel callback should be executed");
            });

            it('validation failed, submit callback not executed, cancel button clicked', function () {
                this.testBeforeSubmit = 0;
                this.testSubmit = 0;
                this.testBeforeCancel = 0;
                this.testCancel = 0;
                this.$el.find('#field_number').val('test');
                this.$okButton.click();
                assert.equal(this.testBeforeSubmit, 1, "beforeSubmit should be executed");
                assert.equal(this.testSubmit, 0, "submit callback should Not be executed");
                this.$cancelButton.click();
                assert.equal(this.testBeforeCancel, 1, "beforeCancel should be executed");
                assert.equal(this.testCancel, 1, "cancel should be executed");
            });

        });

        describe('overlaySingletonLayout', function () {

            it('\'new\' operator can not be used to instantiate object', function () {
                var fn = function () {
                    new overlaySingletonLayout()
                };
                expect(fn).to.throw(TypeError);
            });
            it('getInstance() function should exist', function () {
                (typeof overlaySingletonLayout.getInstance == 'function').should.be.true;
            });
            it('getInstance should always return same object', function () {
                var singletonObj_1 = overlaySingletonLayout.getInstance();
                var singletonObj_2 = overlaySingletonLayout.getInstance();
                expect(singletonObj_1).to.equal(singletonObj_2);
            });

        });

    });

});
