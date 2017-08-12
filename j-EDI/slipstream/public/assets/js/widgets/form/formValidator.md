# Form Validator


## Introduction
The form validator provides validation to a form by adding event listeners to each of the form elements. An error message will be showed if a validation fails.

## API
The form validator exposes two methods: validateForm and isValidInput. The constructor is empty.


### validateForm
It adds validation to each element of a form by adding event listeners. The input parameter is the form to be validated and the output is the same form with validation initialized.

To use it, create and instance of FormValidator and call the validateForm method.

```
 new FormValidator().validateForm(form);
```

### isValidInput
It checks if all elements of a form have valid inputs. The input parameter is the form to be validated and the output is a boolean that is set to true is the form validation is valid, false if one of the elements fails the validation. Calling this method is equivalent to click on the submit button of a form.

To use it, create and instance of FormValidator and call the isValidInput method.

```
 new FormValidator().isValidInput(form);
```

### isValidValue
It checks if one element of a form has a valid value. The validation can be on client side or invoking a REST API. The validation on the client side requires the pattern that needs to be validated and the element to be validated. For example, to perform client side validation:

```
 new FormValidator().isValidValue('hasnotspace',ele);
```

The validation on server side requires:
- The url that represents the REST API to be called. In case the url needs to be composed by input data, a callback function can be defined instead of the URL string. The url callback function is invoked with the value of the element that needs validation.
- The type of request to make: "POST","GET","PUT", or "DELETE".
- The response which is an optional parameter and allows a callback function to reformat the API response to comply with the expected return value of 'true' or 'false'. The response callback function is invoked with two parameters: the status of the response and the response text. It is called once the API request is completed.
Finally, a custom event with a name composed by the "remote_" and the id of the element will be triggered with the true/false data if the value was valid or invalid.
For example, to perform server side validation:

```
var remote = {url: function(inputvalue){..}, type: "GET", response: function(status, responseText){...}}
new FormValidator().isValidValue('',ele,remote);
```

### showFormInlineError
It shows & highlights the inline error next to the integrated widget in form
This method is used specifically for the widgets that are integrated by app externally by swapping the element in form widget.

el - {Object} element that needs to show error message
```
 new FormValidator().showFormInlineError(el);
```

### hideFormInlineError
It hides the inline error next to the integrated widget in form.
This method is used specifically for the widgets that are integrated by app externally by swapping the element in form widget.

el - {Object} element that needs to hide error message

```
 new FormValidator().hideFormInlineError(el);
```

## Patterns
The form validator uses a set of patterns to check if an input is valid. The data-validation<*> attribute of the input will specify which pattern should be used to validate the element.

The patterns available for input validation are:

### validtext
It checks if the input value is not null. The input element should have the following format:

```
    <!-- Input field -->
    <input type="text" data-validation="validtext">

    <!-- Error display -->
    <small class="error errorimage">Please enter a value for this field</small>
```

### hasnumber
It checks if the input value has at least one number. The input element should have the following format:

```
    <!-- Input field -->
    <input type="text" data-validation="hasnumber">

    <!-- Error display -->
    <small class="error errorimage">At least one number is required.</small>
``` 

### hasnotnumber
It checks if the input value has no number. The input element should have the following format:

```
    <!-- Input field -->
    <input type="text" data-validation="hasnotnumber">

    <!-- Error display -->
    <small class="error errorimage">Must not include a number.</small>
```
    
### hasmixedcase
It checks if the input value has at least one mixed case. The input element should have the following format:

```
    <!-- Input field -->
    <input type="text" data-validation="hasmixedcase">

    <!-- Error display -->
    <small class="error errorimage">A combination of mixed case letters is required.</small>
```

### hassymbol
It checks if the input value has at least one symbol. The input element should have the following format:

```
    <!-- Input field -->
    <input type="text" data-validation="hassymbol">

    <!-- Error display -->
    <small class="error errorimage">At least one symbol is required.</small>
```

### hasnotsymbol
It checks if the input value has not symbol. The input element should have the following format:

```
    <!-- Input field -->
    <input type="text" data-validation="hasnotsymbol">

    <!-- Error display -->
    <small class="error errorimage">Must not include a symbol.</small>
```

### hasmixedcasesymbol
It checks if the input value has a combination of mixed cases and symbols. The input element should have the following format:

```
    <!-- Input field -->
    <input type="text" data-validation="hasmixedcasesymbol">

    <!-- Error display -->
    <small class="error errorimage">A combination of mixed case letters is required.</small>
```

### hasnumbersymbol
It checks if the input value has a combination of number and symbols. The input element should have the following format:

