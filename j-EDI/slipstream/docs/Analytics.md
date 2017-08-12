#  Slipstream User Analytics

Gaining insight into the way a user interacts with a web application is critical to providing a good user experience.  Failure rates, time to completion, navigational paths, and other metrics provide the data necessary to improve and optimize workflows.  Static metrics like browser and version used, screen resolution and type of client device also provide important insights that can drive application optimization and help in making design trade-offs. 

Slipstream will provide a set of interfaces in the SDK for gathering user analytics.  The framework will automatically track metrics related to visited URLs, global search queries/number of results, the authenticated user, and other metrics that are related to framework-provided elements.  Plugins can use the provided interfaces to gather additional metrics related to content impressions/interactions, link traversal, etc.

# Slipstream Tracker

Slipstream will provide a set of abstract programming interfaces that can be used for gathering user metrics.    Plugins can provide concrete implementations of these interfaces as *analytics providers* that act as adapters to specific tracker implementations.  The framework will provide one such provider that acts as an adapter to the open source [Piwik tracker](https://piwik.org/).

## Analytics API
The Slipstream.SDK.Analytics class exposes the following programmatic interfaces for tracking analytics events:

### Methods

- #### SDK.Analytics.prototype.trackEvent
Explicitly track a user analytics event.  This can be used to track events that the framework doesn't already track on the plugin's behalf.

    #### Parameters

    - **category**
      
       The event category (eg. Firewall)
      
    - **action**

       The event action (eg. "Create Rule")
       
    - **name**

       The event name {optional}
       
    - **value**

       A value associated with the event (optional)
       
   ```javascript
   function addFirewallRule() {
      totalRules++;
      ...
      // log an event describing the addition of a new firewall rule and the current number of rules.
      Slipstream.SDK.Analytics.trackEvent("firewall", "add rule", "", totalRules);
      ...
   }
   ```
       
- #### SDK.Analytics.prototype.trackLink
Manually log a link click event.

    #### Parameters

    - **url**
      
       The URL associated with the link
      
    - **linkType** (optional)

       The type of the link to be tracked.  If not specified the value defaults to 'link'.
       
   ```javascript
   var link;
   ...
   link.onClick(function() {
       Slipstream.SDK.Analytics.trackLink("/event/4885883", "link");
   });
   ```
       
- #### SDK.Analytics.prototype.trackContentImpressionsWithinNode 
Scans the given DOM node and its children for content blocks and tracks an impression for them if no impression was already tracked for it.

    #### Parameters

    - **domNode**
      
      The DOM node within which content impressions should be tracked.
      
- #### SDK.Analytics.prototype.trackContentImpression
Explicitly tracks a content impression.   This can be used to track impressions for content that is added dynamically after a view is rendered via an activity's *setContentView()* method.

    #### Parameters

    - **contentName**
      
      The name of the content section
      
    - **contentPiece**
      
      A description of the content
      
    - **contentTarget**
      
      The target (if any) of a click on the content

   ```javascript
   var view = new CustomView();
   var container;
   ...
   var newContent = view.render();
   container.append(newContent);

   Slipstream.SDK.Analytics.trackContentImpression("Device Definition", "Device 1", "/devices/device1");
   ```

- #### SDK.Analytics.prototype.trackContentInteractionNode
Explicitly tracks an interaction with the given DOM node.

    #### Parameters

    - **domNode**
      
      The DOM node for which the content interaction to be tracked
      
    - **contentInteraction**
      
      The name of the content interaction to be set eg. 'click' or 'submit'.

   ```javascript
      var domNode;
      ...
      Slipstream.SDK.TrackContentInteractionNode(domNode, "click")
   ```
      
- #### SDK.Analytics.prototype.trackContentInteraction
Explicitly tracks a content interaction using a set of specified values describing the content.

    #### Parameters

    - **contentInteraction**
      
      The name of the content interaction to be set eg. 'click' or 'submit'.
      
    - **contentName**
      
      The name of the content for which the interaction is to be tracked.
      
  - **contentPiece**
      
      A description of the content for which the interaction is to be tracked
     
 - **contentTarget**
      
      The target (if any) of a click on the content
      
   ```javascript
   var deviceNode;
   ...
   devicetNode.onClick(function() {
       Slipstream.SDK.Analytics.trackContentInteraction("click", "device1", "device definition", "/devices/device1");
   });
   ```
      
- #### SDK.Analytics.prototype.addListener
Add a click listener to a specific link element. When clicked, Slipstream will log the click automatically.

    #### Parameters

    - **element**
      
      The link element for which a click listener should be added.  Element clicks will be tracked automatically.

   ```javascript
   var element;
   ...
   Slipstream.SDK.Analytics.addListener(element);
   ```
   
- #### SDK.Analytics.prototype.trackSearch
Track a search query.  This method can be used to track any search interaction in the UI.  An optional category can be provided to further describe the context of the search (eg. 'global', 'firewall rules grid', etc.).

    #### Parameters

    - **query**
      
      The search string to be tracked
      
    - **category** (optional)
      
      The search category
      
    - **resultCount** (optional)
      
      The number of search results for query
      
      ```javascript
      function doSearch(query) {
         executeQuery(query, function(results) {
             Slipstream.SDK.Analytics.trackSearch(query, "network events", results.length); 
         });
      }
      ```
      
- #### SDK.Analytics.prototype.setUserId
Set the userid that will be associated with subsequent tracking events.  Plugins will not typically need to call this method as the authenticated userid is tracked by the framework.

    #### Parameters

    - **username**
      
      The userid associated with subsequent tracking events

## Analytics Providers
An *analytics provider* acts as an adapter to a concrete tracker implementation.  The provider implements the abstract tracking interface defined by Slipstream.

A Slipstream analytics provider is implemented as a Javascript AMD module in [requireJS](http://requirejs.org/docs/api.html) format.  The module must return a no-argument Javascript constructor that extends from *Slipstream.SDK.AnalyticsProvider*.  The framework will use this constructor to instantiate the provider.

```javascript
define(function() {
    function SomeAnalyticsProvider() {
       ...
    }
    
    this.onCreate = function() {
        // Perform required create time initialization of the provider
    }
    
    this.onStart = function() {
        // Perform required startup time initialization of the provider
    }
     
    // Inherit from the Slipstream AnalyticsProvider class
    SomeAnalyticsProvider.prototype = Object.create(Slipstream.SDK.AnalyticsProvider.prototype);
    SomeAnalyticsProvider.prototype.constructor = SomeAnalyticsProvider;
    
    // Return the constructor as the value of this module
    return SomeAnalyticsProvider;
});
```

### Provider Lifecycle

An AnalyticsProvider has a well-defined lifecycle that takes it through a series of states including *create* and *start*, *destroy*.

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

Each state of an analytics provider has a corresponding lifecycle method in an AnalyticsProvider object: *onCreate()*, *onStart()*, *onDestroy()*.

When an analytics provider is first created its *onCreate()* method is called.  By default this method is a no-op but providers can override it to perform any operations necessary prior to the provider being started. Once the *onCreate()* method returns, the provider's onStart() method is immediately invoked.

When a provider is either no longer needed (eg. its associated plugin is removed from the system) it may be destroyed. Before a provider is destroyed its *onDestroy()* method is called. This allows the provider an opportunity to perform any cleanup operations prior to it being destroyed.
  

**Note**: The destroy state and it's corresponding *onDestroy()* method are not currently used by Slipstream but are reserved for future use.

## Analytics Provider Instances

All AnalyticsProvider instances inherit from Slipstream.SDK.AnalyticsProvider.prototype.  In addition to providing an implementation for all base Slipstream.SDK.Analytics.prototype methods, an AnalyticsProvider should implement the following methods:

### Methods

- #### SDK.AnalyticsProvider.prototype.onCreate
The lifecycle callback that is invoked when an AnalyticsProvider is created.  This occurs after instantiation but before the provider is started.  Anything that an provider needs to do before it is started should be done here.  

    A plugin can assume that the user has been authenticated prior to this method being called.

  The method in the AnalyticsProvider prototype is a no-op and should be overridden by objects implementing an AnalyticsProvider.

- #### SDK.AnalyticsProvider.prototype.onStart
The lifecycle callback that is invoked when a AnalyticsProvider is started.  

    A plugin can assume that the user has been authenticated prior to this method being called.

  The method in the AnalyticsProvider prototype is a no-op and should be overridden by objects implementing an AnalyticsProvider.

- #### SDK.AnalyticsProvider.prototype.onDestroy
The lifecycle callback that is invoked when a provider is destroyed.  

   The method in the AnalyticsProvider prototype is a no-op and should be overridden by objects implementing a AnalyticsProvider.

  **Note**: This method is not currently used by Slipstream but is reserved for future use.

### Declaring an AnalyticsProvider 

A plugin must declare the analytics provider that it exposes via its plugin.json file.  Only a single analytics provider can exist in an instance of the Slipstream framework.  If multiple provider definitions exist, then Slipstream will use the last definition found during plugin discovery.

A sample plugin.json with the relevant AnalyticsProvider settings is shown below.

```json
{
   ...
   providers: [
      {
          "uri": "analytics://",
          "module": "analyticsProvider"
      }
   ]
   ...
}
```
When a plugin is loaded and the configuration includes *providers*, the module identified will be instantiated and the *onCreate()* function called to initialize the provider.
  
## Example Analytics Provider
  
```javascript
define(["piwik"], function(Piwik) {    
  function PiwikAnalyticsProvider() {
   Slipstream.SDK.AnalyticsProvider.call(this);
   ...
  }

  PiwikAnalyticsProvider.prototype = Object.create(Slipstream.SDK.AnalyticsProvider.prototype);
  PiwikAnalyticsProvider.prototype.constructor = PiwikAnalyticsProvider;

  PiwikAnalyticsProvider.prototype.trackEvent = function(category, action, name, value) {
    ...
  }
    	
  PiwikAnalyticsProvider.prototype.trackLink = function(url, linkType) {
	...
  }
  ...
  return PiwikAnalyticsProvider;
})
```

## Plugin Requirements for Analytics
Slipstream will automatically track data for all framework-provided UI elements including the primary and secondary navigation, utility toolbar and global search.  It will also track information about the currently logged in user.  In addition it will automatically track data on the client-side runtime environment such as OS and version, browser type and version, screen resolution, etc.  

Plugins will be responsible for explicitly calling the Slipstream tracker API to track application-specific events.  Plugins will also be responsible for declaring content sections in its rendered views for which impressions and interactions are to be tracked.

### Identifying Content Sections

In order to track content impressions and interactions, content sections must be explicitly declared in the section’s markup.  This is done using the following HTML data-* attributes:

| Attribute | Description |
|-------------|-----------------|
| data-track-content |Defines a content block 
| data-content-name="<name>"|Defines the name of the content block
| data-content-piece="<identifier>"| Identifies the piece of content that is displayed (eg. /assets/foo.jpg)|
| data-content-target="<target>"| Defines the content target (eg. the URL of a landing page that is displayed when clicking on the content) |
|data-content-ignoreinteraction| Specifies that interactions with the content should not be tracked automatically|

#### Example

The following markup defines a named content section:

```
<div id=”onboarding” data-track-content data-content-name=”onboarding guide”>
 …
</div>
```

The framework will automatically track content impressions for content that is rendered into the content pane via an Activity’s *setContentView* method.  However, only content that is rendered from the content view's render method will be tracked automatically.  A plugin must explicitly call the appropriate content tracking methods to track any content that it adds to the content pane after the content view’s render method returns (eg. content that is added dynamically due to progressive disclosure).

## Opting-out of Tracking
Most modern browsers provide a ‘do not track’ option so that users can explicitly opt-out of tracking.  The Slipstream tracker will honor this setting and will not generate any tracking data if this option is enabled.


