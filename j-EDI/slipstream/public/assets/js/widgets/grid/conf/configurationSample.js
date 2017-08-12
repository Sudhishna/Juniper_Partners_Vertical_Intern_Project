/**
 * A sample configuration object that shows the parameters required to build a Grid widget
 * Holds the configuration to build the list of current devices with details
 * Search "smallGrid" to find this configuration
 *
 * @module configurationSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'widgets/dropDown/dropDownWidget',
    'widgets/grid/conf/searchConfiguration'
], function (DropDownWidget, searchConfiguration) {

    var showSubtitle = function (cellvalue, options, rowObject){
        var rowSubtitle = cellvalue;
        if (cellvalue){
            rowSubtitle = cellvalue.split(",");
            if (rowSubtitle[0]&&rowSubtitle[1]){
                rowSubtitle = "Zone: " + rowSubtitle[0] + " to " + rowSubtitle[1];
            }
        }
        return rowSubtitle;
    };

    var createLink = function (cellvalue, options, rowObject){
//        return '<a class="cellLink tooltip" data-cell="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</a>';
        return '<a class="cellLink" data-tooltip="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</a>';
    };

    var createInlineLink = function (cellvalue, options, rowObject){
        return '<a class="cellLink tooltip" data-cell="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</a>';
    };

    var undoLink = function (cellvalue, options, rowObject){
        return cellvalue;
    };

    var buildSubgridUrl = function (rowObject){
        //dynamic url example for ngSRX
//        var url = configurationSample.nestedGrid.url;
//        url += url.slice(-1)!="/"? "/" : "";
//        url += rowObject['from-zone-name']+ "," + rowObject['to-zone-name'];
        var url = "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOnePage.json";
        return url;
    };

    var buildRemoteValidationUrl = function (cellvalue, ele){
        console.log($(ele).data('originalRow'));
        var url = "/api/security-policy/global/policy/";
        url += cellvalue;
        return url;
    };

    var processResponse = function (status, responseText){ //isUnique?
        var isValid = false;
        if(status === 404)
            isValid = true;
        return isValid;
    };

    var getDefaultCopiedValue = function (cellvalue){
        return cellvalue + '_1';
    };

    var getDefaultAddedValue = function (cellvalue){
        return cellvalue;
    };

    var getFilterHelp = function () {//sample data for testing purposes
        var filterHelp = "Select the <b>Basic</b> filter to display all columns on the page. <br/>" +
                         "Select the <b>Advanced</b> filter to display only the relevant columns on the page.";
        return filterHelp;
    };

    var getNameHelp = function () {//sample data for testing purposes
        var filterHelp = "Specify name to be used as match criteria for the policy.";
        return filterHelp;
    };

    var getApplicationHelp = function () {//sample data for testing purposes
        var filterHelp = "Specify port-based applications to be used as match criteria for the policy.";
        return filterHelp;
    };

    var getServicesHelp = function () {//sample data for testing purposes
        var filterHelp = "Specify port-based services or service sets to be used as match criteria for the policy.";
        return filterHelp;
    };

    var keyLabelTable = {
        "utm-policy": "UTM",
        "idp": "IDP",
        "application-firewall": "AppFW",
        "application-traffic-control": "AppTC"
    };

    var configurationSample = {};

    configurationSample.nestedGrid = {
        "footer" : {
            getTotalRows: function() {
                return 390;
            }
        },
        "title": "Zone Policies",
        "title-help": {
            "content": "Tooltip for the title of the Grid Widget",
            "ua-help-identifier": "alias_for_ua_event_binding"
        },
        "filter-help": {
            "content": getFilterHelp,
            "ua-help-text": "More..",
            "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
        },
        "dragNDrop":{
            isRowSortable: true
        },
        "tableId":"testNested",
        "sequenceHeader": "S. No.",
        "height": "auto",
        "url": "/assets/js/widgets/grid/tests/dataSample/zonePoliciesManyPages.json",
//        "url": "/api/security-policy/",
//        "numberOfRows": "20",
        "multiselect": "true",
        "filter": "true",
//        "jsonRoot": "policy",
        "validationTime": "500",
//        "scroll":"true",
        "contextMenu": {
            "edit": "Edit Rule",
            "enable":"Enable Rule",
            "disable":"Disable Rule",
            "createBefore": "Create Rule Before",
            "createAfter": "Create Rule After",
            "copy": "Copy Rule",
            "pasteBefore": "Paste Rule Before",
            "pasteAfter": "Paste Rule After",
            "delete": "Delete Rule",
            "custom":[{ //user should bind custom key events
                    "label":"Reset Hit Count",
                    "key":"resetHitEvent"
                },{
                    "label":"Toggle selected row",
                    "key":"toggleSelectedRow"
                }]
        },
        "confirmationDialog": {
            "delete": {
                title: 'Warning',
                question: 'Deleting these rules could negatively effect your network. Are you sure you wish to delete these rules?'
            },
            "save": {
                title: 'Save Changes',
                question: 'You made changes that have not been saved. What would you like to do with your changes?'
            }
        },
        "editRow": {
           "showInline": true
        },
        "subGrid": {
            "url": buildSubgridUrl,
            "ajaxOptions": {
                headers: {
//                    "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                    "Accept": 'application/vnd.net.juniper.space.job-management.jobs+json;version="3";q=0.03'
                }
            },
            "numberOfRows":10,
            "height": "303",
            "jsonRoot": "policy",
            "scroll":"true",
            "showRowNumbers":true,
            "jsonRecords": function(data) {
                if (data.policy.length>0)
                    return data.policy[0]['junos:total'];
                return 0;
            }
        },
        "columns": [
            {
                "index": "context",
                "name": "context",
                "label": "Name",
                "width": 300,
                "formatter":showSubtitle,
                "groupBy":"true",
                "header-help": {
                    "content": getNameHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
            }, {
                "index": "inactive",
                "name": "inactive",
                "label": "Inactive",
                "hidden": true,
                "showInactive":"true"
            }, {
                "name": "name",
                "label": "Name",
                "width": 300,
                "hideHeader": "true",
                "copiedDefaultValue":getDefaultCopiedValue,
                "editCell":{
                    "type": "input",
                    "remote": {
                        "url": buildRemoteValidationUrl, //should return url string
                        "type": "GET",
                        "response": processResponse, //should return boolean: true: isValid
                        "error":"Name already in use"
                    },
                    "pattern": "hasnotspace",
                    "error":"Spaces are not allowed"
                }
            }, {
                "index": "sourceZone",
                "name": "from-zone-name",
                "label": "Source Zone",
                "createdDefaultValue":getDefaultAddedValue,
                "width": 200,
                "editCell":{
                    "type": "input",
                    "pattern": "hasnotspace",
                    "error":"Spaces are not allowed"
                }
            }, {
                "index": "sourceAddress",
                "name": "source-address",
                "label": "Source Address",
                "width": 260,
                "collapseContent":true,
                "createdDefaultValue":"any"
            }, {
                "index": "application-services",
                "name": "application-services",
                "label": "Advanced Security",
                "width": 260,
                "collapseContent":{
                    "keyValueCell": true, //if false or absent, defaults to an array
                    "lookupKeyLabelTable":keyLabelTable
                },
                "header-help": {
                    "content": getServicesHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
            }, {
                "index": "destinationZone",
                "name": "to-zone-name",
                "label": "Destination Zone",
                "createdDefaultValue":getDefaultAddedValue,
                "width": 200
            }, {
                "index": "DestinationAddress",
                "name": "destination-address",
                "label": "Destination Address",
                "width": 260,
                "collapseContent":true,
                "createdDefaultValue":"any"
            }, {
                "index": "application",
                "name": "application",
                "label": "Application",
                "width": 260,
                "collapseContent":true,
                "createdDefaultValue":"any",
                "header-help": {
                    "content": getApplicationHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
            }, {
                "index": "action",
                "name": "action",
                "label": "Action",
                "formatter": function (cellvalue){
                    return cellvalue;
                },
                "width": 200,
                "editCell":{
                    "type": "dropdown",
                    "values":[{
                        "label": "Permit",
                        "value": "permit"
                    },{
                        "label": "Deny",
                        "value": "deny"
                    }]
                }
            }]
    };

    var buildNameVerificationUrl = function (cellvalue){
        var url = "/api/data-sample/client/";
        url += cellvalue;
        return url;
    };

    // var getData = function (postdata){
    //     var self = this;
    //     $.ajax({
    //         url: '/api/get-data',
    //         data: postdata,
    //         dataType:"json",
    //         complete: function(data,status){
    //             var data = data.responseJSON['policy-Level1']['policy-Level2']['policy-Level3'];
    //             $(self).addRowData('',data);
    //         }
    //     });
    // };

    var getData = function (){
    //   console.log("called getData")
    //   var self = this;
    //   var minionData = {};
    //     $.ajax({
    //         url: '/assets/js/widgets/grid/tests/dataSample/simpleGrid.json',
    //         //data: postdata,
    //         dataType:"json",
    //         complete: function(data,status){
    //             minionData = data.responseJSON["minions"];
    //             //console.log(minionData)
    //             // for (var i=0; i<minionData.length; i++){
    //             //   var device = (minionData[i]["device"]);
    //              var dataFormat = {"device":"EX2200","ip":"100.23.42.1","version":"1.0","up/down":"up"}
    //              this.grid.addRow(dataFormat)
    //             // }
    //         }
    //     });
    //     //console.log(minionData)
     }

    var buildSearchUrl = function (value, url){
        return url + "?searchKey=" + value + "&searchAll=true";
    };

    var formatData = function (cellvalue, options, rowObject) {
        if (cellvalue && cellvalue.length === 2){
            return ['0.0.0.0','1.2.3.4','4,5,6,7'];
        }
        return cellvalue;
    };

    var formatObjectData = function (cellvalue, options, rowObject) {
//        console.log(rowObject);
        return cellvalue;
    };

    //sets the status of the action menu items asynchronously by using the updateStatusSuccess callback
        var setCustomActionStatus = function (selectedRows, updateStatusSuccess, updateStatusError) {
        console.log(selectedRows);
        $.ajax({
            type: 'GET',
            url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
            success: function(data) {
                updateStatusSuccess({
                    "edit": selectedRows.isRowEnabled ? true : false,
                    "testCloseGrid": selectedRows.numberOfSelectedRows > 1 ? true : false,
                    "testPublishGrid": selectedRows.numberOfSelectedRows == 1 ? true : false,
                    "testSaveGrid": selectedRows.numberOfSelectedRows > 0 ? true : false,
                    "subMenu": selectedRows.numberOfSelectedRows == 1 ? true : false
                });
            },
            error: function() {
                updateStatusError("Update in the action status FAILED. Selected rows: " + selectedRows.numberOfSelectedRows);
            }
        });
    };

    //sets the status of the items in the context menu and more menu asynchronously by using the updateStatusSuccess callback
    var setContextMenuStatus = function (selectedRows, updateStatusSuccess, updateStatusError) {
        var isRowEditable = !(~selectedRows.selectedRowIds.indexOf('183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent'));
        $.ajax({
            type: 'GET',
            url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
            success: function(data) {
                    updateStatusSuccess({
                    "edit": selectedRows.numberOfSelectedRows == 1 && selectedRows.isRowEnabled && isRowEditable ? true : false,
                    "copy": selectedRows.numberOfSelectedRows > 2 ? true : false,
                    "disableHitEvent": selectedRows.numberOfSelectedRows > 1 ? true : false,
                    "subMenus": selectedRows.numberOfSelectedRows > 0 ? true : false,
                    "subMenu3": selectedRows.numberOfSelectedRows > 3 ? true : false
                });
            },
            error: function() {
                updateStatusError("Update in the status of the context menu items FAILED. Selected rows: " + selectedRows.numberOfSelectedRows);
            }
        });
    };

    var setItemStatus = function (key, isItemDisabled, selectedRows){
        if (key=='resetHitEvent') isItemDisabled = true;
        else if (key=='disableHitEvent' && selectedRows.length>0) isItemDisabled = false;
        if (key=='subMenu3') isItemDisabled = true;
        return isItemDisabled;
    };

    var setCustomMenuStatusAdd = function (key, isItemDisabled, selectedRows) {
        if (key=='createMenu2') isItemDisabled = true;
        return isItemDisabled;
    };

    var setCustomMenuStatusSplit = function (key, isItemDisabled, selectedRows) {
        return isItemDisabled;
    };

    var setShowHideColumnSelection = function (columnSelection){
        columnSelection['from-zone-name'] = false; //hides the from-zone-name column by default
        columnSelection['to-zone-name'] = false; //hides the from-zone-name column by default
        return columnSelection;
    };

    var updateShowHideColumnSelection = function (columnSelection){
        console.log(columnSelection);
    };

    var setCustomTextAreaElement = function(cellvalue, options){
        var $textarea = $("<textarea>");
        $textarea.val(cellvalue);
        return $textarea[0];
    };

    var getCustomTextAreaValue = function(elem, operation){
        return $(elem).val();
    };

    var actionCustomDropdown;

    var getCustomDropdownElement = function(cellvalue, options, rowObject){
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
    };

    var getCustomDropdownValue = function(element, operation){
        return actionCustomDropdown.getValue();
    };

    var applicationDropDownData = [{
            "id": "ike",
            "text": "IKE"
        },{
            "id": "ftp",
            "text": "FTP"
        },{
            "id": "tcp",
            "text": "TCP"
        }];


    var isRowEditable = function (rowId){
        var rows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent'];
        if (rows.indexOf(rowId)!=-1)
            return false;
        return true;
    };

    var setTooltipData = function (rowData, rawData, setTooltipDataCallback){
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
    };

    var dropCallback = function(data, dropColumn, draggableRow, droppableRow){
        console.log('after dropped the items but before saving the data');
        console.log(data);
        console.log(dropColumn);
        console.log(draggableRow);
        console.log(droppableRow);
        return {isValid: true};
        // return {isValid: false, errorMessage: 'The item is duplicated.'};
    };

    var formatCollapseCell = function ($cell, cellvalue, options, rowObject){
        $($cell[1]).find('.cellContentWrapper .cellContentValue').attr('title',rowObject.name).addClass('tooltip');
        return $cell;
    };

    var unformatCollapseCell = function (originalContent, cellvalue, options, rowObject){
        return originalContent;
    };

    var formatObjectCell = function ($cell, cellvalue, options, rowObject){
//        $($cell[1]).find('.cellContentWrapper .cellContentBlock').attr('title',rowObject.name).addClass('tooltip');
        return $cell;
    };

    var unformatObjectCell = function (originalContent, cellvalue, options, rowObject){
        return originalContent;
    };

    var reformatUrl = function (originalUrl) {
        console.log(originalUrl);
        if (originalUrl.sord){
            var sord = originalUrl.sord;
            delete originalUrl.sord;
            originalUrl.sOrd = sord;
        }
        originalUrl.test = "123";
        return originalUrl;
    };

    var deleteRowMessage = function (selectedRows) {
        return "Are you sure you want to delete " + selectedRows.numberOfSelectedRows + " rule(s) for the Firewall Policies grid?";
    };

    //performs the row deletion by an asynchronous calls. In case of success, the success callback should be invoked and in case of failure, the error callback should be used.
    var deleteRow = function (selectedRows, success, error) {
        $.ajax({
            type: 'GET',
            url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
            success: function(data) {
                success();
            },
            error: function() {
                error("Row deletion FAILED. " + selectedRows.numberOfSelectedRows + "were not deleted");
            }
        });
    };

    var getRowIds = function (setIdsSuccess, setIdsError, tokens, parameters) {
//        console.log(tokens);
        console.log(parameters);

        var pspRows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante'];
        if (tokens && ~tokens.indexOf("PSP")){
            setIdsSuccess(pspRows);
        } else {
            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/grid/tests/dataSample/allSDServicesIds.json',
                success: function(data) {
                    setIdsSuccess(data);
                },
                error: function() {
                    setIdsError("Getting all row ids in the grid FAILED.");
                }
            });
        }
    };

    var onBeforeSearch = function (tokens){
        var newTokens = [],
            quickFilterParam = "quickFilter = ",
            quickFilerParamLength = quickFilterParam.length;

        tokens.forEach(function(token){
            if (~token.indexOf(quickFilterParam)) {
                var value = token.substring(quickFilerParamLength);
                switch (value) {
                    case 'juniper':
                        token = "jun eq '2'";
                        break;
                    case "nonJuniper":
                        token = "(jun = 3 or jun eq 5)";
                        break;
                    default:
                        token = "jun eq 'all'"
                }
            }
            newTokens.push(token);
        });
        console.log(newTokens);
        return newTokens;
    };

    configurationSample.simpleGrid = {
        "title": "Firewall Policies",
        "title-help": {
            "content": "Tooltip for the title of the Grid Widget<br/>1. Keyword 'NoData' in search will show the use case when API response not available<br/>2. Keyword 'PSP' in search will show filtered data.<br/>Additional information available on the <b>link</b> below",
            "ua-help-text": "More..",
            "ua-help-identifier": "alias_for_ua_event_binding"
        },
        "refresh": {
            tooltipText: "Click Me!"
        },
//        "tableId":"test1",
//        "urlMethod": "POST", //default: "GET"
        "url": "/api/get-data", //option 1 to be used with jsonRoot
//        "reformatUrl": reformatUrl,
        "jsonRoot": "policy-Level1.policy-Level2.policy-Level3",
//        "url": "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOnePage.json",
//        "jsonRoot": "policy",
//        "getData": getData, //option 2
        "jsonId": "name",
//        "showRowNumbers": true,
        "multiselect": true,
        "height": 'auto', //could be auto
        "scroll": true,
        "numberOfRows":40,
        "jsonRecords": function(data) {
            return data && data['policy-Level1'] && data['policy-Level1']['policy-Level2']['policy-Level3'][0]['junos:total'];
//            return data['policy'][0]['junos:total'];
        },
        //noResultMessage:"No data available",
        noResultMessage: function () {
            return "No data available";
        },
//        "createRow": {
////           "addLast":true,
//            "showInline": true
//        },
//        "editRow": {
//            "showInline": true,
//            "isRowEditable": isRowEditable
//        },
        "deleteRow": {
//            "onDelete": deleteRow,
//            "autoRefresh": true,
            "message": deleteRowMessage
        },
        "onSelectAll": getRowIds,
        "actionButtons":{
//            "defaultButtons":{ //overwrite default CRUD grid buttons
//                "create": {
//                    "label": "Create",
//                    "key": "createMenu",
//                    "items": [{
//                        "label":"Open grid overlay",
//                        "key":"createMenu1"
//                    },{
//                        "label":"Create Menu2",
//                        "key":"createMenu2"
//                    }],
//                    "statusCallback": setCustomMenuStatusAdd
//                }
////                "delete": {
////                    "label": "Delete",
////                    "key": "editMenu",
////                    "items": [{
////                        "label":"Open grid overlay",
////                        "key":"createMenu1"
////                    },{
////                        "label":"Create Menu2",
////                        "key":"createMenu2"
////                    }],
////                    "disabledStatus": true, //default status
////                    "statusCallback": setCustomMenuStatusAdd
////                }
//        },
           "customButtons":
                [{
                    "icon_type": true,
                    "label": "Close",
                    // "icon": "icon_exit_filters_hover",
                    "icon": {
                        default: "icon_archive_purge",
                        hover: "icon_archive_purge_hover",
                        disabled: "icon_exit_filters_disable"
                    },
                    "disabledStatus": true, //default status
                    "key": "testCloseGrid"
                },{
                    "icon_type": true,
                    "label": "Close 1",
                    "icon": {
                        default: "icon_archive_purge",
                        hover: "icon_archive_purge_hover",
                        disabled: "icon_exit_filters_disable"
                    },
                    "disabledStatus": true,//default status
                    "key": "testCloseGrid1"
                },{
                    "button_type": true,
                    "label": "Publish",
                    "key": "testPublishGrid",
                    "disabledStatus": true //default status
                },{
                    "button_type": true,
                    "label": "Save",
                    "key": "testSaveGrid",
                    "secondary": true,
                    "disabledStatus": true //default status
                },{

                    "menu_type": true,
                    "label":"Split Action",
                    "key":"subMenu",
                    "disabledStatus": true, //default status
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
                    "statusCallback": setCustomMenuStatusSplit
                }],
           "actionStatusCallback": setCustomActionStatus
        },
        "contextMenu": {
            "enable":"Enable Rule",
            "disable":"Disable Rule",
//            "createBefore": "Create Row Before",
//            "createAfter": "Create Row After",
            "edit": "Edit Row",
            "copy": "Copy Row",
            "pasteBefore": "Paste Row Before",
            "pasteAfter": "Paste Row After",
            "delete": "Delete Row",
            "quickView": "Detailed View",
            "clearAll": "Clear All",
            "custom":[{ //user should bind custom key events
                "label":"Reset Hit Count",
                "key":"resetHitEvent" //isDisabled property available to set status of individual items by a callback
            },{
                "label":"Disable Hit Count",
                "key":"disableHitEvent"
            },{
                "label":"Update Action Status",
                "key":"updateActionStatusEvent"
            },{
                "label":"Select a row",
                "key":"selectRowEvent"
            },{
                "label":"Get all selected rows",
                "key":"getSelectedRowsEvent"
            },{
                "label":"Reload Grid",
                "key":"reloadGrid"
            },{
                "label":"Reset selection and reload grid",
                "key":"resetReloadGrid"
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
//        "contextMenuItemStatus": setItemStatus,
        "contextMenuStatusCallback": setContextMenuStatus,
        "filter": {
            searchUrl: true,
//            searchUrl: function (value, url){  //overwrites default search
//                return url + "?searchKey=" + value + "&searchAll=true";
//            },
            onBeforeSearch: onBeforeSearch,
//            advancedSearch: {
//                "filterMenu": searchConfiguration.filterMenu,
//                "logicMenu": searchConfiguration.logicMenu
//                },
            noSearchResultMessage : "There are no search results found",
            columnFilter: true,
            showFilter: {
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
                    "setColumnSelection": setShowHideColumnSelection, //true for all selected
                    "updateColumnSelection": updateShowHideColumnSelection
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
                "statusCallback": setCustomMenuStatusSplit
            }
        },
//        "sorting": false,
        "sorting": [{
            "column":"name",
            "order": "asc" //asc,desc
        },{
            "column":"sourceAddress",
            "order": "desc" //asc,desc
        }],
        "dragNDrop":{
            source: 'cell',
            destination: 'cell',
            afterDrop: dropCallback,
            connectWith: 'test2',
            isRowSortable: true
        },
        "columns": [
            {
//                "index": "Name",
                "name": "name",
                "label": "Name",
                "width": "400",
                "formatter":createLink,
                "unformat":undoLink,
                "copiedDefaultValue":getDefaultCopiedValue,
                "editCell":{
                    "type": "input",
                    "post_validation": "postValidation",
                    "pattern": "^[a-zA-Z0-9_\-]+$",
                    "error": "Enter alphanumeric characters, dashes or underscores"
                },
                "searchCell": true,
                "contextMenu": {
                    "copyCell": "Copy Cell",
                    "pasteCell": "Paste Cell",
                    "searchCell": "Search Cell",
                    "custom":[{ //user should bind custom key events
                        "label":"Cell Menu 11",
                        "key":"cellMenu11"
                    },{
                        "label":"Cell Menu 12",
                        "key":"cellMenu12"
                    },{
                        "label":"Cell Sub Menu",
                        "key":"cellSubMenu1",
                        "items": [{
                            "label":"Cell Sub Menu 11",
                            "key":"cellSubMenu11"
                        },{
                            "label":"Cell Sub Menu 12",
                            "key":"cellSubMenu12"
                        }]
                    }]
                }
            }, {
                "index": "inactive",
                "name": "inactive",
                "label": "Inactive",
                "hidden": true,
                "showInactive":true
            }, {
                "index": "sourceZone",
                "name": "from-zone-name",
                "label": "Source Zone",
                "createdDefaultValue":'untrust-inet',
                "width": "100",
                "hidden": true,
                "editCell":{
                    "type": "custom",
                    "element":setCustomTextAreaElement,
                    "value":getCustomTextAreaValue
                }
            }, {
                "index": "sourceAddress",
                "name": "source-address",
                "label": "Source Address",
                "width": "200",
                "collapseContent":{
//                    "formatData": formatData,
                    "formatCell": formatCollapseCell,
                    "unformatCell": unformatCollapseCell
                },
                "createdDefaultValue":"any",
                "dragNDrop":{
                    "isDraggable": true,
                    "isDroppable": true
                },
                "searchCell": {
                    "type": 'dropdown',
                    "values":[{
                        "label": "IP_CONV_204.17.79.60",
                        "value": "1"
                    },{
                        "label": "IP_SEC_204.17.79.60 and IP_SEC_204.17.79.61",
                        "value": "close or client and server"
                    },{
                        "label": "IP_TRE_204.17.79.60",
                        "value": "3"
                    },{
                        "label": "IP_TRE_96.254.162.106",
                        "value": "4"
                    }]
                },
                "contextMenu": {
                    "copyCell": "Copy Cell",
                    "pasteCell": "Paste Cell",
                    "searchCell": "Search Cell",
                    "custom":[{ //user should bind custom key events
                        "label":"Cell Menu 21",
                        "key":"cellMenu21"
                    },{
                        "label":"Cell Menu 22",
                        "key":"cellMenu22"
                    },{
                        "label":"Cell Sub Menu",
                        "key":"cellSubMenu2",
                        "items": [{
                            "label":"Cell Sub Menu 21",
                            "key":"cellSubMenu21"
                        },{
                            "label":"Cell Sub Menu 22",
                            "key":"cellSubMenu22"
                        }]
                    }]
                }
            }, {
                "index": "destinationZone",
                "name": "to-zone-name",
                "label": "Destination Zone",
                "createdDefaultValue":'untrust-inet',
                "width": "100",
                "editCell":{
                    "type": "input",
                    "pattern": "length",
                    "min_length":"2",
                    "max_length":"10",
                    "error": "Must be between 2 and 10 characters."
                }
//                "editCell":{
//                    "type": "input",
//                    "pattern": "hasnotspace",
//                    "error":"Spaces are not allowed"
//                }
            }, {
                "index": "DestinationAddress",
                "name": "destination-address",
                "label": "Destination Address",
                "collapseContent":{
                    "moreTooltip": setTooltipData
                },
                "dragNDrop":{
                    "isDraggable": true,
                    "isDroppable": true
                },
                "width": "100",
                "createdDefaultValue":"any",
                "searchCell":{
                    "type": "number"
                },
                "header-help": {
                    "content": getApplicationHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
            }, {
                "index": "Date",
                "name": "date",
                "label": "Date",
                "width": "100",
                "searchCell":{
                    "type": "date"
                },
                "contextMenu": {
                    "copyCell": "Copy Cell",
                    "pasteCell": "Paste Row Before",
                    "searchCell": "Search Cell"
                },
                "sortable": false
            }, {
                "index": "application",
                "name": "application",
                "label": "Application Application",
                "width": "100",
                "collapseContent":true,
                "createdDefaultValue":"any"
//                "header-help": {
//                    "content": getApplicationHelp,
//                    "ua-help-text": "More..",
//                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
//                }
            }, {
                "index": "application-services",
                "name": "application-services",
                "label": "Advanced Security",
                "width": "260",
                "collapseContent":{
                    "keyValueCell": true, //if false or absent, defaults to an array
                    "lookupKeyLabelTable":keyLabelTable
//                    "formatData": formatObjectData,
//                    "formatObjectCell": formatObjectCell,
//                    "unformatObjectCell": unformatObjectCell
                },
//                "header-help": {
//                    "content": getServicesHelp,
//                    "ua-help-text": "More..",
//                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
//                },
                "searchCell": true
//                "searchCell": {
//                    "searchoptions": {
//                        dataInit: function (element) {
//                            new DropDownWidget({
//                                "container": element,
//                                "data": applicationDropDownData,
//                                "enableSearch": true,
//                                "multipleSelection": true
//                            }).build();
//                        }
//                    }
//                }
            }, {
//                "index": "action",
//                "name": "action",
//                "label": "Action",
//                "width": "100",
//                "editCell":{
//                    "type": "custom",
//                    "element":getCustomDropdownElement,
//                    "value":getCustomDropdownValue
//                }
//            }, {
                "index": "action",
                "name": "action",
                "label": "Action",
                "width": 100,
                "editCell":{
                    "type": "dropdown",
                    "values":[{
                        "label": "Permit",
                        "value": "permit"
                    },{
                        "label": "Deny",
                        "value": "deny"
                    }]
                }
            },{
                "index": "description",
                "name": "description",
                "label": "Description",
                "width": 140,
                "sortable": false,
                "collapseContent": {
                    "singleValue" : true
                },
                "searchCell": true
            }
        ]
    };

    configurationSample.dragNDropGrid1 = {
        "title": "Firewall Policies",
        "title-help": {
            "content": "Tooltip for the title of the Grid Widget<br/>1. Keyword 'NoData' in search will show the use case when API response not available<br/>2. Keyword 'PSP' in search will show filtered data.<br/>Additional information available on the <b>link</b> below",
            "ua-help-text": "More..",
            "ua-help-identifier": "alias_for_ua_event_binding"
        },
        "url": "/api/get-data", //option 1 to be used with jsonRoot
        "jsonRoot": "policy-Level1.policy-Level2.policy-Level3",
        "height": '300px',//could be auto
        "multiselect": true,
        "scroll": true,
        "jsonRecords": function(data) {
            return data['policy-Level1']['policy-Level2']['policy-Level3'][0]['junos:total'];
//            return data['policy'][0]['junos:total'];
        },
        "dragNDrop":{
            source: 'cell',
            destination: 'cell',
            afterDrop: dropCallback,
            connectWith: 'test2',
            isRowSortable: true
        },
        "numberOfRows":10,
        "multiselect":true,
        "jsonId": "name",
        "tableId":"test1",
        "columns": [
            {
                "name": "name",
                "label": "Name",
                "width": 300,
                "formatter":createLink,
                "unformat":undoLink,
                "copiedDefaultValue":getDefaultCopiedValue,
                "editCell":{
                    "type": "input",
                    "pattern": "hasnotspace",
                    "error":"Spaces are not allowed"
                },
                "dragNDrop":{
                    isDraggableHelperData: true
                }
            }, {
                "index": "sourceAddress",
                "name": "source-address",
                "label": "Source Address",
                "width": 260,
                "collapseContent":true,
                "createdDefaultValue":"any",
                "dragNDrop":{
                    "isDraggable": true,
                    "isDroppable": true
                }
            }, {
                "index": "DestinationAddress",
                "name": "destination-address",
                "label": "Destination Address",
                "collapseContent":true,
                "width": 260,
                "createdDefaultValue":"any",
                "dragNDrop":{
                    "isDraggable": true,
                    "isDroppable": true
                }
            }, {
                "index": "date",
                "name": "date",
                "label": "Date",
                "width": 200,
                "searchCell":{
                    "type": "date"
                }
            }]
    };

    configurationSample.dragNDropGrid2 = {
        "title": "Addresses",
        "url": "/api/get-data", //option 1 to be used with jsonRoot
        "jsonRoot": "policy-Level1.policy-Level2.policy-Level3",
//        "url": "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOnePage.json",
//        "jsonRoot": "policy",
//        "getData": getData, //option 2
        "height": '300px',//could be auto
        "multiselect": true,
        "scroll": true,
        "jsonRecords": function(data) {
            return data['policy-Level1']['policy-Level2']['policy-Level3'][0]['junos:total'];
//            return data['policy'][0]['junos:total'];
        },
        "dragNDrop":{
            source: 'row',
            destination: 'cell',
            connectWith: 'test1',
            afterDrop: dropCallback
        },
        "numberOfRows":10,
        "multiselect":true,
        "jsonId": "name",
        "tableId":"test2",
        "columns": [
            {
                "name": "name",
                "label": "Name",
                "width": 300,
                "formatter":createLink,
                "unformat":undoLink,
                "copiedDefaultValue":getDefaultCopiedValue,
                "editCell":{
                    "type": "input",
                    "pattern": "hasnotspace",
                    "error":"Spaces are not allowed"
                },
                "dragNDrop":{
                    isDraggableHelperData: true
                }
            }, {
                "index": "sourceAddress",
                "name": "source-address",
                "label": "Source Address",
                "width": 260,
                "collapseContent":true,
                "createdDefaultValue":"any"
            }, {
                "index": "DestinationAddress",
                "name": "destination-address",
                "label": "Destination Address",
                "collapseContent":true,
                "width": 260,
                "createdDefaultValue":"any"
            }, {
                "index": "date",
                "name": "date",
                "label": "Date",
                "width": 200,
                "searchCell":{
                    "type": "date"
                }
            }]
    };

    var formatDescriptionCell= function (cellValue, options, row) {
        return cellValue || "-";
    };

    var formatObject = function (cell, cellValue, options, rowObject) {
        return cell || "-";
    };

    configurationSample.modelViewGrid = {
        "footer": {
            getTotalRows: function() {
                return 0;
            }
        },
        "title": "Firewall Policies with a Backbone Collection",
        "height": 'auto',
        "multiselect": true,
        "scroll": true,
        "jsonRecords": function(data) {
            return (data && data[0] && data[0]['junos:total']) || 0;
        },
        "jsonId": "name",
        "numberOfRows":12,
        "createRow": {
           "addLast":true,
           "showInline": true
        },
        "editRow": {
           "showInline": true
        },
        "rowMaxElement": {
            "collapse": 2,
            "expand": 3,
            "edit": 3 //applies only for inline editing
        },
        "onSelectAll": false,
        "actionButtons":{
//            "defaultButtons":{ //overwrite default CRUD grid buttons
//                "create": {
//                    "label": "Create",
//                    "key": "createMenu",
//                    "items": [{
//                        "label":"Open grid overlay",
//                        "key":"createMenu1"
//                    },{
//                        "label":"Create Menu2",
//                        "key":"createMenu2"
//                    }],
//                    "statusCallback": setCustomMenuStatusAdd
//                }
//        },
            "customButtons":
                [{
                    "icon_type": true,
                    "label": "Close",
                    // "icon": "icon_exit_filters_hover",
                    "icon": {
                        default: "icon_archive_purge",
                        hover: "icon_archive_purge_hover",
                        disabled: "icon_exit_filters_disable"
                    },
//                    "disabledStatus": true, //default status
                    "key": "testCloseGrid"
                },{
                    "button_type": true,
                    "label": "Publish",
                    "key": "testPublishGrid",
                    "disabledStatus": true //default status
                },{
                    "button_type": true,
                    "label": "Save",
                    "key": "testSaveGrid",
                    "secondary": true,
                    "disabledStatus": true //default status
                }]
//            "actionStatusCallback": setCustomActionStatus
        },
        "contextMenu": {
            "edit": "Edit Row",
            "enable":"Enable Rule",
            "disable":"Disable Rule",
            "createBefore": "Create Row Before",
            "createAfter": "Create Row After",
            "copy": "Copy Row",
            "pasteBefore": "Paste Row Before",
            "pasteAfter": "Paste Row After",
            "delete": "Delete Row",
            "custom":[{ //user should bind custom key events
                "label":"Edit Programmatically",
                "key":"addEditProgrammatically"
            },{
                "label":"Remove Edit Programmatically",
                "key":"removeEditProgrammatically"
            },{
                "label":"Reload Data",
                "key":"reloadData"
            },{
                "label":"Update Action Status Off",
                "key":"updateActionStatusOff"
            },{
                "label":"Update Action Status On",
                "key":"updateActionStatusOn"
            },{
                "label":"Toggle Selection",
                "key":"toggleRowSelection"
            }]
        },
        "contextMenuItemStatus": setItemStatus,
        "filter": {
//            advancedSearch: {
//                "filterMenu": searchConfiguration.filterMenu,
//                "logicMenu": searchConfiguration.logicMenu
//            },
            columnFilter: true,
            showFilter: {
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
                    "setColumnSelection": setShowHideColumnSelection, //true for all selected
                    "updateColumnSelection": updateShowHideColumnSelection
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
                "itemStatusCallback": setCustomMenuStatusSplit
            }
        },
        "showWidthAsPercentage": false,
        "columns": [
            {
                "name": "name",
                "label": "Name",
                "width": 300,
                "hideHeader": "true",
                "formatter":createInlineLink,
                "unformat":undoLink,
                "copiedDefaultValue":getDefaultCopiedValue,
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
                "width": 200
            }, {
                "index": "sourceAddress",
                "name": "source-address",
                "label": "Source Address",
                "width": 260,
                "collapseContent":true,
                "createdDefaultValue":"any",
                "searchCell": {
                    "type": 'dropdown',
                    "values":[{
                        "label": "IP_CONV_204.17.79.60",
                        "value": "1"
                    },{
                        "label": "IP_SEC_204.17.79.60",
                        "value": "2"
                    },{
                        "label": "IP_TRE_204.17.79.60",
                        "value": "3"
                    },{
                        "label": "IP_TRE_96.254.162.106",
                        "value": "4"
                    }]
                }
            },{
                "index": "description",
                "name": "description",
                "label": "Description",
                "width": 140,
                "sortable": false,
                "collapseContent": {
                    // "name": "name",
                    "formatData": formatDescriptionCell,
                    "formatCell": formatObject,
                    "overlaySize": "small",
                    "singleValue" : true
                },
                "searchCell": true
            },{
                "index": "destinationZone",
                "name": "to-zone-name",
                "label": "Destination Zone",
                "createdDefaultValue":'untrust-inet',
                "width": 200
            }, {
                "index": "DestinationAddress",
                "name": "destination-address",
                "label": "Destination Address",
                "collapseContent":{
                    "formatData": formatData
                },
                "width": 260,
                "createdDefaultValue":"any",
                "searchCell":{
                    "type": "number"
                }
            }, {
                "index": "Date",
                "name": "date",
                "label": "Date",
                "width": "100",
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
                    "content": getApplicationHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
            }, {
                "index": "application-services",
                "name": "application-services",
                "label": "Advanced Security",
                "width": 360,
                "collapseContent":{
                    "keyValueCell": true, //if false or absent, defaults to an array
                    "lookupKeyLabelTable":keyLabelTable,
                    "formatData": formatObjectData
                },
                "header-help": {
                    "content": getServicesHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
            }, {
                "index": "action",
                "name": "action",
                "label": "Action",
                "width": 100,
                "editCell":{
                    "type": "dropdown",
                    "values":[{
                        "label": "Permit",
                        "value": "permit"
                    },{
                        "label": "Deny",
                        "value": "deny"
                    }]
                }
            }]
    };

    //builds the configuration form outline for the device listing in tab 1
    configurationSample.smallGrid = {
        "title": "Devices",
        "getData": getData(),
        "jsonRoot": "minions",
        //"singleselect": "true",
        "sorting": false,
        "onSelectAll": false,
        "showWidthAsPercentage": false,
        "noResultMessage":"Data is not yet available. Please wait while your devices are fetched.",
        "columns": [{
                "name": "device",
                "label": "Device"
            },{
                "name": "ip",
                "label": "IP"
            },{
                "name": "version",
                "label": "Version"
            },{
                "name": "sno",
                "label": "Serial Number"
            },{
                "name": "status",
                "label": "Status"
            }]
    };

    configurationSample.getDataGrid = {
        "title": "Get Data Grid",
        "getData": function(){},
        "jsonRoot": "policy",
        "multiselect": true,
        "onSelectAll": false,
        "noResultMessage":"Data is not available",
        "columns": [{
            "name": "name",
            "label": "Name"
        },{
            "name": "note",
            "label": "Note"
        },{
            "name": "amount",
            "label": "Amount"
        }]
    };

    configurationSample.getSetGrid = {
        "filter": {
            "optionMenu": {
                "showHideColumnsItem":{
                    "setColumnSelection": setShowHideColumnSelection
                }
            }
        },
        "title": "Get / Set Column Properties",
        "url": "/assets/js/widgets/grid/tests/dataSample/simpleGrid.json",
        "jsonRoot": "policy",
        "singleselect": "true",
        "sorting": false,
        "onSelectAll": false,
        "showWidthAsPercentage": false,
        "noResultMessage":"Data is not available",
        "columns": [{
                "name": "name",
                "label": "Name"
            },{
                "name": "note",
                "label": "Note"
            },{
                "name": "amount",
                "label": "Amount"
            }]
    };

    configurationSample.reloadGrid = {
        "title": "Reload Grid",
        "url": "/api/get-data",
        "numberOfRows": 200,
        "height": "auto",
        //"jsonRoot": "policy",
        "multiselect": "true",
        "showWidthAsPercentage": false,
        "deleteRow": {
            "onDelete": deleteRow,
            "autoRefresh": true
        },
        "columns": [{
                "name": "name",
                "label": "Name"
         }],
         "contextMenu": {
            "delete": "Delete Address",
            "create": "Create Address",
            "custom":[{
                "label":"Reload grid",
                "key":"reloadGrid"
            },{
                "label":"Reset selection and reload grid",
                "key":"resetReloadGrid"
            }]
         }
    };

    configurationSample.sdGrid = {
        "title": "SD Services",
        "url": "/api/juniper/sd/service-management/services", //needs connection to Space Server
        "beforeSendRequest" : function (url) {
//            return url + "&policyId=98503";
            return url;
        },
        "ajaxOptions": {
            headers: {
                "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                "Accept": 'application/vnd.juniper.sd.service-management.services+json;version=1;q=0.01'
            }
        },
        "jsonRoot": "services.service",
        "jsonId": "id",
        "jsonRecords": function(data) {
            return (data && data.services['total']) || 0;
        },
        "numberOfRows": 50,
        "scroll": true,
        "height": 'auto',
        "multiselect": true,
        "showRowNumbers":true,
        "onSelectAll": getRowIds,
        "deleteRow": {
            "onDelete": deleteRow
//            "autoRefresh": true
        },
        "contextMenu": {
            "edit": "Edit Job",
            "delete": "Delete Job",
            "clearAll": "Clear All",
            "custom":[{ //user should bind custom key events
                "label":"Get all visible rows",
                "key":"getAllRowsEvent"
            },{
                "label":"Get all selected rows",
                "key":"getSelectedRowsEvent"
            },{
                "label":"Toggle rows",
                "key":"toggleRowsEvent"
            },{
                "label":"Reload grid",
                "key":"reloadGridEvent"
            },{
                "label":"Reload grid with 20 rows",
                "key":"reloadGridEvent20"
            },{
                "label":"Reset selection and reload grid",
                "key":"resetReloadGrid"
            }]
        },
//        "contextMenuStatusCallback": setContextMenuStatus,
        "filter": {
            searchUrl: true,
            noSearchResultMessage : "There are no search results found"
        },
        "columns": [
            {
                "name": "id",
                "label": "ID",
                "align": "right",
                "width": 75
            },
            {
                "name": "name",
                "label": "Name",
                "width": 100
            },
            {
                "name": "is-group",
                "label": "Is Group"
            },
            {
                "name": "description",
                "label": "description",
                "width": 300

            },
            {
                "name": "domain-name",
                "label": "Domain Name",
                "width": 100
            }
        ]

    };

    configurationSample.groupGrid = {
        "title": "Job Management",
        "url": "/api/space/job-management/jobs", //needs connection to Space Server
        "ajaxOptions": {
            headers: {
                "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                "Accept": 'application/vnd.net.juniper.space.job-management.jobs+json;version="3";q=0.03'
            }
        },
        "jsonRoot": "jobs.job",
        "jsonId": "id",
        "jsonRecords": function(data) {
            return data.jobs['@total'];
        },
        "numberOfRows": 5,
        "scroll": 1,
        "height": 'auto',
        "multiselect": "true",
        "contextMenu": {
            "edit": "Edit Job",
            "custom":[{ //user should bind custom key events
                "label":"Get all visible rows",
                "key":"getAllRowsEvent"
            },{
                "label":"Get all selected rows",
                "key":"getSelectedRowsEvent"
            },{
                "label":"Reload grid",
                "key":"reloadGridEvent"
            }]
        },
        "sorting": [{
                "column":"id",
                "order": "asc" //asc,desc
//            },{
//                "column":"percent-complete",
//                "order":"desc"
        }],
        "grouping":{
            "columns":[{
                  "column":"id",
              "order": "desc", //asc,desc
                "show": true,
                "text": "Id: <b>{0}</b>"
            },{
                "column":"job-status",
                "order": "desc",
                "show": false,
                "text": "Status: <b>{0}</b>"
            }],
            "collapse":false
        },
        "columns": [
            {
                "index": "id",
                "name": "id",
                "label": "ID",
                "width": 75
            },
            {
                "index": "name",
                "name": "name",
                "label": "Name",
                "width": 200
            },
            {
                "index": "percent-complete",
                "name": "percent-complete",
                "label": "Percent",
                "width": 75,
                "editCell":{
                    "type": "input",
                    "pattern": "float",
                    "error":"Should be a number."
                }
            },
            {
                "index": "job-status",
                "name": "job-status",
                "label": "Status",
                "width": 75
            },
            {
                "index": "job-type",
                "name": "job-type",
                "label": "Job Type",
                "width": 200
            },
            {
                "index": "summary",
                "name": "summary",
                "label": "Summary",
                "width": 250
            },
            {
                "index": "owner",
                "name": "owner",
                "label": "Owner",
                "width": 100
            }
        ]

    };

    return configurationSample;

});
