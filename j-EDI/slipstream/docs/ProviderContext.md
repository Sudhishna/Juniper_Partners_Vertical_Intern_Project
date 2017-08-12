#  Slipstream.SDK.ProviderContext

Provides a runtime context for message providers.  Plugins should never need to directly instantiate this object.  ProviderContext objects are created by the framework and made available to instances of [MessageProvider](MessageProvider.md). 

## ProviderContext Instances

### Properties

- #### publisher

   An object that defines the following function:
   - **publish(evt, data)**
     A function that is used to publish the provider's messages.
     - **evt**
        The name of the event to be published.  This corresponds to the name of a declared topic in the provider's plugin.json file.
     - **data**
        An object containing the data to be published with the event.
    
```javascript
    ...
    
    var publisher = this.context.publisher;
    var event_data = {name: "foobar"};
    
    publisher.publish("myProvider:external_event", event_data);
    
    ...

```