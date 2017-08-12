/**
 * A module that builds the tooltip used in the form widget
 *
 * @module TooltipBuilder
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'widgets/form/formTemplates',
    'widgets/tooltip/tooltipWidget',
    'jquery.tooltipster'
],  /** @lends TooltipBuilder */
    function(render_template, FormTemplates, TooltipWidget) {

    /**
     * TooltipBuilder constructor
     *
     * @constructor
     * @class TooltipBuilder - Builds the tooltips used in the grid widget
     *
     * @returns {Object} Current TooltipBuilder's object: this
     */
    var TooltipBuilder = function(formContainer, conf){

        /**
         * Builds the TooltipBuilder
         * @returns {Object} Current instance
         */

        var templates = new FormTemplates().getPartialTemplates();

        /**
         * Adds tooltips to title of the Form widget
         */
        this.addHeaderTooltip = function (){
            /**
             * Builds a view for tooltip
             * @param {Object} help - object that will have configuration parameter for help
             */
            var getTooltipView = function (help){
                var tooltipView  = render_template(templates.hoverTooltip,{
                    'help-content':help['content'],
                    'ua-help-text':help['ua-help-text'],
                    'ua-help-identifier':help['ua-help-identifier']
                });
                return tooltipView;
            };

            //Builds infotip for the title of Form
            if (conf.elements['title-help']){
                new TooltipWidget({
                    "container": formContainer.find('.form-title-help'),
                    "view": getTooltipView(conf.elements['title-help'])
                }).build();
            }

         };

        /**
         * Adds tooltips to content of the Form widget
         */
        this.addContentTooltip = function (){
            new TooltipWidget({
                "container": formContainer.find('.content:first')
            }).build();
        };

        /**
         * Adds tooltips to the elements from form rows or sections
         * @param {Object} $elements - DOM object of the elements that should have tooltips
         */
        this.addElementsTooltip = function ($elements){
            new TooltipWidget({
                "container": $elements
            }).build();
        };

        };
    return TooltipBuilder;
});