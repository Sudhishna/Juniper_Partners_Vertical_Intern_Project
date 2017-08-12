/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'mockjax'
], function(Backbone, GridWidget, configurationSample, firewallPoliciesData, mockjax){
    var GridView = Backbone.View.extend({

        events: {
            "click .getSelection"    : "getSelection",
            "click .setSelection"    : "setSelection",
            "click .renderNewGrid"   : "renderNewGrid",
            "click .destroyNewGrid"  : "destroyNewGrid",
            "click .clearConfigText" : "clearConfigText"         
        },

        initialize: function () {
            this.mockApiResponse();
            this.search = [
                "sourceAddress = IP_CONV_204.17.79.60, IP_TRE_204.17.79.60",
                "Destination Address >= 3",
                "PSP", //PSP is a filtered value
                "quickFilter = juniper",
                "name = test"
            ];
            this.render();
        },

        render: function () {
            var self = this;
            self.updatedConfiguration = {"elements": configurationSample.simpleGrid}; //sets a default value
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

            this.grid = new GridWidget({
                container: this.el,
                elements: configurationSample.simpleGrid,
                search: this.search,
                onConfigUpdate: update
            });
            this.grid.build();
            this.addTestButtons();
            return this;
        },

        renderNewGrid: function() {
            var self = this;
            this.destroyNewGrid();
            this.$el.append('<div class="newGrid"></div>');

            this.newGrid = new GridWidget({
                container: self.$el.find('.newGrid')[0],
                elements: self.updatedConfiguration.elements,
                search: self.updatedConfiguration.search
            });
            this.newGrid.build();
        },


        // ------Util functions specific to the test page -----------

        destroyNewGrid: function() {
            if (this.newGrid) {
                this.newGrid.destroy();
                this.newGrid = null;
            }
        },

        clearConfigText: function() {
            this.$el.find('.result').val('');
        }, 

        addTestButtons: function () {
            this.$el.append('<br /><br /><br />');
            this.$el.append('<div><h6>Adjust the grid columns - width, show/hide and re-order.  After each change the column config will dump to the text area below.</h6><h6>You can then apply the dumped column config to create a new grid using the updated config in the text area by pressing the Render button.</h6></div>');            
            this.$el.append('<br /><br />');
            this.$el.append('<textarea class="result" style="height:20vh; width:20vw;" />');
            this.$el.append('<br /><br />');
            this.$el.append('<input type="button" class="slipstream-primary-button  renderNewGrid" value="Render New Grid from Config Above"><input type="button" class="slipstream-secondary-button  destroyNewGrid" value="Destroy New Grid">');
            this.$el.append('<br /><br />');
        },

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function(){
            var data = firewallPoliciesData;
            $.mockjax({
                url: '/api/get-data',
                dataType: 'json',
                response: function(settings) {
                    console.log('parameters in the mockjack request: ' + settings.data);
                    if (typeof settings.data == 'string'){
                        var urlHash = {},
                            seg = settings.data.split('&');
                        for (var i=0;i<seg.length;i++) {
                            if (!seg[i]) { continue; }
                            var s = seg[i].split('=');
                            urlHash[s[0]] = s[1];
                        }
                        switch(urlHash['_search']){
                            case "PSP":
                                this.responseText = firewallPoliciesData.firewallPoliciesFiltered;
                                break;
                            case "NoData":
                                this.responseText = firewallPoliciesData.noDataResponse;
                                break;
                            default:
                                this.responseText = firewallPoliciesData.firewallPoliciesAll;
                        }
                    }
                    else {
                        this.responseText = firewallPoliciesData.firewallPoliciesAll;
                    }
                },
                responseTime: 10
            });
            $.mockjax({
                url: /^\/api\/data-sample\/client\/([a-zA-Z0-9\-\_]+)$/,
                urlParams: ["client"],
                response: function(settings) {
                    var client = settings.urlParams.client,
                        clients = ["test","test2","test3"];
                    this.responseText = "true";
                    if ($.inArray(client, clients) !== -1) {
                        this.responseText = "false";
                    }
                },
                responseTime: 100
            });
        }
    });

    return GridView;
});