#  Slipstream.SDK.RBACProvider

Defines the interface between a Role Based Access Control (RBAC) provider and the Slipstream framework.  An RBACProvider is the interface between the Slipstream framework and an RBAC service that provides information on users and their roles/capabilities.


The *Slipstream.SDK.RBACProvider* function is the constructor for RBACProvider objects.

## Syntax

```javascript
    new Slipstream.SDK.RBACProvider()
```

## Description

A Slipstream RBAC provider is implemented as a Javascript AMD module in [requireJS](http://requirejs.org/docs/api.html) format.  The module must return a no-argument Javascript constructor that extends from *Slipstream.SDK.RBACProvider*.  The framework will use this constructor to instantiate the provider.

```javascript
define(function() {
    function RBACProvider() {
       ...
    }
     
    // Inherit from the Slipstream RBACProvider class
    RBACProvider.prototype = Object.create(Slipstream.SDK.RBACProvider.prototype);
    
    // Return the constructor as the value of this module
    return RBACProvider;
});
```

### Provider Lifecycle

An RBACProvider has a well-defined lifecycle that takes it through a series of states including *create*,  *start*, and *destroy*.

        ┌─────────────────────┐
        │   Launch Provider   │
        └─────────────────────┘
                   ↓ 
        ┌─────────────────────┐
        │      onCreate()     │
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │      onStart()      │
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │  Provider active    │  
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │      init()         │  
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │     onDestroy()     │
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │ Provider Terminated │
        └─────────────────────┘

Each state of an RBAC provider has a corresponding lifecycle method in an RBACProvider object: *onCreate()*, *onStart()*, *onDestroy()*.

When an RBAC provider is first created its *onCreate()* method is called.  By default this method is a no-op but providers can override it to perform any operations necessary prior to the provider being started. Once the *onCreate()* method returns, the provider's onStart() method is immediately invoked.

Because it is often necessary for an RBAC provider to perform some initialization after user authentication has occurred, an initialization phase is invoked once authentication is successful.  During this phase, the RBAC provider can assume that the user has been authenticated.  The provider is given the authenticated user's identity which it can then use to complete its initialization.

When a provider is no longer needed (eg. its associated plugin is removed from the system) it may be destroyed. Before a provider is destroyed its *onDestroy()* method is called. This allows the provider an opportunity to perform any cleanup operations prior to it being destroyed.
  

**Note**: The destroy state and it's corresponding *onDestroy()* method are not currently used by Slipstream but are reserved for future use.

## RBACProvider Instances
All RBACProvider instances inherit from RBACProvider.prototype.

### Properties

### Methods

- #### SDK.RBACProvider.prototype.init
Initialize the provider

  The method in the RBACProvider prototype is a no-op and should be overridden by objects implementing an RBACProvider.

    #### Parameters

    - **options**
      
      An options hash for the initialization process.  The options hash can contain the following keys:

        **username** - The name of the currently authenticated user. (required)

        **success** - A callback to be called if initialization is successful. (optional)  

    - **fail** - A callback to be called if initialization fails. This callback takes a 
         single argument that is an object containing the error response. (optional)

- #### SDK.RBACProvider.prototype.verifyAccess
Verify that the currently authenticated user has a set of capabilities.

    #### Returns
    *true* if the currently authenticated user has all of the capabilities specified in the *capabilities* parameter, *false* otherwise.
    
    #### Parameters

    - **capabilities** - An array of capabilities to be verified.  The array contains strings that represent the names of capabilities as defined by the underlying network management platform.
  
### Declaring an RBACProvider 

A plugin must declare the RBAC provider that it exposes via its plugin.json file.  Only a single RBAC provider can exist in an instance of the Slipstream framework.  If multiple provider definitions exist, then Slipstream will use the last definition found during plugin discovery.

A sample plugin.json with the relevant RBACProvider settings is shown below.

plugin.json:

```json
{
   ...
   
   providers: [
      {
          "uri": "rbac://",
          "module": "rbacProvider"
      }
   ]
   
   ...
}
```
When a plugin is loaded and the configuration includes an RBAC provider, the module identified will be instantiated and the *onCreate()* and *onStart()* functions called.  Once the user is authenticated, the provider's init() function will be called.
  
## Example
  
```javascript
  define(function() {
    function RBACProvider() {
        Slipstream.SDK.RBACProvider.call(this);
            ...
         }
    }

   RBACProvider.prototype = Object.create(Slipstream.SDK.RBACProvider.prototype);
   RBACProvider.prototype.constructor = RBACProvider;

   return RBACProvider;
});
  ```
