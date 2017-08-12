/**
 * A module that extends the validator.js library to introduce further validations
 * like password, special characters and other validation needed in the project
 * It is intended to be used by client side validation (forms) and
 * server side validation.
 *
 * @module ExtendedValidator
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'validator',
    './dateValidator'
], function (validator) {

    var symbolPattern = /[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/\\]/;
    var hasNumberPattern = /(?=.*\d+)/;
    var hasMixedCasesPattern = /(?=.*[a-z])(?=.*[A-Z])/;
    var hasSymbolPattern = /(?=.*\W+)/;
    var hasMixedCaseSymbolPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*\W+)/;
    var hasNumberSymbolPattern = /(?=.*\d+)(?=.*\W+)/;
    var hasMixedCaseNumberPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d+)/;
    var hasAlphanumericDashUnderscore = /^[a-zA-Z0-9_\-]+$/;
    var beginWithAlphanumericUnderscore = /^[a-zA-Z0-9_]{1}/;
    var passwordPattern = /(?=.*\d+)(?=.*[a-zA-Z])[0-9a-zA-Z-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;
    var time24HrsPattern = /^([0-1]?\d|2[0-3])(:[0-5][0-9]){1,2}$/;
    var time12HrsPattern = /^(?:1[0-2]|0[1-9])(:[0-5][0-9]){1,2}\s+[aApP][mM]$/;
    var time12HrsPatternWithoutPeriod = /^(?:1[0-2]|0[1-9])(:[0-5][0-9]){1,2}$/;
    var hasSpace = /\s/;
    var fqdnPattern = /^(?=.{1,254}$)((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}$/;
    var netmaskPattern = /^[1-2]{1}[2,4,5,9]{1}[0,2,4,5,8]{1}\.[0-2]{1}[0,2,4,5,9]{1}[0,2,4,5,8]{1}\.[0-2]{1}[0,2,4,5,9]{1}[0,2,4,5,8]{1}\.[0-9]{1,3}$/;
    var ipv4Pattern =  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    var ipv6Pattern = /^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$/;
    var cidrv4Pattern = /^([1-9]|[1-2]\d|3[0-2])$/; //1-32
    var cidrv6Pattern = /^([1-9]|[1-9]\d|1[0-1]\d|12[0-8])$/; //1-128
    var dayPattern = /^(0[1-9]?|[12][0-9]?|3[01]?)$/; //dd
    var monthPattern = /^(0[1-9]?|1[012]?)$/; //mm
    var yearPattern = /^\d{4}$/; //yyyy
    var datePattern_mmddyyyy = /^(0?[1-9]|1[012])[\/\-\\.](0?[1-9]|[12][0-9]|3[01])[\/\-\\.](\d{4})$/;
    var datePattern_ddmmyyyy = /^(0?[1-9]|[12][0-9]|3[01])[\/\-\\.](0?[1-9]|1[012])[\/\-\\.](\d{4})$/;
    var datePattern_yyyymmdd = /^(\d{4})[\/\-\\.](0?[1-9]|1[012])[\/\-\\.](0?[1-9]|[12][0-9]|3[01])$/;
    var fingerprintPattern = /^(([0-9a-f]{1,2}):){15}[0-9a-f]{1,2}$/; //Example: 4a:a7:b6:f1:87:cd:bd:c3:4c:6d:1d:2f:9a:e4:32:8b 

    validator.extend('isSymbol', function (str) {
        return symbolPattern.test(str);
    });

    validator.extend('isNumber', function (str, min, max) {
        var isMinNumber = min && validator.isNumeric(min);
        var isMaxNumber = max && validator.isNumeric(max);
        min = isMinNumber ? parseInt(min) : null;
        max = isMaxNumber ? parseInt(max) : null;
        if(str<min || str>max)
            return false;
        else
            return validator.isNumeric(str);
    });

    validator.extend('hasNumber', function (str) {
        return hasNumberPattern.test(str);
    });

    validator.extend('hasMixedCases', function (str) {
        return hasMixedCasesPattern.test(str);
    });

    validator.extend('hasSymbol', function (str) {
        return hasSymbolPattern.test(str);
    });

    validator.extend('hasEitherMixedCaseSymbol', function (str) { 
        return symbolPattern.test(str) || hasMixedCasesPattern.test(str);
    });

    validator.extend('hasEitherNumberSymbol', function (str) {  
        return symbolPattern.test(str) || hasNumberPattern.test(str); 
    });

    validator.extend('hasEitherMixedCaseNumber', function (str) { 
        return hasNumberPattern.test(str) || hasMixedCasesPattern.test(str);
    });

    validator.extend('hasEitherMixedCaseSymbolNumber', function (str) {
        return hasMixedCasesPattern.test(str) || symbolPattern.test(str) || hasNumberPattern.test(str) ;
    });

    validator.extend('hasMixedCaseSymbol', function (str) {
        return hasMixedCaseSymbolPattern.test(str);
    });

    validator.extend('hasNumberSymbol', function (str) {
        return hasNumberSymbolPattern.test(str);
    });

    validator.extend('hasMixedCaseNumber', function (str) {
        return hasMixedCaseNumberPattern.test(str);
    });

    validator.extend('hasAlphanumericDashUnderscore', function (str) {
        return hasAlphanumericDashUnderscore.test(str);
    });

    validator.extend('beginWithAlphanumericUnderscore', function (str) {
        return beginWithAlphanumericUnderscore.test(str);
    });

    validator.extend('isPassword', function (str) {
        return passwordPattern.test(str);
    });

    validator.extend('isTime', function (str) {
        return time12HrsPattern.test(str) || time24HrsPattern.test(str);
    });

    validator.extend('isTime12Hrs', function (str) {
        return time12HrsPattern.test(str);
    });

    validator.extend('isTime12HrsWithoutPeriod', function (str) {
        return time12HrsPatternWithoutPeriod.test(str);
    });

    validator.extend('isTime24Hrs', function (str) {
        return time24HrsPattern.test(str);
    });

    validator.extend('hasSpace', function (str) {
        return hasSpace.test(str);
    });

    validator.extend('isFQDN', function (str) {
        return fqdnPattern.test(str);
    });

    validator.extend('isNetmask', function (str) {
        return netmaskPattern.test(str);
    });

    validator.extend('isIpv4', function (str) {
        return ipv4Pattern.test(str);
    });

    validator.extend('isIpv6', function (str) {
        return ipv6Pattern.test(str);
    });

    validator.extend('isIpv4v6', function (str, version) {
        if (!version) {
            return validator.isIpv4v6(str, 4) || validator.isIpv4v6(str, 6);
        } else if (version == '4') {
            return ipv4Pattern.test(str);
        }
        return version == '6' && ipv6Pattern.test(str);
    });

    validator.extend('isCidrv4', function (str) {
        return cidrv4Pattern.test(str);
    });

    validator.extend('isCidrv6', function (str) {
        return cidrv6Pattern.test(str);
    });

    validator.extend('isValidDay', function (str) {
        return dayPattern.test(str);
    });

    validator.extend('isValidMonth', function (str) {
        return monthPattern.test(str);
    });

    validator.extend('isValidYear', function (str) {
        return yearPattern.test(str);
    });

    validator.extend('isValidDateformat', function (str, dateformat) {
        var datePattern;
        switch (dateformat) {
            case "mm/dd/yyyy":
            case "mm-dd-yyyy":
            case "mm.dd.yyyy":
                return datePattern_mmddyyyy.test(str);
            case "dd/mm/yyyy":
            case "dd-mm-yyyy":
            case "dd.mm.yyyy":
                return datePattern_ddmmyyyy.test(str);
            case "yyyy/mm/dd":
            case "yyyy-mm-dd":
            case "yyyy.mm.dd":
                return datePattern_yyyymmdd.test(str);
        }
        return false;
    });

    validator.extend('hasValidDate', function (str, dateFormat) {
        var dateformat = !dateFormat ? 'mm/dd/yyyy' : dateFormat.toLowerCase().trim();
        return(dateValidator.validateDate(str, dateformat, validator))
    });
    
    validator.extend('isFingerPrint', function (str) {
        return fingerprintPattern.test(str);
    });

    return validator;
});