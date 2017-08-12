/**
 * A library that groups templates used by the Login widget
 *
 * @module LoginTemplates
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'text!widgets/login/templates/loginContainer.html',
    'text!widgets/login/templates/loginAllScreen.html',
    'text!widgets/login/templates/loginForm.html'
], /** @lends LoginTemplates */
    function(loginContainer, loginAllScreen, loginForm){

    /**
     * LoginTemplates constructor
     *
     * @constructor
     * @class LoginTemplates
     */
    var LoginTemplates = function () {

        /**
         * Provides partial templates used by the login widget to create elements of the login.
         */
          this.getTemplates = function () {
              return {
                  "loginContainer":loginContainer,
                  "loginAllScreen":loginAllScreen,
                  "loginForm":loginForm
              }
          };

  }

    return LoginTemplates;
});
