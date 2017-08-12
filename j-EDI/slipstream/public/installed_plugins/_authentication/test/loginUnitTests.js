define([
  'installed_plugins/login/js/models/loginModel.js',
  'installed_plugins/login/js/views/loginView.js'
], function(
  LoginModel,
  LoginView
) {
  describe("Login plugin unit-tests", function() {

    describe("Models tests", function() {
	  var loginModel = new LoginModel.login(), logoutModel = new LoginModel.logout();
		
      it("login model should exist", function() {
        loginModel.should.exist;
      });
		
      it("logout model should exist", function() {
	    logoutModel.should.exist;
      });	
    });
	describe('Views tests - login form', function() {
	  var view = new LoginView({
	    "context": {
	   	  getMessage: function() {
			return "blah blah";
  		  }
		}
	  });
	  view.render();
	  var formElem = $('#login_user_password'),
		  usernameField = $('#login_username'),
		  passwordField = $('#login_password'),
		  loginButton = $('#login_credentials');
 
	  it('Form should exist in the DOM', function() {
		formElem.should.exist;
	  });
 
	  it('Username field should exist in the DOM', function() {
		usernameField.should.exist;
	  });
	  
	  it('Password field should exist in the DOM', function() {
	    passwordField.should.exist;
	  });
	  
	  it('Login Button should exist in the DOM', function() {
	    loginButton.should.exist;
	  }); 
  	});
  });
});