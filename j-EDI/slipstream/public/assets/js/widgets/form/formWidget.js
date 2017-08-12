/**
 * A module that builds a form from a template and one or two configuration objects.
 * The template is located in the templates folder (form.html) and was written using Mustache
 * The configuration is composed by the elements of the form: conf.elements and
 * the prepopulated values for each elements: conf.values
 *
 * @module FormWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'widgets/form/formTemplates',
    'widgets/form/widgetsIntegration',
    'widgets/form/formValidator',
    'widgets/form/util/configFormatter',
    'widgets/form/util/formUpdater',
    'widgets/form/lib/ipv4mask',
    'lib/template_renderer/template_renderer',
    'widgets/form/lib/tooltipBuilder'
], /** @lends FormWidget */
    function(FormTemplates, WidgetsIntegration, FormValidator, ConfigFormatter, FormUpdater, ipv4, render_template, TooltipBuilder) {

    /**
     * FormWidget constructor
     *
     * @constructor
     * @class FormWidget - Builds a form from a template and configuration objects.
     *
     * @param {Object} conf - configuration object with three parameters:
     * container: define the container where the widget will be rendered
     * elements: define which elements will be part of the form
     * <values>: define the value of the elements
     */
    var FormWidget = function(conf){

        /**
         * Initializes the form widget with constructor and other variables
         */
        this.conf = {
            "container": $(conf.container),
            "elements" : conf.elements,
            "values" : conf.values
        };
        var templates = new FormTemplates();
        var formValidator = new FormValidator();
        var configFormatter = new ConfigFormatter(conf.elements);
        var formUpdater = new FormUpdater();
        var widgetsIntegration, addProgressiveDisclosure, tooltipBuilder;

        /**
         * Builds the formWidget in the specified container
         * @returns {Object} current FormWidget object
        */
        this.build =  function () {
            var formConfigurationById = configFormatter.formatConfigElements(this.conf.elements);
            widgetsIntegration = new WidgetsIntegration(formConfigurationById, this.conf);

            var elementsTemplateHtml = render_template(templates.getFormTemplate(), this.conf.elements, templates.getPartialTemplates());

            if(typeof this.conf.values == 'undefined'){
                this.formTemplateHtml =  this.conf.container.html(elementsTemplateHtml);
            } else {
                this.formTemplateHtml = this.conf.container.html(render_template(elementsTemplateHtml, this.conf.values));
            }
            widgetsIntegration.addWidgets(this.formTemplateHtml);
            formValidator.validateForm(this.formTemplateHtml, conf.elements);

            tooltipBuilder = new TooltipBuilder(this.formTemplateHtml, conf);
            tooltipBuilder.addHeaderTooltip();
            tooltipBuilder.addContentTooltip();

            addProgressiveDisclosure(this.formTemplateHtml, this);
            updateFilePath(this.formTemplateHtml);

            return this;
        };

        /**
         * Destroys all elements created by the FormWidget in the specified container
         * @returns {Object} current FormWidget object
        */
        this.destroy =  function () {
            this.conf.container.remove();
            return this;
        };

        /**
         * Validates that all the fields of the form has the right input
         * Validates externally integrated widgets
         * @param {Object} <optional> form - Form jquery object
         * @returns {Boolean} true is form has valid inputs or false is one or more elements of the form are invalid
        */
        this.isValidInput = function (){
            var isValid = false;
            if (this.formTemplateHtml){
                var form = this.formTemplateHtml.find('form');
                isValid = formValidator.isValidInput(form);
                if(isValid){
                    var externalIntegratedWidgets = form.find('[data-integrated-widget]');
                    externalIntegratedWidgets.each(function(){
                        if($(this).attr('data-invalid') != undefined){
                            isValid =  false;
                            return false;
                        }
                    });
                }
            } else {
                throw new Error("The form widget has to be built first");
            }
            return isValid
        };

        /**
         * Provides a combination of name/value sets that represents the name of the input field and its value for each element of the form
         * @param {Object} <optional> form - Form jquery object
         * @returns {Object} Object with a combination of name/value sets that represents the name of the input field and its value
         */
        this.getValues = function (){
            var formValues = null;
            if (this.formTemplateHtml){
                var form = this.formTemplateHtml.find('form');
                formValues = $(form).serializeArray();
                if (form.find(".fileupload")){
                    var files = form.find(".fileupload");
                    $.each( files, function( k, v) {
                        if (v){
                            console.log(v);
                            var textID = v.previousElementSibling.previousElementSibling.id;
                            formValues.push({name: textID, value: v.files});
                        }
                    });
                }
            } else {
                throw new Error("The form widget has to be built first");
            }
            return formValues;
        };

        /**
         * Shows the form inline error box with the integrated widget by app.
         * @param {Boolean} elementId - elementId of the form element to which widget is integrated
         * @param {Boolean} <optional> show - If it is set to false, it hides the inline form error for specific element
         */
        this.showFormInlineError = function (elementId, show){
            if (this.formTemplateHtml){
                var $element = this.formTemplateHtml.find('form #'+ elementId);
                $element.attr('data-integrated-widget','true');
                if(_.isBoolean(show) && !show) {
                    formValidator.hideFormInlineError($element);
                }else{
                    formValidator.showFormInlineError($element);
                }
            } else {
                throw new Error("The form widget has to be built first");
            }
        };

        /**
         * Shows the form error box with the content defined in the form configuration (err_div_<*> parameters)
         * @param {Boolean} <optional> notShow - If it is set to true, it hides the form error
         * @returns {Object} Object with a combination of name/value sets that represents the name of the input field and its value
         */
        this.showFormError = function (errMsg, notShow){
            if (this.formTemplateHtml){
                var form = this.formTemplateHtml.find('form');
                if (notShow){
                    $(form).find('.alert-box').hide();
                } else {
                    $(form).find('.alert-box')
                        .html(errMsg)
                        .show();
                }
            } else {
                throw new Error("The form widget has to be built first");
            }
        };

        /**
         * Insert values from a collection in the id of the elements of the configuration object
         * @param {String} id - DOM id
         * @param {Object} collection - Collection that contains data to be inserted
         * @returns {Object} updated elements of the configuration object
        */
        this.insertValuesFromCollection = function (id, collection){
            configFormatter.insertValuesFromCollection(id, collection);
            return conf.elements;
        };

        /**
         * Insert values from a JSON object in the id of the elements of the configuration object
         * @param {String} id - DOM id
         * @param {Object} JSON object - JSON that contains data to be inserted
         * @returns {Object} updated elements of the configuration object
        */
        this.insertValuesFromJson = function (elementId, json){
            configFormatter.insertValuesFromJson(elementId, json);
            return conf.elements;
        };

        /**
         * Insert values from a JSON object in the section id of the elements of the configuration object
         * @param {String} sectionId - id of the section in the form configuration object
         * @param {Object} JSON object - JSON that contains data to be inserted
         * @returns {Object} updated elements of the configuration object
         */
        this.insertElementsFromJson = function (sectionId, json){
            configFormatter.insertElementsFromJson(sectionId, json);
            return conf.elements;
        };

        /**
         * Insert elements to a container
         * @param {String} id - DOM id
         * @param {Object} elements - Elements in DOM format
         * @returns {Object} Updated form
        */
        this.insertElementsToContainer = function (id, elements){
            var form = null;
            if (this.formTemplateHtml){
                this.formTemplateHtml.find("#"+id).parent().after(elements);
                form = this.formTemplateHtml;
            } else {
                throw new Error("The form widget has to be built first");
            }
            return form;
        };

        /**
         * Inserts dropdown content (option) to a dropdown element (select) after a form has been built
         * @param {dropdownId} ip of the dropdown element
         * @param {Object} JSON with the content to be inserted. It should follow the format [{label:"label",value:"value"}]
         * @param {Boolean} true: remove default content of the dropdown and add JSON object content
         *                  false: append the content of the dropdown at the end of the existing dropdown list,
         */
        this.insertDropdownContentFromJson = function (dropdownId, json, deleteDefaultList){
            var form = null;
            if (this.formTemplateHtml){
                var selectTemplate = templates.getPartialTemplates().partialDropdown;
                var dropdownContent = render_template(selectTemplate, {"values": json});
                var dropdownContainer = this.formTemplateHtml.find("#"+dropdownId)
                if (deleteDefaultList) dropdownContainer.empty();
                dropdownContainer.append(dropdownContent);
                form = this.formTemplateHtml;
            } else {
                throw new Error("The form widget has to be built first");
            }
            return form;
        };

        /**
         * Copies a row using its className and adds it after the last row with the same className
         * @param {String} rowClassName - className of the row that needs to be copied
         * @param {Boolean} enableDelete - true: delete icon is available. When a row is deleted, an event with the rowClassName name is triggered.
         * @param {Object} elementConf - Elements in DOM format
         * @returns {Object} New added row
         */
        this.copyRow = function (rowClassName, enableDelete, elementConf){
            var newRow = null;
            if (this.formTemplateHtml){
                var sourceRow = this.formTemplateHtml.find('.'+ rowClassName);
                var widgetIdentifier = sourceRow.attr('data-widgetidentifier');
                var widgets = this.getInstantiatedWidgets();

                if(typeof this.sourceRows == 'undefined'){
                    this.sourceRows = {};
                }
                if(typeof this.sourceRows[rowClassName] == 'undefined'){
                    var originalRow = sourceRow;
                    if (sourceRow.length>1){
                        $(sourceRow[0]).addClass('first_element');
                    }
                    var type = "element";
                    if (widgetIdentifier){
                        originalRow = widgets[widgetIdentifier]['element'];
                        type = "widget";
                    }
                    if (enableDelete) {
                        formUpdater.appendDeleteIcon(sourceRow, this.formTemplateHtml, rowClassName);
                    }
                    this.sourceRows[rowClassName] = {
                        "row" : originalRow,
                        "type" : type,
                        "sequential" : 1
                    };
                    sourceRow.attr('data-copy',rowClassName);
                }
                newRow = formUpdater.copyRow(this.sourceRows[rowClassName], elementConf, rowClassName);//elementConf{"label","id","value"}
                $(sourceRow[sourceRow.length-1]).after(newRow);

                if (widgetIdentifier){ //creates a new instance of the element widget after the original source element
                    var els = newRow.find('[data-widget]');
                    var index = this.sourceRows[rowClassName].sequential;
                    $(els).attr('id', $(els).attr('id') + index);
                    widgetsIntegration.addWidget(newRow);
                    if (enableDelete) {
                        formUpdater.appendDeleteIcon(newRow, this.formTemplateHtml, rowClassName,true);
                    }
                    newRow.attr('data-copy',rowClassName+index);
                    formUpdater.renameElements(newRow, elementConf, index);
                    formValidator.validateForm(this.formTemplateHtml);
                }

                this.sourceRows[rowClassName]['sequential']++;
                if (enableDelete) formUpdater.toggleDeleteIcon(this.formTemplateHtml, rowClassName);
            } else {
                throw new Error("The form widget has to be built first");
            }
            return newRow;
        };

        /**
         * Provides an object with the instances of the widgets used during the integration of the form widget
         * with other form element widgets
         */
        this.getInstantiatedWidgets = function(){
            return widgetsIntegration.getInstantiatedWidgets();
        };

        /**
         * Toggle the status of a section from show to hide and vice versa. If the section has the class 'hide', then when the method is called, the hide class will be removed, so that the section will be showed. If the section was showed, when the method is called, the hide class will be added, so that the section will be hidden.
         * @param {String} id - id of the section
         * @param {Object} section - DOM object that represents the section
         * @returns {Object} Updated DOM object that represents the section
         */
        this.toggleSection = function (id, section){
            var self = this;
            var $section = $(section) || this.formTemplateHtml.find('#'+id);
            $section.find('.section_content > .row').each(function(){
                self.toggleRow('',this);
            });
            return $section[0];
        };

        /**
         * Toggle the status of a row from show to hide and vice versa. If the row has the class 'hide', then when the method is called, the hide class will be removed, so that the section will be showed. If the row was showed, when the method is called, the hide class will be added, so that the row will be hidden.
         * @param {String} id - id of the row
         * @param {Object} section - DOM object that represents the row
         * @returns {Object} Updated DOM object that represents the row
         */
        this.toggleRow = function(id, row){
            $row = $(row) || this.formTemplateHtml.find('#'+id);
            $row.toggleClass("hide");
        };

        /**
         *  Enables progressive disclosure per form section with two nested levels:  icon selection and checkbox selection. When the icon for progressive disclosure is clicked, all elements in the form including the subtitle of the section will be collapsed. When the checkbox for progressive disclosure is clicked, all elements below the checkbox progressive disclosure selector will be hidden.
         */
        addProgressiveDisclosure = function(form, context){
            form.find('.progressive_disclosure').on('click', function () {
                var $this = $(this);
                $this.closest('.form_section').find('.progressive_disclosure_content').toggleClass('collapsed');
                $this.toggleClass('collapsed');
            });
            form.find('.toggle_section input').on('click', function () {
                var $section = $(this).closest('.form_section');
                var $sectionContent = $section.find('.section_content');
                $sectionContent.toggleClass('hide');
                context.toggleSection('',$section);
            });
        };

        /**
         * Update file path once selection is done
         * @inner
         */
        var updateFilePath = function (form) {
            form.find('.fileupload').on('change', function (form) {
                var $this = $(this);
                $this.siblings('.fileupload-text').val(this.value.split('\\').pop());
            });

        };

        /**
         * Adds a section to the form
         * @param {Object} sectionConf - configuration of the new section as per the form widget configuration format
         * @param {string} identifier - class ('.<className>') or id ('#<id>') of the section that will be used as a reference for adding the section. If the parameter is absent, the section will be added at the end of the form.
         * @param {boolean} insertBefore - true/false. If it is set to true the new section will be added before the identifier. If it is set to false or if it is absent, the new section will be added after the section set in the identifier parameter.
         * @returns {Object} DOM object that represents the added section
         */
        this.addSection = function (sectionConf, identifier, insertBefore){
            if (this.formTemplateHtml){
                var $sectionWrapper = $("<div>");
                var elementsTemplateHtml = render_template(templates.getFormTemplate(), {"sections":[sectionConf]}, templates.getPartialTemplates());
                $sectionWrapper.append(elementsTemplateHtml);
                formValidator.validateForm($sectionWrapper, sectionConf);
                var $section = $sectionWrapper.find('.form_section').detach();

                if (identifier && insertBefore){ //append before a section/class selector
                    this.formTemplateHtml.find(identifier).before($section);
                } else if (identifier){ //append after a section/class selector
                    this.formTemplateHtml.find(identifier).after($section);
                } else { //append at the end of the form content (elements area), just before the buttons
                    this.formTemplateHtml.find('.form-pattern .content.row').append($section);
                }

                tooltipBuilder.addElementsTooltip($section);
                return $section[0];
            } else {
                throw new Error("The form widget has to be built first");
            }
        };

        /**
         * Adds one or more elements (rows) to the form
         * @param {Array} elementConf - configuration of the new elements as per the form widget configuration format
         * @param {string} identifier - class ('.<className>') or id ('#<id>') of the element (class name of the row) that will be used as a reference for adding the elements.
         * @param {boolean} insertBefore - true/false. If it is set to true the new elements will be added before the identifier. If it is set to false or if it is absent, the new elements will be added after the element set in the identifier parameter.
         * @returns {Object} DOM object that represents the added rows
         */
        this.addElements = function (elementConf, identifier, insertBefore){
            if (this.formTemplateHtml){
                var $sectionWrapper = $("<div>");
                var elementsTemplateHtml = render_template(templates.getFormTemplate(), {"sections":{"elements": elementConf}}, templates.getPartialTemplates());
                $sectionWrapper.append(elementsTemplateHtml);
                formValidator.validateForm($sectionWrapper, elementConf);
                var $rows = $sectionWrapper.find('.section_content > .row').detach();

                if (identifier && insertBefore){ //append before a section/class selector
                    this.formTemplateHtml.find(identifier).before($rows);
                } else if (identifier){ //append after a section/class selector
                    this.formTemplateHtml.find(identifier).after($rows);
                }

                tooltipBuilder.addElementsTooltip($rows);
                return $rows[0];
            } else {
                throw new Error("The form widget has to be built first");
            }
        };

        /**
         * Remove elements or section in the form widget
         * @param {string} identifier - class ('.<className>') or id ('#<id>') of the element (class name of the row) or the section
         * @returns {Object} Removed DOM elements
         */
        this.removeElements = function (identifier){
            if (this.formTemplateHtml){
                var removedElements = this.formTemplateHtml.find(identifier);
                removedElements.remove();
                return removedElements;
            } else {
                throw new Error("The form widget has to be built first");
            }
        }

    };

    return FormWidget;
});