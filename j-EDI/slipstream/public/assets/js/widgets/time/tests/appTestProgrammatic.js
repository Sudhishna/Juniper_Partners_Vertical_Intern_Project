/**
 * A view that uses a declarative form to render Time widget with in.
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
            new TimeWidget({
                "container": '#test_widget'
            }).build();
            return this;
        }
    });

    return TimeView;
});