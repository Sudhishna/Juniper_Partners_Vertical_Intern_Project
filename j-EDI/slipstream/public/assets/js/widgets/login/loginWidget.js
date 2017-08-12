/**
 * A module that builds a login page using default or plugin-specific titles and subtitles. It invokes the login mechanism provided by the plugin invoking this widget.
 *
 * @module LoginWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'widgets/form/formWidget',
    'widgets/login/conf/formConfiguration',
    'widgets/login/lib/loginTemplates',
    'widgets/spinner/spinnerWidget',
    'widgets/overlay/overlayWidget',
    'lib/i18n/i18n',
    'text!widgets/login/templates/loadingBackground.html'
],  /** @lends LoginWidget */
    function(render_template, FormWidget, formConf, LoginTemplates, SpinnerWidget, OverlayWidget, i18n, LoadingBackgroundTemplate){

    /**
     * LoginWidget constructor
     *
     * @constructor
     * @class LoginWidget - Builds a login page from its configuration object.
     *
     *  @param {Object} conf - A configuration object with the following variables:
     * container: container where the widget will be rendered,
     * callback: function that will be called after committing successfully the new password
     * loginTitles: content that will overwrite default titles of the login view
     * @returns {Object} LoginWidget object
     */
    var LoginWidget = function(conf){

       var $loginWidgetContainer, loginForm, loginOverlay, processIndicatorOverlay, spinner, spinnerContainer,
           templates = new LoginTemplates().getTemplates();

        /**
         * Builds a LoginWidget in the provided container
         * @returns {Object} Reference to the LoginWidget object
         */
        this.build =  function () {
            _.extend(formConf.values, conf.content);
            if (conf.container){
                $("body").addClass('login_background');
                $loginWidgetContainer = $(conf.container);
                $loginWidgetContainer.append(render_template(templates.loginContainer,formConf.values,{
                    'loginContent':templates.loginAllScreen,
                    'loginForm':templates.loginForm
                }));
                addLoginForm($loginWidgetContainer);
            } else {
                $loginWidgetContainer = $(render_template(templates.loginContainer,formConf.values,{
                    'loginContent':templates.loginForm
                }));
                addLoginForm($loginWidgetContainer);
                var LoginView = Backbone.View.extend({
                    el: $loginWidgetContainer
                });
                loginOverlay = new OverlayWidget({
                    view: new LoginView(),
                    type: 'medium'
                });
                loginOverlay.build();
            }
            return this;

        };

        /**
         * Adds a login form
         * @param {Object} $loginWidgetContainer - jQuery object with the container that will have a login form added
         * @inner
         */
        var addLoginForm = function ($loginWidgetContainer){
            var $loginFormContainer = $loginWidgetContainer.find('.login_form');
            loginForm = new FormWidget({
                "elements": formConf.login,
                "container": $loginFormContainer,
                "values": formConf.values
            });
            loginForm.build();

            //moves the form description next to the login title
            var description = $loginFormContainer.find('.section_description').detach();
            $loginFormContainer.find('.slipstream-content-title').after(description)

            $loginFormContainer.find('#login_credentials').on('click',function(e){
                e.preventDefault();
                if (loginForm.isValidInput()){
                    submitCredentials(loginForm.getValues());
                }
            });
        };

        /**
         * Submit credentials to the callback function defined by the submitCredentials from the configuration object and provides an activity indicator while use waits for plugin API response.
         * @param {Object} values - user input for username and password
         * @inner
         */
        var submitCredentials = function (values) {
            var username = values[0].name == 'login_username'? values[0].value : "";
            var password = values[1].name == 'login_password'? values[1].value : "";
            var activityIndicatorTime = 0; // setting to 0 for now to prevent the submit button from being clicked more than once.
            
            spinnerContainer = $loginWidgetContainer.find(".login_form_block .centered");

            processIndicatorOverlay = setTimeout(function () {          
                spinner = new SpinnerWidget({
                    "container": spinnerContainer,
                    "statusText": i18n.getMessage('login_widget_activity_indicator_msg')
                }).build();
                
                spinnerContainer.append(render_template(LoadingBackgroundTemplate));
            }, activityIndicatorTime);
            conf.submitCredentials(username,password,onSubmitCredentials);
        };

        /**
         * Allows plugin to give feedback of the response received after submitting user credentials. If the response was 'error', an error message will be shown to the user. If the response was 'success', the background of the page is removed. In both cases, the activity indicator is closed.
         * @param {String} success - true for valid user credentials, and false for invalid user credentials.
         * @inner
         */
        var onSubmitCredentials = function (success, errMsg){
            clearTimeout(processIndicatorOverlay);
            if (spinner){
                spinner.destroy();
                if (spinnerContainer.find(".slipstream-indicator-background").length > 0) spinnerContainer.find(".slipstream-indicator-background").hide();
            }
            if (success)  {
                if (loginOverlay){
                    loginOverlay.destroy();
                }
            } else {
                loginForm.showFormError(errMsg);
            }
        };

        /**
         * Destroys all elements created by the LoginWidget in the specified container
         * @returns {Object} Current LoginWidget object
         */
        this.destroy = function(){
             $("body").removeClass('login_background');
            $loginWidgetContainer.remove();
            return this;
        };

    };

    return LoginWidget;
});