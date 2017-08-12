# Writing Slipstream Plugins

A Slipstream plugin encapsulates a set of UI workflows and/or Slipstream dashboard widgets.  Workflows are composed from one or more [Activities](Activity.md), each of which is defined in a Javascript [AMD](http://en.wikipedia.org/wiki/Asynchronous_module_definition) module.  A plugin also packages the HTML files, CSS files and other resources necessary to support its workflows, and a [manifest file](Manifest.md) that provides metadata describing the plugin.

**Note**:  This document outlines how to write workflow plugins.  For dashboard plugins, please refer to [Writing Slipstream Dashboard Plugins](public/assets/js/widgets/dashboard/dashboard.md).

### Activity Modules

A workflow is simply a sequence of activities.  Each activity is represented as a Javascript AMD module that implements a well-defined interface.  Like most things in Slipstream, Activities are more convention than definition, but Slipstream provides a base [Activity definition](Activity.md) that can be extended.

An Activity has a well-defined [lifecycle](Activity.md#activity-lifecycle) that takes it through a series of states including create, execute, and destroy.  The base lifecycle methods can be overriden in order to implement the behavior specific to an activity.

A Slipstream activity is implemented as a Javascript AMD module in [requireJS](http://requirejs.org/docs/api.html) format.  The module must return a Javascript constructor that the framework can use to instantiate an instance of the activity.

```javascript
define(function() {
    function SomeActivity() {
        // Override the Activity lifecycle methods
        this.onCreate = function() {
            ...
        };
        
        this.onStart = function() {
            ...
        }
    }
    
    // Inherit from the Slipstream Activity class
    SomeActivity.prototype = new Slipstream.SDK.Activity();
    
    // Return the constructor as the value of this module
    return SomeActivity;
});
```

You can write your activities using whichever Javascript libraries you choose.  Slipstream only requires that you implement the Activity interface so that it can load, instantiate and call your activity's lifecycle methods.

### Rendering Views

The primary purpose of an activity is to create one or more UI views, register event handlers on those views, and render the views as part of a workflow.  Slipstream reserves an area of the UI called the *content pane* into which activities can render their views.  

As with activities, Slipstream doesn't dictate how a plugin creates its views.  The only requirement is that a view expose a [well-defined interface](Views.md) that the framework can use to manage it.  Once a view is instantiated and is ready for rendering, an activity can request that the framework render the view into the content pane.  This is done by using the [setContentView](Activity.md#setContentView) method of an activity.

```javascript
this.onStart = function() {
    ...
    // Create a view
    var view = new SomeView();
    
    // Render the view to the Slipstream content area
    this.setContentView(view);
    ...
}

```

If a view already exists in the content pane it will be closed and replaced by the new view.

### Exposing Activities

A Slipstream plugin isn't restricted to using its own activities in its workflows.  The framework provides the ability for a plugin to dynamically discover activities provided by other plugins.  Once discovered, the plugin can use the activities to enhance its workflows.  

For example, suppose a plugin provides the ability to define and deploy a set of virtual security devices in a virtualized network.  A natural part of such a workflow is to allow a user to create security policies on the deployed security devices.  However, the plugin that supports the deployment of virtual devices knows nothing about managing security policies.  In order for the plugin to enhance the deployment workflow to include the creation of security policies, it can query the Slipstream framework for another plugin that contains activities related to security policy management.  If such a plugin exists, the plugin for managing virtual devices can alter its workflow to include a step to create security policies for the deployed devices.  

In order fo this discovery process to work, plugins need a way to expose their activities to other plugins.  This is done by declaring a plugin's activities in the plugin manifest file.  For each activity to be exposed, the manifest file declares the Javascript module that implements the activity and the criteria that Slipstream will use to resolve requests for the activity.  These criteria are expressed in the form of [activity filters](Manifest.md).

```json
"activities": [
    {
        "module": "MyActivity",
        "filters": [
            {
                "action": "Slipstream.SDK.Intent.action.MANAGE",
                "data": {
                    "mime_type" : "vnd.juniper.firewall-policy"
                }
            }
        ]
    }
]
```
Slipstream processes the set of installed plugins at framework boot time and reads each plugin's manifest file.  The activities and filters declared in the manifest are stored in a registry managed by the framework.  Slipstream consults this registry when a plugin requests that an activity matching a set of filter criteria be started.


### Discovering and Starting Activities

A Slipstream plugin can discover activities exposed by other plugins.  These discovered activities can then be utilized in the plugin's workflows.

In order to discover an activity, a plugin must create an [Intent](Intent.md) to perform some activity.  

An Intent describes the action to be performed and the type of the data on which to perform that action.  The data type can be described using a MIME type and/or a URI.

```javascript
// Find an activity that can display geo data
var intent_uri = new Slipstream.SDK.Intent("Slipstream.SDK.Intent.action.VIEW", {scheme: "geo"});

// Find an activity that can manage Juniper firewall policies
var intent_mime = new Slipstream.SDK.Intent("Slipstream.SDK.Intent.action.MANAGE", {mime_type: "
vnd.juniper.firewall-policy"});
```

There are two Slipstream APIs that can be used to discover activities.  

The [lookupActivity]() API is used to determine if an activity exists that meets a given criteria.  This API is useful when dynamically augmenting workflows based on the availability of activities.

The [startActivity]() API is used to find an activity that meets a given criteria and start it if it exists.

You can also add any additional parameters you wish to pass on to the matched activity using the Intent.putExtras() function before you call the [startActivity]() API. The additional parameters could be an array or a plain object. These get parameterized as part of the URL and deparameterized for consumption at the started Activity. Values of the additional parameters are coerced if they are number, undefined or boolean. For ex) "123" is coereced to 123, "undefined" is coerced to undefined, "true" is coerced to true.

```javascript
var intent = new Slipstream.SDK.Intent("Slipstream.SDK.Intent.action.VIEW", {scheme: "geo"});
var activity = this.context.lookupActivity(intent);

if (activity) {
	...
	intent.putExtras({
    	param1: 'value1',
        param2: {
        	nested1: 'value2'
        },
        param3: [arr1, arr2, arr3]
    });
    ...
    try {
        this.context.startActivity(activity);
    }
    catch(Error) {
       console.log("failed to start activity");
    }
    ...
}
```

### Associating Activities with Slipstream Navigation Elements

The Slipstream framework provides primary and secondary navigation elements that users can use to find and launch workflows.  Slipstream plugins can associate their activities with the navigation elements provided by the framework.  When a user selects the navigation element the framework will arrange for the associated activity to be started.

```
                            Primary Navigation

             ┌─────────────────────────────────────────────────┐
             │Dashboard│Device│Policies│Objects│Network│Monitor│
             ├─────────┼───────────────────────────────────────┤
             │Security │                                       │
 Secondary   │  SRX    │                                       │
Navigation   │         │                                       │
             │Routing  │                                       │
             │         │                                       │
             │Switching│                                       │
             │         │                                       │
             └─────────┴───────────────────────────────────────┘

```

This association is made declaratively in the [navigation_paths](Manifest.md) stanza of the plugin manifest file.

The path to the navigation element is provided in the *path* attribute.  Paths are made up of *segments* separated by '/' characters.  Each segment corresponds to a level in the navigation - the first segment corresponds to the primary navigation, the second segment corresponds to the secondary navigation, and so on.    Navigation elements specified in *path* segments that don't already exist will be created by the framework.

Each entry in *navigation_paths* is associated with an activity via the *filter* attribute.  This attribute specifies the value of the *id* attribute in an activity's *filters* array.  

Currently only three levels of navigation are supported - primary, secondary, and the navigation elements nested immediately beneath the secondary level navigation elements.

```json
{
    "activities": [
        {
          "module": "someActivity",
          "filters": [
           {
              "id": "some_activity",
              "action": "VIEW",
              "data": { 
                "mime_type": "application/some.mime.type"
              }
            }
          ]
        }
      ],
      "navigation_paths": [ 
        {
          "path": "device/security/srx",
          "filter": "some_activity"
        }
    ]
}
  ```
### Packaging and Deploying Plugins

Slipstream plugins are packaged into Zip files with the .spi extension.  The Zip file must have the following directory structure:

```
plugin.json
js/
   … all JS module files/directories …
css/
templates/
   … all HTML templates …
img/
help/
nls/
    msgs.properties
    … non en-US language bundles
    
```


Each plugin must contain a [manifest file](Manifest.md) in JSON format named *plugin.json* that contains metadata describing the plugin and a description of the plugin's activities.

#### plugin_manager
Slipstream provides a command-line tool called *plugin_manager* for packaging and managing plugins.  The *plugin_manager* can be used to create, install, update, and uninstall plugins.

```
plugin_manager [-h] | [[-i | -u | -d] plugin-name] | [-c plugin-directory]

   -i   installs a specified plugin; plugin-name.spi must exist.

   -u   updates a specified plugin, if found in system; plugin-name.spi must exist.

   -d   uninstalls plugin, if found.

   -c   create a plugin package (.spi) from the specified plugin-directory, if found.
        plugin-directory must exist in the current working directory

   -h   displays this help content.
```

### Signing Plugins
TBD


### Putting it all Together - A Maps Plugin

The following example will illustrate the steps necessary to create a simple Slipstream plugin.  This plugin will expose a single activity for rendering geolocation data on a map.

#### 1. Create the plugin manifest

The [plugin manifest](Manifest.md) provides some basic metadata about the plugin (name, version, etc.) and declares the activity that can be discovered and started to render geolocation data.

**plugin.json**

```json
{
    "name": "maps",
    "description": "Slipstream Maps Plugin",
    "publisher": "Juniper Networks, Inc.",
    "version": "0.0.1",
    "release_date": "08.25.2014",
    "min_platform_version": "0.0.1",
    "activities": [
        {
            "url_path": "/",
            "module": "mapActivity",
            "filters": [
                {
                    "action": "Slipstream.SDK.Intent.action.VIEW",
                    "data": {
                        "scheme": "geo"
                    }
                }
            ]
        }
    ]
}
```

The activity declared in the *plugin.json* file will be resolved for any intent to view a geo map.

#### 2. Implement the Activity Module

The *plugin.json* file declared an activity whose module is called *mapActivity*.  So a module named mapActivity.js is implemented in the /js subdirectory of the plugin.

**/js/mapActivity.js**

```javascript
/**
 * A module that implements a Slipstream Activity for
 * viewing maps
 *
 * @module MapActivity
 * @copyright Juniper Networks, Inc. 2014
 */
define(['./views/mapView.js'], function(MapView) {
    function MapActivity() {
        this.onStart = function() {
            // get the URI from the intent used to launch this activity
            var uri = this.intent.data.uri;
            
            // extract the latitude/longitude from the URI
            var lat_long = getLatLong(uri);
            
            // Instantiate the view to be rendered
            var mapView = new MapView(lat_long[0], lat_long[1]);

            // render the view into the content pane
            this.setContentView(mapView);
        };

        var getLatLong = function(uri) {
            var path = uri.path();
            var lat_long = path.split(',');

            return lat_long;
        }
    };

    MapActivity.prototype = new Slipstream.SDK.Activity();

    return MapActivity;
});
```

#### 3. Implement the View

The maps activity instantiated and rendered a view from a module named  *mapView.js* to the Slipstream content area.  This module will be implemented in the /js/views directory.

**/js/views/mapView.js**

```javascript
define(['./leaflet.js'], function(L) {
    function MapView(latitude, longitude) {
        this.$el = $('<div style="height:550px">');
        this.el = this.$el[0];
        
        this.render = function() {
            var map = L.map(this.el).setView([latitude, longitude], 13);
            L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
                subdomains: ['otile1','otile2','otile3','otile4']
            }).addTo(this.map);
            L.marker([latitude, longitude]).addTo(this.map);
        }
    };

    return MapView;
});
```

The view module made use of Leaflet to render the geomap and declared it as a dependency in its module definition.  The leaflet.js file must exist at the specified path in order for the view module to be loaded.

#### 4. Resolve and load the Activity

Whenever the maps activity is required to render geomap data, an intent must be created that matches the activity's declared filter criteria.  The Intent can then be resolved to the maps  activity and the activity can be started.  In this case, the activity is resolved whenever an intent specifies an action of *Slipstream.SDK.Intent.action.VIEW* and a URI scheme of *geo*.

**An Activity whose workflow requires a rendered geomap**

```javascript
define(function() {
    function SomeActivity() {
        this.onStart = function() {
            // create an intent to view geomap data with a given latitude/longitude
            var intent = new Slipstream.SDK.Intent("Slipstream.SDK.Intent.action.VIEW", {uri: new Slipstream.SDK.URI("geo:37.3711,-122.0375")});
            
            if (intent) {
                // start the resolved activity
                try {
                    this.context.startActivity(intent);
                }
                catch(Error) {
                    console.log("couldn't start activity");
                }
            }
        };
    }

   SomeActivity.prototype = new Slipstream.SDK.Activity();

   return SomeActivity;
});
```
#### 5. Package the plugin for distribution

Once the plugin has been implemented, it can be packaged into a .spi file for distribution using the *plugin_manager* command-line tool.  

```

plugins$ ls
maps

plugins$ plugin_manager -c maps

Creating plugin file maps.spi from directory maps...
Done. Please check for errors above.

plugins$ ls
maps      maps.spi

plugins$ unzip -l maps.spi

Archive:  maps.spi
  Length     Date   Time    Name
 --------    ----   ----    ----
        0  08-25-14 16:03   maps/
        0  08-25-14 16:16   maps/js/
      919  08-12-14 19:26   maps/js/mapActivity.js
        0  08-25-14 16:31   maps/js/views/
   125410  08-12-14 17:43   maps/js/views/leaflet.js
      991  08-13-14 01:48   maps/js/views/mapView.js
      524  08-18-14 01:29   maps/plugin.json
 --------                   -------
   163405                   7 files
   
```








