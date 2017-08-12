define(function() {
    var UsernameActivity = function() {
        
        this.onCreate = function() {
        	var authResolver = new Slipstream.SDK.AuthenticationResolver();
            var username = authResolver.getUserName() || "";
            this.context.toolbarElement.setUserName(username);
        }
    };

    UsernameActivity.prototype = Object.create(Slipstream.SDK.Activity.prototype);
    UsernameActivity.prototype.constructor = UsernameActivity;

    return UsernameActivity;
});