/**
 * A view that uses the Form Widget to render a form from a configuration object for the Address view
 *
 * @module AddressView
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/form/formWidget',
    '../conf/formConfiguration',
    'widgets/listBuilderNew/listBuilderWidget',
    'widgets/listBuilderNew/conf/configurationSample',
    'widgets/listBuilderNew/tests/dataSample/testingSample',
    'mockjax'
], function(Backbone, FormWidget, formConfiguration, ListBuilderWidget, listBuilderConf, testingSample, mockjax){
    var ApplicationView = Backbone.View.extend({

        render: function () {
            this.mockApiResponse();
            this.form = new FormWidget({
                "elements": formConfiguration.Address,
                "container": this.el
            });
            this.form.build();
            this.addListBuilder();
            return this;
        },

        addListBuilder: function (id,list){
            var address = this.$el.find('#addresses'),
                addressesContainer = address.parent();
                
            this.addressesListBuilder = new ListBuilderWidget({
                container: addressesContainer,
                elements: listBuilderConf.secondListBuilder,
                rowTooltip: this.rowTooltip
            });
            this.addressesListBuilder.build();
            address.remove();
        },

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function(){
            var data = testingSample;
            $.mockjax({
                url: '/api/get-data',
                dataType: 'json',
                response: function(settings) {
                    if (typeof settings.data == 'string'){
                        var urlHash = {},
                            seg = settings.data.split('&');
                        for (var i=0;i<seg.length;i++) {
                            if (!seg[i]) { continue; }
                            var s = seg[i].split('=');
                            urlHash[s[0]] = s[1];
                        }

                        switch(urlHash.searchAll){
                            default:
                                this.responseText = data.addresses;
                        }

                        switch(urlHash.page){
                            default:
                                this.responseText = data.addresses;
                        }

                    }
                    else {
                        this.responseText = data.addresses;
                    }
                },
                responseTime: 10
            });
        },

        rowTooltip: function (rowData, renderTooltip){
            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/listBuilderNew/tests/dataSample/tooltipsSample.json',
                success: function(response) {
                    console.log(rowData);
                    var data = response.address,
                        moreData=[];
                    moreData.push({
                        title: "Address Group"
                    });
                    data.forEach(function(item){
                        moreData.push({
                            label: "Address: " + item['name']
                        });
                    });
                    moreData.push({
                        link: "(10 more)",
                        id: "address-tooltip-more-link"
                    });
                    renderTooltip(moreData);
                    
                }
            });
        }
    });

    return ApplicationView;
});