# ContextMenu Widget


## Introduction
The ContextMenu widget is a reusable graphical user interface that allows users to add a custom right click menu or a click menu to any HTML element or selected container.

## API
The ContextMenu widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods. Any data required by the widget is passed by its constructor.


## Configuration
The configuration object has two variables:

```
{
	container: <define the DOM element where the widget will be rendered>,
	elements: <optional, define the parameters required to build the ContextMenu like items of the menu and callback functions.>,
	dynamic: <optional, defines a context menu which DOM-footprint will be created every time the menu is opened and destroyed when the menu is hidden>

}
```

For example, a ContextMenu widget would be instantiated with:

```
new ContextMenuWidget({
    "elements": configurationSample,
    "container": '.context-menu'
}).build();
```

where the "elements" should be defined in a set of key/value pairs as described in the following section. For example:

```
var configurationSample = {
        "callback": function(key, opt){ console.log(opt); },
        "items": [{
                "label":"Edit Rule",
                "key":"edit"
            },{
                "label":"Disable Rule",
                "key":"disable"
            },{
                "label":"Create Rule Before",
                "key":"createBefore"
        }],
        "events": {
            "show":function(opt){console.log('Show Event' + opt);},
            "hide":function(opt){console.log('Hide Event' + opt);}
        }
    }
```


### Container
It represents the id or the class of the element that will have a ContextMenu.


### Elements
It represents an object with the configuration parameters required to build the ContextMenu widget. The parameters are:

**items**
Defines the items or commands to be listed in contextMenu. For example:

```
"items": [{
        "label":"Edit Rule",
        "key":"edit"
    },{
        "label":"Disable Rule",
        "key":"disable"
    },{
        "label":"Copy Rule",
        "key":"copy"
    },{
        "label":"Paste Rule Before",
        "key":"pasteBefore",
        "disabled":true
    },{
        "label":"Paste Rule After",
        "key":"pasteAfter",
        "disabled":true
    },{
        "label":"Delete Rule",
        "key":"delete"
    },{
        "label":"Reset Hit Count",
        "key":"resetHit"
    },{
        "label":"Disable Hit Count",
        "key":"disableHit"
}]
```

An item has the following properties:

- **label**
Specifies the label that an item will show when the context menu is opened.

- **key**
Defines a unique identifier for an item in the context menu.

- **items**
Defines a second level of menus to be assigned to an item located at the first level menu. The parameters are the same as the one defined for an item located at the first level menu. For example:

```
"items": {
    "label":"SubMenu 1",
    "key":"fold1",
    "items": [{
            "label":"SubMenu1 Menu1",
            "key":"fold1-key1",
            "icon":"edit",
            "callback":printKey
        },{
            "label":"SubMenu1 Menu2",
            "key":"fold1-key2",
            "icon":"copy",
            "callback":printKey
        },{
            "separator": "true"
        },{
            "label":"SubMenu1 Menu3",
            "key":"fold1-key3",
            "icon":"cut",
            "callback":printKey
     }]
}
```
- **separator**
Provides a line to divide an item label from the next one when its value is set to true. For example:

```
"separator": "true"
```

- **title**
Defines a title for a set of item menus. For example the context menu configuration for the items parameter could include:

```
items: [{
            "label":"Edit Rule",
            "key":"edit"
        },{
            "separator": true
        },{
            "title":"Checkbox title",
            "className": "checkboxTitle1"
        },{
            "key": "column1",
            "label": "Column 1",
            "type": "checkbox",
            "selected": true,
            "value": '1',
            "events": checkboxChangeEvent
        }]
```

- **className**
Defines the class name that can be applied to an item menu in the context menu.

- **disabled**
Specifies if an item in the context menu is disabled (true) or enabled (false). It can be defined as a boolean or as a callback function. The callback is executed in the context of the triggering object (so this inside the function refers to the element the context menu was shown for). The first argument is the key of the command. The second argument is the options object. Options parameters are:

- **$trigger**
jQuery object with the element triggering the menu.

- **$menu**
jQuery object with the menu element

- **callbacks**
Object with the registered callbacks of all commands (including those of sub-menus)

- **commands**
Object with the registered commands (including those of sub-menus)

- **inputs**
Object with the registered commands of input-type (including those of sub-menus).

- **hasTypes**
Flag denoting if the menu contains input elements

- **ns**
The namespace (including leading dot) all events for this contextMenu instance were registered under

**callback**
Specifies the default callback to be used in case an item does not expose its own callback. For example:

```
 "callback": function(key, opt){ console.log(opt); },
```

**events**
Defines the events to register on the items like show or hide. For example:

