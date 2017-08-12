/**
 * A module that instantiates the login widget using its own models for API calls and
 * personalization of the login view titles.
 *
 * @module LoginView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/login/loginWidget'
],  function(Backbone, LoginWidget){

    var LoginView = Backbone.View.extend({

        initialize: function(){
            this.context = this.options.context;
        },

        render: function() {
            var self = this;

            new LoginWidget({
                submitCredentials: this.options.onSubmitCredentials,
                container: self.$el,
                content: {
                    title: this.context.getMessage("login_title"),
                    model: this.context.getMessage("login_model"),
                    version: this.context.getMessage("login_version"),
                    copyright: this.context.getMessage("login_copyright")
                }
            }).build();

            return this;
        }

    });

    return LoginView;
});