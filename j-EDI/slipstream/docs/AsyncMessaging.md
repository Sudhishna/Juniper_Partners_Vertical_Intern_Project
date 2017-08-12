# Asynchronous Messaging

Slipstream provides a mechanism for plugins to act as providers of asynchronous messages and to deliver those messages to other plugins registered to listen to them.  These messages can originate from within or outside the framework.  Two framework abstractions are provided in support of this: [MessageResolver](MessageResolver.md) and [MessageProvider](MessageProvider.md).

## MessageResolver

The [MessageResolver](MessageResolver.md) provides a unified way to work with *topic subscriptions* across the Slipstream framework.  Plugins use the MessageResolver to subscribe to topics made available by MessageProviders, thereby eliminating the need for plugins to work directly with a MessageProvider.  

              ┌────────────┐           ┌────────────────┐         ┌────────────────┐
              │   Plugin   │  ----->   │ MessageResolver│ <------ │ MessageProvider│
              └────────────┘ subscribe └────────────────┘ register└────────────────┘
                                                          topics

## MessageProvider
A MessageProvider should be created if your plugin will be publishing messages that may be of interest to other plugins. The framework will aggregate all providers defined in the plugin's manifest file. Any plugin that will be providing cross-plugin messages will need to subclass the [MessageProvider](MessageProvider.md) from the SDK. To allow the framework to register the MessageProvider, the provider must be described in the plugin's manifest file. This allows the framework to instantiate the MessageProvider when the plugin is first discovered. The provider must provide a unique URI that will be used to identify it. The topics provided within a message provider must also be unique within that message provider.

                 
                                          Message Bus
                    ┌──────────────────────────────────────────────────────┐
                    │                                                      ^
                    │ message                                              │ publish message
                    v                                                      │ 
              ┌────────────┐           ┌────────────────┐         ┌────────────────┐
              │   Plugin   │  ----->   │ MessageResolver│ <------ │ MessageProvider│
              └────────────┘ subscribe └────────────────┘ register└────────────────┘
                                                          topics
