# List Builder Widget


## Introduction
The list builder widget is a reusable graphical user interface that allows users to select one or many items from a set of values. It shows a large list of options (box 1: Available) and a large list of selections (box 2: Selected).

## API
The list builder widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods and any data required by the widget is passed by its constructor.


###Configuration
The configuration object has two variables:

```
{
	container: <define the container where the widget will be rendered>,
	list: <define the list of options to be showed in the available list of the list builder and in the selected list (optional)>
}
```

For example:

```
{
    var listBuilder = new ListBuilderWidget({
        "list": {
            "availableElements": protocolList,
            "selectedElements": protocolListSelected
        },
        "container": this.$el
    });
}
```

where the "list" should be a object that contains the availableElements and the selectedElements properties as an array of value/label pairs. For example:

```
{
    var protocolList = [{
                            "label": "BFD",
                            "value": "BFD",
                            "moreInfo": "(50)",
                            "tooltip": "Source port: <b>8080</b><br/>Destination port: <b>8080</b>",
                            "valueDetails": "System",
                            "img_src": "./img/icon4.png",
                            "extraData": 'extraData'
                        },
                        {
                            "label": "BGP",
                            "value": "BGP"
                       }];
}
```

Each object (list item) in the array of the availableElements or the selectedElements could contain:

- label: text that describes the list item that will be showed next to the list item checkbox
- value: unique id assigned to the list item
- moreInfo: it shows additional information on a link format
- valueDetails: it represents extra information that needs to be presented for the list item
- img_src: path of the image showed for the list item
- extraData: extra data needs to be tracked but not show on UI. This data must be a string. If you need to pass an object, make sure you stringify it before passing.

###Build
Adds the dom elements and events of the list builder in the specified container. For example:

```
{
    listBuilder.build();
}
```

###Destroy
Clean up the specified container from the resources created by the list builder widget.

```
{
    listBuilder.destroy();
}
```

## Usage
To add a list builder in a container, follow these steps:
1. Instantiate the list builder widget and provide the configuration object the list of elements to show (list) and the container where the list builder will be rendered
2. Call the build method of the list builder widget

Optionally, the destroy method can be called to clean up resources created by the list builder widget.

```
{
    var listBuilder = new ListBuilderWidget({
        "list": {
            "availableElements": protocolList
        },
        "container": this.el
    });

    listBuilder.build();
}
```

## Methods

### getAvailableItems
Get the available items (available column). For example:

```
   var list = listBuilder.getAvailableItems();
```

### addAvailableItems
Add new items to the available column. For example:

```
    var list = [{
            "label": "BFD2",
            "value": "BFD2",
            "moreInfo": "(50)",
            "tooltip": "Source port: <b>8080</b><br/>Destination port: <b>8080</b>",
            "valueDetails": "System",
            "img_src": "./img/icon4.png"
        },
        {
            "label": "IGMP2",
            "value": "IGMP2",
            "valueDetails": "System",
            "img_src": "./img/icon4.png"
        },
        {
            "label": "LDP2",
            "valueDetails": "System",
            "value": "LDP2"
        }];
    listBuilder.addAvailableItems(list);
```

### setAvailableItems
Set existing items from the selected column to the available column. For example:

```
    var list = ['OSPF3', 'RIPNG'];
    listBuilder.setAvailableItems(list);
```

### removeAvailableItems
Remove existing items from the available column. For example:

```
    var list = ['PIM', 'RIP', 'ROUTER-DISCOVERY'];
    listBuilder.removeAvailableItems(list);
```

### getSelectedItems
Get the selected items (selected column). For example:

```
   var list = listBuilder.getSelectedItems();
```

### addSelectedItems
Add new items to the selected column. For example:

```
    var list = [{
            "label": "BFD2",
            "value": "BFD2",
            "moreInfo": "(50)",
            "tooltip": "Source port: <b>8080</b><br/>Destination port: <b>8080</b>",
            "valueDetails": "System",
            "img_src": "./img/icon4.png"
        },
        {
            "label": "IGMP2",
            "value": "IGMP2",
            "valueDetails": "System",
            "img_src": "./img/icon4.png"
        },
        {
            "label": "LDP2",
            "valueDetails": "System",
            "value": "LDP2"
        }];
    listBuilder.addSelectedItems(list);
```

### setSelectedItems
Set existing items from the available column to the selected column. For example:

```
    var list = ['PIM', 'RIP', 'ROUTER-DISCOVERY'];
    listBuilder.setSelectedItems(list);
```

### removeSelectedItems
Remove existing items from the selected column. For example:

```
    var list = ['OSPF3', 'RIPNG'];
    listBuilder.removeSelectedItems(list);
```

## Event

### selectedChangeEvent
Listen the selectedChangeEvent of the selected column. For example:

```
    $('.box2 .list-group').on('selectedChangeEvent', function(event, list){
        if (list && list.event && list.event === 'select'){
            console.log('move items from the available to selected column');
        }else if(list && list.event && list.event === 'unselect'){
            console.log('move items from the selected to available column');
        }
    });
```