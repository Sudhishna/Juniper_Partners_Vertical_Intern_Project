/** 
 * A module that implements a selection model for a tree of navigational
 * elements.  The implementation is inspired by Backbone.Picky.  
 *
 * All nodes can be in either selected or deselected state.  Non-leaf nodes can
 * also be in either expanded or collapsed state.
 *
 * @module 
 * @name Slipstream/TreePicky
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(['backbone.picky'], function() {
	var TreePicky = {}

    // A model for selectable elements of a navigational tree
    TreePicky.Selectable = function (model, tree) {
        this.tree = tree;
        this.expanded = false;
        this.selected = false;
    };

    _.extend(TreePicky.Selectable.prototype, {
        expand: function() {
            this.expanded = true;
            this.trigger("expanded");
        },

        collapse: function() {
            this.expanded = false;
            this.trigger("collapsed");
        },

        toggleExpand: function() {
            if (this.expanded) {
                this.collapse();
            }
            else {
                this.expand();
            }
        },

        select: function() {
            if (this.selected) {
                return; 
            }
            this.selected = true;
            this.trigger("selected");
            this.tree.treeNodeSelect(this);
        },

        deselect: function() {
            if (!this.selected) { 
                return; 
            }
            this.selected = false;
            this.trigger("deselected");
            this.tree.treeNodeDeselect(this);
        }
    });

    return TreePicky;
});