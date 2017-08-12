define([
    'backbone',
    'text!widgets/overlay/tests/templates/activityIndicatorTemplate.html'
], function (Backbone, activityIndicatorTemplate) {
    var ActivityIndicatorView = Backbone.View.extend({

        render: function () {
            var template = Hogan.compile(activityIndicatorTemplate);
            var elementsTemplateHtml = template.render({});
            $(this.el).append(elementsTemplateHtml);
            return this;
        }
    });

    return ActivityIndicatorView;
});