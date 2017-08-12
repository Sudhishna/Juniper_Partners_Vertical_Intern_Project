# Tree Widget


## Introduction
The tree widget is a reusable graphical interface that allows users to show data in a tree format. 

## API
The tree widget follows the widget programming interface standards, therefore it exposes: build and destroy methods and any data required by the widget is passed by its constructor.


###Configuration
The configuration object supports the following properties:

```
{
    container: <define the container where the widget will be rendered>,
    multiselect: <define if the tree allows selecting multiple nodes or not. Default: false.(optional)>,
    data: <used to populate the tree with local data. Objects should have an id, text, and optional children property. The children property is an array that should contain one or more objects. Additional properties can be included, they will be ignored by the tree, but still available. The child nodes are not lazy loaded.>,
    url: <used to fetch remote data. If lazy load is needed, this should be a function that takes a node as an argument.  The node selected will be passed to the function.  A node with id "#" is passed when initially loaded>,
    dataFilter: <define callback executed when data is fetched from a URL.  Used to format the data according to tree expectations (described above in the data property)>,
    ajaxOptions: <additional xhr options that may need to be set, such as the Accept header >,
    showCheckboxes: <boolean to determine whether or not to show checkboxes. Default: true>,
    cascadeSelections: <boolean to determine whether or not a selection should cascade and select all child nodes as well. Default: false. (optional)>,
    selectedNodes: <an array of nodes to be initially selected.  The array can contain id strings, or complete node objects>,
    onSelect: <define optional callback to be executed when a node is selected.  Returns an array of the selected node ids>,
    onDeselect: <define optional callback to be executed when a node is deselected.  Returns an array of the selected node id>,
    onExpand: <define optional callback to be executed when a node is expanded>,
    onCollapse: <define optional callback to be executed when a node is collapsed>,
    onFilter: <define callback for filtering when using remote data.  Callback should expect the filter string and a callback that should be called with the node ids of nodes containing matching children.>,
    onLoad: <define optional callback to be executed when the tree is fully rendered>
}
```

Example using local data:

```
var container = $('.treeContainer');

{
    var tree = new TreeWidget({
                    container: container[0],
                    multiselect: true
                    data: {
                        id: 2,
                        text: "Global",
                        children: [
                          {
                            id: 3,
                            text: "orpheus"
                          },
                          {
                            id: 4,
                            text: "csp"
                          }
                        ]
                    }
                });
}
```

Example using remote data and lazy load:

```
var container = $('.treeContainer');

{
    var tree = new TreeWidget({
                    container: container[0],
                    multiselect: true
                    url: function(node) {
                        if (node.id == "#") {
                            return '/api/domains'
                        }

                        return '/api/domains/' + node.id;
                    },
                    ajaxOptions: {
                        headers: {
                            'Accept': 'application/vnd.net.juniper.space.domain-management.domain+json;version=1;q=0.01'
                        }
                    }
                });
}
```

###Build
Adds the dom elements and events of the tree in the specified container. For example:

```
{
    tree.build();
}
```

###Destroy
Clean up the specified container from the resources created by the tree widget.

```
{
    tree.destroy();
}
```

## Usage
To add a tree in a container, follow these steps:
1. Instantiate the tree widget and provide the container where the tree will be rendered.
2. Call the build method of the tree widget

Optionally, the destroy method can be called to clean up resources created by the tree widget.

```
{
    var container = $('.treeContainer');

    var tree = new TreeWidget({
                    container: container[0],
                    multiselect: true
                    data: {
                        id: 2,
                        text: "Global",
                        children: [
                          {
                            id: 3,
                            text: "orpheus"
                          },
                          {
                            id: 4,
                            text: "csp"
                          }
                        ]
                    }
                }).build();
}
```

## Methods

### addNode
Adds a node to the tree using the passed in parent node id string or node object, the node object to be added, and an optional position parameter.  Use "#" as the node id if you need to add to the root node. The position can be "first", "last", or an index.  This is a zero-based index from the parent node.
```
   tree.addNode(parent, node, position);
```

### deleteNode
Deletes a node from the tree given a provided tree node id or the node object
```
   tree.deleteNode(node); 
```

### getNode
Gets the entire node for the specified id or object.  This will include any non-tree data that was passed in when the node was created.
```
   tree.getNode(node);
```

### selectNode
Marks the node as selected using the node id or the node object
```
   tree.selectNode(node); 
```

### deselectNode
Removes the selection state for a node in the tree using the node id or the node object
```
   tree.deselectNode(node); 
```

### getSelectedNodes
Gets an array of nodes that are currently selected in the tree.
```
   tree.getSelectedNodes();
```

### expandNode
Expands the tree for the node identified by the passed in node id or the node object.  This will not recursively expand child nodes.
```
   tree.expandNode(node); 
```

### expandAll
Recursively expands the tree for the node identified by the passed in node id or the node object.  If no arguments are passed, every node will be expanded.
```
   tree.expandAll(node); 
```

### collapseNode
Collapses the tree for the node identified by the passed in id or the node object
```
   tree.collapseNode(node); 
```

### collapseAll
Recursively collapses the tree for the node identified by the passed in node id or the node object.  If no arguments are passed, every node will be collapsed.
```
   tree.collapseAll(node); 
```

### filter
Request the tree to be filtered by the provided string
```
    tree.filter('orpheus');
```

### removeFilter
Remove any filter so that hidden nodes are visible again.
```
    tree.removeFilter();
```