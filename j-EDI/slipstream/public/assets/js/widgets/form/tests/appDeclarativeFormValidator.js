/**
 * A view that uses a form html markup to a produce a form with client side validation and tooltips
 *
 * @module DeclarativeFormValidatorView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'text!widgets/form/tests/conf/declarativeSampleForm.html',
    'widgets/form/formValidator',
    'widgets/tooltip/tooltipWidget'
], function(Backbone, declarativeForm, FormValidator, TooltipWidget){
    var DeclarativeFormValidatorView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            var form = this.$el.append(declarativeForm);
            new FormValidator().validateForm(form);
            new TooltipWidget({
                "container": form
            }).build();
            return this;
        }

    });

    return DeclarativeFormValidatorView;
});