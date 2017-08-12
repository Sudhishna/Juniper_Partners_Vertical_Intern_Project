#  Slipstream.SDK.ActivityContext

Provides a runtime context for activities.  Plugins should never need to instantiate an *ActivityContext* object.  Context objects are created by the framework and associated with a running activity.

## Syntax

```javascript
    new Slipstream.SDK.ActivityContext(ctx_name, ctx_root)
```

### Parameters

- **ctx_name**
The name of the context.  Slipstream sets this to the name of the plugin associated with the activity.

- **ctx_root**
The fully qualified path to the root directory of the plugin associated with the activity.

## ActivityContext Instances

### Properties

- #### ctx_name
The name of the context.  Slipstream sets this to the name of the plugin associated with the activity.

- #### ctx_root
The fully qualified path to the root directory of the plugin associated with the activity.

### Methods

- #### SDK.ActivityContext.prototype.getMessage(key, sub_values)
Retrieve a localized message by key.

  #### Parameters

  - **key**
The key to the message to be retrieved

  - **sub_values** (optional)
An array of substitution values that should be interpolated into the retrieved message string.

  #### Returns
  The localized message string with the *sub_values* interpolated.
  
  ```javascript
  var my_key = "A message with not {0} but {1} substitution values";
  var msg = this.context.getMessage("my_key", ["one", "two"]);
  console.log(msg);
  
  > "A message with not one but two substitution values"
  ```

- #### SDK.ActivityContext.prototype.startActivity(intent)
Start an activity

  #### Parameters

  - **intent**
  The intent used to define the activity to be started.

- #### SDK.ActivityContext.prototype.startActivityForResult(intent, callback)
Start an activity with the expectation of getting a result

  #### Parameters

  - **intent**
  The intent used to define the activity to be started.

  - **callback**
  A callback that will be called when the started activity finishes.  Callback signature is function(resultCode, data) {}.

- #### SDK.ActivityContext.prototype.lookupActivity(intent)
Lookup an activity

  #### Parameters

    - **intent**
The intent used to define the activity to be looked up.

  #### Returns
  *true* if an activity matching the intent is found, *false* otherwise.



