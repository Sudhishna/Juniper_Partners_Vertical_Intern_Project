/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'widgets/grid/tests/view/createPolicyView',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'mockjax'
], function(Backbone, GridWidget, configurationSample, ZonePoliciesAddView, ZonePoliciesModel, firewallPoliciesData, mockjax){
    var GridView = Backbone.View.extend({

        events: {
            "click .getSelection": "getSelection"
        },

        initialize: function () {
            this.render();
        },

        render: function () {
            this.grid = new GridWidget({
                container: this.el,
                elements: configurationSample.getDataGrid
            });
            this.grid.build();
            this.addData(this.grid);
            this.$el.append('<input type="button" class="slipstream-primary-button  getSelection" value="Get Selection">');
            return this;
        },

        getSelection: function(){
            console.log(this.grid.getSelectedRows());
        },

        addData: function (grid) {
            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/grid/tests/dataSample/simpleGrid.json',
                success: function(data) {
                    var rows = data.policy;
                    grid.addRow(rows);
                },
                error: function() {
                    console.log("Getting all row for the grid FAILED.");
                }
            });

        }

    });

    return GridView;
});