```
    <!-- Input field -->
    <input type="text" data-validation="hasnumbersymbol">

    <!-- Error display -->
    <small class="error errorimage">At least one number and one symbol is required.</small>
```

### hasmixedcasenumber
It checks if the input value has a combination of number and mixed cases. The input element should have the following format:

```
    <!-- Input field -->
    <input type="text" data-validation="hasmixedcasenumber">

    <!-- Error display -->
    <small class="error errorimage">A combination of mixed case letters and one number is required.</small>
```

### hasspace
It checks if the input value has space. The input element should have the following format:

```
    <!-- Input field -->
    <input type="text" data-validation="hasspace">

    <!-- Error display -->
    <small class="error errorimage">Must include a space.</small>
```

### hasnotspace
It checks if the input value has no space. The input element should have the following format:

```
    <!-- Input field -->
    <input type="text" data-validation="hasnotspace">

    <!-- Error display -->
    <small class="error errorimage">Must not include a space.</small>
```

### email
It checks if the input value is a valid email. The input element should have the following format:

```
    <!-- Input field -->
    <input type="text" data-validation="email">

    <!-- Error display -->
    <small class="error errorimage">Please enter a valid email.</small>
```

### url
It checks if the input value is a valid url.  The input element should have the following format:

```
  <!-- Input field -->
  <input type="text" data-validation="url">

  <!-- Error display -->
  <small class="error errorimage">Please enter a valid URL.</small>
```

### alpha
It checks if the input value is a string that contains only letters (a-zA-Z). The input element should have the following format:

```
  <!-- Input field -->
  <input type="text" data-validation="alpha">

  <!-- Error display -->
  <small class="error errorimage">Please enter a valid string that contains only letters (a-zA-Z)</small>
```

### number
It checks if the input value is a string that only contains numbers.

```
  <!-- Input field -->
  <input type="text" data-validation="number">

  <!-- Error display -->
  <small class="error errorimage">Please enter a valid string that contains only numbers</small>
```

### symbol
It checks if the input value contains only symbols. The input element should have the following format:

```
  <!-- Input field -->
  <input type="text" data-validation="symbol">

  <!-- Error display -->
  <small class="error errorimage">Please enter a valid string that contains only symbols</small>
```

### alphanumeric
It checks if the input value is a string that only contains letters and numbers. The input element should have the following format:

```
  <!-- Input field -->
  <input type="text" data-validation="alphanumeric">

  <!-- Error display -->
  <small class="error errorimage">Please enter a string that contains only letters and numbers</small>
```

### hexadecimal
It checks if the input value is a hexadecimal number. The input element should have the following format:

```
  <!-- Input field -->
  <input type="text" data-validation="hexadecimal">

  <!-- Error display -->
  <small class="error errorimage">Please enter a valid hexadecimal number</small>
```

### color
It checks if the input value is a hexadecimal color. The input element should have the following format:

```
  <!-- Input field -->
  <input type="text" data-validation="color">

  <!-- Error display -->
  <small class="error errorimage">Please enter a valid hexadecimal color</small>
```

### lowercase
It checks if the input value is a string in lowercase. The input element should have the following format:

```
  <!-- Input field -->
  <input type="text" data-validation="lowercase">

  <!-- Error display -->
  <small class="error errorimage">Please enter a valid string in lowercase</small>
```

### uppercase
It checks if the input value is a string in uppercase. The input element should have the following format:

```
  <!-- Input field -->
  <input type="text" data-validation="uppercase">

  <!-- Error display -->
  <small class="error errorimage">Please enter a valid string in uppercase</small>
```

### integer
It checks if the input value is an integer number. The input element should have the following format:

```
  <!-- Input field -->
  <input type="text" data-validation="integer">

  <!-- Error display -->
  <small class="error errorimage">Please enter a valid integer</small>
```

### float
It checks if the input value is an float number. The input element should have the following format:

```
  <!-- Input field -->
  <input type="text" data-validation="float">

  <!-- Error display -->
  <small class="error errorimage">Please enter a valid float</small>
```

### divisible
It checks if the input value is a number that's divisible by another number. The value of the divisor should be available from the input attribute: *data-divisibleby*. The input element should have the following format:

```
   <!-- Input field -->
   <input type="text" data-validation="divisible" data-divisibleby="5">

   <!-- Error display -->
   <small class="error errorimage">Please enter a number that is divisible by 5</small>
```

### length
It checks if the input value's length falls in a range. The value of the minimum length should be available from the *data-minLength* data attribute and the value of the maximum length should be available from the *data-maxLength* data attribute. The input element should have the following format:

