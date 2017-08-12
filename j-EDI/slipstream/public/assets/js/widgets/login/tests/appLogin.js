/**
 * A view that renders a Login widget
 *
 * @module LoginView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/login/loginWidget',
    './models/LoginModel',
    'mockjax'
], function(Backbone, LoginWidget, LoginModel, mockjax){
    var LoginView = Backbone.View.extend({

        model: new LoginModel(),

        initialize: function () {
            this.mockApiResponse();
        },

        render: function () {
            var self = this;
            this.loginWidget =  new LoginWidget({
                container: this.el,
                content: {
                    title: "Juniper Web Device Manager",
                    subtitle: "SRX320",
                    version: "Version 123.ABC",
                    copyrightYear: "2015"
                },
                submitCredentials: _.bind(self.submitCredentials, self)
            });
            this.loginWidget.build();
            return this;
        },

        submitCredentials: function(username, password, onSubmitCredentials){
            var self = this;
            this.model.set('user', username);
            this.model.set('password', password);
            this.model.save(null, {
                error: function (data) {
                    console.log('error in login: ', JSON.stringify(data));
                    onSubmitCredentials(false);
                },
                success: function (data) {
                    console.log('success in login: ', JSON.stringify(data));
                    onSubmitCredentials(true);
                    self.$el.empty().append('User credentials are valid');
                }
            });
        },

        /* mocks REST API response for login to the app */
        mockApiResponse: function(){
            $.mockjax({
                url: '/slipstream/api/login',
                dataType: 'json',
                type: 'post',
                responseTime: 2000,
                response: function(settings) {
                    var header = $.parseJSON( settings.data );
                    var username = header.user,
                        password = header.password;
                    if (username=='miriam'&&password=='vilitanga'){
                        this.responseText = {success: true};
                    } else {
                        this.error = 404;
                    }
                }
            });
        }
    });

    return LoginView;
});