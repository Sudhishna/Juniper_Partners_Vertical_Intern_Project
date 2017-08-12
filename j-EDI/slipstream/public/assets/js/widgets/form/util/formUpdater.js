/**
 * A module that provides some utilities methods like copying and deleting rows and reading values from
 * the Form Widget.
 *
 * @module FormUpdater
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'widgets/form/formTemplates',
    'lib/template_renderer/template_renderer'
], /** @lends FormUpdater */
    function(FormTemplates,render_template){

    /**
     * @class FormUpdater
     */
    var FormUpdater = function(){

        var deleteIcon = render_template(new FormTemplates().getPartialTemplates().deleteRow);

        /**
         * copy a row from a source row
         * @param {Object} sourceRow - original row that needs to be copied
         * @param {Object} rowConf - configuration (label, id and value) that will be applied to the new row
         * @param {string} rowClassName - name of the class that is used as an identifier for the copying of the rows
         * @returns {Object} the new copied row
         */
        this.copyRow =  function (sourceRow,rowConf,rowClassName) {
            var row = sourceRow.row;
            var newRow = row.clone(true,true);
            if (/element/.test(sourceRow.type)){
                var rowIndex = sourceRow.sequential;
                newRow.attr('data-copy',rowClassName+rowIndex);
                this.renameElements(newRow, rowConf, rowIndex);
            }
            return newRow;
        };

        /**
         * rename elements in a row according to a configuration object (label, id and value)
         * @param {Object} row - row that needs to be updated
         * @param {Object} rowConf - configuration (label, id and value) that will be applied to the new row
         * @param {string} rowIndex - name of the class that is used as an identifier for the copying of the rows
         */
        this.renameElements = function (row, rowConf, rowIndex){
            var elements = row.find('label, input, select');
            for(var i=0; i<elements.length; i++){
                var $element = $(elements[i]);
                var tagName = $element.prop("tagName");
                if(/LABEL/.test(tagName)){
                    if (rowConf) $element.text(rowConf.label);
                } else {
                    if (rowConf) $element.prop("value", (rowConf.value));
                    var id = rowConf&&rowConf.id ? rowConf.id : $element.attr('id')+rowIndex;
                    $element.attr('id',id);
                    var name = rowConf&&rowConf.name ? rowConf.name : $element.attr('name')+rowIndex;
                    $element.attr('name',name);
                    $element.attr('value',''); //don't copy in the new row the value of the original row
                    if($element.attr('data-equalto'))
                        $element.attr('data-equalto',$element.attr('data-equalto')+rowIndex);
                    if(/dropdown_field/.test($element.attr('id')))
                        $element.parent().addClass('smallerDropdown');
                }
            }
        };

        this.appendDeleteIcon = function (row, form, rowClassName, isElementWidget){
            var self = this;
            if (isElementWidget)
                row.append(deleteIcon);
            else
                $(row[row.length-1]).append(deleteIcon);
            $(row).find('.delete_row').on('click', function(e){
                var rowParent = this.parentElement;
                var $rowParent = $(rowParent);
                $rowParent.trigger(rowClassName, rowParent);
                var rowData = $rowParent.data('copy');
                form.find("[data-copy='" + rowData + "']").remove();

                self.toggleDeleteIcon(form, rowClassName);
            });
        };

        this.toggleDeleteIcon = function (form, rowClassName){
            var deleteRows = form.find('.'+ rowClassName + ' .delete_row');
            if (deleteRows.length==1) {
                deleteRows.addClass('hideIcon');
            } else {
                deleteRows.removeClass('hideIcon');
            }
        };

    };

    return FormUpdater;
});