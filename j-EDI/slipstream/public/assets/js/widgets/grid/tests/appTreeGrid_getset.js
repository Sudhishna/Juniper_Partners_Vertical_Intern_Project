/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSampleTree',
    'widgets/grid/tests/dataSample/firewallPoliciesTreeData',
    'mockjax'
], function(Backbone, GridWidget, configurationSample, firewallPoliciesData, mockjax){
    var GridView = Backbone.View.extend({

        events: {
            "click .renderNewGrid"   : "renderNewGrid",
            "click .destroyNewGrid"  : "destroyNewGrid"
        },

        initialize: function () {
            this.mockApiResponse();
            this.render();
        },

        render: function () {
            var self = this;
            self.updatedConfiguration = {"elements": configurationSample.treeGrid}; //sets a default value
            var update = function(updatedConf){
                var columnsArray = updatedConf.elements.columns;
                var outputString = '';
                for (var i = 0; i < columnsArray.length; i++) {
                    outputString += JSON.stringify(columnsArray[i], null, 4);
                    if (i != columnsArray.length - 1) {
                        outputString += ',\r';
                    }
                }
                self.$el.find('.result').val(outputString);
                self.updatedConfiguration = updatedConf;
            };

            new GridWidget({
                container: this.el,
                elements: configurationSample.treeGrid,
                onConfigUpdate: update
            }).build();

            this.addTestButtons();
            return this;
        },

        renderNewGrid: function() {
            var self = this;
            this.destroyNewGrid();
            this.$el.append('<div class="newGrid"></div>');

            this.newGrid = new GridWidget({
                container: this.$el.find('.newGrid')[0],
                elements: self.updatedConfiguration.elements,
                search: self.updatedConfiguration.search
            });
            this.newGrid.build();
        },


        // ------Util functions specific to the test page -----------

        addTestButtons: function () {
            this.$el.append('<br /><br /><br />');
            this.$el.append('<div><h6>Adjust the grid columns - width, show/hide and re-order.  After each change the column config will dump to the text area below.</h6><h6>You can then apply the dumped column config to create a new grid using the updated config in the text area by pressing the Render button.</h6></div>');            
            this.$el.append('<br /><br />');
            this.$el.append('<textarea class="result" style="height:20vh; width:20vw;" />');
            this.$el.append('<br /><br />');
            this.$el.append('<input type="button" class="slipstream-primary-button  renderNewGrid" value="Render New Grid from Config Above"><input type="button" class="slipstream-secondary-button  destroyNewGrid" value="Destroy New Grid">');
            this.$el.append('<br /><br />');
        },

        destroyNewGrid: function() {
            if (this.newGrid) {
                this.newGrid.destroy();
                this.newGrid = null;
            }
        },

        /* mocks REST API response for tree data for the parent and first children */
        mockApiResponse: function(){
            var data = firewallPoliciesData;
            $.mockjax({
                url: '/api/get-tree',
                response: function(settings) {
                    var urlHash = {},
                        seg = settings.data.split('&');
                    for (var i=0;i<seg.length;i++) {
                        if (!seg[i]) { continue; }
                        var s = seg[i].split('=');
                        urlHash[s[0]] = s[1];
                    }
                    if(urlHash.page == 2){
                        this.responseText = firewallPoliciesData.firewallPoliciesPage2;
                    }else if(urlHash.page == 3){
                        this.responseText = firewallPoliciesData.firewallPoliciesPage3;
                    }else {
                        switch(urlHash.nodeid){
                            case "11":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel11;
                                break;
                            case "15":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel15;
                                break;
                            case "25":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel25;
                                break;
                            case "4":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel4;
                                break;
                            case "55":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel55;
                                break;
                            default:
                                this.responseText = firewallPoliciesData.firewallPoliciesAll;
                        }
                    }

                },
                responseTime: 10
            });
        }
    });

    return GridView;
});