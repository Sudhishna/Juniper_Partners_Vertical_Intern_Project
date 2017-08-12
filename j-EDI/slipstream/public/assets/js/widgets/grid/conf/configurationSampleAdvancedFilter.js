/**
 * A sample configuration object that shows the parameters required to build a Grid widget with advanced filter
 *
 * @module configurationSampleAdvancedFilter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'widgets/dropDown/dropDownWidget',
    'widgets/grid/conf/searchConfiguration'
], function (DropDownWidget, searchConfiguration) {

    var configurationSample = {};

    var configurationCallback = {
        createLink: function (cellvalue, options, rowObject){
            return '<a class="cellLink tooltip" data-cell="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</a>';
        },
        undoLink: function (cellvalue, options, rowObject){
            return cellvalue;
        },
        getDefaultCopiedValue: function (cellvalue){
            return cellvalue + '_1';
        },
        getDefaultAddedValue: function (cellvalue){
            return cellvalue;
        },
        getApplicationHelp: function () {//sample data for testing purposes
            var filterHelp = "Specify port-based applications to be used as match criteria for the policy.";
            return filterHelp;
        },
        getServicesHelp: function () {//sample data for testing purposes
            var filterHelp = "Specify port-based services or service sets to be used as match criteria for the policy.";
            return filterHelp;
        },
        buildNameVerificationUrl: function (cellvalue){
            var url = "/api/data-sample/client/";
            url += cellvalue;
            return url;
        },
        getData: function (postdata){
            var self = this;
            $.ajax({
                url: '/api/get-data',
                data: postdata,
                dataType:"json",
                complete: function(data,status){
                    var data = data.responseJSON['policy-Level1']['policy-Level2']['policy-Level3'];
                    $(self).addRowData('',data);
                }
            });
        },
        formatData: function (cellvalue, options, rowObject) {
            if (cellvalue && cellvalue.length === 2){
                return ['0.0.0.0','1.2.3.4','4,5,6,7'];
            }
            return cellvalue;
        },
        formatObjectData: function (cellvalue, options, rowObject) {
//          console.log(rowObject);
            return cellvalue;
        },
        setItemStatus: function (key, isItemDisabled, selectedRows){
            if (key=='resetHitEvent') isItemDisabled = true;
            else if (key=='disableHitEvent' && selectedRows.length>0) isItemDisabled = false;
            if (key=='subMenu3') isItemDisabled = true;
            return isItemDisabled;
        },
        setCustomMenuStatusAdd: function (key, isItemDisabled, selectedRows) {
            if (key=='createMenu2') isItemDisabled = true;
            return isItemDisabled;
        },
        setCustomMenuStatusSplit: function (key, isItemDisabled, selectedRows) {
            return isItemDisabled;
        },
        setShowHideColumnSelection: function (columnSelection){
            columnSelection['from-zone-name'] = false; //hides the from-zone-name column by default
            columnSelection['to-zone-name'] = false; //hides the from-zone-name column by default
            return columnSelection;
        },
        updateShowHideColumnSelection: function (columnSelection){
            console.log(columnSelection);
        },
        setCustomTextAreaElement: function(cellvalue, options){
            var $textarea = $("<textarea>");
            $textarea.val(cellvalue);
            return $textarea[0];
        },
        getCustomTextAreaValue: function(elem, operation){
            return $(elem).val();
        },
        getCustomDropdownElement: function(cellvalue, options, rowObject){
            var actionDropDownData = [{
                "id": "permit",
                "text": "permit"
            },{
                "id": "deny",
                "text": "deny"
            }];
            var $span =  $('<div><select class="celldropdown"></select></div>');
            actionCustomDropdown = new DropDownWidget({
                "container": $span.find('.celldropdown'),
                "data": actionDropDownData,
                "placeholder": "Select an option",
                "enableSearch": true
            }).build();
            actionCustomDropdown.setValue(cellvalue);
            return $span[0];
        },
        getCustomDropdownValue: function(element, operation){
            return actionCustomDropdown.getValue();
        },

        isRowEditable: function (rowId){
            var rows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent'];
            if (rows.indexOf(rowId)!=-1)
                return false;
            return true;
        },
        setTooltipData: function (rowData, rawData, setTooltipDataCallback){
    //        console.log(rowData);
            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
                success: function(data) {
                    setTooltipDataCallback(data.address, {
                        "key": "ip-prefix",
                        "label": "name",
                        "clickHandler": function(item){
                            console.log(item);
                        }
                    });
                }
            });
        },
        dropCallback: function(data, dropColumn, draggableRow, droppableRow){
            console.log('after dropped the items but before saving the data');
            console.log(data);
            console.log(dropColumn);
            console.log(draggableRow);
            console.log(droppableRow);
            return {isValid: true};
            // return {isValid: false, errorMessage: 'The item is duplicated.'};
        },
        setPostData: function(postData) {
            console.log(postData);
            return {
                "value3": "valuePostData3",
                "value4": "valuePostData4"
            };
        }
    };

    var configurationData = {
        keyLabelTable: {
            "utm-policy": "UTM",
            "idp": "IDP",
            "application-firewall": "AppFW",
            "application-traffic-control": "AppTC"
        },
        applicationDropDownData: [{
            "id": "ike",
            "text": "IKE"
        },{
            "id": "ftp",
            "text": "FTP"
        },{
            "id": "tcp",
            "text": "TCP"
        }]

    };

    var actionCustomDropdown;

    configurationSample.simpleGridAdvancedFilter = {
        "title": "Grid Sample Page with Advanced Filter",
        "title-help": {
            "content": "Tooltip for the title of the Grid Widget<br/>Additional information available on the <b>link</b> below",
            "ua-help-text": "More..",
            "ua-help-identifier": "alias_for_ua_event_binding"
        },
        "tableId":"test1",
       "urlMethod": "POST", //default: "GET"
        //"postData": {
        //    "value1": "valuePostData1",
        //    "value2": "valuePostData2"
        //},
        "postData": configurationCallback.setPostData,
        "url": "/api/get-data", //option 1 to be used with jsonRoot
        "jsonRoot": "policy-Level1.policy-Level2.policy-Level3",
//        "url": "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOnePage.json",
//        "jsonRoot": "policy",
//        "getData": configurationCallback.getData, //option 2
        "jsonId": "name",
//        "showRowNumbers": true,
        "multiselect": true,
        "height": 'auto', //could be auto
        "scroll": true,
        "numberOfRows":20,
        "jsonRecords": function(data) {
            return data['policy-Level1']['policy-Level2']['policy-Level3'][0]['junos:total'];
//            return data['policy'][0]['junos:total'];
        },
//        "createRow": {
////           "addLast":true,
//            "showInline": true
//        },
//        "editRow": {
//            "showInline": true,
//            "isRowEditable": configurationCallback.isRowEditable
//        },
        "actionButtons":{
//            "defaultButtons":{ //overwrite default CRUD grid buttons
//                "create": {
//                    "label": "Create Menu",
//                    "key": "createMenu",
//                    "items": [{
//                        "label":"Open grid overlay",
//                        "key":"createMenu1"
//                    },{
//                        "label":"Create Menu2",
//                        "key":"createMenu2"
//                    }],
//                    "statusCallback": configurationCallback.setCustomMenuStatusAdd
//                }
//            },
            "customButtons":
                [{
                    "button_type": true,
                    "label": "Publish",
                    "key": "testPublishGrid"
                },{
                    "button_type": true,
                    "label": "Save",
                    "key": "testSaveGrid",
                    "secondary": true
                },{
                    "icon_type": true,
                    "label": "Close",
                    "icon": "icon_archive_purge",
                    "key": "testCloseGrid"
                },{
                    "menu_type": true,
                    "label":"Split Action",
                    "key":"subMenu3",
                    "items": [{
                        "label":"SubMenu1 Menu1",
                        "key":"subMenu1"
                    },{
                        "label":"SubMenu1 Menu2",
                        "key":"subMenu2"
                    },{
                        "separator": "true"
                    },{
                        "label":"SubMenu1 Menu3",
                        "key":"subMenu3"
                    }],
                    "statusCallback": configurationCallback.setCustomMenuStatusSplit
                }]
        },
        "contextMenu": {
            "enable":"Enable Rule",
            "disable":"Disable Rule",
//            "createBefore": "Create Row Before",
//            "createAfter": "Create Row After",
            "copy": "Copy Row",
            "pasteBefore": "Paste Row Before",
            "pasteAfter": "Paste Row After",
            "delete": "Delete Row",
            "quickView": "Detailed View",
            "custom":[{ //user should bind custom key events
                "label":"Reset Hit Count",
                "key":"resetHitEvent"
            },{
                "label":"Disable Hit Count",
                "key":"disableHitEvent"
            },{
                "label":"Reload Grid",
                "key":"reloadGrid"
            },{
                "label":"Reload grid with 10 rows",
                "key":"reloadGridNewRowNumber"
            },{
                "label":"With sub menus",
                "key":"subMenus",
                "items": [{
                    "label":"Grid Overlay",
                    "key":"subMenu1"
                },{
                    "label":"SubMenu1 Menu2",
                    "key":"subMenu2"
                },{
                    "separator": "true"
                },{
                    "label":"SubMenu1 Menu3",
                    "key":"subMenu3"
                }]
            }]
        },
        "contextMenuItemStatus": configurationCallback.setItemStatus,
        "filter": {
            searchUrl: true,
//            searchUrl: function (value, url){  //overwrites default search
//                return url + "?searchKey=" + value + "&searchAll=true";
//            },
            advancedSearch: {
                "filterMenu": searchConfiguration.filterMenu,
                "logicMenu": searchConfiguration.logicMenu,
                "save": [{
                        "label": "Save Filter",
                        "key":"saveFilter"
                    },{
                        "label": "Create Monitor",
                        "key":"createMonitor"
                    },{
                        "label": "Create Alert",
                        "key":"createAlert"
                    }]
            },
            columnFilter: true,
            showFilter: {
                "customItems": [{ //user should bind custom key events
                        "label":"View saved filters",
                        "key":"viewFilters"
                    },{
                        "label":"Load saved filters",
                        "key":"loadFilters"
                    }],
                quickFilters: [{
                        "label":"Only Juniper devices",
                        "key":"juniper"
                    },{
                        "label":"Only non-Juniper devices",
                        "key":"nonJuniper"
                    }]
            },
            optionMenu: {
                "showHideColumnsItem":{
                    "setColumnSelection": configurationCallback.setShowHideColumnSelection, //true for all selected
                    "updateColumnSelection": configurationCallback.updateShowHideColumnSelection
                },
                "customItems": [{ //user should bind custom key events
                    "label":"Export Grid",
                    "key":"exportGrid",
                    "items": [{
                        "label":"Export to PDF",
                        "key":"exportSubMenu1"
                    },{
                        "label":"Export to CSV",
                        "key":"exportSubMenu2"
                    },{
                        "separator": "true"
                    },{
                        "label":"Export to XML",
                        "key":"exportSubMenu3"
                    }]
                },{
                    "label":"Share Grid",
                    "key":"shareGrid"
                },{
                    "label":"Print Grid",
                    "key":"printGrid"
                }],
                "statusCallback": configurationCallback.setCustomMenuStatusSplit
            }
        },
        "dragNDrop":{
            source: 'cell',
            destination: 'cell',
            afterDrop: configurationCallback.dropCallback,
            connectWith: 'test2'
        },
        "columns": [
            {
                "name": "name",
                "label": "Name",
                "width": 300,
                "formatter": configurationCallback.createLink,
                "unformat": configurationCallback.undoLink,
                "copiedDefaultValue": configurationCallback.getDefaultCopiedValue,
                "editCell":{
                    "type": "input",
                    "pattern": "hasnotspace",
                    "error":"Spaces are not allowed"
                },
                "searchCell": true
            }, {
                "index": "inactive",
                "name": "inactive",
                "label": "Inactive",
                "hidden": true,
                "showInactive":"true"
            }, {
                "index": "sourceZone",
                "name": "from-zone-name",
                "label": "Source Zone",
                "createdDefaultValue":'untrust-inet',
                "width": 200,
                "editCell":{
                    "type": "custom",
                    "element": configurationCallback.setCustomTextAreaElement,
                    "value": configurationCallback.getCustomTextAreaValue
                }
            }, {
                "index": "sourceAddress",
                "name": "source-address",
                "label": "Source Address",
                "width": 260,
                "collapseContent": true,
//                "collapseContent":{
//                    "formatData": configurationCallback.formatData
//                },
                "createdDefaultValue":"any",
                "dragNDrop":{
                    "isDraggable": true,
                    "isDroppable": true
                },
                "searchCell": {
                    "type": 'dropdown',
                    "values":[{
                        "label": "IP_CONV_204.17.79.60",
                        "value": "IP_CONV_204.17.79.60"
                    },{
                        "label": "IP_SEC_204.17.79.60",
                        "value": "IP_SEC_204.17.79.60"
                    },{
                        "label": "IP_TRE_204.17.79.60",
                        "value": "IP_TRE_204.17.79.60"
                    },{
                        "label": "IP_TRE_96.254.162.106",
                        "value": "IP_TRE_96.254.162.106"
                    }]
                }
            }, {
                "index": "destinationZone",
                "name": "to-zone-name",
                "label": "Destination Zone",
                "createdDefaultValue":'untrust-inet',
                "width": 200,
                "editCell":{
                    "type": "input",
                    "pattern": "length",
                    "min_length":"2",
                    "max_length":"10",
                    "error": "Must be between 2 and 10 characters."
                }
            }, {
                "index": "DestinationAddress",
                "name": "destination-address",
                "label": "Destination Address",
                "collapseContent":{
                    "moreTooltip": configurationCallback.setTooltipData
                },
                "dragNDrop":{
                    "isDraggable": true,
                    "isDroppable": true
                },
                "width": 260,
                "createdDefaultValue":"any",
                "searchCell":{
                    "type": "number"
                }
            }, {
                "name": "date",
                "label": "Date",
                "width": 200,
                "searchCell":{
                    "type": "date"
                }
            }, {
                "index": "application",
                "name": "application",
                "label": "Application",
                "width": 260,
                "collapseContent":true,
                "createdDefaultValue":"any",
                "header-help": {
                    "content": configurationCallback.getApplicationHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
            }, {
                "index": "application-services",
                "name": "application-services",
                "label": "Advanced Security",
                "width": 300,
                "collapseContent":{
                    "keyValueCell": true, //if false or absent, defaults to an array
                    "lookupKeyLabelTable": configurationData.keyLabelTable,
                    "formatData": configurationCallback.formatObjectData
                },
                "header-help": {
                    "content": configurationCallback.getServicesHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                },
                "searchCell": {
                    "searchoptions": {
                        dataInit: function (element) {
                            new DropDownWidget({
                                "container": element,
                                "data": configurationData.applicationDropDownData,
                                "enableSearch": true,
                                "multipleSelection": true
                            }).build();
                        }
                    }
                }
            }, {
                "index": "action",
                "name": "action",
                "label": "Action",
                "width": 200,
                "editCell":{
                    "type": "custom",
                    "element": configurationCallback.getCustomDropdownElement,
                    "value": configurationCallback.getCustomDropdownValue
                }
//            }, {
//                "index": "action",
//                "name": "action",
//                "label": "Action",
//                "width": 200,
//                "editCell":{
//                    "type": "dropdown",
//                    "values":[{
//                        "label": "Permit",
//                        "value": "permit"
//                    },{
//                        "label": "Deny",
//                        "value": "deny"
//                    }]
//                }
            }]
    };

    return configurationSample;

});
