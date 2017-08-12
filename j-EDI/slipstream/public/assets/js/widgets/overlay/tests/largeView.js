define([
    'backbone',
    'widgets/overlay/tests/conf/config',
    'text!widgets/overlay/tests/templates/exampleTemplate.html',
    'widgets/overlay/tests/mediumView',
    'widgets/overlay/overlayWidget'
], function (Backbone, Conf, ExampleTemplate, SampleView, OverlayWidget) {
    var AppView = Backbone.View.extend({

        events: {
            'click #callNestedOverlay': 'createNestedOverlay',
            'click #yes': 'callWideViewCloseCallback'
        },

        render: function () {
            var template = Hogan.compile(ExampleTemplate);
            var elementsTemplateHtml = template.render(Conf.elements);
            $(this.el).append(elementsTemplateHtml);
            return this;
        },

        createNestedOverlay: function () {
            var sampleViewObj = new SampleView({});

            var conf = {
                view: sampleViewObj,
                xIconEl: true,
                cancelButton: false,
                okButton: false,
                type: 'medium'
            };
            this.overlayWidgetObj = new OverlayWidget(conf);
            this.overlayWidgetObj.build();
        },

        eventClicked: function () {
            console.log("event clicked from largeView");
        },

        callWideViewCloseCallback: function () {
            console.log("Overlay destroy callback is triggered from Large view");
            this.options.wideViewDestroyChildOverlay();
        },

        close: function(){
            console.log("close function of Large view is called before destroying the child");
            // Do not call the destroy method of parent overlay from close - it will create the loop as shown in given line below
            //this.options.wideViewDestroyChildOverlay(); // These line is commented purposefully to indicate how the loop can happen between wide view & large view while closing/destroying the overlays.
        }
    });

    return AppView;
});