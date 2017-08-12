# Utility Toolbar

The Slipstream user interface contains a utility toolbar that provides a quick way to navigate to a set of application features without requiring the framework's menu-based navigation.  

**[Insert toolbar image here]**

The toolbar is extensible - a plugin can add elements to the toolbar and make those toolbar elements actionable.

Toolbar elements come in two flavors - Icon-based elements and elements based on a plugin-provided view.

## Icon-based Toolbar Elements
Each icon toolbar element has an associated default icon that is displayed in the toolbar.

Up to two [activities](Activity.md) can be associated with an icon toolbar element.  The *toolbar activity* is started when the toolbar element is instantiated and can be used to update the state of the toolbar icon asynchronously.  This could be useful, for example, for a toolbar element that displays the number of asynchronous system alerts that have occurred.  The *onSelect* activity is started whenever the toolbar icon is selected.

Toolbar elements can define a [view](View.md) that is rendered and displayed in a tooltip when a user hovers over the toolbar element.

### Defining Utility Toolbar Icon Elements
Utility toolbar elements are defined declaratively in the [plugin manifest](Manifest.md).

```javascript
"utility_toolbar": [
   {
     "icon": "toolbar/commit.svg",
     "activity": {
       "module": "toolbarActivity"
     },
     "onselect_activity": {
       "module": "onSelectActivity"
     },
     "hover": {
       "view": "hoverView"
     }
   }
]

```

This manifest defines one utility toolbar element whose default icon is found in the file */img/toolbar/commit.svg*, where */img* is the plugin's images directory.  Both a *toolbar* and *onselect* activity are defined.  This toolbar element also provides a view defined in Javascript module *hoverView* that is rendered and displayed onhover.  The paths to toolbar activities and view modules are defined relative to the plugin's *js* directory.

If more granular control is required with respect to RBAC or authentication restrictions for an activity associated with a toolbar element, then the activity definition can be referenced instead of the activity module:

```javascript
activities: [
  {
      "auth_required": false, 
      "capabilities": [
          ....
      ],
      "filters": [
          {
              "id": "some_filter"
              ...
          }
      ]
  }
],

"utility_toolbar": [
   {
     "icon": "toolbar/commit.svg",
     "activity": {
         "filter": "some_filter"
     }
   }
]

```
The activity will be resolved via an intent that matches the specified filter, and all of the authentication and RBAC restrictions associated with the activity will be enforced.

### Modifying the Element's State
The activities associated with an icon utility toolbar element receive a reference to a [IconToolbarElement](UtilityToolbarIconElement.md) object, called *toolbarElement*, in their *context* object.  This object exposes methods for modifying the state of the toolbar element.

```javascript
// Set the element's icon badge to '5'
this.context.toolbarElement.setIconBadge(5);

// Set the element's icon to the image in 'img/someIcon.svg'
this.context.toolbarElement.setIcon("someIcon.svg");

// Set the element's icon badge to the image in 'img/iconBadge.svg'
this.context.toolbarElement.setIconBadge("iconBadge.svg");

// Disable the toolbar element
this.context.toolbarElement.setEnabled(false);
```

## View-based Toolbar Elements
There are use cases for rendering an element in the toolbar that is not simply an icon.  For such cases, a view-based toolbar element can be created.  

View-based toolbar elements allow a plugin to define any view and register it for rendering in the toolbar.  Only very simple views are recommended here as the toolbar is allocated very limited vertical screen real estate by the framework.

### Defining View-based Toolbar Elements
View-based utility toolbar elements are defined declaratively in the [plugin manifest](Manifest.md).  An activity is specified that will be loaded by the framework and executed in order to produce a view for rendering in the toolbar.

```javascript
...

"utility_toolbar": [
   {
     "activity": {
       "module": "toolbarActivity"
     }
   }
]

...
```

## Modifying the Element's State
The activity associated with a view-based utility toolbar element receive a reference to a [ViewToolbarElement](UtilityToolbarViewElement.md) object, called *toolbarElement*, in their *context* object.  This object exposes a method for setting the view used to render the toolbar element.

```javascript
// Set the element's view
var View = Backbone.View.extend({
    render: function() {...}
});

this.context.toolbarElement.setView(new View());
```




