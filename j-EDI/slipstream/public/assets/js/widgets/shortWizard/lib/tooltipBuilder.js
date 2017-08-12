/**
 * A module that builds the tooltip used in the short wizard widget
 *
 * @module TooltipBuilder
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'lib/template_renderer/template_renderer',
    'text!widgets/shortWizard/templates/helpTooltip.html',
    'widgets/tooltip/tooltipWidget',
    'jquery.tooltipster'
],  /** @lends TooltipBuilder */
    function(render_template, TooltipTemplate, TooltipWidget) {

    /**
     * TooltipBuilder constructor
     *
     * @constructor
     * @class TooltipBuilder - Builds the tooltips used in the grid widget
     *
     * @returns {Object} Current TooltipBuilder's object: this
     */
    var TooltipBuilder = function($containerElement, conf){

        /**
         * Adds tooltips to title of the Form widget
         */
        this.addHeaderTooltip = function (){
            /**
             * Builds a view for tooltip
             * @param {Object} help - object that will have configuration parameter for help
             */
            var getTooltip = function (help){
                var tooltipTemplate  = render_template(TooltipTemplate,{
                    'help-content':help['content'],
                    'ua-help-text':help['ua-help-text'],
                    'ua-help-identifier':help['ua-help-identifier']
                });
                return tooltipTemplate;
            };

            //Builds infotip for the title of shortWizard
            if (conf['titleHelp']){
                var tooltip = getTooltip(conf['titleHelp']);

                new TooltipWidget({
                    "container": $containerElement,
                    "view": tooltip
                }).build();
            }

         };
        };
    return TooltipBuilder;
});