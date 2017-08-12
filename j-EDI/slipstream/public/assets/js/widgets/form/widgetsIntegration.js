/**
 * A module that integrates the form widget with other widgets that build elements of a form
 *
 * @module WidgetsIntegration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'widgets/datepicker/datepickerWidget',
    'widgets/ipCidr/ipCidrWidget',
    'widgets/time/timeWidget',
    'widgets/timeZone/timeZoneWidget',
    'widgets/dropDown/dropDownWidget'
], /** @lends WidgetsIntegration */
    function(DatepickerWidget, IpCidrWidget, TimeWidget, TimeZoneWidget, DropDownWidget){

    /**
     * WidgetsIntegration constructor
     *
     * @constructor
     * @class WidgetsIntegration
     */
    var WidgetsIntegration = function(formConfigurationElementsById, formConfiguration){

        var formConfigurationById = formConfigurationElementsById,
            instantiatedWidgets = {},
            commonElementProperties = ['id','class','label','name','required','field-help','notshowrequired','error','inlineLinks', 'inlineIcons', 'inlineButtons', 'help'];

        /** 
         * Iterate through the form and extracts all of the elements that need to be integrated with the form and
         * adds them to the form widget
         * The elements are identified by the data-widget attribute
         * @param {Object} form - form that require integration with widgets that build elements of a form
         * @returns {Object} form with added element widgets
         */
        this.addWidgets =  function (form) {
            var els = form.find('[data-widget]');
            for(var i=0; i<els.length; i++){
                this.buildWidget(els[i]);
            }
            return form;
        };

        this.addWidget =  function (ele) {
            var els = ele.find('[data-widget]');
            this.buildWidget(els);
            return ele;
        };

        /**
         * Identifies the widget that needs to be built and provides the parameters required to have the widget build.
         * The container is updated with the html and events built by the element widget
         * @param {Object} ele - Dom element that requires integration with a element widget
         */
        this.buildWidget = function (ele) {
            var $ele = $(ele),
                widgetIdentifier = $ele.data('widget') + "_" +$ele.attr('id'),
                initValue;

            //sets the instantiatedWidgets Object and data-widgetidentifier attribute for elements built from other widgets (datePicker, time, timeZone, etc.)
            var setInstantiatedWidget = function ($ele) {
                var $parentRow = getParentRow($ele);
                instantiatedWidgets[widgetIdentifier] = { "element" : $parentRow.clone(true,true) };
                $parentRow.attr('data-widgetidentifier',widgetIdentifier);
            };

            //gets the value of a form element from the value configuration of the form widget. it follows the "{{value}}" format, the same that is used in binding data to an input element
            var getInitValue = function ($ele, eleId) {
                var elementConfiguration = formConfigurationById[eleId];
                if (elementConfiguration && elementConfiguration.initValue) {
                    if (_.isString(elementConfiguration.initValue) && elementConfiguration.initValue.substring(0,2)=="{{" && elementConfiguration.initValue.slice(-2)=="}}" ) {
                        var valueKey = elementConfiguration.initValue.substring(2, elementConfiguration.initValue.length-2);
                        if (formConfiguration["values"] && formConfiguration["values"][valueKey])
                            return formConfiguration["values"][valueKey];
                    } else {
                        return elementConfiguration.initValue;
                    }
                }
            };

            switch ($ele.data('widget')) {
                case 'datePicker':
                    setInstantiatedWidget($ele);
                    instantiatedWidgets[widgetIdentifier]['instance'] = new DatepickerWidget({
                        dateFormat: $ele.data('dateformat'),
                        container: ele
                    }).build();
                    instantiatedWidgets[widgetIdentifier]['instance'].disable($ele.attr('disabled') === 'disabled');

                    var $parentContainer = getGroupContainer($ele);
                    if ($parentContainer.length) {
                        initValue = getInitValue ($parentContainer, $parentContainer.attr('id'));
                        initValue && (initValue = initValue.date);
                    } else {
                        initValue = getInitValue ($ele, $ele.attr('id'));
                    }
                    initValue && instantiatedWidgets[widgetIdentifier]['instance'].setDate(initValue);

                    break;
                case 'ipCidr':
                    setInstantiatedWidget($ele);
                    var ipCidrRow = getParentRow($ele).empty();
                    var eleData = $ele.data();
                    if (eleData['ip_field_help_content']||eleData['ip_field_help_alias']){
                        eleData['ip_field-help']= {
                            'content': eleData['ip_field_help_content'],
                            'ua-help-identifier': eleData['ip_field_help_alias']
                        };
                        delete eleData['ip_field_help_content'];
                        delete eleData['ip_field_help_alias'];
                    }
                    if (eleData['subnet_field_help_content']||eleData['subnet_field_help_alias']){
                        eleData['subnet_field-help']= {
                            'content': eleData['subnet_field_help_content'],
                            'ua-help-identifier': eleData['subnet_field_help_alias']
                        };
                        delete eleData['subnet_field_help_content'];
                        delete eleData['subnet_field_help_alias'];  
                    }

                    //adds custom validation data to an element if the object is available in the elements configuration object
                    var customValidationCallback = formConfigurationById[$ele.attr('id')]['customValidationCallback'];
                    customValidationCallback && (eleData['customValidationCallback'] = customValidationCallback);

                    instantiatedWidgets[widgetIdentifier]['instance'] = new IpCidrWidget({
                        "container": ipCidrRow,
                        "elements": eleData
                    }).build();

                    initValue = getInitValue ($ele, $ele.attr('id'));
                    initValue && instantiatedWidgets[widgetIdentifier]['instance'].setValues(initValue.ip, initValue.cidr, initValue.subnet);
                    break;
                case 'time':
                    setInstantiatedWidget($ele);
                    instantiatedWidgets[widgetIdentifier]['instance'] = new TimeWidget({
                        "container": ele
                    }).build();
                    initValue = getInitValue ($ele, $ele.attr('id'));
                    $ele.unwrap();

                    if (initValue) {
                        instantiatedWidgets[widgetIdentifier]['instance'].setTime(initValue.time);
                        instantiatedWidgets[widgetIdentifier]['instance'].setTimePeriod(initValue.period);
                    }
                    break;
                case 'timeZone':
                    setInstantiatedWidget($ele);
                    instantiatedWidgets[widgetIdentifier]['instance'] = new TimeZoneWidget({
                        "container": ele
                    }).build();

                    initValue = getInitValue ($ele, $ele.attr('id'));
                    initValue && instantiatedWidgets[widgetIdentifier]['instance'].setSelectedTimezone(initValue);
                    break;
                case 'dateTime':
                    setInstantiatedWidget($ele);
                    var $widgetContainer = getGroupContainer($ele);
                    initValue = getInitValue ($widgetContainer, $widgetContainer.attr('id'));

                    var parentContainer = $ele.parent();
                    $ele.detach();
                    parentContainer.after($ele);
                    instantiatedWidgets[widgetIdentifier]['instance'] = new TimeWidget({
                        "container": $ele
                    }).build();
                    $ele.find('.elementlabel').remove();

                    if (initValue) {
                        instantiatedWidgets[widgetIdentifier]['instance'].setTime(initValue.time);
                        instantiatedWidgets[widgetIdentifier]['instance'].setTimePeriod(initValue.period);
                    }
                    break;
                case 'dropDown':
                    setInstantiatedWidget($ele);
                    var formElementProperties = ['element_dropdown','values','dropdown_disabled'];
                    var dropDownWidgetConfiguration = getWidgetConfiguration(formConfigurationById[$ele.attr('id')], commonElementProperties.concat(formElementProperties));

                    initValue = getInitValue ($ele, $ele.attr('id'));
                    if (typeof(initValue) == 'undefined' ) {
                        dropDownWidgetConfiguration.initValue = initValue;
                    } else {
                        delete dropDownWidgetConfiguration.initValue;
                    }
                    dropDownWidgetConfiguration.container = ele;
                    instantiatedWidgets[widgetIdentifier]['instance'] = new DropDownWidget(dropDownWidgetConfiguration).build();
                    initValue && instantiatedWidgets[widgetIdentifier]['instance'].setValue(initValue);
                    break;
                case 'checkBox':
                case 'radioButton':
                    var elementId = getGroupContainer($ele).attr('id');

                    initValue = getInitValue ($ele, elementId);
                    if (initValue) {
                        initValue.forEach(function (value) { //loops through the values set in the form configuration
                            $ele.find('#' + value.id).attr('checked', value.checked)
                        });
                    }
                    break;
                default:
                    break;
            }
            return instantiatedWidgets[widgetIdentifier];
        };

        /**
         * Provides the widget configuration by removing the properties that belong to the form element
         * @param {Object} elementConfiguration - Element configuration from the form element configuration
         * @param {Array} commonProperties - Properties that are only related to a form element
         * @returns {Object} Widget configuration without the properties that are common to a form element
         * @inner
         */
        var getWidgetConfiguration = function (elementConfiguration, commonProperties) {
            var widgetConfiguration = _.extend({}, elementConfiguration);
            for (var key in widgetConfiguration) {
                if (~commonProperties.indexOf(key)) {
                    delete widgetConfiguration[key]
                }
            }
            return widgetConfiguration;
        };

        /**
         * Provides the container of a form element. The container is identified by the closest parent of the element that has a row class.
         * @param {Object} $ele - jQuery object of an element
         * @returns {Object} JQuery object with row class and parent of the input "ele"
         * @inner
         */
        var getParentRow =  function ($ele) {
            return $ele.closest( ".row" );
        };

        /**
         * Provides the container of a form element. The container is identified by the closest parent of the element that has a elementgroup class.
         * @param {Object} $ele - jQuery object of an element
         * @returns {Object} JQuery object with row class and parent of the input "ele"
         * @inner
         */
        var getGroupContainer =  function ($ele) {
            return $ele.closest( ".elementgroup" );
        };

        /**
         * Provides an object with instances of the widgets used during the integration of the form widget
         * with other form element widgets
         * @returns {Object} Integrated form element widgets objects
         */
        this.getInstantiatedWidgets =  function () {
            return instantiatedWidgets;
        };

    };

    return WidgetsIntegration;
});