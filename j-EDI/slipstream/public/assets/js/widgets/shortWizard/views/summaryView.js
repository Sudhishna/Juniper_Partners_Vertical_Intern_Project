/**
 * Module that renders the summary view
 *
 * @module Summary View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'jquery',
    'backbone',
    'widgets/form/formWidget',
    'widgets/shortWizard/conf/summaryConfiguration',
    'text!widgets/shortWizard/templates/summaryValues.html',
    'text!widgets/shortWizard/templates/editLink.html',
    'lib/template_renderer/template_renderer',
    'widgets/shortWizard/views/wizardSummaryView',
    'lib/i18n/i18n'
], function($, Backbone, FormWidget, summaryConfiguration, multipleValueTemplate, editLink, render_template, WizardSummaryView, i18n) {
    var SummaryView = WizardSummaryView.extend({

        vent: null,

        events: {
            "click .wizard_edit_link" :  "handleEditClick"
        },
        
        initialize: function (options) {
            this.pages = options.pages;
            this.vent = options.vent;
            this.summaryTitle = options.summaryTitle;
            this.summaryEncode = options.summaryEncode;
            this.formWidget = new FormWidget({
                "elements": summaryConfiguration.list,
                "container": this.el
            });
            return this;
        },

        render: function () {
            var summaryElements = [];

            for (var i = 0; i < this.pages.length; i++) {
                if (this.pages[i].intro == true) {
                    continue;
                }

                if (this.pages[i].view.getSummary === undefined) {
                    continue;
                }
                var summaries = this.pages[i].view.getSummary();
                if (summaries === undefined) {
                    continue;
                }
                
                var isFirstEntry = true;

                for (var j = 0; j < summaries.length; j++) {
                    var summary = summaries[j];
                    if (typeof summary == 'object' &&
                        summary.label && summary.value) {
                        if (isFirstEntry) {
                            summary.id = i.toString();
                            isFirstEntry = false;
                        }
                        if (Array.isArray(summary.value)) {
                            var stringValue = "";
                            for (var k = 0; k < summary.value.length; k++) {
                                stringValue += render_template(multipleValueTemplate, summary.value[k]);
                            }
                            summary.value = stringValue;
                        }
                        summaryElements.push(summary);
                    }
                }
            }

            this.formatSummaryList(summaryElements);
            var formWidgetObject = this.formWidget.build();
            this.addEditLink(this.$el);
            return this;
        },

        getSummary: function () {
            return [];
        },

        formatSummaryList: function (summaryList) {
            var element_type = "element_description";
            if(this.summaryEncode){
                element_type = "element_description_encode";
            }

            for (var i = 0; i < summaryList.length; i++) {
                summaryList[i][element_type] = "true";
            };

            this.formWidget.insertElementsFromJson('0', JSON.stringify(summaryList));
            return this;
        },

        addEditLink: function (form) {
            form.find('span.optionselection[id]').each(function( index ) {
                var linkId = $(this).attr('id');
                var newLink = render_template(editLink, {
                    "id":'edit_'+linkId,
                    "edit": i18n.getMessage('wizard_summary_edit_link_label')
                });
                $(this).parent().after(newLink);
                $(this).parent().parent().addClass('summary_section');
            });
        },

        handleEditClick: function(evt){
            var idOfTarget = evt.target.id;
            if(idOfTarget){
                var parsedCommand = idOfTarget.split('_')[0];
                var parsedPageToRender = parseInt(idOfTarget.split('_')[1]);
                this.vent.trigger("step:try_selected", parsedPageToRender);
            }
        }

    });

    return SummaryView;
});