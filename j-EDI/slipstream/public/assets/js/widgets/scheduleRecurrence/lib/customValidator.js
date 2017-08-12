
/**
 * A Util to support validation via callback in Form Widget. It makes use of post_validation parameter.
 * It also makes hidden or disabled invalid fields as valid
 *
 * @module ScheduleRecurrenceWidget
 * @author Vignesh K
 * @copyright Juniper Networks, Inc. 2015
 */
define(
  [
   'underscore'
  ], function(Underscore) {

  var CustomValidator = function(viewOrContainer){

    //if view
    if(viewOrContainer.$el) {
        this.view = viewOrContainer;
    }
    else {
        this.container = viewOrContainer;
    }

    /**
     * Adds custom validation handlers 
     * @param eventHash The hash of post_validation keys and corresponding validation methods.
     * The validation method should return error message to indicate validation failure
     */
    this.addCustomValidation = function(eventHash) {
       if(this.view) {
          this.eventHash = eventHash;
          if(this.eventHash) {
             for (var key in this.eventHash) {
                var method = this.eventHash[key];
                if (!Underscore.isFunction(method)) method = this.view[this.eventHash[key]];
                method = Underscore.bind(method, this.view);
                this.view.events[key] = constructCallback(method, this.view, this.eventHash, key);
             }
          }
       }
       else {
          this.eventHash = eventHash;
          if(this.eventHash) {
             for (var key in this.eventHash) {
                var method = this.eventHash[key];
                if (Underscore.isFunction(method))  {
                    this.container.bind(key,constructCallback(method));
                }
             }
          }
       }

    };

    /**
     * Removes validation errors for disabled or hidden fields configured with input post_validation eventKey 
     * @param eventKey The post_validation key.
     */
    this.removeValidationForDisabledField = function(eventKey) {
      if(eventKey && eventKey[0]) {
        if(this.view) {
          this.view.events[eventKey] = removeValidation;
        }
        else {
          this.container.bind(eventKey, removeValidation);
        }
      }
    };
  }

  /**
   * post_validation handler to remove validation for disabled or hidden fields
   */
  var removeValidation = function(event, isValid) {
    var el = event.target;
    var isDisabled = el.disabled;
    var isHidden = $(el).is(":hidden");

    if(isDisabled || isHidden) {
        CustomValidator.removeError(el);
    }
  };


  /**
   * Constructs a post_validation handler to add/remove validation error
   * based on the custom validation methods
   */
  var constructCallback = function(method, view, eventHash, key) {

    return function(event, isValid) {

      var el = event.target;
      var isDisabled = el.disabled;
      var isHidden = $(el).is(":hidden");
      if(isDisabled || isHidden) {
          CustomValidator.removeError(el);
      }
      else if(isValid) {
        var error = method(event, isValid);
        if(error && error.trim()[0]) {
            CustomValidator.addError(el, error);
        }
        else {//TODO Check if it is required
            CustomValidator.removeError(el);
        }
      }
    };
  };
  
  /**
   * Removes validation error from the given form widget element.
   * @param el The form widget element for which the validation error has to be removed.
   */
  CustomValidator.removeError = function(el) {
    var is_checked = el.type === "radio"  ||  el.type === "checkbox";
    if(is_checked) {
      $(el).removeAttr('data-invalid').parent().parent().removeClass('error');
      $(el).parent().parent().prev().removeClass('error');
      $(el).parent().siblings(".inline-help").hide();
    } else {
      $(el).removeAttr('data-invalid').parent().removeClass('error');
      $(el).parent().prev().removeClass('error');
      $(el).siblings(".inline-help").hide();
    }
  };
  
  /**
   * Adds validation error to the given form widget element.
   * @param el The form widget element to which the validation error has to be added.
   * @param error The validation error message.
   */
  CustomValidator.addError = function(el, error) {
    var is_checked = el.type === "radio"  ||  el.type === "checkbox";
    if(is_checked) {
      $(el).parent().siblings("small").text(error);
      $(el).attr('data-invalid', '').parent().parent().addClass('error');
      $(el).parent().parent().prev().addClass('error');
      $(el).parent().siblings(".inline-help").hide();
    } else {
      $(el).siblings("small").text(error);
      $(el).attr('data-invalid', '').parent().addClass('error');
      $(el).parent().prev().addClass('error');
      $(el).siblings(".inline-help").hide();
    }
  };

  return CustomValidator;

});


