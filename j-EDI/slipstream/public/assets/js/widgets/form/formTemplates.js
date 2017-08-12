/**
 * A library that exposes the templates that other widgets can use to build a form element with the same DOM structure as the form widget.
 * Conforming to the style provided by the form widget facilitates the integration of form element widgets with the form widget and the form validator.
 *
 * @module FormTemplates
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'text!widgets/form/templates/programmaticForm.html',
    'text!widgets/form/templates/partialElementStart.html',
    'text!widgets/form/templates/partialInput.html',
    'text!widgets/form/templates/partialMultipleValidation.html',
    'text!widgets/form/templates/partialDropdown.html',
    'text!widgets/form/templates/partialElementEnd.html',
    'text!widgets/form/templates/deleteRow.html',
    'text!widgets/form/templates/titleHelp.html',
    'text!widgets/form/templates/hoverTooltip.html'
], /** @lends FormTemplates */
    function(fullForm, partialElementStart, partialInput, partialMultipleValidation, partialDropdown, partialElementEnd, deleteRow, titleHelp, hoverTooltip){

    /**
     * FormTemplates constructor
     *
     * @constructor
     * @class FormTemplates
     */
    var FormTemplates = function () {

        /**
         * Provides the main template used by the form widget to create a form
         * @returns {Object} the main form template
         * @inner
         */
          this.getFormTemplate = function () {
              return fullForm;
          };

        /**
         * Provides partial templates used by the form widget to create elements of the form. The partial templates are:
         * "partialElementStart": partial template to be used at the beginning of a form element
         * "partialInput" partial template to be used as a part of the input element
         * "partialMultipleValidation: partial template to be used when an element requires multiple validation
         * "partialElementEnd" partial template to be used at the end of a form element
         * @returns {Object} an object with the partial templates for the header, body and footer of a form element
         */
          this.getPartialTemplates = function () {
              return {
                  "partialElementStart":partialElementStart,
                  "partialInput":partialInput,
                  "partialMultipleValidation":partialMultipleValidation,
                  "partialDropdown": partialDropdown,
                  "partialElementEnd": partialElementEnd,
                  "deleteRow": deleteRow,
                  "titleHelp": titleHelp,
                  "hoverTooltip": hoverTooltip
              }
          };

  }

    return FormTemplates;
});
