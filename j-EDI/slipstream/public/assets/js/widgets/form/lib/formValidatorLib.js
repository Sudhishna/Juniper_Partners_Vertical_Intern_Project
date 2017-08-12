/**
 * A module that the form widget uses to perform client side validation.
 * It uses classes defined for the form like ".form-pattern" and other classes
 * that are styled by Foundation like ".error" and it's based on foundation.abide
 *
 * @module FormValidatorLib
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'widgets/form/lib/libraryWrapper',
    'widgets/form/lib/remoteValidator'
], /** @lends FormValidatorLib */
function(LibraryWrapper, RemoteValidator){

    /**
     * FormValidatorLib constructor
     *
     * @constructor
     * @class FormValidatorLib
     * @param {Object} form - The FormValidatorLib's configuration object.
     */
    var FormValidatorLib = function(form){
        var $form = form.find('form.form-pattern'),
            $errorBox = $form.find('.alert-box'),
            err_timeout = $form.attr('data-err-timeout') || 500,
            valid_timeout = $form.attr('data-valid-timeout') || 500,
            validationLibraryWrapper = new LibraryWrapper(),
            remoteValidator = new RemoteValidator();

        /**
         * initialize the library adding events for inputs, textarea, selects and submits
         */
        this.init = function(){
            var self = this;
            var validationElements = ".elementinput>input, .elementinput>textarea, .elementinput>select, .optionselection>input, .elementinput .fileupload-text:first"

            $form.attr('form-pattern-validator', '');

            $form
                .off('.validator')
                .on('submit submit.fndtn.validator', function (e) {
                    e.preventDefault();
                    return self.validate($(this).find(validationElements).get(), e);
                })
                .bind("validateForm", function (e){
                    self.validate($(form).find(validationElements).get(), e, true);
                })
                .find('input[type="submit"]')
                .on('click', function (e) {
                    self.validate($(form).find(validationElements).get(), e);
                });

            $form
                .find(validationElements)
                .off('.validator')
                .on('blur.fndtn.validator change.fndtn.validator', function (e) {
                    $errorBox.hide();
                    self.validate([this], e);
                })
                .on('keydown.fndtn.validator', function (e) {
                    $errorBox.hide();
                    clearTimeout(self.timer);
                    self.timer = setTimeout(function () {
                        self.validate([this], e);
                    }.bind(this), err_timeout);
                })
                .keypress(function (e) {
                    if(e.which == 13)
                        self.validate($(form).find(validationElements).get(), e);
                });
        };

        /**
         * validate all elements of the form. once validation is completed,
         * and if the submit button was selected, the form will be focused on the first element
         * that needs validation
         *
         * @param {Object} els - Elements to be validated
         * @param {Object} e - Event
         * @param {boolean} setErrorFocus - Flag indicating if the form needs to be focused on the first element in case of non-submit events
         * @inner
         */
        this.validate = function(els, e, setErrorFocus){
            //adds an attribute "validated" to the form and indicates the form has been validated
            if(typeof $form.attr('validated') === 'undefined')
                $form.attr('validated', '');
            var validations = this.validate_elements(els),
                validation_count = validations.length,
                submit_event = /submit/.test(e.type);

            for (var i=0; i < validation_count; i++) {
                var $ele = $(els[i]),
                    isInputElement = $ele.is("input"),
                    eleType = $ele.attr('type'),
                    isActionElement = isInputElement && (eleType === 'submit' || eleType === 'button'),
                    isToggleCheckbox = $ele.closest('.toggle_section.optionselection').children().length ? true : false,
                    isInCollapsedSection = $ele.closest('.progressive_disclosure_content.collapsed').children().length ? true : false;

                if (!validations[i]) {
                    if ((submit_event || setErrorFocus) && !isActionElement && !isToggleCheckbox)
                        els[i].focus();

                    if (!isActionElement && !$ele.is(":disabled") && ($ele.is(":visible") || isInCollapsedSection) && !isToggleCheckbox) {
                        $form.trigger('invalid');
                        $form.attr('data-invalid', 'true');
                        return false;
                    }
                }
            }

            if (submit_event) {
                $form.trigger('valid');
            }

            $form.removeAttr('data-invalid');

            return true;
        };

        /**
         * loop through each element of the form the pattern and apply styles
         * @param {Object} els - Elements to be validated
         * @inner
         */
        this.validate_elements = function (els) {
            var count = els.length,
                elements = [];

            for (var i = count - 1; i >= 0; i--) {
                elements.push(this.getPattern(els[i]));
            }

            return this.check_validation_and_apply_styles(elements);
        };

        /**
         * Apply a regular expression for the user defined pattern or leave it blank if it will use a predefined pattern
         * (type variable)
         * @param {Object} el - Dom element that needs to be validated
         * @inner
         */
        this.getPattern = function (el) {
            var type = el.getAttribute('data-validation'),
                required = typeof el.getAttribute('required') === 'string',
                regexObjPattern = el.getAttribute('data-regexobj-pattern') !== null ? true : false,
                pattern;

            if (regexObjPattern) {
                // Expected to receive the regex Obj from config in form of string type
                var patternString = el.getAttribute('data-regexobj-pattern');
                // Substring the regex semantic operators to create a valid Regex object from string.
                pattern = patternString.substring(1, patternString.length - 1);
            } else {
                pattern = el.getAttribute('data-pattern') || '';
            }

            if (pattern.length > 0) {
                return [el, new RegExp(pattern), required];
            }

            return [el, pattern, required, type];
        };

        /**
         * validate each element using validationLibraryWrapper library.
         * @param {Object} elements - Elements to be validated
         * @inner
         */
        this.check_validation_and_apply_styles = function (elements) {
            var count = elements.length,
                validations = [];

            for (var i = count - 1; i >= 0; i--) {
                var el = elements[i][0],
                    $el = $(el),
                    required = elements[i][2],
                    value = el.value,
                    type = el.getAttribute('data-validation'),
                    remote = $el.data('remote'),
                    is_equal = el.getAttribute('data-equalto'),
                    is_checked = el.type === "radio"  ||  el.type === "checkbox",
                    is_password = el.type === "password",
                    valid_length = (required) ? (el.value.length > 0) : true,
                    self = this;

                if (is_checked && required) {
                    validations.push(this.valid_checked(el, required));
                } else if (is_equal && required) {
                    validations.push(this.valid_equal(el, required));
                } else {
                    var hideErrorMessage = function(el,self){
                        self.removeErrorMessage(el);
                        self.triggerCustomEvent(el,true);
                        validations.push(true);
                    };
                    var showErrorMessage = function(el,self){
                        self.addErrorMessage(el);
                        self.triggerCustomEvent(el,false);
                        validations.push(false);
                    };

                    if(el.type=="number" && !el.validity.valid){
                        showErrorMessage(el,self);
                    } else if (elements[i][1] && elements[i][1].test(value) && valid_length || !required && el.value.length < 1) {
                        if(remote){
                            bindRemoteValidation($el, this, validations);
                        }else{
                            hideErrorMessage(el,this);
                        }
                    } else if (/multiple/.test(type)||is_password) {
                        validations.push(this.valid_multiple(el, required));
                    } else if (!(elements[i][1]) &&  validationLibraryWrapper.validate_data_type(type,el)){
                        if(remote){
                            bindRemoteValidation($el, this, validations);
                        }else{
                            hideErrorMessage(el,this);
                        }
                    } else if (!(elements[i][1]) && remote){ //calls remote validation and binds "remote_<id>" custom event to act on valid or invalid input value
                        bindRemoteValidation($el, this, validations);
                    } else {
                        if(remote) {
                            $el.siblings(".error").text($el.data('validationError')); //When remote validation passes, but client side validation fails, client validation error message neds to be set before showing it
                        }
                        showErrorMessage(el,this);
                    }
                }
            }

            return validations;
        };



        var bindRemoteValidation = function($el, self, validations) {
            var el = $el.get(0);
            validations && validations.push(true); //sets initial validation to match a validation for el. remote validation gets trigger after it.

            $el.bind('remote_' + el.id, function(e, isValid) {
                if (/true/.test(isValid)) {
                    self.removeErrorMessage(el);
                    self.triggerCustomEvent(el, true);
                } else {
                    $el.siblings(".error").text($el.data('remote').error);
                    self.addErrorMessage(el);
                    self.triggerCustomEvent(el, false, $el.data('remote').error);
                }
            });
            remoteValidator.validateDataOnRemote($el.data('remote'), el);
        };


        /**
         * validate multiple patterns for the same elements
         * @inner
         */
        this.valid_multiple = function (el, required) {
            var type = null,
                error = null,
                valid = true,
                errors = {},
                self = this;

            var hideValid = (/true/.test(el.getAttribute('data-hide_valid'))) ? true : false;
            	
            var attrs = _.sortBy(el.attributes, function(elem){ 
                        return elem.name;
                      });
            Array.prototype.slice.call(attrs).every(function (item, index, array) {
                if (/_data-validation_/.test(item.name)) {
                    type = item.name.substring(item.name.lastIndexOf("_") + 1);
                    errors[type] = item.value;

                    if (!validationLibraryWrapper.validate_data_type(type, el)) {
                        self.addErrorMessage(el);
                        valid = false;
                        error = item.value;
                        return;
                    }
                }

                validateRegexPattern(el);

                function validateRegexPattern(el) {
                    var regexAttrName, regexPatternObj, patternString, regexId;

                    if (/data-validation-regexobj-pattern_/.test(item.name)) {
                        regexAttrName = "data-validation-regexobj-pattern_";
                        regexId = item.name.split(regexAttrName).pop();
                        // Expected to receive the regex Obj from config in form of string type
                        patternString = el.attributes[regexAttrName + regexId].value;
                        // Substring the regex semantic operators to create a valid Regex object from string.
                        regexPatternObj = new RegExp(patternString.substring(1, patternString.length - 1));
                    } else if (/data-validation-regex-pattern_/.test(item.name)) {
                        regexAttrName = "data-validation-regex-pattern_";
                        regexId = item.name.split(regexAttrName).pop();
                        patternString = el.attributes[regexAttrName + regexId].value;
                        regexPatternObj = new RegExp(patternString);
                    } else {
                        return;
                    }

                    if (!regexPatternObj.test(el.value)) {
                        self.addErrorMessage(el);
                        valid = false;
                        error = el.attributes[regexAttrName.slice(0, -9) + "_" + regexId].value;
                        return;
                    }
                }
                return true;
            });

            if (valid) {
                if (!$(el).data('remote')) {
                    self.removeErrorMessage(el);
                    this.triggerCustomEvent(el, true);
                    if (!hideValid) this.showValid(el);
                } else {
                    // Perform remote validation once all client side validations pass
                    bindRemoteValidation($(el), this);
                }
            } else {
                $(el).siblings(".inline-help").hide();
                $(el).siblings(".error").text(error);
                self.addErrorMessage(el);
                this.triggerCustomEvent(el, false);
            }

            return valid;
        };

        /**
         * validate that the value of an element is equal to the one of another element
         * @inner
         */
        this.valid_equal = function(el, required) {
            var from  = document.getElementById(el.getAttribute('data-equalto')).value,
                to    = el.value,
                valid = (from === to);

            if (valid) {
                this.removeErrorMessage(el);
                this.triggerCustomEvent(el,true);
            } else {
                this.addErrorMessage(el);
                this.triggerCustomEvent(el,false);
            }

            return valid;
        };

        /**
         * validate that a valid selection of a radio button or a checkbox has happened
         * @param {Object} el - Dom element that needs to be validated
         * @param {string} required - If string is available, the element is a required field
         * @inner
         */
        this.valid_checked = function (el, required) {
            var name = el.getAttribute('name'),
                group = document.getElementsByName(name),
                count = group.length,
                valid = false;

            for (var i=0; i < count; i++) {
                if (group[i].checked) valid = true;
            }

            for (var i=0; i < count; i++) {
                if (valid) {
                    $(el).removeAttr('data-invalid').parent().parent().removeClass('error');
                    $(el).parent().parent().prev().removeClass('error');
                    $(el).parent().siblings(".inline-help").hide();
                    this.triggerCustomEvent(el,true);
                } else {
                    $(el).attr('data-invalid', '').parent().parent().addClass('error');
                    $(el).parent().parent().prev().addClass('error');
                    $(el).parent().siblings(".inline-help").hide();
                    this.triggerCustomEvent(el,false);
                }
            }

            return valid;
        };

        /**
         * remove any error message from the form
         * @param {Object} el - Dom element that needs to be validated
         * @inner
         */
        this.removeErrorMessage = function(el){
            $(el).removeAttr('data-invalid').parents(".elementinput").removeClass('error');
            $(el).parents(".elementinput").prev().removeClass('error');
            $(el).siblings(".inline-help").hide();
        };

        /**
         * add error messages to the form
         * @param {Object} el - Dom element that needs to be validated
         * @param {Object} el - Dom element that needs to be validated
         * @inner
         */
        this.addErrorMessage = function(el){
            var elType = el.type;
            if (!(elType=='button'||elType=='submit')){
                $(el).attr('data-invalid', '').parents(".elementinput").addClass('error');
                $(el).parents(".elementinput").prev().addClass('error');
                $(el).siblings(".inline-help").hide();
            }
        };

        /**
         * show "valid" message for a validated input
         * @param {Object} el - Dom element that needs to be validated
         * @inner
         */
        this.showValid = function (el){
            var $validConfirmation = $(el).siblings(".inline-help");
            $validConfirmation.text("Valid");
            $validConfirmation.addClass('valid');
            $validConfirmation.show();
            clearTimeout(this.timer);
            this.timer = setTimeout(function () {
                $validConfirmation.hide();
            }.bind(this), valid_timeout);
        };

        /**
         * Triggers a custom event using the name provided by the data-trigger attribute
         * Listeners of the custom event should implement a binding event handler. For example: $(el).bind(custom_event,function(){...});
         * @param {Object} el - Dom element that needs validation
         * @param {boolean} enabled - true if the element passed the input validation and false if the validation failed
         * @inner
         */
        this.triggerCustomEvent = function (el, isValid){
            var custom_event = el.getAttribute('data-trigger');
            if (el.getAttribute('data-trigger')) {
                $(el).trigger(custom_event, isValid); //no errors: enabled=true
            }
        };
    };

    return FormValidatorLib;
});
