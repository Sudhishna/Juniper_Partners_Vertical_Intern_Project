/**
 * Created by vidushi on 5/16/14.
 * Date validator lib is used validate dates semantically & syntactically
 * Date validations are triggered using slipstream form validation library
 *
 * @author Vidushi Gupta<vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
var dateValidator = {};

dateValidator.validateDate = function (value, dateFormat, validator) {

    var delimiter = dateValidator.findDelimiter(value);

    switch (dateFormat) {
        case "mm/dd/yyyy":
        case "mm-dd-yyyy":
        case "mm.dd.yyyy":
            return(dateValidator.mmddyyyy(value, dateFormat, validator, delimiter));
        case "dd/mm/yyyy":
        case "dd-mm-yyyy":
        case "dd.mm.yyyy":
            return(dateValidator.ddmmyyyy(value, dateFormat, validator, delimiter));
        case "yyyy/mm/dd":
        case "yyyy-mm-dd":
        case "yyyy.mm.dd":
            return(dateValidator.yyyymmdd(value, dateFormat, validator, delimiter));
    }
    return false;
};

dateValidator.mmddyyyy = function (value, dateFormat, validator, delimiter) {

    var fieldValue = value.trim().split(delimiter);

    if (fieldValue[2] && value.length >= dateFormat.length) {
        if (validator.isValidDateformat(value, dateFormat)) {
            var month = parseInt(fieldValue[0]);
            var date = parseInt(fieldValue[1]);
            var year = parseInt(fieldValue[2]);
            return (dateValidator.dateExist(month, date, year));
        } else {
            return false;
        }
    } else if (fieldValue[1]) {
        if (validator.isValidDay(fieldValue[1])) {
            return true;
        } else {
            return false;
        }
    } else if (fieldValue[0] && validator.isValidMonth(fieldValue[0])) {
        return true;
    }
    return false;
};

dateValidator.ddmmyyyy = function (value, dateFormat, validator, delimiter) {

    var fieldValue = value.trim().split(delimiter);

    if (fieldValue[2] && value.length >= dateFormat.length) {
        if (validator.isValidDateformat(value, dateFormat)) {
            var date = parseInt(fieldValue[0]);
            var month = parseInt(fieldValue[1]);
            var year = parseInt(fieldValue[2]);
            return (dateValidator.dateExist(month, date, year));
        } else {
            return false;
        }
    } else if (fieldValue[1]) {
        if (validator.isValidMonth(fieldValue[1])) {
            return true;
        } else {
            return false;
        }
    } else if (fieldValue[0] && validator.isValidDay(fieldValue[0])) {
        return true;
    }
};

dateValidator.yyyymmdd = function (value, dateFormat, validator, delimiter) {

    var fieldValue = value.trim().split(delimiter);

    if (fieldValue[2] && value.length >= dateFormat.length) {
        if (validator.isValidDateformat(value, dateFormat)) {
            var year = parseInt(fieldValue[0]);
            var month = parseInt(fieldValue[1]);
            var date = parseInt(fieldValue[2]);
            return (dateValidator.dateExist(month, date, year));
        } else {
            return false;
        }
    } else if (fieldValue[1]) {
        if (validator.isValidMonth(fieldValue[1])) {
            return true;
        } else {
            return false;
        }
    } else if (fieldValue[0] && validator.isValidYear(fieldValue[0])) {
        return true;
    }
};

dateValidator.dateExist = function (month, date, year) {
    // Create list of days of a month [assume there is no leap year by default]
    var listOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month == 1 || month > 2) {
        if (date > listOfDays[month - 1]) {
            return false;
        }
    }
    if (month == 2) {
        var leapYear = false;
        if ((!(year % 4) && year % 100) || !(year % 400)) {
            leapYear = true;
        }
        if ((leapYear == false) && (date >= 29)) {
            return false;
        }
        if ((leapYear == true) && (date > 29)) {
            return false;
        }
    }
    return true;
};

dateValidator.findDelimiter = function (value) {
    var delimiter;
    if (value.indexOf('/') != -1) {
        delimiter = '/'
    } else if (value.indexOf('-') != -1) {
        delimiter = '-'
    } else if (value.indexOf('.') != -1) {
        delimiter = '.'
    }
    return delimiter;
};



