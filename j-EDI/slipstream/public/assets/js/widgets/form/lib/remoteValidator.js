/**
 * A module that implements remote validation by calling a REST API that will test the input data. An event is triggered the validation has been completed.
 *
 * @module RemoteValidator
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
], /** @lends RemoteValidator */
    function(){

    /**
     * @class RemoteValidator
     */
    var RemoteValidator = function(){

        /**
         * Tests if an HTML input element has a valid value by invoking a REST API.
         * The API call is asynchronous and it is expected to return true if the value is 'valid' or 'false' if it is invalid.
         * The configuration object consists of the element that requires validation (el) and the parameters to call the API (remote).
         * @param {Object} remote - configuration required to test if the element is valid. It consists of:
         * url: it represents the REST API to be called; in case the url needs to be composed by the input data, a callback function can be defined instead of the string. The url callback function is invoked with the value of the element that needs validation.
         * type:  the type of request to make ("POST","GET","PUT","DELETE")
         * response: a callback function that can be used to reformat the API response to comply with the expected return value of 'true' or 'false'. The response callback function is invoked with two parameters: the status of the response and the response text. It is called once the API request is completed.
         * @param {Object} el - element that needs validation
         * @returns {boolean} true if the element validation is valid, false if the elements fails the validation.
         * A custom event with a name composed by the "remote_" and the id of the element will be triggered with the true/false data if the value was valid or invalid.
         */
        this.validateDataOnRemote = function (remote,el){
            var url = remote.url;
            if (typeof(url) == "function")
                url = url(el.value, el);
            remote.el = el;
            $.ajax({
                url:url,
                headers: remote.headers,
                type:remote.type,
                context: remote,
                complete: function(e, xhr, settings){
                    var remote = this;
                    var formatResponse = remote.response,
                        isValid = e.responseText;
                    if(formatResponse){
                        isValid = formatResponse(e.status, e.responseText);
                    }
                    $(remote.el).trigger('remote_'+remote.el.id,isValid);
                }
            });
        };

    };

    return RemoteValidator;
});