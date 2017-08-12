# Search Widget


## Introduction
The Search widget is a reusable graphical user interface that allows users to add a search container with tokens that represent the search criteria.


## API
The Search widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods. Any data required by the widget is passed by its constructor.


## Configuration
The configuration object has multiple parameters. Only the container parameter is a required one.

```
{
    container:  <DOM object that defines where the widget will be rendered.>
    readOnly: <boolean that defines if the token area will be shown as a read only container. In this case, the filter and logic menus won't be available.>
    filterMenu: <Object that defines the filter context menu that will be shown on the token area. It is used to select the key and value of a token.>
    logicMenu: <Array that defines the logic menu that will be shown on the token area between two tokens. It is used to replace the default AND logic operator added by default between two tokens.>
    afterTagAdded: <callback function invoked after a tag is added.>
    afterTagRemoved: <callback function invoked after a tag is removed.>

}
```

For example, a Search widget would be instantiated with:

```
var readOnlySearchContainer = this.$el.find('.readOnlySearchContainer')[0];

var searchWidget = new SearchWidget({
    "container": readOnlySearchContainer,
    "readOnly": true
});
```

### container
It represents the DOM element that will have a Search.


### readOnly
It represents a boolean that defines if the token area will be shown as a read only container. If it is set to true, the search container will turn into a read only mode and the filter and logic menus won't be available.

### filterMenu
Defines the items that will be listed in filter context menu and that will be available on the token area. It is used to select the key and value of a token. If the readOnly parameter is set to true, this parameter will be ignored. For example:

```
var filterMenu = {
    'name': {
        'label':'name',
        'value':['SRX','MX','EX']
    },
    'sourceAddress': {
        'label':'sourceAddress',
        'value':['12.1','12.2','12.3','12.4','13.1','13.3','13.3','13.4']
    },
    'Platform': {
        'label':'Platform',
        'value':['srx650', 'srx5800', 'mx2020', 'ex2200']
    },
    'ManagedStatus': {
        'label':'ManagedStatus',
        'value':['In Sync','Out of Sync','Connecting']
    },
    'ConnectionStatus': {
        'label':'ConnectionStatus',
        'value':['Down', 'Up']
    },
    'IPAddress': {
        'label':'IPAddress',
        'value':['']
    }
};
```

Where the key of the object is the item key and the label represents the label of the item while value represents the value that will be showed if the item is selected.

### logicMenu
It defines the logic menu that will be shown on the token area between two tokens. It is used to replace the default AND logic operator added by default between two tokens. It is represented by an array. For example

```
var logicMenu = ['AND','OR','OR NOT','AND NOT']
```

### afterTagAdded
It defines a callback function that is invoked after a tag is added.

### afterTagRemoved
It defines a callback function that is invoked after a tag is removed.


## build
Adds the DOM elements and events for the Search widget in the specified container. For example:

```
{
    searchWidget.build();
}
```


## destroy
Cleans up the specified container from the resources created by the Search widget.

```
{
    searchWidget.destroy();
}
```


## Other Methods

### getTabsData

## Usage
To include the Search widget, a container should be identified, and the passed it to the constructor of the Search widget, and finally call the build method on this instance. The steps to follow are:

### Step 1
Add the HTML markup that needs to show a context menu when the container is click (or right click depending on configuration). For example:

```
<div class="searchContainer"></div>

```

### Step 2
Create a configuration object with the filter and logic menus if the search is editable (readOnly set to false). For example:

```
var searchConf = {};

searchConf.filterMenu = {
    'name': {
        'label':'name',
        'value':['SRX','MX','EX']
    },
    'sourceAddress': {
        'label':'sourceAddress',
        'value':['12.1','12.2','12.3','12.4','13.1','13.3','13.3','13.4']
    },
    'Platform': {
        'label':'Platform',
        'value':['srx650', 'srx5800', 'mx2020', 'ex2200']
    },
    'ManagedStatus': {
        'label':'ManagedStatus',
        'value':['In Sync','Out of Sync','Connecting']
    },
    'ConnectionStatus': {
        'label':'ConnectionStatus',
        'value':['Down', 'Up']
    },
    'IPAddress': {
        'label':'IPAddress',
        'value':['']
    }
};

searchConf.logicMenu = ['AND','OR','OR NOT','AND NOT'];
```

### Step 3
Instantiate the Search widget using the container created in step 1 and the configuration created in step 2 and then build the widget. For example:

```
new SearchWidget({
    "filterMenu": configurationSample.filterMenu,
    "logicMenu": configurationSample.logicMenu,
    "container": searchContainer
});.build();
```