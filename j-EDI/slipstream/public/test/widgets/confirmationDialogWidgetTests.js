define([
    'widgets/confirmationDialog/confirmationDialogWidget'
],function(ConfirmationDialogWidget) {
    describe('ConfirmationDialogWidget - Unit tests:', function() {
        describe('ConfirmationDialogWidget', function() {
            
            var yesButtonCallback = function() {
                console.log('Yes button callback called');
            };

            var noButtonCallback = function() {
                console.log('No button callback called');
            };

            var conf = {
                title: 'Test Confirmation Dialog',
                question: 'Are you sure you want to respond Yes to this question?',
                yesButtonLabel: 'Yes',
                noButtonLabel: 'No',
                yesButtonCallback: yesButtonCallback,
                noButtonCallback: noButtonCallback,
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered',
                // kind: 'warning'
            };

            var confirmationDialogObj = new ConfirmationDialogWidget(conf);

            it('should exist', function() {
                confirmationDialogObj.should.exist;
            });

            it('should expose a vent', function() {
                confirmationDialogObj.vent.should.exist;
            });

            it('build() should exist', function() {
                assert.isFunction(confirmationDialogObj.build, 'The ConfirmationDialogWidget must have a function named build.');
            });
            
            it('destroy() should exist', function() {
                assert.isFunction(confirmationDialogObj.destroy, 'The ConfirmationDialogWidget must have a function named destroy.');
            });
        });
    });
});