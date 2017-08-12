/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/tests/appSimpleGrid',
    'widgets/grid/tests/appSimpleGrid_Inline',
    'widgets/grid/tests/appSimpleGridAdvancedFilter',
    'widgets/grid/tests/appSpaceSimpleGrid_VirtualScrolling',
    'widgets/grid/tests/appModelViewGrid',
    'widgets/grid/tests/appSpaceGroupGrid',
    'widgets/grid/tests/appNestedGrid',
    'widgets/grid/tests/appTreeGrid',
    'widgets/grid/tests/appTreeGrid_Preselection',
    'widgets/grid/tests/appTreeGrid_manyRow',
    'widgets/grid/tests/appSmallGrid',
    'widgets/grid/tests/appGetDataGrid',
    'widgets/grid/tests/appDragNDropGrid',
    'widgets/grid/tests/appSimpleGrid_rbac',
    'widgets/grid/tests/appSimpleGrid_reload',
    'widgets/grid/tests/appSimpleGrid_getset',
    'widgets/grid/tests/appTreeGrid_getset'
], function (Backbone, SimpleGrid, SimpleGridInline, AppSimpleGridAdvancedFilter, SpaceSimpleGridVirtualScrolling,
        ModelViewGrid, GroupGrid, NestedGrid, TreeGrid, TreeGridPreselection, TreeGridManyRow, SmallGrid, GetDataGrid, DragNDropGrid, SimpleGridRbac,
        SimpleGridReload, SimpleGridGetSet, TreeGridGetSet) {
    var GridView = Backbone.View.extend({

        events: {
            'click .simple_grid a': function(){this.renderGrid(SimpleGrid)},
            'click .simple_inline_grid a': function(){this.renderGrid(SimpleGridInline)},
            'click .simple_grid_advanced_filter a': function(){this.renderGrid(AppSimpleGridAdvancedFilter)},
            'click .space_grid a': function(){this.renderGrid(SpaceSimpleGridVirtualScrolling)},
            'click .model_grid a': function(){this.renderGrid(ModelViewGrid)},
            'click .group_grid a': function(){this.renderGrid(GroupGrid)},
            'click .nested_grid a': function(){this.renderGrid(NestedGrid)},
            'click .tree_grid a': function(){this.renderGrid(TreeGrid)},
            'click .tree_grid_preselection a': function(){this.renderGrid(TreeGridPreselection)},
            'click .tree_grid_many_rows a': function(){this.renderGrid(TreeGridManyRow)},
            'click .small_grid a': function(){this.renderGrid(SmallGrid)},
            'click .get_data_grid a': function(){this.renderGrid(GetDataGrid)},
            'click .dragndrop_grid a': function(){this.renderGrid(DragNDropGrid)},
            'click .simple_grid_with_rbac a': function(){this.renderGrid(SimpleGridRbac)},
            'click .simple_grid_with_reload a': function(){this.renderGrid(SimpleGridReload)},
            'click .simple_grid_get_set_cols a': function(){this.renderGrid(SimpleGridGetSet)},
            'click .tree_grid_get_set_cols a': function(){this.renderGrid(TreeGridGetSet)}
        },

        renderGrid: function (GridView) {
            this.$el.hide();
            new GridView({
                el: '#main_content'
            });
        }

    });

    return GridView;
});