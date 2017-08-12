/**
 * A module that builds a IP CIDR widget using default values or an element configuration.
 * The configuration object includes the container which should be used to render the widget
 * and the set of key/value that should be used to overwrite the default values provided by the IP CIDR widget.
 *
 * @module IpCidrWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n',
    'text!widgets/ipCidr/templates/elements.html',
    'widgets/ipCidr/conf/elements',
    'widgets/ipCidr/lib/ipCidrSubnetInteraction',
    'widgets/form/formValidator',
    'widgets/form/formTemplates'
],  /** @lends IpCidrWidget */
    function(render_template, i18n, elementsTemplate, widgetConfiguration, IpCidrSubnetInteraction, FormValidator, FormTemplates) {

    /**
     * IpCidrWidget constructor
     *
     * @constructor
     * @class IpCidrWidget - Builds a IP CIDR widget from a configuration object.
     *
     * @param {Object} conf - It requires two parameters:
     * container: define the container where the widget will be rendered
     * elements: define the set of key/value that should be used to overwrite the default IP CIDR values. It should have one or more of the following keys with their respective value:
     * {
     *  "ip_label": "IP Address", "ip_id": "text_ip", "ip_name": "text_ip", "ip_placeholder": "IP v4 or v6", "ip_required": "true", "ip_tooltip": "IP v6 example", "ip_error": "Invalid IP address",
     *  "cidr_id": "text_cidr", "cidr_name": "text_cidr", "cidr_placeholder": "CIDR", "cidr_error": "Invalid CIDR"
     *  "subnet_id": "text_subnet", "subnet_name": "text_subnet", "subnet_placeholder": "Subnet placeholder", "subnet_error": "Please enter a valid subnet mask"
     * }
     * If the elements parameter is not available, the widget will be built using the defaul IP CIDR values defined in the widgetConfiguration parameter
     * If the elements parameter exists but it doesn't provide a label ("label"), the IP CIDR widget will be built without labels.
     * @returns {Object} Current IpCidrWidget's object: this
     */
    var IpCidrWidget = function(conf){

        this.conf = {
            "$container": $(conf.container),
            "elements" : conf.elements
        };

        /**
         * Builds the IP CIDR widget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build =  function () {
            var templates = new FormTemplates();
            var elementInteraction = new IpCidrSubnetInteraction();
            var widgetConfigurationCopy = $.extend(true,{}, widgetConfiguration);
            if (conf.elements) getUserConfiguration(widgetConfigurationCopy);
            var elementsTemplateHtml = render_template(elementsTemplate, widgetConfigurationCopy.elements, templates.getPartialTemplates());
            this.conf.$container.addClass('row ip-cidr-widget')
                .append(elementsTemplateHtml);
            enableInputs(this.conf.$container);
            if(conf.elements && conf.elements.customValidationCallback){
                elementInteraction.storeCustomValidationData(this.conf.$container, conf.elements.customValidationCallback, widgetConfigurationCopy.elements);
            }
            elementInteraction.addPostValidationHandlers(this.conf.$container);
            return this;
        };

        /**
         * Overwrites the default IP CIDR values of the widget by using the user this.conf.elements parameter provided in the conf Object
         * @inner
         */
        var getUserConfiguration = function (widgetConfigurationCopy){
            var i, widgetConfigArray = widgetConfigurationCopy.elements.elements,
                cidrSubnetObj = widgetConfigurationCopy.cidrSubnetConversion,
                userConfig = conf.elements,
                ele={'0':'ip_','1':'cidr_','2':'subnet_'};
            for (i=0; i<widgetConfigArray.length; i++){
                var key, widgetConfig = widgetConfigArray[i];
                for (key in widgetConfig) {
                    if (/label/.test(key) && userConfig[ele[i]+key]=='' && userConfig['ip_label'] == ''){
                        delete widgetConfig[key];
                    }
                    if (/ip_version/.test(key) && userConfig[ele[i]+key]==''){
                        delete widgetConfig[key];
                    }
                    if (typeof userConfig[ele[i]+key] != 'undefined' && userConfig[ele[i]+key]!=''){
                        widgetConfig[key]=userConfig[ele[i]+key];
                    }
                    if (/element_subnet/.test(key)){
                        for (cidr in cidrSubnetObj) {
                            widgetConfig.values.push({
                              "value": cidrSubnetObj[cidr]
                            });
                        }
                    }
                }
            }
        };

        /**
         * Enables the CIDR and Subnet inputs that have a preset value
         * @inner
         */
        var enableInputs = function (container){
            var cidr = $(container).find('.input_cidr');
            if (cidr.val() != "") $(cidr).removeAttr('disabled');
            var subnet = $(container).find('.input_subnet');
            if (subnet.val() != "") $(subnet).removeAttr('disabled');
        };

        /**
         * Sets the values assigned to the IP, CIDR and Subnet inputs
         * @param {string} ip - The given IP address.
         * @param {string} cidr - The given IP CIDR.
         * @param {boolean} subnet - The given subnet.
         * @returns {Object} key/value set for each input, where key is the id of the input and value is the value of the input
         */
        this.setValues =  function (ip, cidr, subnet) {
            if (ip){
                this.conf.$container.find('.input_ip').val(ip);
                if (cidr){
                    var cidrInput = this.conf.$container.find('.input_cidr');
                    cidrInput.val(cidr);
                    $(cidrInput).removeAttr('disabled');
                    subnet = subnet ? subnet : widgetConfiguration.cidrSubnetConversion[cidr];
                    if (subnet){
                        var subnetInput = this.conf.$container.find('.input_subnet');
                        subnetInput.val(subnet);
                        $(subnetInput).removeAttr('disabled');
                    }
                }
            }
        }

        /**
         * Gets the values assigned to the IP, CIDR and Subnet inputs
         * @returns {Object} key/value set for each input, where key is the id of the input and value is the value of the input
         */
        this.getValues =  function () {
            var values = {}
            var ip = this.conf.$container.find('.input_ip');
            values['ip'] = { "id": ip.attr('name'), "value": ip.val()}
            var cidr = this.conf.$container.find('.input_cidr');
            values['cidr'] = { "id": cidr.attr('name'), "value": cidr.val()}
            var subnet = this.conf.$container.find('.input_subnet');
            values['subnet'] = { "id": subnet.attr('name'), "value": subnet.val()}
            return values;
        }

        /**
         * Gets the values assigned to the IP/CIDR inputs
         * @returns {String} A string composed by the value of the IP input plus the "/" symbol plus the CIDR value
         */
        this.getIpCidrValue =  function () {
            var values = this.getValues();
            return values.ip.value+'/'+values.cidr.value;
        }

        /**
         * Destroys all elements created by the IpCidrWidget in the specified container
         * @returns {Object} Current IpCidrWidget object
         */
        this.destroy =  function () {
            this.conf.container.remove();
            return this;
        }
    };

    return IpCidrWidget;
});