```
   <!-- Input field -->
   <input type="text" data-validation="length" data-minlength="2" data-maxlength="5">

   <!-- Error display -->
   <small class="error errorimage">Please enter a string that is greater than or equal to 2 but less than or equal to 5</small>
```

### date
It checks if the input value is a date. The input element should have the following format:

```
   <!-- Input field -->
   <input type="date" data-validation="date">

   <!-- Error display -->
   <small class="error errorimage">Please enter a valid date</small>
```

### afterdate
It checks if the input value is a date that is after the specified date (defaults to now). The value of the after date should be available from the *data-afterDate* data attribute. The input element should have the following format:

```
   <!-- Input field -->
   <input type="date" data-validation="afterdate" data-afterdate="05/28/2014">

   <!-- Error display -->
   <small class="error errorimage">Please enter a date after May 28, 2014</small>
```

### beforeDate
It checks if the input value is a date that is before the specified date (defaults to now). The value of the before date should be available from the *data-beforeDate* data attribute. The input element should have the following format:

```
   <!-- Input field -->
   <input type="date" data-validation="beforedate" data-beforedate="06/20/2014">

   <!-- Error display -->
   <small class="error errorimage">Please enter a date before June 20, 2014</small>
```

### time
It checks if the input value is a valid time either if it is in the 24 hours or 12 hours format. The input element should have the following format:

```
   <!-- Input field -->
   <input type="time" data-validation="time">

   <!-- Error display -->
   <small class="error errorimage">Please enter a valid time</small>
```

### time12hrs
It checks if the input value has a 12 hours format. The input element should have the following format:

```
   <!-- Input field -->
   <input type="time" data-validation="time12hrs">

   <!-- Error display -->
   <small class="error errorimage">Please enter a time with 12 hours format</small>
```

### time24hrs
It checks if the input value has a 24 hours format. The input element should have the following format:

```
   <!-- Input field -->
   <input type="time" data-validation="time24hrs">

   <!-- Error display -->
   <small class="error errorimage">Please enter a time with 24 hours format</small>
```

### inarray
It checks if the input value is in a array of allowed values.The allowed values should be available from the *data-array* data attribute. The input element should have the following format:

```
   <!-- Input field -->
   <input type="text" data-validation="inarray" data-array="4,5,6">

   <!-- Error display -->
   <small class="error errorimage">Please enter one of the allowed values: 4, 5 or 6</small>
```

### creditcard
It checks if the input value is a credit card number. The input element should have the following format:

```
   <!-- Input field -->
   <input type="text" data-validation="creditcard">

   <!-- Error display -->
   <small class="error errorimage">Please enter a valid credit card</small>
```

### ip
It checks if the input value is a valid IP address (version 4 or 6). The version should be available from the *data-ipversion* data attribute. The input element should have the following format:

```
   <!-- Input field -->
   <input type="text" data-validation="ip" data-ipversion="4">

   <!-- Error display -->
   <small class="error errorimage">Please enter a valid IP address version 4</small>
```

### ipv4orv6
It checks if the input value is a valid IP address; either version 4 or v6 are considered valid IP addresses. The input element should have the following format:

```
   <!-- Input field -->
   <input type="text" data-validation="ipv4orv6">

   <!-- Error display -->
   <small class="error errorimage">Please enter a valid IP either version 4 or version 6</small>
```

### fingerprint
It checks if the input value is a valid SSH public key fingerprint ( Example: 4a:a7:b6:f1:87:cd:bd:c3:4c:6d:1d:2f:9a:e4:32:8b ). 

The input element should have the following format:

```
    <!-- Input field -->
    <input type="text" data-validation="fingerprint">

    <!-- Error display -->
    <small class="error errorimage">Please enter a valid fingerprint</small>
```

## Usage
Form validation is automatically available if the form was created using the form widget (programmatic form); therefore, no action is required.

If the form is declarative; then add to the form:
1. A form-pattern class in the form tag.
2. A data-validation attribute for each of the inputs that needs validation with the patterns described in the previous section.
3. A small tag with an error class as a sibling for each of the inputs that needs validation.

For example, a declarative form should have the following format:

```
<form class="form-pattern">
...
    <input type="text" data-validation="validtext">
    <small class="error errorimage">Please enter a value for this field</small>
...
</form>
```

To add validation to a declarative form, follow these steps:

1. Make sure the form complies with the form validator format (explained lines above)
2. Instantiate the form validator
3. Call the validateForm method and provide the form as the input parameter. The return object is the form with validation initialized


