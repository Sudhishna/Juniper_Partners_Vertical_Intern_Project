/**
 * An activity module that instantiates the login widget and uses the authentication resolver to complete the login process.
 *
 * @module LoginActivity
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'widgets/login/loginWidget',
    './conf/userLoginConfiguration.js',
    "conf/global_config",
], function(LoginWidget, userLoginConfiguration, global_config) {
    /**
     * Construct a LoginActivity
     */
    var LoginActivity = function() {
        Slipstream.SDK.Activity.call(this);

        var authResolver;
        var self = this;
        var loginView;
        var global_conf_nls_ctx_name = "__global_conf__";

        this.onStart = function() {
            authResolver = new Slipstream.SDK.AuthenticationResolver();
            var context = this.getContext();
            var product_name = Slipstream.reqres.request("nls:retrieve", {
                msg: global_config.product_name,
                namespace: global_conf_nls_ctx_name
            });
            var product_version = Slipstream.reqres.request("nls:retrieve", {
                msg: global_config.product_version,
                namespace: global_conf_nls_ctx_name
            });
            var product_release_year = Slipstream.reqres.request("nls:retrieve", {
                msg: global_config.product_release_year,
                namespace: global_conf_nls_ctx_name
            });
            var loginWidgetConf = {
                submitCredentials: onSubmitCredentials,
                content: {
                    title: product_name,
                    version: product_version,
                    copyright: context.getMessage("login_copyright"),
                    copyrightYear: product_release_year
                }
            };

            if (this.intent.extras.target_intent){ //if the app was auto logged out
                
                authResolver.unauthenticate();

                Slipstream.UI.render(true);

                var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_AUTHENTICATE, {
                    uri: new Slipstream.SDK.URI("auth://")
                });

                context.startActivity(intent);

                //history means windows.history
                history.pushState(null, null, '/');

            } else {
                var LoginView = Marionette.ItemView.extend({
                    render: function(){
                        _.extend(loginWidgetConf, {container: this.el});
                        this.loginWidget = new LoginWidget(loginWidgetConf).build();
                    },
                    onClose: function() {
                        this.loginWidget.destroy();
                    }
                });

                loginView = new LoginView();
                this.setContentView(loginView);
            }
        };

        function onSubmitCredentials(username, password, resultCallback) {
            authResolver.authenticate(username, password, {
                success: function() {
                    // If the caller is expecting a result, send it.
                    Slipstream.SDK.Analytics.setUserId(username);
                    
                    resultCallback(true);
                    loginView.close();
                    self.setResult(Slipstream.SDK.BaseActivity.RESULT_OK);
                    self.finish();
                },
                fail: function(authenticationError) {
                    resultCallback(false, authenticationError);
                }
            });
        }

        function setIdleTimeout() { //kept for future reference since the current authentication relies on the expiration time provided in the authentication resolver
            var timeOut = parseInt(userLoginConfiguration.parameters.timeout);

            //Start timer and logout user after timeOut secs
            $(document).idleTimer(timeOut)
                .on("idle.idleTimer", function () {
                    console.log("Logging out the user after the idle time (" + timeOut + ") has been reached");

                    var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_UNAUTHENTICATE, {
                        uri: new Slipstream.SDK.URI("auth://")
                    });

                    self.context.startActivity(intent);
                });
        }

    };

    LoginActivity.prototype = Object.create(Slipstream.SDK.Activity.prototype);
    LoginActivity.prototype.constructor = LoginActivity;

    return LoginActivity;
});
