define([
    './models/loginModel.js',
    './views/logoutView.js'
], function(LoginModel, LogoutView) {
    /**
     * Construct a LogoutActivity
     */
    var LogoutActivity = function() {   
        Slipstream.SDK.Activity.call(this);
        var self = this;
        this.onStart = function() {
            // Unauthenticate the current user
            var authResolver = new Slipstream.SDK.AuthenticationResolver();

            function refreshUI() {
                 window.location = "/";      
            }
            
            function unauthenticateCallback(){
                authResolver.getAuthenticationMode({
                    success: function(authMode){
                        if((authMode && authMode == 'cert') || (self.intent.extras && self.intent.extras.message)){
                            Slipstream.UI.render(true);
                            history.pushState(null, null, '/');
                            self.constructLogoutView();
                        }
                        else{
                            refreshUI();
                        }
                    },
                    fail: function(){
                        refreshUI();
                    }
                });
            }

            var doLogout = function() {
                authResolver.unauthenticate({
                    success: function() {
                        unauthenticateCallback()
                    },
                    fail: function() {
                        /* 
                         * logout likely failed because the session expired so refresh
                         * the UI.
                         */
                        unauthenticateCallback();
                    }
                });
            };
            Slipstream.commands.execute('navigation:request',{success: doLogout, fail:function(){}});
        };
        this.constructLogoutView = function() {
            var params = {context : self.getContext()};
            if(self.intent.extras && self.intent.extras.message){
              params.message = self.intent.extras.message;
            }
            var logoutView = new LogoutView(params);
            self.setContentView(logoutView);
        };
    };

    LogoutActivity.prototype = Object.create(Slipstream.SDK.Activity.prototype);
    LogoutActivity.prototype.constructor = LogoutActivity;

    return LogoutActivity;
});
