# Introduction
The Slipstream framework provides a programming construct for plugin developers to display their individual dashboard widgets. These widgets can contain any information the plugin developers want to display on the dashboard - for example visual graphs, real-time data, status, chassis information and links to quick setup wizards.


#### The dashboard contains three main sections:

1. The title, along with action buttons.
2. The thumbnail container, which can be expanded or collapsed.
3. The dashlet container, which contains the main widgets.

# API
The dashboard widget object exposes the following methods and attributes:

```javascript
function Dashboard(config) {…}
```
Constructor, used to create a new Dashboard widget.
The configuration attributes are defined as below:
**container** - The attribute to search for and append the dashboard widget's html to once rendered. e.g. '#dashboard_container'.
If you are using the dashboard outside of Slipstream framework context, this parameter is mandatory for the dashboard to render content properly. Refer to the ["Using Dashboard widget without the Slipstream framework context"](#dashboard_without_framework) section below.
If you are using the dashboard widget within the Slipstream framework's context, you need not specify a container. Refer to the ["Using Dashboard widget in the Slipstream framework context"]("#dashboard_with_framework") section below.

```javascript
function addDashboardWidget(dashboardWidget)
```
Function to add a widget template to the dashboard widget from which users can spawn multiple widgets in the dashlet container area. You need to use this function if you are using the Dashboard widget without the Slipstream framework context. Refer to the ["Using Dashboard widget without the Slipstream framework context"](#dashboard_without_framework) section below.

The parameter dashboardWidget is an object containing the following attributes:

**title** - The dashboard widget's title

**size** - A string from the following set indicating the size of the widget when added to the dashboard container area:
small: (width: 200px, height: 100px),
single: (width: 400px, height: 300px),
double: (width: 800px, height: 300px),
vertical: (width: 400px, height: 600px),
large: (width: 800px, height: 600px),
wide: (width: 1200px, height: 300px)

**details** - String details for the dashboard widget that need to be shown in the dropdown when hoevered over the thumbnail in the thumbnail container

**view** - A reference to the view class from which new widgets should be initialized when dragging and dropping thumbnails from the thumbnail container to dashlet container. Refer to the ["Using Dashboard widget without the Slipstream framework context"](#dashboard_without_framework) section below for an example of the view parameter. The view itself is a class written as per Slipstream's View guidelines. Refer to [Views](Views.md) for these guidelines.

**image** - An instantiated view that renders an image for the widget's thumbnail in the thumbnail container. Refer to the ["Using Dashboard widget without the Slipstream framework context"](#dashboard_without_framework) section below for an example of the image parameter.

**customEditView** - An instantiated view that renders custom controls for the widget's Edit form. 

```javascript
function build(conf)
```
Function to setup and render the dashboard using conf params. conf is an object with following parameters:
**dashboard_title** - (optional) The title to be displayed on the upper left corner for the dashboard.
**onDone** - (optional) Callback function for dashboard to call when it has been destroyed.

```javascript
function destroy()
```
Function to close the widgets, close the dashboard, free up other resources and remove it from the DOM.

**customInitData** - In addition to supplying data to the customEditView, *customInitData* can be used by the dashlet view to send and receive custom settings from the framework. The framework will store this JSON object, and the app is responsible for managing it.

# Views
As mentioned above, dashlets views should be written as per Slipstream's [Views](Views.md) guidelines. To implement custom behavior, the view class can implement several custom functions.

## Dashlet View

**More Details** - To display a 'More Details' link, the view should implement the `moreDetails` function. When the link is clicked, the framework delegates the event to this function for the view to handle.

**Custom Init Data** - A JSON object which is passed back and forth between the views and the framework to handle custom data, such as refresh interval, dashlet type, etc. This is passed into the view during initialization. An initial set of custom data can be specified in plugin.json, which is passed in when the dashlet is created, or when no custom data is found. This is described below.
  ```javascript
    this.initialize: function() {
        this.customData = this.options.customInitData;
    }
  ```

  - **getCustomInitData** - An optional function which allows the view to save customInitData. It is called by the framework after initialization, and after a dashlet has been edited. Rather than expecting data to be returned, a callback is passed in for the view to call when it's ready. This allows the view to make asynchronous calls if it needs to, and update the customInitData later.

  **Note:** if the `getCustomInitData` function is implemented in a view, the `doneCallback` *must* be called, or the framework will not persist the dashlet.
  ```javascript
    getCustomInitData: function (doneCallback) {
        var customData = ...;
        // process data
        doneCallback(customData);
    }
  ```

**refresh** - This function is called under two circumstances: when the refresh button is clicked, and after the dashlet is updated. For both cases, a progress indicator is displayed, and a `done` callback is passed in. Call this callback to hide the progress indicator. In the latter case, a dashlet model is passed in, which includes all the dashlet settings, including `customInitData`. This allows the view to handle any additional processing it needs to do following an update.
```javascript
refresh: function(done, proposedModel) {
    if (proposedModel !== undefined) {
        // The dashlet was updated
        // re-fetch data with updated parameters
    } else {
        // Refresh button was clicked
    }
    done();
}
```

**close** - This function is called to cleanup a dashlet when navigating away from the dashboard, or when the dashlet is deleted. When a dashlet is deleted, a parameter with boolean value `true` is passed in. Otherwise, no parameter is passed in. This distinction may be necessary if some processing is needed on the remote device, beyond what Slipstream is managing.
```javascript
close: function(deleteDashlet) {
    if (deleteDashlet) {
        // process dashlet delete
    }
    this.$el.remove();
    ...
}
```

## Custom Edit View
The framework supplies a standard set of controls for editing a dashlet, including the title and description. The `customEditView` can define any additional controls, in any format. Custom data is handled by the framework through the *customInitData* object.

  - ***serialize*** - This function is called by the framework to fetch custom data. Data items can include *size*, and *customInitData*. *customInitData* is simply a JSON object, and can include anything that JSON can support. The *size* property must match one of the supported dashlet sizes. Developers are responsible for maintaining integrity of this object.

  ```javascript
    this.serialize: function() {
        return {
            'size': 'double',
            'customInitData': {
                'chartType': 'BAR',
                'auto_refresh': 25,
                'show_top': 10
            }
        };
    };
  ```
  - ***render*** - The view's render function will be called by the framework when it is ready to display the customEditView.

## Filters
The framework supports an optional filter area below the dashlet header. Up to two dropdown box filters can be added to a dashlet.
To add a filter, define the parameters in a conf file, eg. defaultFilterConf.js.
Then include the conf file in plugin.json for each dashlet.

```javascript
define([], function () {
    var FilterConf = function (context) {
        var filters = [
            {
                'name': 'dashlet_previous_filter',
                'label': 'Previous',
                'values': [
                    {
                        'label': '5 mins',
                        'value': 300000
                    },
                    {
                        'label': '15 mins',
                        'value': 900000
                    },
                    {
                        'label': '30 mins',
                        'value': 1800000
                    },
                    {
                        'label': '1 hour',
                        'value': 3600000,
                        'selected': true
                    },
                    {
                        'label': '8 hours',
                        'value': 28800000
                    },
                    {
                        'label': '1 day',
                        'value': 86400000
                    },
                    {
                        'label': '4 days',
                        'value': 345600000
                    },
                    {
                        'label': '7 days',
                        'value': 604800000
                    }
                ]
            }
        ];
        this.getValues = function() {
            return filters;
        };
    };
    return FilterConf;
});
}
```

## plugin.json
The framework finds the dashlet and custom edit views via two values in the plugin's manifest file. An initial `customInitData` object can also be specified, which is used during dashlet creation, or if no customInitData is stored.
```javascript
{
    'name': 'pluginName',
    ...
    'dashboard': {
        'widgets': [
            {
                'title': "Dashlet Title",
                'size': "double",
                'details': "Dashlet Description",
                'module': "myDashletView",  // specified dashlet view
                'thumbnail': "top-applications.jpg",
                'editView': "myDashletEditView",    // specified dashlet's custom edit view
                'filterConf': "defaultFilterConf",  // specified dashlet's filter configuration
                'customInitData': {
                    'myCustomSetting': 1234
                }
            }
        ]
    }
}
```

# Using Dashboard widget without the Slipstream framework context  <a name="dashboard_without_framework"></a>
The Dashboard widget can be used without without the Slipstream framework.

## Writing your dashboard container template
Example: testDashboard.html
```html
<!doctype html>
<html class="no-js" lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Test Dashboard Widget</title>
        <link rel="stylesheet" href="/assets/css/app.css" />
        <link rel="stylesheet" href="./testDashboard.css" />
    </head>
    <body>
        <div id="dashboard_test_content"></div>
        <div id="overlay_content"></div>
        <script data-main="main" src="/assets/js/vendor/require/require.js"></script>
    </body>
</html>
```
***Note***: Your html template needs to have a div with id="overlay_content" under a location that spans 100% of height and width of your page. This is required by the overlay widget to render itself with the proper size and at the proper location. The dashboard uses the overlay widget to prompt for confirmation of removal of widgets from the dashboard.

## Writing your require config file
As you can see in the previous section, the html page includes a start point module for require.js - main.js.
main.js is supposed to load and inject all third party dependencies required for Slipstream widgets.
This file also loads a lightweight version of the Slipstream framework which provides custom template rendering support to the dashboard.

Example main.js
```javascript
require.config({
    baseUrl: '/assets/js',
    paths: {
        URI: 'vendor/uri/URI',
        jquery: 'vendor/jquery/jquery',
        jqueryui: 'vendor/jquery/jquery-ui',
        "jqueryDatepicker": 'vendor/jquery/jquery-ui-datepicker',
        "jquery-i18n": 'lib/jquery-i18n-properties/jquery.i18n.properties',
        "jquery.idle-timer": 'vendor/jquery/jquery.idle-timer',
        'jquery.shapeshift': 'vendor/jquery/jquery.shapeshift',
        'jquery.toastmessage': 'vendor/jquery/jquery.toastmessage',
        'toastr': 'vendor/jquery/toastr/toastr',
        jcarousel: 'vendor/jquery/jcarousel/jquery.jcarousel',
        modernizr: 'vendor/modernizr/modernizr',
        foundation: 'vendor/foundation/foundation',
        underscore: 'vendor/underscore/underscore',
        template: 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
        hogan: 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
        backbone: 'vendor/backbone/backbone',
        'backbone.localStorage': 'vendor/backbone/backbone.localStorage',
        'backbone.picky': 'vendor/backbone/backbone.picky',
        "backbone.modal": "vendor/backbone/backbone.modal",
        "backbone.marionette.modals": "vendor/backbone/backbone.marionette.modals",
        'backbone.syphon': 'vendor/backbone/backbone.syphon',
        marionette: 'vendor/backbone/backbone.marionette',
        validator: 'vendor/validator/validator',
        text: 'vendor/require/text',
        d3: 'vendor/d3/d3',
        highcharts: 'vendor/highcharts/highcharts',
        highchartsmore: 'vendor/highcharts/highcharts-more',
        gridLocale: 'vendor/jquery/jqGrid/i18n/grid.locale-en',
        jqGrid: 'vendor/jquery/jqGrid/jquery.jqGrid',
        'jquery.contextMenu': 'vendor/jquery/jqContextMenu/jquery.contextMenu',
        'jquery.tooltipster': 'vendor/jquery/jqTooltipster/jquery.tooltipster',

        /* Foundation */
        'foundation.core': 'vendor/foundation/js/foundation',
        'foundation.abide': 'vendor/foundation/js/foundation/foundation.abide',
        'foundation.accordion': 'vendor/foundation/js/foundation/foundation.accordion',
        'foundation.alert': 'vendor/foundation/js/foundation/foundation.alert',
        'foundation.clearing': 'vendor/foundation/js/foundation/foundation.clearing',
        'foundation.dropdown': 'vendor/foundation/js/foundation/foundation.dropdown',
        'foundation.interchange': 'vendor/foundation/js/foundation/foundation.interchange',
        'foundation.joyride': 'vendor/foundation/js/foundation/foundation.joyride',
        'foundation.magellan': 'vendor/foundation/js/foundation/foundation.magellan',
        'foundation.offcanvas': 'vendor/foundation/js/foundation/foundation.offcanvas',
        'foundation.orbit': 'vendor/foundation/js/foundation/foundation.orbit',
        'foundation.reveal': 'vendor/foundation/js/foundation/foundation.reveal',
        'foundation.tab': 'vendor/foundation/js/foundation/foundation.tab',
        'foundation.tooltip': 'vendor/foundation/js/foundation/foundation.tooltip',
        'foundation.topbar': 'vendor/foundation/js/foundation/foundation.topbar'

    },
    shim: {
        'URI': {
            exports: 'URI'
         },
        'underscore': {
            exports: '_'
        },
        'template': {
            exports: 'template'
        },
        'hogan': {
            deps: [ 'template' ],
            exports: 'Hogan'
        },
        'jquery.shapeshift': {
            deps: ['jqueryui'],
            exports: 'shapeshift'
        },
        jcarousel: {
            deps: ['jquery'],
            exports: 'jcarousel'
        },
        'toastr': {
            deps: ['jquery'],
            exports: 'toastr'
        },
        'backbone': {
            deps: [ 'underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone.localStorage': {
            deps: [ 'backbone'],
            exports: 'Backbone.LocalStorage'
        },
        'backbone.picky': ['backbone'],
        'backbone.syphon': {
            deps: [ 'backbone'],
            exports: 'Backbone.Syphon'
        },
        'marionette': {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        'backbone.modal': {
            deps: [ 'backbone'],
            exports: 'Backbone.Modal'
        },
        'backbone.marionette.modals': {
            deps: [ 'backbone','marionette'],
            exports: 'Backbone.Marionette.Modals'
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        'jquery-i18n': {
            deps: ['jquery'],
            exports: 'jQuery.i18n'
        },
        'jqueryDatepicker':{
            deps: ['jquery'],
            exports: 'jqueryDatepicker'
        },
        'highcharts': {
            deps: ['jquery'],
            exports: 'highcharts'
        },
        'highchartsmore': {
            deps: ['highcharts', 'jquery'],
            exports: 'highchartsmore'
        },
        jqGrid: {
            deps: ['jquery','gridLocale'],
            exports: 'jqGrid'
        },
        'jquery.contextMenu': {
            deps: ['jquery'],
            exports: '$.contextMenu'
        },

        /* Foundation */
        'foundation.core': {
            deps: [
                'jquery',
                'modernizr'
            ],
            exports: 'Foundation'
        },
        'foundation.abide': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.accordion': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.alert': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.clearing': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.dropdown': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.interchange': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.joyride': {
            deps: [
                'foundation.core',
                'foundation.cookie'
            ]
        },
        'foundation.magellan': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.offcanvas': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.orbit': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.reveal': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.tab': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.tooltip': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.topbar': {
            deps: [
                'foundation.core'
            ]
        },
        'jquery.tooltipster': {
            deps: [
                'jquery'
            ],
            exports: 'tooltipster'
        }
    }
});

define([
    'jquery',
    'foundation.core',
    'Slipstream'
], function ($, foundation, Slipstream) {

    $(document).foundation();
    Slipstream.initialize();
    Slipstream.vent.on("framework:booted", function() {
        require(['widgets/dashboard/tests/appDashboard'], function(DashboardView){
            new DashboardView({
                el: $('#dashboard_test_content')
            });
        });
    });
});

```

## Writing your controller/view that uses the dashboard
The example below shows 3 different widgets being added to the dashboard. Refer to ["Creating a dashboard widget with manual refresh functionality"](#creating_widget_with_manual_refresh) section below for further information on how to create use the refresh function to indicate success/failure.

Example: appDashboard.js
```javascript
define([
    'backbone',
    'widgets/dashboard/dashboard'
], function(Backbone, Dashboard){

    var BBView = Backbone.View.extend({
        initialize: function(options) {
            _.extend(this, options);
        },
        render: function() {
            this.$el.html(this.template);
            return this;
        }
    });

    var MyTestView1 = Backbone.View.extend({
        initialize: function(options) {
            _.extend(this, options);
        },
        render: function() {
            this.$el.html(this.template);
            return this;
        },
        template: '<div><img src="/assets/images/dashboard/testApp/thumbnail1.jpg"></div>'
    });

    var MyTestView2 = Backbone.View.extend({
        initialize: function(options) {
            _.extend(this, options);
        },
        render: function() {
            this.$el.html(this.template);
            return this;
        },
        template: '<div><img src="/assets/images/dashboard/testApp/thumbnail2.jpg"></div>',
        refresh: function(done) {
            setTimeout(function() {
                done();
            }, 2000);
        }
    });

    var MyTestView3 = Backbone.View.extend({
        initialize: function(options) {
            _.extend(this, options);
        },
        render: function() {
            this.$el.html(this.template);
            return this;
        },
        template: '<div><img src="/assets/images/dashboard/testApp/thumbnail3.jpg"></div>',
        refresh: function(done) {

            setTimeout(function() {
                done(new Error('Error refreshing MyTestView3'));
            }, 2000);
        }
    });

    var DashboardView = Backbone.View.extend({

        initialize: function () {
            this.dashboard = new Dashboard({
                container: '#dashboard_test_content'
            });

            var pluginContext = {
                ctx_name: '',
                ctx_root: ''
            };

            var self = this;
            self.dashboard.addDashboardWidget({
                title: 'Test 1',
                size: 'double',
                details: 'Test',
                image: new BBView({
                    template: '<div><img src="/assets/images/dashboard/testApp/thumbnail1.jpg"></div>'
                }),
                view: MyTestView1,
                context: pluginContext
            });

            self.dashboard.addDashboardWidget({
                title: 'Test 2',
                size: 'double',
                details: 'Test',
                image: new BBView({
                    template: '<div><img src="/assets/images/dashboard/testApp/thumbnail2.jpg"></div>'
                }),
                view: MyTestView2,
                context: pluginContext
            });


            self.dashboard.addDashboardWidget({
                title: 'Test 3',
                size: 'double',
                details: 'Test',
                image: new BBView({
                    template: '<div><img src="/assets/images/dashboard/testApp/thumbnail3.jpg"></div>'
                }),
                view: MyTestView3,
                context: pluginContext
            });

            self.render();
        },

        render: function () {
            var self = this;
            self.dashboard.build({
                dashboard_title: 'NGSRX',
                onDone: _.bind(function() {
                    console.log('called onDone back');
                }, this)
            });

            return this;
        },

        close: function() {
            this.dashboard.destroy();
        }
    });

    return DashboardView;
});
```

## Adding capabilities to save and restore dashboard state
The dashboard uses a Slipstream backend provided RESTful API and DB to save and restore the state of the dashboard if the database is available. If used within the Slipstream framework context, the backend DB and the RESTful API are automatically loaded for the dashboard to use. However, if you are using the dashboard without thr Slipstream framework, you will need to provide a RESTful API that adheres to the following semantics:

### User preferences API
```
HTTP GET /slipstream/preferences/user
```
Should return the preferences associated with the logged in user if found. The API should also verify a user is logged in based on the value of the api.sid cookie passed into the request.

```
HTTP PUT /slipstream/preferences/user
```
Should update/create the preferences for the logged in user. The API should also verify a user is logged in based on the value of the api.sid cookie passed into the request.

```
HTTP DELETE /slipstream/preferences/user
```
Should delete the user record associated with the logged in user if found. The API should also verify a user is logged in based on the value of the api.sid cookie passed into the request.

```
HTTP POST /slipstream/preferences/user
```
Should return a 403 (NOT ALLOWED) error.


### Session preferences API
```
HTTP GET /slipstream/preferences/session
```
Should return the preferences associated with the session id passed in as the api.sid cookie if found.

```
HTTP PUT /slipstream/preferences/session
```
Should update/create the preferences for the session id passed in as the api.sid cookie in the request.

```
HTTP DELETE /slipstream/preferences/session
```
Should delete the record associated with the session id passes in as the api.sid cookie in the request if found.

```
HTTP POST /slipstream/preferences/session
```
Should return a 403 (NOT ALLOWED) error.


# Using Dashboard widget in the Slipstream framework context <a name="dashboard_with_framework"></a>
When used in the context of the Slipstream framework, the Dashboard plugin uses the plugin discovery mechanism that Slipstream provides to give the additional benefit of writing declarative dashboard widget-plugins to be rendered in the Slipstream UI framework.
The Slipstream framework allows a plugin developer to create widget-plugins which the dashboard renders within itself and adds functionality to.
Plugin developers can write their own view module along with models, html templates and thumbnails; and provide information in the plugin.json file for the Slipstream framework to capture the plugin and render it.

The dashboard object is part of the framework and does not need to be referenced by a plugin developer in most cases.
The only case where the dashboard may need to be referenced directly in a plugin is to make the dashboard navigable through an activity.
Slipstream comes with a stock plugin that does this launching for plugin developers. In case you want to develop your own dashboard launch plugin, please refer to [Writing your own Dashboard Launch Plugin](#launch_plugin)


## Writing your dashboard widget plugins
This section outlines how you write a dashboard widget plugin to render in the dashboard.
### Steps for developing a new dashboard widget:
#### 1. Create a new folder under your plugins folder following the guildelines to create a new plugin. 
The structure of the folder should look as below. Only plugin.json, js/views folder with the base view and img folder with thumbnail image are mandatory. All other folders are optional.

```
plugins
 |-- your_dashboard_widget_plugin_folder
  |--  plugin.json
  |--  js
   |-- views
    |-- your_javascript_view_files
   |-- models
    |-- your_javascript_model_files_to_support_views
  |-- templates
   |-- your_html_or_hogan_template_files
  |-- img
   |-- your_img_files
  |-- test
   |-- your_test_files
  |-- nls
   |-- translation_files_as_per_slipstream_translation_guidelines
```

#### 2. Write your plugin.json file as follows:

```json
{
  "name": "your_widget_plugin_name",
  "description": "Description for your plugin",
  "publisher": "Juniper Networks, Inc.",
  "version": "0.0.1",
  "release_date": "08.29.2014",
  "min_platform_version": "0.0.1",
  "dashboard": {
    "widgets": [
      {
        "title": "Your Dashboard Widget Title",
        "size": "double", // size can be one of the following: 
                          // small (width: 200px, height: 100px),
                          // single (width: 400px, height: 300px),
                          // double (width: 800px, height: 300px),
                          // vertical (width: 400px, height: 600px),
                          // large (width: 800px, height: 600px),
                          // wide (width: 1200px, height: 300px)
        "details": "Details for the dashboard widget that need to be shown in the dropdown",
        "module": "name_of_base_view",
        "thumbnail": "Relative path to image that will be shown as the thumbnail under img folder"
      }
    ]
  }
}
```

An example is as follows:

```json
{
  "name": "device_utilization_plugin",
  "description": "NG-SRX Dashboard Device Utilization Plugin",
  "publisher": "Juniper Networks, Inc.",
  "version": "0.0.1",
  "release_date": "08.29.2014",
  "min_platform_version": "0.0.1",
  "dashboard": {
    "widgets": [
      {
        "title": "Device Utilization Widget",
        "size": "double",
        "details": "Device Utilization View details",
        "module": "deviceUtilizationView",
        "thumbnail": "thumbnailDeviceUtil.jpg"
      }
    ]
  }
}
```

#### 3. Create your view, model, template files under js folder and name your base view as indicated in plugin.json.

Develop your views, models and templates as you normally would as per Slipstream standards.
**Important: ** Implement a "close" function in your base view that is reponsible for cleanup such as unbinding from events, closing internally created views, etc.

##### Creating a dashboard widget with manual refresh functionality <a name="creating_widget_with_manual_refresh"></a>
If your dashboard widget needs to be manually refreshed by clicking on the refresh button in the dashboard, then implement a "refresh" function that accepts a callback function. The callback function must be called once the widget has fetched new data and has rendered the new data with an optional JavScript Error object in case of failure to indicate that a failure has occured to the dashboard.

Here's an example of a dashboard widget base view that implements both close and refresh:

```javascript
define(["marionette",
        "./chassisView.js.hogan", 
        "text!../../templates/systemChassisLayout.tpl"], function(Marionette, ChassisView, systemChassisLayoutTemplate) {
    /**
     * Constructs a SystemChassisLayout
     */
    var SystemChassisLayout = Marionette.Layout.extend({
        template: systemChassisLayoutTemplate,

        initialize: function() {
            this.context = new Slipstream.SDK.ActivityContext(this.options.context.ctx_name, this.options.context.ctx_root);

            this.chassis_view = new ChassisView({context: this.context});
        },

        onRender: function() {
            this.chassisView.show(this.chassis_view);
        },

        regions: {
            chassisView: "#chassisView",
        },

        refresh: function(done) {
            function successCallback() {
                done();
            };

            function errorCallback() {
                done(new Error('Error refreshing System Chassis Layout'));
            };

            $.when(this.chassis_view.refresh())
            .then(successCallback, errorCallback);
        },

        close: function() {
            this.chassisView.close();
        }
    });
    
    return SystemChassisLayout;
});
```

##### Creating a dashboard widget without manual refresh
Some widgets may be either static or may require dynamic updates based on the model.
For such widgets, a manual refresh is not required.
To indicate to the dashboard widget that a refresh isn't required, simply do not implement the "refresh" function.


## Writing your own Dashboard Launch Plugin <a name="launch_plugin"></a>

In most cases you will not need to implement your own dashboard launch plugin as the Slipstream plugins will ship with a stock launch plugin. In case it does not, follow these steps to create your own dashboard launch plugin.

#### 1. Create a new plugin activity

The structure of the folder should be as per Slipstream standards.
The plugin.json file can be as follows:

```json
{
  "name": "dashboard_launch_plugin",
  "description": "NG-SRX Dashboard Launch",
  "publisher": "Juniper Networks, Inc.",
  "version": "0.0.1",
  "release_date": "07.29.2014",
  "min_platform_version": "0.0.1",
  "activities": [
    {
      "module": "dashboardLaunchActivity",
      "filters": [
        {
          "id": "dashboard.launch.view",
          "action": "VIEW",
          "data": { 
            "mime_type": "vnd.juniper.net.dashboard.launch"
          }
        }
      ]
    }
  ],
  "navigation_paths": [
    {
      "path": "Monitor",
      "filter": "dashboard.launch.view"
    }
  ]
}
```

#### 2. Create the dashboardLaunchActivity file under js folder
Contents of the file should be as follows:

```javascript
define([
  "./views/dashboardView.js"
  ], function(DashboardView) {
  /**
   * Constructs a DashboardLaunchActivity.
   */
  var DashboardLaunchActivity = function() {
    this.onStart = function() {
      console.log("DashboardLaunchActivity started");

        this.setContentView(this.view);
    };

    this.onCreate = function() {
      console.log("DashboardLaunchActivity created");

      this.view = new DashboardView({
          onDone:  _.bind(function() {
            console.log('Dashboard activity done');
          }, self),
          context: this.getContext(),
          dashboard: this.getDashboard()
        });
    };

    this.onDestroy = function() {
      console.log("DashboardLaunchActivity being destroyed");
    };
  };

  DashboardLaunchActivity.prototype = new Slipstream.SDK.Activity();
  
  return DashboardLaunchActivity;
});
```

#### 3. Create a dashboardView.js file under js/views
Contents of the file should be as follows:

```javascript
define([
    'backbone',
    'widgets/dashboard/dashboard'
], function(Backbone, Dashboard) {
    var DashboardView = Backbone.View.extend({

        initialize: function(options) {
            var self = this;

            if (options.onDone) {
                this.closeCallback = options.onDone;
            }
            this.context = this.options.context;
            this.dashboard = this.options.dashboard;

            this.dashboard.build({
                dashboard_title: 'NGSRX',
                onDone: _.bind(function() {
                    self.closeCallback();
                }, this)
            });

            this.el = this.dashboard.el;
            this.$el = $(this.el);

            return this;
        },

        close: function() {
            this.dashboard.destroy();
        }
    });

    return DashboardView;
});
```

