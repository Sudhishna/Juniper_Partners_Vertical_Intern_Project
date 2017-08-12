/**
 * A module that personalization of the logout view titles and messages.
 * 
 * @module LoginView
 * @copyright Juniper Networks, Inc. 2014
 */

define( [
    'lib/template_renderer/template_renderer',
    'backbone',
    'widgets/form/formWidget',
    './../conf/logoutConfiguration.js',
    'text!widgets/login/templates/loginContainer.html',
    'text!widgets/login/templates/loginAllScreen.html',
    'text!widgets/login/templates/loginForm.html'
],
        function( render_template,
                Backbone,
                FormWidget,
                FormConf,
                loginContainer,
                loginAllScreen,
                loginForm ) {

            var LogoutView = Backbone.View.extend( {

                initialize: function( ) {
                    this.context = this.options.context;
                },

                render: function( ) {
                    var formConf = new FormConf( this.context );
                    var formValues = formConf.getValues( );
                    $( "body" ).addClass( 'login_background' );
                    this.$el.append( render_template( loginContainer,
                            formValues,
                            {
                                'loginContent': loginAllScreen,
                                'loginForm': loginForm
                            } ) );
                    var elements = formConf.getLogoutConf( {message: this.options.message, info: this.options.info } );

                    logoutForm = new FormWidget( {
                        "elements": elements,
                        "container": this.$el.find( '.login_form' ),
                        "values": formValues
                    } );
                    logoutForm.build( );
                    return this;
                }
            } );

            return LogoutView;
        } );