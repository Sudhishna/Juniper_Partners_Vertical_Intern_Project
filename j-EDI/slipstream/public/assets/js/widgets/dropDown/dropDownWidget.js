/**
 * A module that builds a Drop Down widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 * and the configuration required by the third party library: select2.
 *
 * @module DropDownWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'select2',
    'text!widgets/dropDown/templates/checkboxOption.html',
    'lib/template_renderer/template_renderer'
],  /** @lends DropDownWidget */
    function(select2, checkboxOptionTemplate, render_template) {

    /**
     * DropDownWidget constructor
     *
     * @constructor
     * @class DropDownWidget - Builds a drop down widget from a configuration object.
     *
     * @param {Object} conf - It requires the following parameters:
     * container: define the container where the widget will be rendered
     * data: define the elements that will be showed in the drop down (select elements). It should be a JSON object and could include disabled (true) and selected (true) for the select options.
     * matcher: defines a javascript function to be used instead of the default filter.
     * placeholder: defines a short hint that describes the expected action in the dropdown.
     * multipleSelection: adds support for multi-value select boxes. It includes the parameters:
     * - maximumSelectionLength: restricts the maximum number of options selected
     * - createTags: allows user to create new tags or select options
     * - allowClearSelection: allows to remove all elements from the list of selected options when it is set to true
     * onChange:  A callback function to be called whenever the value in the dropdown is changed.  The callback takes a 
     * single Object as a parameter with the following attributes:
     * - val: The new value selected in the dropdown
     * enableSearch: Boolean true if the drop-down should allow search within the set of values, false otherwise.  
     * Defaults to true if not specified.
     * initValue: Specifies the initial value of the dropdown.
     *
     * @returns {Object} Current DropDownWidget's object: this
     */
    var DropDownWidget = function(conf){
        var select2Configuration,
            reselect = true; // Flag used for setting dropdown selection when either conf.initVal is set or by using setValue()

        /*
         * Internal handling of data.text  and implicit return of initial dropdown format
         * @param {Object} Automatically provided by select2 library
         *
        */    

        var templateSelection_ = function (data) {
            if (data.text && data.text !== "") {
                return data.text;                 // TODO: Consider the cons of this approach if the user's ajax data has data.text, but the user wants to display a value other than data.text
            }
            if (conf.templateSelection) {
                return conf.templateSelection(data);
            }
        };

        this.conf = {
            $container: $(conf.container),
            data: conf.data
        };

        var requestDelay = 500;

        /**
         * Builds the Dropdown widget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build =  function () {
            var $parentContainer =  this.conf.$container.parent();
            $parentContainer.addClass('dropdown-widget');

            if (conf.data)
                this.conf.data = typeof(conf.data) === 'object'? conf.data : JSON.parse(conf.data);

            select2Configuration = {
                // dropdownParent: $parentContainer, ** TODO: uncomment when absolute positioning bug      **
                //                                   ** is fixed in select2 library.                       **
                //                                   ** see https://github.com/select2/select2/issues/3303 **
                containerCssClass: "dropdown-widget",
                data: this.conf.data,
                placeholder: conf.placeholder,
                matcher: conf.matcher,
                templateSelection: templateSelection_,
                dropdownAutoWidth : true,
                templateResult: conf.templateResult,
                remoteData: conf.remoteData, // used for the lazy loading
                allowClear:  conf.allowClearSelection || false
            };

            if (conf.initValue) {
                _.extend(select2Configuration, {
                    initSelection : function (element, callback) {
                        var data = {id: conf.initValue.id, text: conf.initValue.text};
                        callback(data);
                    }
                });
            }

            if (!conf.enableSearch) {
                _.extend(select2Configuration, {
                    minimumResultsForSearch: Infinity
                });
            }


            if (conf.multipleSelection){
                this.conf.$container.attr('multiple','multiple');
                if (conf.multipleSelection.createTags){
                    _.extend(select2Configuration,{
                        maximumSelectionLength: conf.multipleSelection.maximumSelectionLength,
                        tags: conf.multipleSelection.createTags,
                        allowClear: conf.multipleSelection.allowClearSelection,
                        tokenSeparators: [',', ' ']
                    })
                } else {
                    _.extend(select2Configuration,{
                        maximumSelectionLength: conf.multipleSelection.maximumSelectionLength,
                        allowClear: conf.multipleSelection.allowClearSelection
                    })
                }
            }

            if (conf.showCheckboxes) {
                _.extend(select2Configuration,{
                    templateResult: function (data) {
                        if (!data.id) {
                            return data.text;
                        }
                        var $res = $(render_template(checkboxOptionTemplate,{
                            'text':data.text,
                            'selected':data.element.selected
                        }));
                        return $res;
                    }
                });
            }

            /* configuration used to handle virtual scroll & search with virtual scroll*/
            if (conf.remoteData) {
                $.extend(true, select2Configuration, {
                    "ajax": {
                        "cache": true,
                        "headers": conf.remoteData.headers,
                        "url": conf.remoteData.url,
                        "delay": conf.remoteData.delay || requestDelay, // delay time after which the remote call will occur
                        "dataType": conf.remoteData.dataType || "json", // default to JSON type
                        "data": function (params) {

                            params.page = params.page || 1;

                            var pageStart = (params.page - 1) * conf.remoteData.numberOfRows;

                            var queryString = {
                                page: params.page,
                                paging: "(start eq " + pageStart + ", limit eq " + conf.remoteData.numberOfRows + ")"
                            };

                            // extend queryString so that on initial drop down load, the _search or q parameter is not used
                            if ((typeof(params.term) != "undefined") && (params.term.trim().length != 0)) {
                                queryString._search = params.term; //search term used by Server call
                                //queryString.q = params.term; //search term used by library
                            } else if (conf.enableSearch) {
                                params.term = " ";
                            }

                            return queryString;
                        },
                        "processResults": function (data, params) {
                            // parse the results into the format expected by Select2, indicates the infinite scrolling
                            return {
                                results: parseData(data),
                                pagination: {
                                    more: (params.page * conf.remoteData.numberOfRows) < conf.remoteData.jsonRecords(data) //total Records
                                },
                                initSelect: initSelectDD (this, conf.initValue) // Method to handle highlighting and selection of initValue after ajax call. "this" refers to select2 object
                            }
                        },
                       "success": conf.remoteData.success,
                       "error": conf.remoteData.error
                    }
                });
                /* parse data to pick the actual array of objects from the returned data */
                var parseData = function (data) {
                    var jsonRootKeys = conf.remoteData.jsonRoot.split(".");
                    var jsonData = data;
                    for (var i = 0; i < jsonRootKeys.length; i++) {
                        jsonData = jsonData[jsonRootKeys[i]];
                    }
                    return jsonData;
                };

                /* 
                 * Highilight and select the item in the dropdown that corresponds to conf.initValue during dropdown build process
                 * @param {Object} corresponds to select2 object
                 * @param {object} corresponds to conf.initValue
                 * @inner
                 */
                var initSelectDD  = function(s2, initVal) {
                    if (initVal && reselect) {
                        s2.select(initVal);
                        reselect = false;
                    }
                };

            }

            this.conf.$container.select2(select2Configuration);

            if (conf.onChange) {
                this.conf.$container.on("change", conf.onChange);
            }

            if (conf.multipleSelection){
                this.conf.$container.on("select2:selecting", function(e){
                    var selectedValues = $(this).select2("val");
                    if (selectedValues && ((selectedValues.length) >= conf.multipleSelection.maximumSelectionLength)) {                                    
                        e.preventDefault();
                    }
                });
            }

            return this;
        };

        /*
        Reset the data that is set for the drop down
        Not for use with remoteData since addData extends conf.data which is ignored in cases of conf.remoteData
        @param {Array} data to be used for replacing the drop down data
        @param resetData flag to be used for resetting data or appending data        
        */
        this.addData = function(selectData, resetData){
                var self = this;
                if(resetData){
                     this.conf.$container.select2().empty();
                }
                selectData = typeof(selectData) === 'object'? selectData : JSON.parse(selectData);
                this.conf.$container.select2(_.extend(select2Configuration,{data: selectData}));
        };

        /**
         * Destroys all elements created by the Dropdown widget in the specified container
         * @returns {Object} Current Dropdown object
         */
        this.destroy =  function () {
            // Modified with the upgrade of select2 library from 4.0.0 to 4.0.3
            this.conf.$container.select2("destroy");
            return this;
        };

        /**
         * Get the current value of the dropdown.
         */         
        this.getValue = function() {
            return this.conf.$container.select2("val");    
        };

        /**
         *  Set the value of the dropdown
         *  @param {Object} || {String} value - The value to be set into the dropdown
         *  ****** @param Type 1: {id: <id of the dropdown value>, text: <data to be displayed in the dropdown>}  For use with remoteData
         *  ****** @param Type 2: <id of the dropdown value> For use with Local data
         *  For remoteData, setValue can be used to change the displayed value to ANY value by passing the params {id: < >, text: < >}. 
         *  ****** Care should be taken to pass the same value to the remote data source
         *  ****** If setValue() is used for setting the initial value of a remote dropdown, the text and id must match a value from the expected remote data.
         *  For local data, setValue can be used to change the displayed value to a value that exists in conf.data. The method CANNOT be used to set the display to a value that is not in conf.data. 
         */  
        this.setValue = function(value) {
            if (conf.remoteData) {
                var option = new Option(value.text, value.id);
                option.selected = true;
                this.conf.$container.append(option);
                this.conf.$container.trigger("change");
            }
            else {
                var valueData = value;
                if ( _.isArray(value)) {
                    if( value[0] && _.isObject(value[0])) {
                        valueData = [];
                        for (var i in value) {
                            value[i].id && valueData.push(value[i].id);
                        }
                    }
                }
                else if ( _.isObject(value)) {
                    value.id && ( valueData = value.id );
                }
                // this.conf.$container.select2("val", valueData); // This is deprecated. Replaced with .val().trigger("change");
                this.conf.$container.val(valueData).trigger("change");
            }
            return value;                                                      
        };
    };

    return DropDownWidget;
});