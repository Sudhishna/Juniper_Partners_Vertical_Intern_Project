/**
 * This function is used to mask the ip address input field to auto add dot in each octet with three digits
 *
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 *  @param jquery object with input fields
 */

function ipv4Mask($ipFields) {

    $ipFields.bind("keyup", { parentObj: this }, function (e) {
        var cursorPos = $(this)[0].selectionStart;
        var autoDot = addAutoDot(cursorPos, $(this)[0].value);
        if (autoDot) {
            $(this)[0].value = $(this)[0].value + ".";
        }
    });

    function addAutoDot(cursorPos, inputValue) {
        var octetSections = inputValue.split('.');
        for (var i in octetSections) {
            var addAutoDot = false;
            if (octetSections[i].length < 3) {
                continue;
            } else if (octetSections[i].length == 3) {
                addAutoDot = true;
            }
            if (i >= 3) {
                addAutoDot = false;
            }
        }
        return addAutoDot;
    };
};
