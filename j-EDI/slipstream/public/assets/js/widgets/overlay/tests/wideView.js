define([
    'hogan',
    'backbone',
    'widgets/overlay/tests/conf/config',
    'text!widgets/overlay/tests/templates/exampleTemplate.html',
    'widgets/overlay/tests/largeView',
    'widgets/overlay/overlayWidget'
], function (Hogan, Backbone, Conf, ExampleTemplate, SampleView, OverlayWidget) {
    var AppView = Backbone.View.extend({

        events: {
            'click #callNestedOverlay': 'createNestedOverlay',
            'click #yes': 'eventClicked'
        },

        render: function () {
            var template = Hogan.compile(ExampleTemplate);
            var elementsTemplateHtml = template.render(Conf.elements);
            $(this.el).append(elementsTemplateHtml);
            return this;
        },

        createNestedOverlay: function () {
            var self = this;
            var sampleViewObj = new SampleView({'wideViewDestroyChildOverlay': _.bind(self.destroyChildOverlay, self)});

            var conf = {
                view: sampleViewObj,
                xIconEl: true,
                cancelButton: false,
                okButton: false,
                type: 'large'
            };
            this.overlayWidgetObj = new OverlayWidget(conf);
            this.overlayWidgetObj.build();
        },

        eventClicked: function () {
            console.log("event clicked from wideView");
        },

        destroyChildOverlay: function(){
            console.log("destroyChildOverlay called in Wide view");
            this.overlayWidgetObj.destroy();
        }
    });

    return AppView;
});