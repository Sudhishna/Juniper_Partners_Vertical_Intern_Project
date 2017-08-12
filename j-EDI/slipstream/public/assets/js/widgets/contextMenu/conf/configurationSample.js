/**
 * A sample configuration object that shows the parameters required to build a Context Menu widget
 *
 * @module configurationSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var printKey = function(key, opt) {
        console.log("clicked: " + key);
    };

    var toggle_copy = function (key, opt) {
        this.data('disabled', this.data('disabled') ? false : true);
        return false;
    };

    var configurationSample = {};

    /**************************************************
     * Simple Context Menu with default callback
     **************************************************/
    configurationSample.simpleContextMenu = {
        "callback": function(key, opt){ console.log(opt); },
        "items": [{
                "label":"Edit Rule",
                "key":"edit"
            },{
                "label":"Disable Rule",
                "key":"disable"
            },{
                "label":"Create Rule Before",
                "key":"createBefore"
            },{
                "label":"Create Rule After",
                "key":"createAfter"
            },{
                "label":"Copy Rule",
                "key":"copy"
            },{
                "label":"Paste Rule Before",
                "key":"pasteBefore",
                "disabled":true
            },{
                "label":"Paste Rule After",
                "key":"pasteAfter",
                "disabled":true
            },{
                "label":"Delete Rule",
                "key":"delete"
            },{
                "label":"Reset Hit Count",
                "key":"resetHit"
            },{
                "label":"Disable Hit Count",
                "key":"disableHit"
        }],
        "events": {
            "show":function(opt){console.log('Show Event' + opt);},
            "hide":function(opt){console.log('Hide Event' + opt);}
        }
    };

    /**************************************************
     * Context Menu with Sub-Menu
     **************************************************/
    configurationSample.completeContextMenu = {
        "autoHide": "true",
        "items": [{
                "label":"Edit",
                "key":"edit",
                "icon":"edit",
                "callback":printKey
            },{
                "label":"Cut",
                "key":"cut",
                "icon":"cut",
                "callback":printKey
            },{
                "label":"Copy",
                "key":"copy",
                "icon":"copy",
                "callback":toggle_copy
            },{
                "label":"Paste",
                "key":"paste",
                "icon":"paste",
                "callback":printKey,
                "disabled": function(key, opt){ return true; }
            },{
                "label":"Delete",
                "key":"delete",
                "icon":"delete",
                "callback":printKey,
                "disabled": function(key, opt){ return !!this.data('disabled'); }
        },{
                "separator": "true"
            },{
                "label":"Quit",
                "key":"quit",
                "icon":"quit",
                "callback":printKey
            },{
                "separator": "true"
            },{
                "label":"SubMenu 1",
                "key":"fold1",
                "items": [{
                        "label":"SubMenu1 Menu1",
                        "key":"fold1-key1",
                        "icon":"edit",
                        "callback":printKey
                    },{
                        "label":"SubMenu1 Menu2",
                        "key":"fold1-key2",
                        "icon":"copy",
                        "callback":printKey
                    },{
                        "separator": "true"
                    },{
                        "label":"SubMenu1 Menu3",
                        "key":"fold1-key3",
                        "icon":"cut",
                        "callback":printKey
                 }]
            },{
                "separator": "true"
            },{
                "label":"SubMenu 2",
                "key":"fold2",
                "items": [{
                    "label":"SubMenu2 Menu1",
                    "key":"fold2-key1",
                    "icon":"edit",
                    "callback":printKey
                },{
                    "label":"SubMenu2 Menu2",
                    "key":"fold2-key2",
                    "icon":"copy",
                    "callback":printKey
                },{
                    "label":"SubMenu2 Menu3",
                    "key":"fold2-key3",
                    "icon":"cut",
                    "callback":printKey
                }]
            }]
    };

    /**************************************************
     * Dynamic Context Menu with callback
     **************************************************/
    configurationSample.dynamicContextMenu = {
        "autoHide": "true",
        "callback": function(key, opt){ },
        "items": [{
            "label":"Edit Rule",
            "key":"edit"
        },{
            "label":"Disable Rule",
            "key":"disable"
        },{
            "label":"Create Rule Before",
            "key":"createBefore"
        },{
            "label":"Create Rule After",
            "key":"createAfter"
        },{
            "label":"Copy Rule",
            "key":"copy"
        },{
            "label":"Paste Rule Before",
            "key":"pasteBefore",
            "disabled":true
        },{
            "label":"Paste Rule After",
            "key":"pasteAfter",
            "disabled":true
        },{
            "label":"Delete Rule",
            "key":"delete"
        },{
            "label":"Reset Hit Count",
            "key":"resetHit"
        },{
            "label":"Disable Hit Count",
            "key":"disableHit"
        }]
    };


    /**************************************************
     * Context Menu with input items
     **************************************************/
    var checkboxChangeEvent = {
            change: function(e){
                console.log("Is checked?: " + this.checked + " value: " + this.value);
            }
        };

    configurationSample.inputContextMenu = {
        "callback": function(key, opt){ console.log(opt); },
        items: [{  // generates <input type="checkbox">
            "label":"Edit Rule",
            "key":"edit"
        },{
            "separator": true
        },{
            "title":"Checkbox title",
            "className": "checkboxTitle1"
        },{
            "key": "column1",
            "label": "Column 1",
            "type": "checkbox",
            "selected": true,
            "value": '1',
            "events": checkboxChangeEvent
        },{
            "key": "column2",
            "label": "Column 2",
            "type": "checkbox",
            "selected": true,
            "events": checkboxChangeEvent
        },{
            "separator": true
        },{ // generates <input type="radio">
            "key": "radio1",
            "label": "Radio 1",
            "type": "radio",
            "groupId": 'radio',
            "value": '1'
        },{
            "key": "radio2",
            "label": "Radio 2",
            "type": "radio",
            "groupId": 'radio',
            "value": '2'
        },{
            "key": "radio2",
            "label": "Radio 2",
            "type": "radio",
            "groupId": 'radio',
            "value": '2'
        },{
            "separator": true
        },{
            "key": "select1",
            "label": "Select",
            "type": "select",
            "options": {
                "1": 'one',
                "2": 'two',
                "3": 'three'
            },
            "selected": "2"
        },{
            "separator": true
        },{// generates <input type="text">
            "key": "name",
            "label": "Text",
            "type": "text",
            "value": "Slipstream is awesome",
            "events": {
                "keyup": function(e) {
//                    console.log('key: '+ e.keyCode);
                }
            }
        }],
        events: {
            show: function(opt) {
                var $this = this;
                // import states from data store
                $.contextMenu.setInputValues(opt, $this.data()); //ToDo: Implement a widget method instead
            },
            hide: function(opt) {
                var $this = this;
                // export states to data store
                $.contextMenu.getInputValues(opt, $this.data()); //ToDo: Implement a widget method instead
            }
        }
    };

    return configurationSample;

});
