# TabContainer Widget


## Introduction
The TabContainer widget is a reusable graphical user interface that allows users to break content into multiple sections that can be swapped to save space. Each section represents a tab and is composed by the title or name of the tab and the content or pane.

## API
The TabContainer widget follows the widget programming interface standards, therefore it exposes: build and destroy methods. Any data required by the widget is passed by its constructor.


## Configuration
The configuration object has the following parameters:

```
{
    container:  <DOM object that defines where the widget will be rendered>
    tabs: <Array of objects that defines the name and the content that will be shown in the tab container>
    vertical: <Boolean that defines the layout of the tab>
    toggle: <Boolean that defines the tab container as a set of toggle buttons>
    height: <String that defines the height of the container that holds the tab content>.
    rightAlignment: <Boolean that defines if the tab container will be aligned to the right if it set to true. by default is false, and the tab container is aligned to the left>
    submit: <Object that defines the button that will be used to retrieve the data held by each of the tabs>
}
```

For example, a Tab Container widget could be instantiated with the following configuration:

```
    var tabsWidget = new TabContainerWidget({
        "container": el,
        "tabs": tabsArray,
        "vertical": true,
        "height": "540px",
        "submit":{
            "id": "tabContainer-widget_save",
            "name": "save",
            "value": "Submit"
        }
    });
```

where the tabsArray variable for the tabs parameter is an array of objects. For example:

```
 var tabsArray = [{
            id:"create",
            name:"Create",
            content: new CreateView()
        },{
            id:"application",
            name:"Application",
            content: new ApplicationView({
                model: new ZonePoliciesModel.application.collection()
            })
        },{
            id:"destination",
            name:"Destination",
            isDefault: true,
            content: new DestinationAddressView({
                model: new ZonePoliciesModel.address.collection()
            })
        },{
            id:"source",
            name:"Source Address",
            content: new SourceAddressView({
                model: new ZonePoliciesModel.address.collection()
            })
        }];
```

### container
The container parameter represents the DOM element that will contain the Tab Container widget.

### tabs
The tabs parameter represents the parameters required to define a tab. It should be an array with objects that have the following parameters:
- id: id of the tab and represented by a string primitive data type. The id should be unique in the page.
- name: name of the tab and represented by a string primitive data type.
- content: content of the tab and represented by a Slipstream view object data type. The view should implement the getViewData method so the Tab Container widget could retrieve the user input in the view by using the getTabsData method.
- isDefault: tab that will be shown by default when the tab is rendered and represented by a boolean data type. If it is set to true if it will indicate the default. If it is absent or all isDefault parameters are set to false, then the first tab will be the default tab.

### orientation
String that defines the layout of the tab. If it is set to "vertical", the tabs will be displayed vertically. If it is absent, or if it is set to "horizontal", the tabs will be displayed horizontally.

### height
 Defines the height of the container that holds the tab content. It could be represented as a string composed by the number of units and the type of unit (for example: 540px) or it could be represented by a number data type in which case, the height is assumed in pixels. If it absent, the height of the tab will be calculated independently and will be long enough to hold the content of each of them.

### navigation
Defines the tab container with a navigation style when the navigation property is set to true. When it is absent or it is set to false, the tab container widget is represented as a standard set of tabs. For example:

```javascript
    new TabContainerWidget({
        "container": $navigationContainer,
        "tabs": [{
                                id:"createNav",
                                name:"FORM",
                                content: new FormView()
                            },{
                                id:"zoneNav",
                                name:"TABS",
                                isDefault: true,
                                content: new TabView()
                            },{
                                id:"verticalTab",
                                name:"VERTICAL",
                                content: new TabVerticalView()
                            },{
                                id:"rightTab",
                                name:"RIGHT",
                                content: new TabRightView()
                            },{
                                id:"toggleTab",
                                name:"TOGGLE",
                                content: new ToggleView()
                            }],
        "height": "auto",
        "navigation": true
    }).build();
```

### toggle
Defines the tab container as a set of toggle buttons when the toggle property is set to true. When it is absent or it is set to false, the tab container widget is represented as a standard set of tabs.

### submit
Defines the button that will be used to retrieve the data the updates user has on each of the tabs. It includes the parameters:
- id: id of the button
- name: name of the button
- value: label of the button


## build
Adds the dom elements and events of the TabContainer widget in the specified container. For example:

```
tabsWidget.build();
```

## destroy
Clean up the specified container from the resources created by the TabContainer widget.

```
tabsWidget.destroy();
```


## Other Methods

### getTabsData
Gets the data that each tab has collected from the user input. The data is retrieved by calling the getViewData from each view defined in the tabs parameter. It returns an object with all the data collected for each of the views. The key is the id of the tab and the value is the Object that is returned after invoking the getViewData on the view. Only the tabs that were visited are included. For example:

```
tabsWidget.getTabsData();
```

### getAllTabsData
Gets the data that each tab has collected from the user input. The data is retrieved by calling the getViewData from each view defined in the tabs parameter. It returns an object with all the data collected for each of the views. The key is the id of the tab and the value is the Object that is returned after invoking the getViewData on the view. All the tabs are included, including the ones the user did not visit. For example:

```
tabsWidget.getAllTabsData();
```

### getActiveTab
Provides the id or key of the active tab. For example:

```
tabsWidget.getActiveTab();
```

### getActiveTabByIndex
Provides the index of the active tab as it is defined in the tabs array parameter. For example:

```
tabsWidget.getActiveTabByIndex();
```

### setActiveTab
Sets a tab as the active one. The input parameter is the id or key of the tab. For example:

```
tabsWidget.setActiveTab('application');
```


## Usage
To include the TabContainer widget, define the container, the tabs (name and views) and the submit button parameters. Then, build the widget. For example:

```
    new TabContainerWidget({
        "container": this.el,
        "tabs": this.tabs,
        "vertical": true,
        "height": "540px",
        "submit":{
            "id": "tabContainer-widget_save",
            "name": "save",
            "value": "Submit"
        }
    }).build();
```

### addTab
Add a new tab(s) dynamically. The input parameter is the object of the tab configuration or an array of multiple tabs configuration. For example:

```
    var tab = {
        id:"address",
        name:"Address",
        content: new AddressView()
    },
    tabs = [{
                id:"create",
                name:"Create",
                content: new CreateView()
            },{
                id:"application",
                name:"Application",
                content: new ApplicationView()
            },{
                id:"zone",
                name:"Zone Policy",
                isDefault: true,
                content: new ZonePolicy()
            }];
    tabsWidget.addTab(tab);
    tabsWidget.addTab(tabs);
```

### removeTab
Remove an existing tab(s) dynamically. The input parameter is the tab id or the array of tab ids. For example:

```
    tabsWidget.removeTab("address");
    tabsWidget.removeTab(["create", "application", "zone"]);
```