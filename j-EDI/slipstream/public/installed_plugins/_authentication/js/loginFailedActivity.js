define( [
    './views/logoutView.js'
],
        function( LogoutView ) {
            /**
              * Construct a loginFailedActivity
              */
            var loginFailedActivity = function( ) {
                Slipstream.SDK.Activity.call( this );
                var self = this;
                this.onStart = function( ) {
                    this.constructLogoutView( );
                };
                this.constructLogoutView = function( ) {
                    var extras = this.getIntent().getExtras();
                    var logoutView = new LogoutView( {
                        context: self.getContext( ),
                        message: (extras && extras.message )? extras.message:self.getContext( ).getMessage( 'certificate_login_failed' ),
                        info: (extras && extras.info )? extras.info: " "
                    } );
                    this.setContentView( logoutView );
                };
            };

            loginFailedActivity.prototype = Object.create( Slipstream.SDK.Activity.prototype );
            loginFailedActivity.prototype.constructor = loginFailedActivity;

            return loginFailedActivity;
        } );
