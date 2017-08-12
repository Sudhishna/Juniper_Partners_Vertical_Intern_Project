/**
 * A library that groups templates used by the Grid widget
 *
 * @module GridTemplates
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'text!widgets/grid/templates/gridContainer.html',
    'text!widgets/grid/templates/actionContainer.html',
    'text!widgets/grid/templates/filterContainer.html',
    'text!widgets/grid/templates/subGridContainer.html',
    'text!widgets/grid/templates/saveContainer.html',
    'text!widgets/grid/templates/moreCell.html',
    'text!widgets/grid/templates/editCell.html',
    'text!widgets/grid/templates/partialInputCell.html',
    'text!widgets/grid/templates/inputCellEnd.html',
    'text!widgets/grid/templates/dropdownCell.html',
    'text!widgets/grid/templates/partialDropdownCell.html',
    'text!widgets/grid/templates/helpTooltip.html',
    'text!widgets/grid/templates/moreTooltip.html',
    'text!widgets/grid/templates/gridHeader.html',
    'text!widgets/grid/templates/treeAllCheckbox.html',
    'text!widgets/grid/templates/treeCheckbox.html',
    'text!widgets/grid/templates/treeNoCheckbox.html',
    'text!widgets/grid/templates/columnAction.html',
    'text!widgets/grid/templates/gridDraggableElement.html',
    'text!widgets/grid/templates/gridNotDroppableMask.html',
    'text!widgets/grid/templates/loadingBackground.html',
    'text!widgets/grid/templates/noResultTemplate.html',
    'text!widgets/grid/templates/footerContainer.html',
    'text!widgets/grid/templates/pagination.html'
], /** @lends GridTemplates */
    function(gridContainer,
             actionContainer,
             filterContainer,
             subGridContainer,
             saveContainer,
             moreCell,
             editCell,
             partialInputCell,
             inputCellEnd,
             dropdownCell,
             partialDropdownCell,
             helpTooltip,
             moreTooltip,
             gridHeader,
             treeAllCheckbox,
             treeCheckbox,
             treeNoCheckbox,
             columnAction,
             gridDraggableElement,
             gridNotDroppableMask,
             loadingBackgroundTemplate,
             noResultTemplate,
             footerContainer,
             pagination){

    /*
     * GridTemplates constructor
     *
     * @constructor
     * @class GridTemplates
     */
    var GridTemplates = function () {

        /**
         * Provides partial templates used by the grid widget to create elements of the grid.
         */
          this.getTemplates = function () {
              return {
                  "gridContainer":gridContainer,
                  "actionContainer":actionContainer,
                  "filterContainer":filterContainer,
                  "subGridContainer":subGridContainer,
                  "saveContainer":saveContainer,
                  "moreCell":moreCell,
                  "editCell": editCell,
                  "partialInputCell": partialInputCell,
                  "inputCellEnd": inputCellEnd,
                  "dropdownCell": dropdownCell,
                  "partialDropdownCell": partialDropdownCell,
                  "helpTooltip": helpTooltip,
                  "moreTooltip": moreTooltip,
                  "gridHeader": gridHeader,
                  "treeAllCheckbox": treeAllCheckbox,
                  "treeCheckbox": treeCheckbox,
                  "treeNoCheckbox": treeNoCheckbox,
                  "gridDraggableElement": gridDraggableElement,
                  "gridNotDroppableMask": gridNotDroppableMask,
                  "columnAction": columnAction,
                  "loadingBackgroundTemplate": loadingBackgroundTemplate,
                  "noResultContainer": noResultTemplate,
                  "footerContainer": footerContainer,
                  "pagination": pagination
              }
          };

  };

    return GridTemplates;
});
