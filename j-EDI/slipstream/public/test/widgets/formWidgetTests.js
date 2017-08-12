define([
	'widgets/form/conf/configurationSample',
	'widgets/form/formWidget'
	],function(formConfiguration, FormWidget) {
		describe('FormWidget - Unit tests:', function() {

            var $el = $('#test_widget'),
                containerId = 0;

            var createContainer = function () {
                var $container = $("<div id = grid-container-id" + containerId++ + "></div>");
                $el.append($container);
                return $container;
            };

            var cleanUp = function (thisObj) {
                thisObj.formWidgetObj.destroy();
                thisObj.$formContainer.remove();
            };

            var elementsConfigurationById = function (conf) {
                var formConf = {};
                var sections = conf.sections,
                    i, j, elements, element;
                for (i=0; sections && i<sections.length; i++){

                    if (sections[i].toggle_section)
                        sections[i].toggle_section.status = "show"; //make visible all sections

                    elements = sections[i].elements;
                    for (j=0; elements && j < elements.length; j++){
                        element = elements[j];
                        element.id && (formConf[element.id] = element);
                    }
                }
                return formConf;
            }(formConfiguration.elements);

            describe('Widget Interface', function() {
                before(function(){
                    this.formWidgetObj = new FormWidget({
                        "elements": formConfiguration.elements,
                        "container": createContainer()
                    });
                });
                it('should exist', function() {
                    this.formWidgetObj.should.exist;
                });
                it('build() should exist', function() {
                    assert.isFunction(this.formWidgetObj.build, 'The form widget must have a function named build.');
                });
                it('destroy() should exist', function() {
                    assert.isFunction(this.formWidgetObj.destroy, 'The form widget must have a function named destroy.');
                });
            });

            describe('Template', function() {
                before(function(){
                    this.$formContainer = createContainer();
                    this.formWidgetObj = new FormWidget({
                        "elements": formConfiguration.elements,
                        "container": this.$formContainer[0]
                    }).build();
                });
                after(function(){
                    cleanUp(this);
                });
                it('should contain <form> as firstchild', function() {
                    this.$formContainer.find(">:first-child").is("form").should.be.true;
                });
                it('should contain "form-pattern" as class for <form> element', function() {
                    this.$formContainer.find(">:first-child").hasClass('form-pattern').should.be.true;
                });
                it('should contain "validate" as class for <form> element', function() {
                    this.$formContainer.find(">:first-child").hasClass('validate').should.be.true;
                });
                it('should contain title', function() {
                    this.$formContainer.find(".form-pattern h3").text().should.exist;
                });
            });


            describe('Field Multiple Validation', function() {
                beforeEach(function(){
                    this.$formContainer = createContainer();
                    this.formWidgetObj = new FormWidget({
                        "elements": formConfiguration.elements,
                        "container": this.$formContainer[0]
                    }).build();
                    this.$hostname = this.$formContainer.find("#hostname");
                    this.$errorElement = this.$hostname.parent().find('.error');
                });
                afterEach(function(){
                    cleanUp(this);
                });
                it('should first validate if Hostname satisfies Required Field', function() {
                    this.$hostname.val('');
                    this.$hostname.blur();
                    this.$errorElement.text().should.equal("This field is required.");
                });

                it('should first validate if Hostname satisfies Required Field', function() {
                    this.$hostname.val('abcdefghij1234567890abcdefghij1234567890abcdefghij1234567890abcdefghij1234567890');
                    this.$hostname.blur();
                    this.$errorElement.text().should.equal("Must not exceed 64 characters.");
                });

                it('should first validate if Hostname satisfies Required Field', function() {
                    this.$hostname.val('hostname!');
                    this.$hostname.blur();
                    this.$errorElement.text().should.equal("Only alphanumeric characters, dashes and underscores allowed.");
                });

                it('should first validate if Hostname satisfies Required Field', function() {
                    this.$hostname.val('hostname');
                    this.$hostname.blur();
                    this.$errorElement.text().should.equal('true');
                });

            });

            describe('Drop Down Widget Integration', function() {
                beforeEach(function(){
                    this.$formContainer = createContainer();
                    this.formWidgetObj = new FormWidget({
                        "elements": formConfiguration.elements,
                        "container": this.$formContainer[0]
                    }).build();
                });
                afterEach(function(){
                    cleanUp(this);
                });
                it('should render the select and options tags for the drop down element', function() {
                    var dropDownId = 'dropdown_field_2',
                        $dropDownSelect = this.$formContainer.find('#' + dropDownId),
                        $dropDownOption = $dropDownSelect.find('option').length,
                        dropDownConfiguration = elementsConfigurationById[dropDownId];

                    assert.equal(dropDownConfiguration.data.length, $dropDownOption, 'the number of options (values/data property) for the element_dropdown configuration has the same number of option tags in the DOM when the element dropdown is built and rendered');

                    var $option1 = $($dropDownSelect.find('option')[1]);
                    assert.equal(dropDownConfiguration.data[1].id, $option1.val(), 'the id/value for an option (data/values property) in the dropdown configuration has the correct value when the element is built and rendered');
                    assert.equal(dropDownConfiguration.data[1].text, $option1.text(), 'the text/label for an option (data/values property) in the dropdown configuration has the correct text when the element is built and rendered');
                });
                it('should validate if the drop down element satisfies the required field', function() {
                    var dropDownId1 = 'dropdown_field_1',
                        $dropDownElement1 = this.$formContainer.find('#' + dropDownId1).parent(),
                        dropDownConfiguration1 = elementsConfigurationById[dropDownId1],
                        dropDownId2 = 'dropdown_field_2',
                        $dropDownElement2 = this.$formContainer.find('#' + dropDownId2).parent(),
                        dropDownConfiguration2 = elementsConfigurationById[dropDownId2];

                    var selectedIndex;
                    var hasSelectedOption = function (values) {
                        selectedIndex = null;
                        for (var i=0; i < values.length; i++) {
                            if (values[i].selected) {
                                selectedIndex = i;
                                return true;
                            }
                        }
                        return false;
                    };

                    //form validation is triggered
                    this.formWidgetObj.isValidInput();

                    //form configuration is verified for a required element with no default value
                    assert.isTrue(dropDownConfiguration1.required, 'the configuration of the drop down element has a required property set to true');
                    assert.isFalse(hasSelectedOption(dropDownConfiguration1.values), 'the configuration of the drop down element does not include an option with a default value');
                    assert.equal(dropDownConfiguration1.values[0].value, '', 'the value of the first option of the the drop down is empty');

                    //form element should show an error after the form is validated since the element is a required field
                    assert.isTrue($dropDownElement1.hasClass('error'), 'the dropdown element is a required field and has an error indication after the form validation is triggered');

                    //form configuration is verified for a required element with no default value
                    assert.isTrue(dropDownConfiguration2.required, 'the configuration of the drop down element has a required property set to true');
                    assert.isTrue(hasSelectedOption(dropDownConfiguration2.data), 'the configuration of the drop down element does include an option with a default value');
                    assert.isNotNull(dropDownConfiguration2.data[selectedIndex].id, 'the value of the selected option of the the drop down is not null');

                    //form element should not show an error after the form is validated since the element is a required field
                    assert.isFalse($dropDownElement2.hasClass('error'), 'the dropdown element is a required field and does not have an error indication after the form validation is triggered');
                });
            });

            describe('Data Binding Integration', function() {
                before(function(){
                    this.$formContainer = createContainer();
                    this.formWidgetObj = new FormWidget({
                        "elements": formConfiguration.elements,
                        "values": formConfiguration.values,
                        "container": this.$formContainer[0]
                    }).build();
                    this.instantiatedWidgets = this.formWidgetObj.getInstantiatedWidgets();

                });
                after(function(){
                    cleanUp(this);
                });
                //gets the value assigned during data bindings
                var getValue = function (elementConfiguration, value){
                    if (elementConfiguration && elementConfiguration[value]) {
                        if (_.isString(elementConfiguration[value]) && elementConfiguration[value].substring(0,2)=="{{" && elementConfiguration[value].slice(-2)=="}}" ) {
                            var valueKey = elementConfiguration[value].substring(2, elementConfiguration[value].length-2);
                            if (formConfiguration["values"] && formConfiguration["values"][valueKey])
                                return formConfiguration["values"][valueKey];
                        } else {
                            return elementConfiguration[value];
                        }
                    }
                };
                it('should set the value of an input element', function() {
                    var elementId = 'text_email',
                        $element = this.$formContainer.find('#' + elementId),
                        elementValue = $element.val(),
                        elementConfiguration = elementsConfigurationById[elementId],
                        bindingValue = getValue(elementConfiguration, "value");
                    assert.equal(elementValue, bindingValue, 'the value in the input element should be the one set in the values object of the form configuration');
                });
                it('should set the value of a datePicker widget element', function() {
                    var elementId = 'text_datepickerWidget',
                        elementValue = this.instantiatedWidgets["datePicker_"+elementId]["instance"].getDate(),
                        elementConfiguration = elementsConfigurationById[elementId],
                        bindingValue = getValue(elementConfiguration, "initValue");
                    assert.equal(elementValue.toLocaleDateString(), bindingValue, 'the date value in the datePicker widget element should be the one set in the values object of the form configuration');
                });
                it('should set the value of a time widget element', function() {
                    var elementId = 'text_timeWidget',
                        elementValue = this.instantiatedWidgets["time_"+elementId]["instance"].getTime(),
                        elementConfiguration = elementsConfigurationById[elementId],
                        bindingValue = getValue(elementConfiguration, "initValue");
                    assert.equal(elementValue, bindingValue.time + " " + bindingValue.period, 'the time value in the time widget element should be the one set in the values object of the form configuration');
                });
                it('should set the value of a dateTime element', function() {
                    var elementId = 'text_dateTimeWidget',
                        elementConfiguration = elementsConfigurationById[elementId],
                        bindingValue = getValue(elementConfiguration, "initValue"),
                        dateElementId = 'text_dateTime_date_Widget',
                        dateElementValue = this.instantiatedWidgets["datePicker_"+dateElementId]["instance"].getDate(),
                        timeElementId = 'text_dateTime_time_Widget',
                        timeElementValue = this.instantiatedWidgets["dateTime_"+timeElementId]["instance"].getTime();
                    assert.equal(dateElementValue.toLocaleDateString(), bindingValue.date, 'the date value in the datePicker widget element should be the one set in the values object of the form configuration');
                    assert.equal(timeElementValue, bindingValue.time + " " + bindingValue.period, 'the time value in the time widget element should be the one set in the values object of the form configuration');
                });
                it('should set the value of a time widget element', function() {
                    var elementId = 'text_ipCidrWidget1',
                        elementValue = this.instantiatedWidgets["ipCidr_"+elementId]["instance"].getValues(),
                        elementConfiguration = elementsConfigurationById[elementId],
                        bindingValue = getValue(elementConfiguration, "initValue");
                    assert.equal(elementValue.ip.value, bindingValue.ip, 'the ip value in the ipCidr widget element should be the one set in the values object of the form configuration');
                    assert.equal(elementValue.cidr.value, bindingValue.cidr, 'the cidr value in the ipCidr widget element should be the one set in the values object of the form configuration');
                });
                it('should set the value of a dropDown widget element', function() {
                    var elementId = 'dropdown_field_3',
                        elementValue = this.instantiatedWidgets["dropDown_"+elementId]["instance"].getValue(),
                        elementConfiguration = elementsConfigurationById[elementId],
                        bindingValue = getValue(elementConfiguration, "initValue");
                    assert.equal(elementValue[0], bindingValue.id, 'the dropdown value in the dropDown widget element should be the one set in the values object of the form configuration');
                });
                it('should set the value of a check box element', function() {
                    var elementId = 'checkbox_field',
                        $elements = this.$formContainer.find('#' + elementId + ' :checked'),
                        elementsValue = [],
                        elementConfiguration = elementsConfigurationById[elementId],
                        bindingValue = [];
                    getValue(elementConfiguration, "initValue").forEach(function (value){
                       if (value.checked){
                           bindingValue.push(value.id);
                       }
                    });
                    $elements.each(function(id, element){
                        if (element.checked) {
                            elementsValue.push(element.id);
                        }
                    });
                    assert.includeMembers(elementsValue, bindingValue, 'the checked items in the checkbox element should be a super set of the ones set in the values object of the form configuration');
                });
                it('should set the value of a radio button element', function() {
                    var elementId = 'radio_field',
                        $elements = this.$formContainer.find('#' + elementId + ' :checked'),
                        elementsValue = [],
                        elementConfiguration = elementsConfigurationById[elementId],
                        bindingValue = [];
                    getValue(elementConfiguration, "initValue").forEach(function (value){
                        if (value.checked){
                            bindingValue.push(value.id);
                        }
                    });
                    $elements.each(function(id, element){
                        if (element.checked) {
                            elementsValue.push(element.id);
                        }
                    });
                    assert.includeMembers(elementsValue, bindingValue, 'the checked item in the radio button element should be a super set of the ones set in the values object of the form configuration');
                });
            });

        });
	});
