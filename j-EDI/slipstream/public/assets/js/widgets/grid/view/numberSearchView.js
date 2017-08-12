/**
 * A view that uses the formWidget to a produce a form from a configuration file
 * The configuration file contains the title, labels, element types, validation types and buttons of the form
 *
 * @module Quick View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/conf/formConfiguration',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget'
], function(Backbone, formConf, FormWidget, OverlayWidget){
    var NumberSearchView = Backbone.View.extend({

        events: {
            'click #add_number_filter': 'addNumberToken',
            'click #cancel_number_filter': 'cancelNumberFilter'
        },

        initialize: function () {
            this.overlay = new OverlayWidget({
                view: this,
                type: 'small',
                class: 'grid-widget'
            });
            this.overlay.build();
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConf.numberColumnFilter,
                "container": this.el
            });
            this.form.build();
            this.addRadioButtonHandler();
            return this;
        },

        addRadioButtonHandler: function () {
            var $form = this.$el.find('form#number_filter_overlay');
            var $radioButtonSection = $form.find('.number_column_filter_section');
            var numberInputs = $radioButtonSection.find('input[type="text"]');
            $form.find("input[name='number_radio_button']").on('change', function(e){
                numberInputs.prop("disabled", true).val('');
                $radioButtonSection.find("input#"+e.target.id+"_number").prop("disabled", false);
                if(e.target.id == 'between'){
                    $radioButtonSection.find("input#and_number").prop("disabled", false);
                }
            });
        },

        addNumberToken: function (e){
            var values = this.form.getValues(),
                $radioButtonContainer = this.$el.find('.number_column_filter_section.radioButtons .elementinput'),
                column = this.options.column;
            var token = "",
                type = values[0].value,
                value = values[1].value,
                toValue;
            if (type == 'between' && value)
                toValue = values[2].value;

            if(value || toValue){
                $radioButtonContainer.removeClass('error');

                switch (type){ //switch on number range: exactly, between, greater or lesser
                    case 'exactly':
                        token += ' = ' + value;
                        break;
                    case 'between':
                        token += ': ' + value + " - " + toValue;
                        break;
                    case 'greater':
                        token += ' >= ' + value;
                        break;
                    case 'lesser':
                        token += ' =< ' + value;
                        break;
                }

                var key = column.index || column.name;
                this.options.removeTokens(column);                   
                this.options.addTokens(key + token);
                this.cancelNumberFilter(e);
            } else {
                $radioButtonContainer.addClass('error');  //TODO: not showing!
            }
        },

        cancelNumberFilter: function (e){
            this.overlay.destroy();
            e.preventDefault();
            e.stopPropagation();
        }

    });

    return NumberSearchView;
});