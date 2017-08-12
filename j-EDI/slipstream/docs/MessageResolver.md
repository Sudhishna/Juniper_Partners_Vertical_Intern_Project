#  Slipstream.SDK.MessageResolver

Defines the interface between a plugin and a message provider.

## Methods

- #### SDK.MessageResolver.subscribe(uri, topic, callback)
Subscribe to a provider's topic.

  #### Parameters
  
  - **uri**
The URI uniquely identifying the provider.

  - **topic**
The string identifying the topic to which the caller would like to subscribe.

  - **callback**
The function to be called when the provider sends a message in the given topic.

  **Returns**
  A handle to the created subscription.
  
- #### SDK.MessageResolver.unsubscribe(subscription)
Remove a subscription.

  #### Parameters

  - **subscription**
The handle to the subscription to be unsubscribed.

- #### SDK.MessageResolver.topics(uri)
Return the list of topics defined by a MessageProvider

  #### Parameters

  - **uri**
The uri that uniquely identifies the provider.

   **Returns**
   The list of topics defined by this provider.  The list has the following format:
  
  ```json
   [
       {
           “event” : "device:commit",
           “description” : "The device:commit event is published any time a new configuration has been successfully committed."
       },
       {
           “event” : "device:alert",
           “description”: "The device:alert event is published any time there is a new alert on the device."
       }
  ] 
  ```



