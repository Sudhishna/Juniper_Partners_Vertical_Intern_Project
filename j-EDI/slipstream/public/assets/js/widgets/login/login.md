# Login Widget


## Introduction
The login widget is a reusable graphical user interface that allows a plugin to include a login view  with a username/password pair that should be used to log into the application.

## API
The login widget follows the widget programming interface standards, therefore it exposes: a build method and a destroy method and any data required by the widget is passed by its constructor. It has an additional method called 'onSubmitCredentials' that allows plugin give feedback to the login widget of the result of authentication request.


## Configuration
The configuration object has the following variables:

```
{
	container: <define the container where the widget will be rendered, if it is not available, the widget will be rendered on an overlay>,
	loginTitles: <define the content that overwrites default titles of the login view>,
    submitCredentials: <define the function that the login widget will call to execute the authentication provided by the plugin>,
}
```

For example:

```
var self = this;
var loginWidget = new LoginWidget({
    container: self.$el,
    content: titles,
    submitCredentials: _.bind(self.submitCredentials, self)
});
loginWidget.build();
```

where the content is an object with the parameters: title, subtitle, version and copyrightYear. For example:

```
var titles = {
     title: this.context.getMessage("login_title"),
     subtitle: this.context.getMessage("login_model"),
     version: this.context.getMessage("login_version"),
     copyrightYear: "2014"
 },
```

and submitCredential has the parameters:
- username: user provided in the login form
- password: password provided in the login form
- onSubmitCredentials: function callback that gives the login widget a feedback with the response of the user authentication. It's execution is **required** and it has the parameter success. If the success parameter is set to false, it will show an error message at the top of the login box; otherwise, the application homepage will be showed.

### Build
Adds the dom elements and events of the login widget in the specified container. For example:

```
{
    loginWidget.build();
}
```

### onSubmitCredentials
Allows the login widget to receive a feedback with the response of the user authentication. First, it destroys the activity indicator, and then, if the response was an error, it will show an error message at the top of the login box; otherwise, it will remove the login background. For example:

```
var self = this;
this.model.set('user', username);
this.model.set('password', password);
this.model.save(null, {
    error: function (data) {
        console.log('error in login: ', JSON.stringify(data));
        self.loginWidget.onSubmitCredentials('error');
    },
    success: function (data) {
        console.log('success in login: ', JSON.stringify(data));
        self.loginWidget.onSubmitCredentials('success');
        self.onLogin();
    }
});
```

### Destroy
Clean up the specified container from the resources created by the login widget.

```
{
    loginWidget.destroy();
}
```

## Usage
To add a login/set password view in a container, follow these steps:
1. Instantiate the login widget and provide the configuration object with the title, subtitle and other plugin specific labels and the container where the login widget will be rendered.
2. Call the build method of the login widget.

Optionally, the destroy method can be called to clean up resources created by the login widget.

```
new LoginWidget({
    container: self.$el,
    content: {
        title: this.context.getMessage("login_title"),
        subtitle: this.context.getMessage("login_model"),
        version: this.context.getMessage("login_version"),
        copyrightYear: "2014"
    },
    submitCredentials: _.bind(self.submitCredentials, self)
}).build();
```

If the login widget needs to be used in the context of the first page of an application, then the plugin that instantiates the login widget needs to create an activity with a MAIN action. For example, the plugin.json should look like this:

```
{
    "name": "preload",
    "description": "Set password or login",
    "publisher": "Juniper Networks, Inc.",
    "version": "0.0.1",
    "release_date": "03.24.2014",
    "min_platform_version": "0.0.1",
    "activities": [
        {
            "module": "loginActivity",
            "filters": [
                {
                    "action": "MAIN",
                    "data": {
                        "mime_type": "vnd.juniper.net.login"
                    }
                }
            ]
        }
    ]
}
```