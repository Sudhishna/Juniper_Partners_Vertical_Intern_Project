/**
 * A module that encapsulates the integration of the client validation
 * with the Validator library. It also extends the Validator library
 * to include the application specific validation requirements.
 *
 * @module LibraryWrapper
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'lib/validator/extendedValidator'
],  /** @lends LibraryWrapper */
    function (validator) {

    /**
     * LibraryWrapper constructor
     *
     * @constructor
     * @class LibraryWrapper
     */
    var LibraryWrapper = function(){

        /**
         * Checks if the input of an elements has a valid value
         * @param {string} type - Type of validation.
         * @param {string} el - Element that requires validation.
         */
        var isRegexPattern;
        this.validate_data_type = function (type, el){
            isRegexPattern = false;
            var value = el.value ;
            // predefined pattern types
            switch(type){
                case 'validtext':
                    return !validator.isNull(value);
                case 'hasnumber':
                    return validator.hasNumber(value);
                case 'hasnotnumber':
                    return !validator.hasNumber(value);
                case 'hasmixedcase':
                    return validator.hasMixedCases(value);
                case 'hassymbol':
                    return validator.hasSymbol(value);
                case 'hasnotsymbol':
                    return !validator.hasSymbol(value);
                case 'haseithermixedcasesymbol': 
                    return validator.hasEitherMixedCaseSymbol(value);
                case 'haseithernumbersymbol':
                    return validator.hasEitherNumberSymbol(value);
                case 'haseithermixedcasenumber':
                    return validator.hasEitherMixedCaseNumber(value);
                case 'haseithermixedcasesymbolnumber': 
                    return validator.hasEitherMixedCaseSymbolNumber(value);
                case 'hasmixedcasesymbol':
                    return validator.hasMixedCaseSymbol(value);
                case 'hasnumbersymbol':
                    return validator.hasNumberSymbol(value);
                case 'hasmixedcasenumber':
                    return validator.hasMixedCaseNumber(value);
                case 'hasalphanumericdashunderscore':
                    return validator.hasAlphanumericDashUnderscore(value);
                case 'beginwithalphanumericunderscore':
                    return validator.beginWithAlphanumericUnderscore(value);
                case 'hasspace':
                    return validator.hasSpace(value);
                case 'hasnotspace':
                    return !validator.hasSpace(value);
                case 'password':
                    return validator.isPassword(value);
                case 'email':
                    return validator.isEmail(value);
                case 'url':
                    return validator.isURL(value);
                case 'alpha':
                    return validator.isAlpha(value);
                case 'number':
                    var min=el.getAttribute('min'),
                        max=el.getAttribute('max');
                    return validator.isNumber(value, min, max);
                case 'symbol':
                    return validator.isSymbol(value);
                case 'alphanumeric':
                    return validator.isAlphanumeric(value);
                case 'hexadecimal':
                    return validator.isHexadecimal(value);
                case 'color':
                    return validator.isHexColor(value);
                case 'lowercase':
                    return validator.isLowercase(value);
                case 'uppercase':
                    return validator.isUppercase(value);
                case 'integer':
                    return validator.isInt(value);
                case 'float':
                    return validator.isFloat(value);
                case 'divisible':
                    var number = el.getAttribute('data-divisibleBy');
                    return validator.isDivisibleBy(value, number);
                case 'minlength':
                    var min;
                    if (el.getAttribute('data-length'))
                        min=el.getAttribute('data-length');
                    return validator.isLength(value,min);
                case 'length':
                    var min,max;
                    if (el.getAttribute('data-minLength'))
                        min=el.getAttribute('data-minLength');
                    if (el.getAttribute('data-maxLength'))
                        max=el.getAttribute('data-maxLength');
                    return validator.isLength(value,min,max);
                case 'date':
                    var dateFormat = el.getAttribute('data-dateFormat');
                    return (validator.hasValidDate(value, dateFormat));
                case 'afterdate':
                    var afterDate = el.getAttribute('data-afterDate');
                    return validator.isAfter(value,afterDate);
                case 'beforedate':
                    var beforeDate = el.getAttribute('data-beforeDate');
                    return validator.isBefore(value,beforeDate);
                case 'time':
                    return validator.isTime(value);
                case 'time12hrs':
                    return validator.isTime12Hrs(value);
                case 'time12hrsWithoutPeriod':
                    return validator.isTime12HrsWithoutPeriod(value);
                case 'time24hrs':
                    return validator.isTime24Hrs(value);
                case 'inarray':
                    var arrayValues = el.getAttribute('data-array').replace(/\,$/, '').split(',');
                    return validator.isIn(value,arrayValues);
                case 'creditcard':
                    return validator.isCreditCard(value);
                case 'ip':
                    var version = el.getAttribute('data-ipVersion');
                    return validator.isIP(value,version);
                case 'ipv4':
                    return validator.isIpv4(value);
                case 'ipv6':
                    return validator.isIpv6(value);
                case 'ipv4v6':
                    var version = el.getAttribute('data-ipVersion');
                    return validator.isIpv4v6(value, version);
                case 'cidrv4':
                    return validator.isCidrv4(value);
                case 'cidrv6':
                    return validator.isCidrv6(value);
                case 'subnet':
                    return validator.isNetmask(value);
                case 'fqdn':
                    return validator.isFQDN(value);
                case 'iporfqdn': {
                    if (validator.isIP(value)) { //if no version is provided, validator will check for v4 or v6
                        return true;
                    } else if (validator.isFQDN(value)) {
                        return true;
                    }
                    return false;
                }
                case 'fingerprint':
                    return validator.isFingerPrint(value);  // validator will check the given value is a valid SSH public key fingerprint or not. Example: 4a:a7:b6:f1:87:cd:bd:c3:4c:6d:1d:2f:9a:e4:32:8b
                default:
                    isRegexPattern = true;
                    return false;
            }
        };

        /**
         * Used to identify if user provided a regex pattern or is using the predefined patterns to validate the value
         */
        this.isRegexPattern = function(){
            return isRegexPattern;
        }
    };

    return LibraryWrapper;

});