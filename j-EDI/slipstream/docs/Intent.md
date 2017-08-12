#  Slipstream.SDK.Intent

An Intent describes an action to be performed as part of a workflow and the type of the data on which to perform that action. The data type can be described using a MIME type and/or a URI.  Intents are matched against the activity filters defined in plugin manifest files in order to find activities that satisfy the intent.

## Syntax

```javascript
    new Slipstream.SDK.Intent(action, data)
```

### Parameters

- **action**
The action to be performed by the target activity.

- **data**
An object describing the data to be operated on by the activity.  This object can contain one or both of the following attributes:

- **uri**
The URI of the data to be operated on.  During activity resolution, the segments of the URI are matched against those specified in the activity filters defined in each plugin's manifest.

  **Note**: The URI *scheme* is the only segment currently supported.

- **mime_type**
The MIME type of the data to be operated on.  The MIME type is matched against the type specified in the activity filters defined in each plugin's manifest. 

  An Intent matches an activity if and only if the specified MIME type and URI match the MIME type and URI segments declared in one of the activity's filters.

#### Standard Actions

- **Slipstream.SDK.Intent.action.AUTHENTICATE** = "slipstream.intent.action.AUTHENTICATE"

   Allow a user to authenticate himself to the system.

   Input data required: None

- **Slipstream.SDK.Intent.action.VIEW** = "slipstream.intent.action.VIEW"
     
    View the definition of a resource

     Input data required:  The URI of the resource to be viewed.

- **Slipstream.SDK.Intent.action.LIST** = "slipstream.intent.action.LIST"

     Display a list of resources of the given type.

     Input data required:  The MIME type of the resources to be listed.

- **Slipstream.SDK.Intent.action.CREATE** = "slipstream.intent.action.CREATE"
     
   Create a resource of the given type.

   Input data required: The MIME type of the resource to be created.

- **Slipstream.SDK.Intent.action.EDIT** = "slipstream.intent.action.EDIT"
     
    Edit a resource.  Similar to ACTION_VIEW except that ACTION_EDIT allows the resource to be modified.
 
    Input data required: The URI of the resource to be edited.

- **Slipstream.SDK.Intent.action.CLONE** = "slipstream.intent.action.CLONE"
     
    Clone a resource.  Similar to ACTION_CREATE except that ACTION_CLONE accepts a resource id and populates
    the creation form based on the properties of the identified resource.
 
    Input data required: The URI of the resource to be cloned.

- **Slipstream.SDK.Intent.action.SELECT** = "slipstream.intent.action.SELECT"
     
    Allows selection from the list of resources.
 
    Input data required: An optional list of resources already selected.

- **Slipstream.SDK.Intent.action.ASSIST** = "slipstream.intent.action.ASSIST"
     
   Provide user assistance for a given topic

   Input data required:  The URI of the help topic to be displayed.
   *example*: help://[path_to_topic]

- **Slipstream.SDK.Intent.action.SEARCH** = "slipstream.intent.action.SEARCH"
     
   Search for resources that match a query.

   Input data required:  The URI of the search query to be executed.
   *example*: search://query

- **Slipstream.SDK.Intent.action.MONITOR** = "slipstream.intent.action.MONITOR"
     
   Display a dashboard of system health and performance monitoring data.
   
   Input data required: None

- **Slipstream.SDK.Intent.action.QUICK_SETUP** = "slipstream.intent.action.QUICK_SETUP"
     
    Perform a quick setup of some portion of the configuration.

    Input data required: A URI identifying the configuration area to be configured.  eg. setup://initial, setup://vpn

## Description

When a plugin needs to perform some action that is not implemented in one of its own workflows, it can create an Intent describing the action to be performed and the type of data on which to perform it.  This intent can then be used to [lookup]() or [start]() an activity that satisfies the requirements of the intent.

plugin.json:

```json
"activities": [
    {
        "url_path": "/",
        "module": "mapActivity",
        "filters": [
            {
                "action": "VIEW",
                "data": {
                    "scheme": "geo"
                }
            }
        ]
    }
]
```
activity.js:

```javascript
var uri = new URI(“geo:34.57,-128.43”);
var intent = new Slipstream.SDK.Intent(Slipstream.Intent.action.VIEW, uri);

var activity = this.context.lookupActivity(intent);
if (activity) {
    this.context.startActivity(intent);
}
```

An activity can obtain the intent used to start it by reading its *intent* property.

```javascript
this.onStart = function() {
    ...
    var myIntent = this.intent;
    ...
}
```

## Intent Instances
All Intent instances inherit from Intent.prototype.

### Properties

See [Standard Actions](#standard-actions) for a list of properties defining standard Intent actions.

- #### action
The action to be performed by the target activity.

- #### data
An object describing the [data](#parameters) to be operated on by the activity.

- #### extras
An object storing additional parameters for the matching activity's consumption.

### Methods
- #### putExtras(extras)
Method to allow passing arbitrary data for matching activity's consumption. extras can be a complex object. Calling this method multiple times on same intent overwrites previous values.

- #### getExtras
Method to retrieve the extras stored in this intent object into a JavaScript object.