```
"events": {
    "show":function(opt){console.log('Show Event' + opt);},
    "hide":function(opt){console.log('Hide Event' + opt);}
}
```

**autoHide**
Specifies if the menu must be hidden when the mouse pointer is moved out of the trigger and menu elements. Default: false.

**zIndex**
Specifies the offset to add to the calculated zIndex of the trigger element. Default is set to 200.

**trigger**
Specifies the event to show the contextMenu. Possible values: "right", "left", "hover", "none".

**position**
Sets the position of the context menu.The function is executed in the context of the trigger object. The first argument is the $menu jQuery object. The second and third arguments are x and y coordinates provided by the showing event.
x and y may either be integers denoting the offset from the top left corner, undefined, or the string "maintain". If the string "maintain" is provided, the current position of the $menu must be used. If the coordinates are undefined, appropriate coordinates must be determined. An example of how this can be achieved is provided with determinePosition. For example:

```
"position": function(opt, x, y){opt.$menu.css({top: 10, left: 20});}

```

**type**
Defines an item menu as an input element. It could be a checkbox ( "type": "checkbox"), a radio button ("type": "radio") or a text ("type": "text"). For example:

```
{
...
items: [{  // generates <input type="checkbox">
        "key": "column1",
        "label": "Column 1",
        "type": "checkbox",
        "selected": true,
        "value": '1',
        "events": checkboxChangeEvent
    },{ // generates <input type="radio">
        "key": "radio1",
        "label": "Radio 1",
        "type": "radio",
        "radio": 'radio',
        "value": '1'
    },
...
}
```

**context**
Indicates the DOM node from where the Context Menu search of the provided container (id or class) will start. Default: body.


## Build
Adds the dom elements and events of the ContextMenu widget in the specified container. For example:

```
{
    ContextMenu.build();
}
```

## Destroy
Cleans up the specified container from the resources created by the ContextMenu widget.

```
{
    ContextMenu.destroy();
}
```

## Usage
To include the ContextMenu widget, a container with a ContextMenu class or id should be identified, and the passed it to the constructor of the Context Menu widget, and finally call the build method on this instance. The steps to follow are:

### Step 1
Add the HTML markup that needs to show a context menu when the container is click (or right click depending on configuration). For example:

```
<div class="context-menu">Menu1</div>
```

### Step 2
Create a configuration object with the items or commands to be showed in the Context Menu. For example:

```
var configurationSample = {
    "autoHide": "true",
    "items": [{
            "label":"Edit",
            "key":"edit",
            "icon":"edit",
            "callback":printKey
        },{
            "label":"Cut",
            "key":"cut",
            "icon":"cut",
            "callback":printKey
        },{
            "label":"Copy",
            "key":"copy",
            "icon":"copy",
            "callback":toggle_copy
        },{
            "label":"Paste",
            "key":"paste",
            "icon":"paste",
            "callback":printKey,
            "disabled": function(key, opt){ return true; }
        },{
            "label":"Delete",
            "key":"delete",
            "icon":"delete",
            "callback":printKey,
            "disabled": function(key, opt){ return !!this.data('disabled'); }
    },{
            "separator": "true"
        },{
            "label":"Quit",
            "key":"quit",
            "icon":"quit",
            "callback":printKey
        },{
            "separator": "true"
        },{
            "label":"SubMenu 1",
            "key":"fold1",
            "items": [{
                    "label":"SubMenu1 Menu1",
                    "key":"fold1-key1",
                    "icon":"edit",
                    "callback":printKey
                },{
                    "label":"SubMenu1 Menu2",
                    "key":"fold1-key2",
                    "icon":"copy",
                    "callback":printKey
                },{
                    "separator": "true"
                },{
                    "label":"SubMenu1 Menu3",
                    "key":"fold1-key3",
                    "icon":"cut",
                    "callback":printKey
             }]
        },{
            "separator": "true"
        },{
            "label":"SubMenu 2",
            "key":"fold2",
            "items": [{
                "label":"SubMenu2 Menu1",
                "key":"fold2-key1",
                "icon":"edit",
                "callback":printKey
            },{
                "label":"SubMenu2 Menu2",
                "key":"fold2-key2",
                "icon":"copy",
                "callback":printKey
            },{
                "label":"SubMenu2 Menu3",
                "key":"fold2-key3",
                "icon":"cut",
                "callback":printKey
            }]
        }]
};
```

### Step 3
Instantiate the ContextMenu widget using the container created in step 1 and the configuration created in step 2 and then build the widget. For example:

```
new ContextMenuWidget({
    "elements": configurationSample.simpleContextMenu,
    "container": '.context-menu'
}).build();
```