/**
 * A module that builds a Tree widget
 *
 * @module TreeWidget
 * @author Brian Duncan <bduncan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'jstree',
    'lib/template_renderer/template_renderer',
    'text!./templates/treeContainer.html'
],  /** @lends TreeWidget */
    function(jstree, render, template) {
    /**
     * TreeWidget constructor
     *
     * @constructor
     * @class TreeWidget - Builds a Tree widget from a configuration object.
     *
     * @param {Object} conf Supports the following properties:
     *   container: define the container where the widget will be rendered (required)
     *   data: Contains the data used to build the tree. Used for local data.
     *   url: URL to fetch remote data
     *   dataFilter: Callback to format the remote data as needed for the tree. Used in combination with url 
     *               if the data returned by the server does not match tree expectations.
     *   ajaxOptions: An object with additional xhr properties if needed.  
     *                For example, { accept: { 'Content-Type': 'application/json'}} to set the accept header.
     *   showCheckboxes: boolean indicating whether or not to show checkboxes.
     *   multiselect: boolean to determine whether or not multiple selections are supported. false by default (optional)
     *   selectedNodes: array of initial selections, can be id strings or node objects
     *   onSelect: Callback when a node is selected. An array of selected nodes is provided. (optional)
     *   onDeselect: Callback when a node is deselected. An array of selected nodes is provided. (optional)
     *   onExpand: Callback when a node is expanded. The node that was expanded is provided. (optional)
     *   onCollapse: Callback when a node is collapsed. The node that was collapsed is provided. (optional)
     *   onFilter: Callback to be executed when using remote data and filter is requested.
     *             The callback should accept the query string, a callback function that will be passed
     *             an array of node ids to be expanded (ie the nodes that have not had children loaded yet, but 
                   contain matches) (optional) 
     *   onLoad: Callback executed when the tree is fully rendered.(optional)
     * @returns {Object} An instance of TreeWidget
     */
    var TreeWidget = function(conf){
        var ERROR_NO_INSTANCE = 'Tree has not been built yet!';
        var instance = null;
        var treeConfig = null;
        var defaults = {
            multiselect: false,
            cascadeSelections: false,
            showCheckboxes: true,
            selectedNodes: [],
            search: {},
            onSelect: null,
            onDeselect: null,
            onExpand: null,
            onCollapse: null,
            onFilter: null,
            onLoad: null
        };

        treeConfig = _.extend(defaults, conf);
        treeConfig.container = $(conf.container);

        var container = treeConfig.container.append(render(template));
        var $widget = container.find('.tree-container');

        if (conf.url) {
            treeConfig.data = _.extend(conf.ajaxOptions || {}, { url: conf.url, dataFilter: conf.dataFilter });
        }

        /**
         * Convert an array of id strings to node objects
         */
        var idToNode = function(ids) {
            return ids.map(function(id) {
                return instance.get_node(id);
            });
        };

        /**
         * Setup any user requested callbacks
         */
        var bindCallbacks = function() {
            if (treeConfig.onLoad) {
                $widget.on('ready.jstree', function() {
                    treeConfig.onLoad();
                });
            }            

            // Mark nodes as selected if passed into configuration
            if (treeConfig.selectedNodes.length > 0) {
                $widget.on('ready.jstree', function() {
                    treeConfig.selectedNodes.forEach(function(node) {
                        instance.select_node(node);
                    });
                });
            }

            if (treeConfig.onSelect || treeConfig.onDeselect) {
                $widget.on('changed.jstree', function(e, data) {
                    if (treeConfig.onSelect && data.action == 'select_node') {
                        var nodes = idToNode(data.selected);
                        treeConfig.onSelect(nodes);
                    } else if (treeConfig.onDeselect && data.action == 'deselect_node') {
                        var nodes = idToNode(data.selected);
                        treeConfig.onDeselect(nodes);
                    }
                });
            }

            if (treeConfig.onExpand) {
                $widget.on('open_node.jstree', function(e, data) {
                    treeConfig.onExpand(data.node);
                });
            }

            if (treeConfig.onCollapse) {
                $widget.on('close_node.jstree', function(e, data) {
                    treeConfig.onCollapse(data.node);
                });
            }
        };

        /** 
         * Builds the Tree widget in the configured container
         * @returns {Object} Returns this instance of the tree
         */
        this.build =  function () {
            var plugins = ['search'];

            if (treeConfig.showCheckboxes) {
                plugins.push('checkbox');
            }

            if (treeConfig.url && treeConfig.onFilter) {
                treeConfig.search = {
                    ajax: treeConfig.onFilter
                };
            }

            bindCallbacks();

            instance = $.jstree.create($widget, {
                core: {
                    animation: 0,
                    check_callback: true,
                    data: treeConfig.data,
                    multiple: treeConfig.multiselect,
                    themes: {
                        name: "default",
                        dots: false,
                        icons: false
                    }
                },
                checkbox: {
                    three_state: treeConfig.cascadeSelections,
                    keep_selected_style: false,
                    visible: true
                },
                search: treeConfig.search,
                plugins: plugins
            });

            return this;
        };

        /**
         * Destroys the tree widget
         */
        this.destroy =  function () {
            if (! instance) {
                throw new Error(ERROR_NO_INSTANCE);
            }

            instance.destroy();
        };

        /**
         * Expand the node identified by the passed in node id or node object.
         * This does not recursively open child nodes.
         *
         * @param {String|Object} The node identifier or object
         * @returns {Object} This instance of the tree
         */
        this.expandNode = function(node) {
             if (! instance) {
                throw new Error(ERROR_NO_INSTANCE);
            }

            instance.open_node(node);

            return this;           
        };

        /**
         * Expand all nodes in the tree recursively.  Operates on the node
         * passed in or all nodes if called without arguments
         *
         * @param {Object} node Optional node to recursively expand
         * @returns {Object} This instance of the tree
         */
        this.expandAll = function(node) {
             if (! instance) {
                throw new Error(ERROR_NO_INSTANCE);
            }

            instance.open_all(node);

            return this;
        };

        /**
         * Collapse the node identified by the passed in node id or object
         *
         * @param {String|Object} The node identifier or object
         * @returns {Object} This instance of the tree
         */
        this.collapseNode = function(node) {
             if (! instance) {
                throw new Error(ERROR_NO_INSTANCE);
            }

            instance.close_node(node);

            return this;           
        };

        /**
         * Collapse all nodes in the tree recursively.  Operates on the node
         * passed in or all nodes if called without arguments
         *
         * @param {Object} node Optional node to recursively collapse
         * @returns {Object} This instance of the tree
         */
        this.collapseAll = function(node) {
             if (! instance) {
                throw new Error(ERROR_NO_INSTANCE);
            }

            instance.close_all(node);

            return this;
        };

        /**
         * Deselect the node identified by the passed in node id or object
         *
         * @param {String|Object} The node identifier or object
         */
        this.deselectNode = function(node) {
            if (! instance) {
                throw new Error(ERROR_NO_INSTANCE);
            }

            instance.deselect_node(node);

            return this;
        };

        /**
         * Select the node identified by the passed in node id or object
         *
         * @param {String|Object} id - The node identifier or object
         */
        this.selectNode = function(node) {
            if (! instance) {
                throw new Error(ERROR_NO_INSTANCE);
            }

            instance.select_node(node);

            return this;
        };

        /**
         * Get an array of selected nodes
         */
        this.getSelectedNodes = function() {
            if (! instance) {
                throw new Error(ERROR_NO_INSTANCE);
            }
            
            var nodes = instance.get_selected();
            nodes = nodes.map(function(id) {
                return instance.get_node(id);
            });

            return nodes;
        };

        /**
         * Get the node identified by the passed in node id or object
         *
         * @param {String|Object} id - The node identifier or object
         */
        this.getNode = function(node) {
            if (! instance) {
                throw new Error(ERROR_NO_INSTANCE);
            }

            return instance.get_node(node);
        };

        /**
         * Add a new node to the tree without refreshing the entire tree
         *
         * @param {Mixed} parent - The id or node object of new nodes parent
         * @param {Object} node - An object with an id and text property
         * @param {Mixed} position - An optional position to place the node within the parent.
         *                           Can be "first", "last", or the index.
         */
        this.addNode = function(parent, node, position) {
            if (! instance) {
                throw new Error(ERROR_NO_INSTANCE);
            }
            
            return instance.create_node(parent, node, position);
        };

        /**
         * Remove a node from the tree without refreshing the entire tree
         *
         * @param {String|Object} id - The node identifier or object
         */
        this.deleteNode = function(node) {
            if (! instance) {
                throw new Error(ERROR_NO_INSTANCE);
            }

            return instance.delete_node(node);
        };

        /**
         * Request the tree to be filtered on the passed in string
         *
         * @param {String} query The search string
         */
        this.filter = function(query) {
            if (! instance) {
                throw new Error(ERROR_NO_INSTANCE);
            }

            instance.search(query, false, true);
        };

        /**
         * Remove any filters that were applied to the tree. This will 
         * show any nodes that were previously hidden.
         */
        this.removeFilter = function() {
            if (! instance) {
                throw new Error(ERROR_NO_INSTANCE);
            }

            instance.clear_search();
        }

    };

    return TreeWidget;
});