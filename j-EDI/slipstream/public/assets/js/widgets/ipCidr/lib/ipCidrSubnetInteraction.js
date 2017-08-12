/**
 * A library that handles the interaction among the three elements that the IP CIDR widget provides: the IP, the CIRD and the Subnet elements.
 *
 * @module IpCidrSubnetInteraction
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
        'widgets/ipCidr/conf/elements',
        'widgets/form/formValidator',
        'lib/i18n/i18n'
], /** @lends IpCidrSubnetInteraction */
   function(widgetConfiguration, FormValidator, i18n){

    var IpCidrSubnetInteraction = function () {

        /**
         * Initializes the library by creating a mapping from subnet to cidr
         * @inner
         */
        this.initialize = function () {
            var key,input=widgetConfiguration.cidrSubnetConversion;
            widgetConfiguration.subnetCidrConversion = {};
            for (key in input) {
                if (input.hasOwnProperty(key)) {
                  widgetConfiguration.subnetCidrConversion[input[key]] = key;
                }
            }
            this.validator = new FormValidator();
        };

        /**
         * Defines the events handlers that will be called after an element validation is completed
         * @param {Object} container - Jquery object that contains all the elements of the IP CIDR widget
         */
        this.addPostValidationHandlers = function(container) {
            this.initialize();

            this.input_ip = container.find('.input_ip');
            this.input_cidr = container.find('.input_cidr');
            this.input_subnet = container.find('.input_subnet');
            this.container = container;
            var self = this;
            this.input_ip.bind("enableCidrSubnet", function(e, isValid){
                self.enableCidrSubnet(this, isValid, e);
            });
            this.input_cidr.bind("updateSubnet", function(e, isValid){
                self.updateSubnetFromCidr(this, isValid, e);
            });
            this.input_subnet.bind("updateCidr", function(e, isValid){
                self.updateCidrFromSubnet(this, isValid, e);
            });
        };

        /**
         * Enables or disables the CIDR and Subnet fields depending on the result of the IP input validation
         *
         * @param {Object} ele - DOM element (IP input) binded to the custom event handler
         * @param {string} isValid - true if the value of the field is valid, and false otherwise
         * @param {Object} e - Event
         * @inner
         */
        this.enableCidrSubnet = function (ele, isValid, e){
          if (/true/.test(isValid)){
              if(this.isIpVersion4(ele)){
                  this.input_cidr.attr('data-validation', 'cidrv4');
                  this.input_cidr.prop('disabled', false);
                  this.input_subnet.prop('disabled', false);
              } else {
                  this.input_cidr.attr('data-validation', 'cidrv6');
                  this.input_cidr.prop('disabled', false);
                  this.input_subnet.val('');
                  this.input_subnet.prop('disabled', true);
              }
              // Trigger the post validation
              triggerPostValidation(this);
          } else {
              this.input_subnet.val('');
              this.input_subnet.prop('disabled', true);
              this.input_cidr.val('');
              this.input_cidr.prop('disabled', true);
              this.input_cidr.attr('data-validation', 'cidrv4');
              // If custom validation error exists, change the custom error to default error
              resetIpError(this);
          }
        };

        /**
         * Updates Subnet input depending on the value of the CIDR input and the result of its validation
         * @param {Object} ele - DOM element (CIDR input) binded to the custom event handler
         * @param {string} isValid - true if the value of the input is valid, and false otherwise
         * @param {Object} e - Event
         * @inner
         */
        this.updateSubnetFromCidr = function (ele, isValid, e){
          var iscidrv4 = /cidrv4/.test($(ele).attr('data-validation'));
          if($(ele).prop('disabled')) return;
          if (/true/.test(isValid)){
              if(iscidrv4){
                  if (this.input_cidr.val()!=''){
                      var subnet = widgetConfiguration.cidrSubnetConversion[ele.value];
                      if (subnet) this.input_subnet.val(subnet);
                      this.input_subnet.prop('disabled', false);
                  } else {
                      this.input_subnet.val('');
                  }
              }else{
                  this.input_subnet.val('');
                  this.input_subnet.prop('disabled', true);
              }
              // Trigger the post validation
              triggerPostValidation(this);
          } else {
              this.input_subnet.val('');
              this.input_subnet.prop('disabled', true);
              // If custom validation error exists, remove the custom validation error
              updateElementError(this, '', true);
          }
        };

        /**
         * Updates CIDR input depending on the value of the Subnet input and the result of its validation
         * @param {Object} ele - DOM element (Subnet input) binded to the custom event handler
         * @param {string} isValid - true if the value of the input is valid, and false otherwise
         * @param {Object} e - Event
         * @inner
         */
        this.updateCidrFromSubnet = function (ele, isValid, e){
          if($(ele).prop('disabled')) return;
          if (/true/.test(isValid)){
              if (this.input_subnet.val()!=''){
                  var cidr = widgetConfiguration.subnetCidrConversion[ele.value];
                  if (cidr) this.input_cidr.val(cidr);
                  this.input_cidr.prop('disabled', false);
              } else {
                  this.input_cidr.val('');
              }
              // Trigger custom validation
              triggerPostValidation(this);
          } else {
              this.input_cidr.val('');
              this.input_cidr.prop('disabled', true);
              // If custom validation error exists, remove the custom validation error
              updateElementError(this, '', true);
          }
        };

        /**
         * Updates CIDR input depending on the value of the Subnet input and the result of its validation
         * @param {Object} ele - DOM element (Subnet input) binded to the custom event handler
         * @param {string} isValid - true if the value of the input is valid, and false otherwise
         * @param {Object} e - Event
         * @inner
         */
        this.isIpVersion4 = function (ele){
            var $elev4 = $(ele).clone();
            $elev4.attr('data-ipVersion','4');
            return this.validator.isValidValue('ipv4v6',$elev4[0]);
        };

        /**
         * Store custom validation data to the IP input
         * @param {Object} elementContainer - DOM element (container of the widget)
         * @param {callback} customValidationCallback - The callback to do custom validation
         * @param {Object} conf - Widget configuration
         */
        this.storeCustomValidationData = function(elementContainer, customValidationCallback, conf) {
            var data = {
                "callback": customValidationCallback,
                // save the original error for IP input
                "originalIpError": conf.elements[0].error ? conf.elements[0].error : ''
            }
            elementContainer.data('custom_validation',data);
        };

        /**
         *  Trigger post validation and show/hide the error message according to validation result
         *  There are two kinds of validation:
         *  1. Valid IP but Subnet value is missing
         *  2. Valid IP and valid CIDR but wrong combination
         */
        var triggerPostValidation = function(self) {
            var customValidation = self.container.data('custom_validation'),
                ipVal = self.input_ip.val(),
                cidrVal = self.input_cidr.val();

            // Remove the existing post validation error first
            updateElementError(self, '', true);
            if(ipVal && !cidrVal){
                updateElementError(self, i18n.getMessage('ipcidr_widget_ip_and_cidr_required_error'));
            }else{
                if(customValidation){
                    var showErrorMessage = function(error) {
                        error = error ? error : i18n.getMessage('ipcidr_widget_ip_and_cidr_combination_error');
                        updateElementError(self, error);
                    };
                    if(customValidation.callback && typeof(customValidation.callback) === "function"){
                        customValidation.callback(self.input_ip[0], self.input_cidr[0], self.input_subnet[0], showErrorMessage);
                    }
                }
            }
        };

        /**
         *  Show/hide error message for IP input
         * @param {Object} self
         * @param {string} error -  Error message
         * @param {boolean} notshow - true/false, for show/hide error message.
         */
        var updateElementError = function(self, error, notshow) {
            var input_ip = self.input_ip;
            if(notshow){
                input_ip.removeAttr('data-invalid').parents(".row_ip").removeClass('error');
                resetIpError(self);
            }else{
                // If error is given, show the given error.
                if(error){
                    input_ip.data('originalErrorChanged', true);
                    input_ip.siblings(".error").text(error);
                }
                input_ip.attr('data-invalid', '').parents(".row_ip").addClass('error');
            }
        };

        /**
         *  Reset the error text of IP input to the original one
         */
        var resetIpError = function(self) {
            var input_ip = self.input_ip,
                originalError = '';
            // If the original error text has been changed, reset it to the original one
            if(input_ip.data('originalErrorChanged') && self.container.data('custom_validation')){
                originalError = self.container.data('custom_validation').originalIpError;
                input_ip.siblings(".error").text(originalError);
                input_ip.removeData('originalErrorChanged');
            }
        };
    }

    return IpCidrSubnetInteraction;
});
