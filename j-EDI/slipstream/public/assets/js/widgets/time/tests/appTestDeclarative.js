/**
 * A view that uses a declarative form to render Time widget with in.
 * Validator library to validate the time
 *
 * @module TimeView
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/time/timeWidget',
    'text!widgets/time/tests/templates/declarativeTime.html',
    'widgets/form/formValidator'
], function (Backbone, TimeWidget, DeclarativeTemplate, FormValidator) {
    /**
     * Constructs a TimeView
     */
    var TimeView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            var form = this.$el.append(DeclarativeTemplate);
            var timeWidget = new TimeWidget({
                "container": '#time_declarative'
            }).build();
            new FormValidator().validateForm(form);
            return this;
        }
    });

    return TimeView;
});