define(function() {
    /**
     * Construct a MyProfileActivity
     */
    var MyProfileActivity = function() {

        this.onStart = function() {
          var self = this;
          var doStartActivity = function() {
            intent = new Slipstream.SDK.Intent( "VIEW",
            {
              "mime_type": "vnd.juniper.net.myprofile.launch"
            } );
            self.context.startActivity( intent );
          };
          Slipstream.commands.execute('navigation:request',{success: doStartActivity, fail:function(){}});
        };
    };

    MyProfileActivity.prototype = Object.create(Slipstream.SDK.Activity.prototype);
    MyProfileActivity.prototype.constructor = MyProfileActivity;

    return MyProfileActivity;
});
