#  Slipstream.SDK.MessageProvider

Defines the interface between a message provider and the Slipstream framework.  A MessageProvider is used to broadcast messages to framework components and plugins that are registered as listeners via the [MessageResolver](MessageResolver.md).  They typically do not render views.


The *Slipstream.SDK.MessageProvider* function is the constructor for MessageProvider objects.

## Syntax

```javascript
    new Slipstream.SDK.MessageProvider()
```

## Description

A Slipstream message provider is implemented as a Javascript AMD module in [requireJS](http://requirejs.org/docs/api.html) format.  The module must return a no-argument Javascript constructor that extends from *Slipstream.SDK.MessageProvider*.  The framework will use this constructor to instantiate the provider.

```javascript
define(function() {
    function SomeProvider() {
       ...
    }
     
    // Inherit from the Slipstream MessageProvider class
    SomeProvider.prototype = new Slipstream.SDK.MessageProvider();
    
    // Return the constructor as the value of this module
    return SomeProvider;
});
```

### Provider Lifecycle

A MessageProvider has a well-defined lifecycle that takes it through a series of states including *create* and *start*, *destroy*.

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
        │     onDestroy()     │
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │ Provider Terminated │
        └─────────────────────┘

Each state of a message provider has a corresponding lifecycle method in a MessageProvider object: *onCreate()*, *onStart()*, *onDestroy()*.

When a message provider is first created its *onCreate()* method is called.  By default this method is a no-op but providers can override it to perform any operations necessary prior to the provider being started. Once the *onCreate()* method returns, the provider's onStart() method is immediately invoked.

When a provider is either no longer needed (eg. its associated plugin is removed from the system) it may be destroyed. Before a provider is destroyed its *onDestroy()* method is called. This allows the provider an opportunity to perform any cleanup operations prior to it being destroyed.
  

**Note**: The destroy state and it's corresponding *onDestroy()* method are not currently used by Slipstream but are reserved for future use.

## MessageProvider Instances
All MessageProvider instances inherit from MessageProvider.prototype.

### Properties

#### MessageProvider.prototype.context
Provides the provider's [runtime context](ProviderContext.md).  The context can be used for publishing messages in the provider's topics.

### Methods

- #### SDK.Activity.prototype.onCreate
The lifecycle callback that is invoked when a MessageProvider is created.  This occurs after instantiation but before the provider is started.  Anything that an provider needs to do before it is started should be done here.  

    A plugin can assume that the user has been authenticated prior to this method being called.

  The method in the MessageProvider prototype is a no-op and should be overridden by objects implementing a MessageProvider.

- #### SDK.MessageProvider.prototype.onStart
The lifecycle callback that is invoked when a MessageProvider is started.  

    A plugin can assume that the user has been authenticated prior to this method being called.

  The method in the MessageProvider prototype is a no-op and should be overridden by objects implementing a MessageProvider.

- #### SDK.MessageProvider.prototype.onDestroy
The lifecycle callback that is invoked when a provider is destroyed.  

   The method in the MessageProvider prototype is a no-op and should be overridden by objects implementing a MessageProvider.

  **Note**: This method is not currently used by Slipstream but is reserved for future use.
  
### Declaring a MessageProvider 

A plugin must declare the providers it exposes in its plugin.json file.  

Each message provider must have a unique URI. Plugins use this URI to subscribe to messages via the [MessageResolver](MessageResolver.md).

A sample plugin.json with the relevant MessageProvider settings is shown below.

plugin.json:

```json
{
   ...
   
   providers: [
      {
          "uri": "topics://vnd.juniper.srx", 
          "module": "srx_notifications"
      }

   ]
   
   ...
}
```
When a plugin is loaded and the configuration includes *providers*, the module identified will be instantiated and the *onCreate()* function called to initialize the provider. The MessageResolver will then map the URI to the instantiated provider.
  
## Example

A message provider that listens for the addition of events external to the framework and publishes events for the consumption of plugins.
  
```javascript
  define(["/socket.io/socket.io.js"], function(io) {
    function MyProvider() {
        var socket_server_url = window.location.protocol + "//" + window.location.host,
            message_channel = io.connect(socket_server_url),
            publisher;

        this.onCreate = function() {
            publisher = this.getContext().getPublisher();
        };

        this.onStart = function() {
            plugin_channel.on('external_event', function (event_data) {
                console.log("got external event");
                publisher.publish("myProvider:external_event", event_data);
            });
        }
    }

    MyProvider.prototype = new Slipstream.SDK.MessageProvider();

    return MyProvider;
});
  ```
