#  Slipstream.SDK.Activity

Activities are the building blocks of workflows in Slipstream.  An activity defined in one plugin can discover and leverage activities defined by other plugins in order to create dynamic workflows.

The *Slipstream.SDK.Activity* function is the constructor for Activity objects.

## Syntax

```javascript
    new Slipstream.SDK.Activity()
```

## Description

A Slipstream activity is implemented as a Javascript AMD module in [requireJS](http://requirejs.org/docs/api.html) format.  The module must return a no-argument Javascript constructor that extends from *Slipstream.SDK.Activity*.  The framework will use this constructor to instantiate an activity.

```javascript
define(function() {
    function SomeActivity() {
       ...
    }
     
    // Inherit from the Slipstream Activity class
    SomeActivity.prototype = new Slipstream.SDK.Activity();
    
    // Return the constructor as the value of this module
    return SomeActivity;
});
```

### Activity Lifecycle

An Activity has a well-defined lifecycle that takes it through a series of states including *create*, *execute*, and *destroy*.

         ┌─────────────────────┐
     ┌─> │   Launch Activity   │
     │   └─────────────────────┘
     │              ↓ 
     │   ┌─────────────────────┐
     │   │      onCreate()     │
     │   └─────────────────────┘
     │              ↓
     │   ┌─────────────────────┐
     │   │     onStart()       │
     │   └─────────────────────┘
     │              ↓
     │   ┌─────────────────────┐
     │   │  Activity Running   │
     │   └─────────────────────┘
     │              ↓
     │   ┌─────────────────────┐
     │   │     onDestroy()     │
     │   └─────────────────────┘
     │              ↓
     │   ┌─────────────────────┐
     └─  │ Activity Terminated │
         └─────────────────────┘


Each state of an activity has a corresponding lifecycle method in an Activity object: *onCreate()*, *onStart()*, and *onDestroy()*.

When an activity is first created its *onCreate()* method is called.  By default this method is a no-op but activities can override it to perform any operations necessary prior to the activity being started. Once the *onCreate()* method returns, the activity’s onStart() method is immediately invoked. This is the activity’s main method and is where an activity will typically perform model/view/layout creation, event binding and UI rendering.

When an activity is either no longer needed (eg. its associated plugin is removed from the system) or its system resources are required for another activity’s execution, the activity may be destroyed. Before an activity is destroyed its *onDestroy()* method is called. This allows the activity an opportunity to perform any cleanup operations prior to it being destroyed. Once destroyed an activity can come into existence again through the invocation of its *onCreate()*/*onStart()* methods.
  

**Note**: The destroy state and it's corresponding *onDestroy()* method are not currently used by Slipstream but are reserved for future use.

## Activity Instances
All Activity instances inherit from Activity.prototype.

### Properties

#### Activity.prototype.context
Provides the activity's [runtime context](ActivityContext.md).  The context can be used for operations such as starting other activities and reading message strings from the plugin's message bundles.

#### Activity.prototype.intent

Provides the [intent](Intent.md) used to start the activity.

### Methods

- #### SDK.Activity.prototype.onCreate
The lifecycle callback that is invoked when an Activity is created.  This occurs after instantiation but before the activity is started.  Anything that an activity needs to do before it is started should be done here.  

  The method in the Activity prototype is a no-op and should be overridden by objects implementing an Activity.

- #### SDK.Activity.prototype.onStart
The lifecycle callback that is invoked when an Activity is started.  This is where an activity should render its view(s).  

  The method in the Activity prototype is a no-op and should be overridden by objects implementing an Activity.

- #### SDK.Activity.prototype.onDestroy
The lifecycle callback that is invoked when an Activity is destroyed.  

   The method in the Activity prototype is a no-op and should be overridden by objects implementing an Activity.

  **Note**: This method is not currently used by Slipstream but is reserved for future use.

- #### SDK.Activity.prototype.setResult(resultCode, data)
Used to set the result of an activity.  Used when you intend to provide a result back to a parent activity

 #### Parameters

 - **resultCode**
 Result code of either SDK.Activity.RESULT_OK or SDK.Activity.RESULT_CANCELLED

 - **data**
 An intent containing the result of the activity

- #### SDK.Activity.prototype.setContentView(view)
Set the view in the Slipstream content pane.

  #### Parameters

  - **view**
the [view](Views.md) to be rendered into the framework's content area.  The view will replace an existing view in the content area and the existing view's *close* method will be called. 

- #### SDK.Activity.prototype.getExtras
A proxy method to this.intent.getExtras() function to retrieve parameters passed in by the initiater (activityContext or url_router) into a JavaScript object.

- #### SDK.Activity.prototype.finish
Should be called to indicate completion of the activity.  Handles returning a result to the parent activity if required, then calls the onDestroy lifecycle method.
