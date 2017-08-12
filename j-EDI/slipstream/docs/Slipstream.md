# Slipstream - A Management UI Framework

Slipstream is a lightweight framework for building management user interfaces in a decoupled way.  It allows workflows to be dynamically created from independently developed and deployed *plugins*.  Plugins can dynamically discover other plugins and use those discovered plugins in their own workflows.  

### Plugins
Plugins are a combination of Javascript code, HTML templates, CSS files, and other resources such as message bundles used for localization.  A plugin's workflows can be written using the MVC library of the developer's choice - Slipstream does not dictate how the workflows are written.

### Workflows and Activities
The building blocks of workflows are Slipstream *Activities*.   Activities are written as Javascript modules that are packaged with a plugin.  These modules conform to a simple interface that Slipstream relies on to discover, load and start their lifecycle.  Once started, an activity is in complete control of its workflow and can render its views to the Slipstream content area and discover and start other activities. 

### Activity Discovery and Intents
Slipstream Activities are discovered and started by creating an *Intent*.  An Intent describes a desire to perform some activity.  The activity to be performed is defined by an *action* and a combination of a MIME type and a URI.  For example, a plugin that renders a view containing an IP address may want to provide the option to render the geolocation data for that address on a map.  .  If the plugin does not have the capability to render such a map itself it can create an intent to render a map and request that Slipstream launch a map activity if one exists.  An intent for this might specify an action of *Slipstream.Intent.action.VIEW* and a URI of *geo:34.57,-140.4*, where 34.57 and -140.4 are the latitude and longitude of the data to be displayed, respectively. If an activity matching the intent is found, Slipstream will launch the map activity and pass the geolocation data to it so that the activity can render the desired data on the map.  In this way, workflows, and the activities that comprise them, can be completely decoupled.

### UI Widgets
Plugins, activities and intents are the building blocks of decoupled Slipstream workflows.  While Slipstream doesn't dictate how a workflow's views are created it does provide a widget toolkit that contains a core set of UI widgets including forms, grids, overlays, wizards, graph and dashboard widgets that follow established user experience practices.  Slipstream also provides support for internationalization of views and allows plugins to supply their own locale-specific message bundles that the framework manages and automatically loads based on the client's locale.

## Learn more
Follow these links to learn more about Slipstream:

[Writing Slipstream Plugins](Plugins.md)

[Writing Slipstream Dashboard Plugins](public/assets/js/widgets/dashboard/dashboard.md)

[Activities](Activity.md)

[Intents](Intent.md)

[Views](Views.md)

[Asynchronous Messaging](AsyncMessaging.md)

[Notifications](UserNotifications.md)

[The Utility Toolbar](UtilityToolbar.md)

[The Slipstream Widget Toolkit](Widgets.md)

[Internationalizing views](i18n.md)

[Formatting dates](DateFormatter.md)

[User Assistance](UserAssistance.md)

[User Preferences](Preferences.md)

[User Analytics](Analytics.md)