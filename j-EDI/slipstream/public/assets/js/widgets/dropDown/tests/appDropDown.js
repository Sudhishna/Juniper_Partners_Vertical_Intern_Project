/**
 * A view that uses the Drop Down Widget to render drop downs from a configuration object
 * The configuration object contains the container, options of the select, and other parameteres required to build the widget.
 *
 * @module DropDown View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/dropDown/dropDownWidget',
    'widgets/dropDown/tests/view/addView',
    'widgets/dropDown/tests/model/remoteData',
    'text!widgets/dropDown/tests/dataSample/applicationSimple.json',
    'text!widgets/dropDown/tests/dataSample/applicationShort.json',
    'text!widgets/dropDown/tests/dataSample/application.json'
], function(Backbone, DropDownWidget, AddView, RemoteData, applicationSimple, applicationShort, application){
    var DropDownView = Backbone.View.extend({


        events: {
            'click #btn-setValRemote': 'addDropDownVal',
            'click #btn-setValLocal': 'setDropDownValLocal',
            'click #btn-setValLocalMultiArr': 'setDropDownValLocalMultiArr',
            'click #btn-setValLocalMultiObj': 'setDropDownValLocalMultiObj'
        },

        widgets: {},

        initialize: function () {
            new RemoteData();
            this.containers = {
                basicNoData: this.$el.find('.basic-selection-nodata'),
                basicData: this.$el.find('.basic-selection-data'),
                basicDataSetValue: this.$el.find('.basic-selection-data-setValue'),
                basicTemplate: this.$el.find('.basic-template'),
                multipleEmpty: this.$el.find('.multiple-selection-empty'),
                multipleDefault: this.$el.find('.multiple-selection-default'),
                multipleDefaultTokens: this.$el.find('.multiple-selection-default-tokens'),
                simpleDataInfiniteScroll: this.$el.find('.simple-selection-infinite-scroll'),
                remoteDropdownContainer: this.$el.find('.simple-selection-infinite-scroll-setVal')
            };
            this.render();
        },

        render: function () {
            var self = this;
            new DropDownWidget({
                "container": this.containers.basicNoData,
                "showCheckboxes": true,
                "allowClearSelection":true,
                "placeholder": "Select an option"
            }).build();


            new DropDownWidget({
                "container": this.containers.basicData,
                "data": application,
                "enableSearch": true,
                "matcher": this.newMatcher,
                "onChange": this.setValCb                
            }).build();

            self.widgets.basicDataSetValueWidget = new DropDownWidget({
                "container": this.containers.basicDataSetValue,
                "data": application,
                "enableSearch": true,
                "matcher": this.newMatcher
            });

            self.widgets.basicDataSetValueWidget.build();            

            new DropDownWidget({
                "container": this.containers.basicTemplate,
                "data": application,
                "templateResult": self.templateResult
            }).build();

            self.widgets.multiEmpty = new DropDownWidget({
                "container": this.containers.multipleEmpty,
                "data": applicationShort,
                "multipleSelection": {
                    allowClearSelection: true
                },
                "showCheckboxes": true,
                "placeholder": "Select an option"
            });

            self.widgets.multiEmpty.build();

            this.$el.find("#resetData").on("click",function(){
                self.widgets.multiEmpty.addData(applicationSimple,true);
            });
            this.$el.find("#appendData").on("click",function(){
                self.widgets.multiEmpty.addData(applicationShort);
            });

            self.widgets.multipleDefault = new DropDownWidget({
                "container": this.containers.multipleDefault,
                "data": application,
                "multipleSelection": {
                    maximumSelectionLength: 2,
                    allowClearSelection: true
                },
                "placeholder": "Select an option"
            });
            self.widgets.multipleDefault.build();

            self.widgets.multipleDefaultTokens = new DropDownWidget({
                "container": this.containers.multipleDefaultTokens,
                "data": application,
                "multipleSelection": {
                    maximumSelectionLength: 15,
                    createTags: true,
                    allowClearSelection: true
                },
                "placeholder": "Select an option"
            });

            self.widgets.multipleDefaultTokens.build();

            new DropDownWidget({
                //example that shows the virtual scroll along with search.
                "container": this.containers.simpleDataInfiniteScroll,
                "enableSearch": true,
                "initValue": {
                    "id": 131074,
                    "text": "Any-IPv6"
                },
                "remoteData": {
                    "url": "/api/dropdown/getRemoteData",
                    "numberOfRows": 10,
                    "jsonRoot": "data",

                    "jsonRecords": function(data) {
                        return data.data;
                    },
                    "success": function(data){console.log("call succeeded")},
                    "error": function(){console.log("error while fetching data")}
                },
                "templateResult": this.formatRemoteResult,
                "templateSelection": this.formatRemoteResultSelection,
                "onChange": this.setValCb
            }).build();
    
            self.widgets.remoteDropdown = new DropDownWidget({
                //example that shows lading data in dropdown using AJAX, setting inital value to the drop down and adding new values to the dropdown
                "container": this.containers.remoteDropdownContainer,
                "enableSearch": false,                      
                "remoteData": {
                    "url": "/api/dropdown/getRemoteData",
                    "numberOfRows": 10,
                    "jsonRoot": "data",

                    "jsonRecords": function(data) {
                        return data.data;
                    },
                    "success": function(data){console.log("call succeeded" + JSON.stringify(data.data))},
                    "error": function(){console.log("error while fetching data")}
                },
                "templateResult": this.formatRemoteResultAddDropDownData,
                "templateSelection": this.formatRemoteResultSelection,                
                "onChange": this.setValCb
            });

            self.widgets.remoteDropdown.build();


            // Set Initial Value - An alternate way to initValue
            self.widgets.remoteDropdown.setValue({
                "id": "rtsp",
                "text": "junos-rtsp"
            });

            return this;
        },

        formatRemoteResult: function (data) {
            var markup = data.text;
            return markup;
        },

        formatRemoteResultSelection: function (data) {            
                return data.name || data.text;
        },

        newMatcher: function (params, data) {
            // if there are no search terms, return all of the data
            if ($.trim(params.term) === '') {
                return data;
            }

            // params.term should be the term that is used for searching and data.text is the text that is displayed for the data object
            if (data.text.indexOf(params.term) > -1) {
                var modifiedData = $.extend({}, data, true);
                modifiedData.text += ' (matched)'; //return search with modified object
                return modifiedData;
            }

            // return 'null' if the term should not be displayed
            return null;
        },

        templateResult: function (data){
            if (!data.id) {
                return data.text;
            }
            var mySelect = data.text;
            var $myCustomHtml = $("<span><img src='/assets/images/error.png'/> " + mySelect + "</span>");
            return $myCustomHtml;
        },


        setDropDownValLocal: function() {
            var self = this;
            self.widgets.basicDataSetValueWidget.setValue("tcp");
        },

        setDropDownValLocalMultiArr: function() {
            var self = this,
                data = ["ftp","tftp","rtsp"];

            self.widgets.multipleDefault.setValue(data);
        },

        setDropDownValLocalMultiObj: function() {
            var self = this,                
            data =     [{   "id": "ftp",
                            "text": "junos-ftp"
                         },
                         {
                            "id": "tftp",
                            "text": "junos-tftp"
                         },
                         {
                            "id": "rtsp",
                            "text": "junos-rtsp"
                        }];
            self.widgets.multipleDefaultTokens.setValue(data);
        },        


        formatRemoteResultAddDropDownData: function (data) {
            var markup = data.text;
            return markup;
        },

        setValCb: function(data) {
            console.log(data);
        },

        addDropDownVal: function (e) {
            var self = this;
            var dialog = new AddView({'save': _.bind(self.save, self)});
        },

        save: function (data) {
            var self = this;
            self.widgets.remoteDropdown.setValue(data.dropdownData);
            $.ajax({
              method: "GET",
              url: '/api/dropdown/updateData',
              data: data.dropdownData,
              dataType: 'jsonp'
            }); 
        }
    });

    return DropDownView;
});