/**
 * Configuration required for the login plugin
 *
 * @module User Login Configuration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var userLoginConfiguration = {};

    userLoginConfiguration.parameters = {
        "timeout": "18000" //3 * 60 * 1000
    };

    return userLoginConfiguration;

});