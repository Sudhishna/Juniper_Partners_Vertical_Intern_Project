/**
 * A sample configuration object that shows the parameters required to build a List Builder widget
 *
 * @module configurationSample
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'widgets/listBuilderNew/tests/dataSample/testingSample'
    ], function (testingSample) {

    var configurationSample = {};

    var createLink = function (cellvalue, options, rowObject){
            return '<a class="cellLink" data-cell="'+cellvalue+'">'+cellvalue+'</a>';
         },
         getData = function (postdata){
            var self = this;
            $.ajax({
                url: '/api/get-data',
                data: postdata,
                dataType:"json",
                complete: function(data,status){
                    var data = data.responseJSON['addresses']['address'];
                    $(self).addRowData('id',data);
                }
            });
        },
        getData2 = function (postdata){
            var self = this;
            $.ajax({
                url: "/api/get-data2",
                data: postdata,
                dataType:"json",
                complete: function(data,status){
                    var data = data.responseJSON['addresses']['address'];
                    $(self).addRowData('id',data);
                }
            });
        },
        onSelectAllAvailable = function(done){
            console.log(testingSample.selectAllAvailable);
            done({ids:testingSample.selectAllAvailable});
        },
        filterParameter = "(addressType ne 'IPADDRESS' and addressType ne 'DNS' and addressType ne 'NETWORK' and addressType ne 'WILDCARD' and addressType ne 'POLYMORPHIC' and addressType ne 'DYNAMIC_ADDRESS_GROUP’)";
         
    configurationSample.firstListBuilder =  {
        "availableElements": {
            "url": "/api/get-data",
            "jsonRoot": "addresses.address",
            "totalRecords": "addresses.@total",
            "title": "Test Title1",
            "urlParameters": {filter: filterParameter},
            "onSelectAll": onSelectAllAvailable
        },
        "selectedElements": {
            "url": '/api/get-data2',
            "jsonRoot": "addresses.address",
            "totalRecords": "addresses.@total",
            "title": "Test Title2",
            "urlParameters": {filter: filterParameter},
            "hideSearchOptionMenu": true
        },
        "pageSize": 10,
        "sorting": [
            {
            "column": "name",
            "order": "asc"
            }
        ],
        "jsonId": "id",
        "height": '115px',
        "id": "test",  
        "search": {
            "url": function (currentPara, value){
                if (_.isArray(value)){
                    return _.extend(currentPara, {searchKey:value.join(' '), searchAll:true, _search: 'aol', test: false});
                }else{
                    return _.extend(currentPara, {searchKey:value, searchAll:true, _search: value});
                }
            },
            "optionMenu": [{
                "label":"IP Address",
                "value":"IPADDRESS",
                "key":"IPADDRESS",
                "type": "checkbox",
                "selected": true
            },{
                "label":"DNS",
                "value":"DNS",
                "key":"DNS",
                "type": "checkbox",
                "selected": true
            },{
                "label":"Network",
                "value":"NETWORK",
                "key":"NETWORK",
                "type": "checkbox",
                "selected": true
            },{
                "label":"Wildcard",
                "value":"WILDCARD",
                "key":"WILDCARD",
                "type": "checkbox",
                "selected": true
            },{
                "label":"Polymorphic",
                "value":"POLYMORPHIC",
                "key":"POLYMORPHIC",
                "type": "checkbox",
                "selected": true
            }]
        },
        // "ajaxOptions": {
        //     "headers": {
        //         "Accept": 'application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01'
        //     }
        // },
        "columns": [
        {
            "id": "id",
            "name": "id",
            "hidden": true
        }, {
            "index": "name",
            "name": "name",
            "label": "Name",
            "width": 150,
            "formatter":createLink
        }, {
            "index": "domain-name",
            "name": "domain-name",
            "label": "Domain",
            "width": 80
        }]
    },
    configurationSample.secondListBuilder =  {
        "availableElements": {
            "url": "/api/get-data",
            "jsonRoot": "addresses.address",
            "totalRecords": "addresses.@total"
        },
        "pageSize": 20,
        "id": "test2",
        "jsonId": "id",
        "height": '115px',
        "loadonce": true, //only load remotely once
        "columns": [
        {
            "id": "id",
            "name": "id",
            "hidden": true
        }, {
            "index": "name",
            "name": "name",
            "label": "Name",
            "width": 150
        }, {
            "index": "domain-name",
            "name": "domain-name",
            "label": "Domain",
            "width": 80
        }]
    },
    configurationSample.thirdListBuilder =  {
        "availableElements": {
            "getData": getData
        },
        "selectedElements": {
            "getData": getData2
        },
        "id": "test3",
        "jsonId": "id",
        "search": {
            "columns": "name",
            "optionMenu": [{
                "label":"2",
                "value":"2",
                "key":"search1",
                "type": "radio"
            },{
                "label":"SAP",
                "value":"SAP",
                "key":"search2",
                "type": "radio"
            }]
        },
        "height": '115px',
        "columns": [
        {
            "id": "id",
            "name": "id",
            "hidden": true
        }, {
            "index": "name",
            "name": "name",
            "label": "Name",
            "width": 150
        }, {
            "index": "domain-name",
            "name": "domain-name",
            "label": "Domain",
            "width": 80
        }]
    };

    return configurationSample;

});
