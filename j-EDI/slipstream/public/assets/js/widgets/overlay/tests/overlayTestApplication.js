/**
 * Overlay widget Test Application is a sample applcation that utilizes the overlay widget.
 *
 * @module OverlayTestApplication
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(['widgets/overlay/tests/wideView',
        'widgets/overlay/tests/testView',
        'widgets/overlay/tests/fixedHeightView',
        'widgets/overlay/overlayWidget',
        'widgets/overlay/tests/views/zonePoliciesView',
        'widgets/overlay/tests/models/zonePoliciesModel'],
function (OverlayView, TestView, FixedHeightView, OverlayWidget, FormOverlayView, ZonePoliciesModel) {
    this.launch = function(){     
        $('#nestedOverlay').click(function(){
            var overlayViewObj = new OverlayView({});
            var conf = {
                view: overlayViewObj,
                cancelButton: false,
                okButton: false,
                showScrollbar: true,
                type: 'wide'
            };
            this.overlayWidgetObj = new OverlayWidget(conf);
            this.overlayWidgetObj.build();
        });

        $('#open').click(function(){
            var overlaySize = $("input[name=overlaySize]:checked");
            var contentSize = $("input[name=contentSize]:checked");
            var contentHasTitle = $("#contentTitle");
            var contentHasButtons = $("#contentButtons");
            var contentHasInputField = $("#contentField");
            var overlayHasTitle = $("#overlayTitle");
            var overlayHasButtons = $("#overlayButtons");

            var overlayViewObj = new TestView({
                contentSize: contentSize.val(),
                buttonsOnContent: contentHasButtons.is(":checked"),
                titleOnContent: contentHasTitle.is(":checked"),
                numberFieldOnContent: contentHasInputField.is(":checked")
            });

            var conf = {
                view: overlayViewObj,
                cancelButton: overlayHasButtons.is(":checked"),
                okButton: overlayHasButtons.is(":checked"),
                showScrollbar: true,
                type: overlaySize.val(),
                title: overlayViewObj.title,
                beforeSubmit: function(){
                    console.log("-- beforeSubmit is executed");
                    var valid = true;

                    if(contentHasInputField.is(":checked")) {
                        var numberVal = this.$el.find('#field_number').val();
                        valid = numberVal && !isNaN(parseFloat(numberVal)) && isFinite(numberVal);
                        if (valid) {
                            console.log("No Error, submit method will be executed next");
                        } else {
                            console.log("Validation failed, submit method will not be executed");
                        }
                    }

                    return  valid;
                },
                submit: function(){
                    console.log("-- submit is executed");
                },
                beforeCancel: function(){
                    console.log("-- beforeCancel is executed");
                },
                cancel: function(){
                    console.log("-- cancel is executed");
                }
            };

            if(!overlayHasTitle.is(":checked")){
                delete conf.title;
            }

            this.overlayWidgetObj = new OverlayWidget(conf);
            this.overlayWidgetObj.build();
        });

        $('#formTestCaseLink').click(function(){
            var overlayViewObj = new FormOverlayView({
                'model': new ZonePoliciesModel.zone.model(),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'isMin'     : false
            });
        });

        $('#formTestCaseLinkMin').click(function(){
            var overlayViewObj = new FormOverlayView({
                'model': new ZonePoliciesModel.zone.model(),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'isMin'     : true
            });
        });

        $('#overlayWithFixedContainerTestCaseLink').click(function(evt){
            var overlayViewObj = new FixedHeightView({});
            var conf = {
                view: overlayViewObj,
                cancelButton: false,
                okButton: false,
                showScrollbar: true,
                title: null,
                type: 'small'
            };
            this.overlayWidgetObj = new OverlayWidget(conf);
            this.overlayWidgetObj.build();
        });
    };
    return this;
});
