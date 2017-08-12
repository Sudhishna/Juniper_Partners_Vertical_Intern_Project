/**
 * A module that builds the tooltip used in the list builder widget
 *
 * @module TooltipBuilder
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'lib/template_renderer/template_renderer',
    'text!widgets/listBuilderNew/templates/tooltip.html',
    'widgets/tooltip/tooltipWidget'
],  /** @lends TooltipBuilder */
    function(render_template, tooltipTemplates, TooltipWidget) {

    /**
     * TooltipBuilder constructor
     *
     * @constructor
     * @class TooltipBuilder - Builds the tooltips used in the list builder widget
     *
     * @returns {Object} Current TooltipBuilder's object: this
     */
    var TooltipBuilder = function(conf){

        /**
         * Adds tooltips to the rows of the list builder widget
         * @param {Object} gridTable - table with elements that will be have tooltips added
         */
        this.addContentTooltips = function (gridTable){
       

            var $moreContent = $(render_template(tooltipTemplates));

            new TooltipWidget({
                "elements": {
                    "minWidth": 100,
                    "maxWidth": 100,
                    "position": "left",
                    "contentAsHTML": true,
                    "style": "grid-widget",
                    "animation": false,
                    "contentCloning": false,
                    "functionBefore": function ($moreContainer, resume) {
                        var rowId = $moreContainer[0].id,
                            rowData = gridTable.jqGrid('getRowData',rowId);

                        var setTooltipData = function (moreData){
                            $moreContent = $(render_template(tooltipTemplates,{items: moreData}));
            
                            resume();
                            $moreContainer.tooltipster('content', $moreContent);
                        }
                        conf.rowTooltip(rowData, setTooltipData);
                    }
                },
                "container": gridTable.find('tr'),
                "view": $moreContent
            }).build();

        };

    };

    return TooltipBuilder;
});
